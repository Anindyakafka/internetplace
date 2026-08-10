import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'static/data/sealdah-network.json');

async function apiKey() {
	if (process.env.RAILRADAR_API_KEY) return process.env.RAILRADAR_API_KEY;
	const env = await readFile(resolve(root, '.env'), 'utf8').catch(() => '');
	return env.match(/^RAILRADAR_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

const key = await apiKey();
if (!key) throw new Error('RAILRADAR_API_KEY is missing from .env');

const wait = (ms) => new Promise((done) => setTimeout(done, ms));
async function get(path, attempt = 0) {
	const response = await fetch(`https://api.railradar.in/v1${path}`, {
		headers: { Authorization: `Bearer ${key}` }
	});
	if (response.status === 429 && attempt < 3) {
		await wait(65_000);
		return get(path, attempt + 1);
	}
	if (!response.ok) throw new Error(`${path} returned ${response.status}`);
	return response.json();
}

console.log('Fetching Sealdah service board…');
const board = await get('/stations/SDAH/trains');
const raw = board?.data?.trains ?? [];
const terminalServices = raw.filter(({ train }) =>
	train?.type === 'Suburban' && (train.source?.code === 'SDAH' || train.destination?.code === 'SDAH')
);

const services = terminalServices.map(({ train, stop }) => {
	const outbound = train.source.code === 'SDAH';
	const terminal = outbound ? train.destination : train.source;
	return {
		id: train.number,
		name: train.name,
		direction: outbound ? 'from-sealdah' : 'to-sealdah',
		terminal,
		sealdahTime: outbound ? stop.departure : stop.arrival,
		dayOffset: (outbound ? stop.departureDay : stop.arrivalDay) ?? 1,
		distanceKm: stop.distance,
		runDays: train.runDays
	};
});

const groups = Map.groupBy(services, (service) => service.terminal.code);
const corridors = [];
let index = 0;
for (const [code, corridorServices] of groups) {
	const representative = corridorServices.find((service) => service.direction === 'from-sealdah') ?? corridorServices[0];
	if (index > 0) await wait(7_100);
	console.log(`[${index + 1}/${groups.size}] ${code} via ${representative.id}`);
	try {
		const route = await get(`/trains/${representative.id}/route?format=geojson`);
		let coordinates = route?.data?.geojson?.geometry?.coordinates ?? route?.geojson?.geometry?.coordinates ?? [];
		if (representative.direction === 'to-sealdah') coordinates = coordinates.toReversed();
		corridors.push({
			code,
			name: representative.terminal.name,
			representativeTrain: representative.id,
			serviceCount: corridorServices.length,
			coordinates
		});
	} catch (error) {
		console.warn(`Skipping geometry for ${code}: ${error.message}`);
		corridors.push({ code, name: representative.terminal.name, representativeTrain: representative.id, serviceCount: corridorServices.length, coordinates: [] });
	}
	index += 1;
}

await writeFile(output, `${JSON.stringify({
	generatedAt: new Date().toISOString(),
	station: { code: 'SDAH', name: 'Sealdah' },
	counts: {
		services: services.length,
		fromSealdah: services.filter((service) => service.direction === 'from-sealdah').length,
		toSealdah: services.filter((service) => service.direction === 'to-sealdah').length,
		corridors: corridors.length
	},
	services,
	corridors
}, null, 2)}\n`);
console.log(`Wrote ${services.length} services and ${corridors.length} corridors to ${output}`);
