import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'static/data/west-bengal-trains.json');
const hubs = ['SDAH', 'HWH', 'MJT', 'KOAA', 'SHM'];
const delay = (ms) => new Promise((done) => setTimeout(done, ms));

async function readKey() {
	if (process.env.RAILRADAR_API_KEY) return process.env.RAILRADAR_API_KEY;
	const env = await readFile(resolve(root, '.env'), 'utf8').catch(() => '');
	return env.match(/^RAILRADAR_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

const key = await readKey();
if (!key) throw new Error('RAILRADAR_API_KEY is missing from .env');

async function get(path, attempt = 0) {
	const response = await fetch(`https://api.railradar.in/v1${path}`, { headers: { Authorization: `Bearer ${key}` } });
	if (response.status === 429 && attempt < 3) { await delay(65_000); return get(path, attempt + 1); }
	if (!response.ok) throw new Error(`${path} returned ${response.status}`);
	return response.json();
}

const previous = JSON.parse(await readFile(output, 'utf8').catch(() => '{"routes":[]}'));
const geometryByPair = new Map((previous.routes ?? []).map((route) => [route.pair, route]));
const serviceById = new Map();

const sealdah = JSON.parse(await readFile(resolve(root, 'static/data/sealdah-network.json'), 'utf8').catch(() => '{"corridors":[]}'));
for (const corridor of sealdah.corridors ?? []) {
	if (!corridor.coordinates?.length) continue;
	const terminal = { code: corridor.code, name: corridor.name };
	const hub = { code: 'SDAH', name: 'SEALDAH' };
	geometryByPair.set(`SDAH→${corridor.code}`, { pair: `SDAH→${corridor.code}`, source: hub, destination: terminal, representativeTrain: corridor.representativeTrain, coordinates: corridor.coordinates });
	geometryByPair.set(`${corridor.code}→SDAH`, { pair: `${corridor.code}→SDAH`, source: terminal, destination: hub, representativeTrain: corridor.representativeTrain, coordinates: corridor.coordinates.toReversed() });
}

if (process.env.TRAIN_DATA_OFFLINE === '1') {
	for (const service of previous.services ?? []) serviceById.set(service.id, service);
} else {
	for (const hub of hubs) {
		console.log(`Fetching ${hub} station board…`);
		const payload = await get(`/stations/${hub}/trains`);
		for (const { train, stop } of payload?.data?.trains ?? []) {
			if (!['Suburban', 'MEMU'].includes(train?.type)) continue;
			if (train.source?.code !== hub && train.destination?.code !== hub) continue;
			const outbound = train.source.code === hub;
			serviceById.set(train.number, {
				id: train.number, name: train.name, type: train.type, source: train.source, destination: train.destination,
				anchor: hub, anchorTime: outbound ? stop.departure : stop.arrival,
				distanceKm: Number(stop.distance) || 0, runDays: train.runDays ?? []
			});
		}
		await delay(7_100);
	}
}

const services = [...serviceById.values()];
const routeGroups = Map.groupBy(services, (service) => `${service.source.code}→${service.destination.code}`);
let fetched = 0;
const maxNewRoutes = Number(process.env.MAX_NEW_TRAIN_ROUTES ?? 35);

const prioritizedRouteGroups = [...routeGroups.entries()].sort(([pairA], [pairB]) => {
	const aIsSealdah = pairA.includes('SDAH');
	const bIsSealdah = pairB.includes('SDAH');
	return Number(aIsSealdah) - Number(bIsSealdah);
});

for (const [pair, pairServices] of prioritizedRouteGroups) {
	if (geometryByPair.has(pair) || fetched >= maxNewRoutes) continue;
	const representative = pairServices[0];
	console.log(`Route ${pair} via ${representative.id} (${fetched + 1}/${maxNewRoutes})`);
	try {
		const payload = await get(`/trains/${representative.id}/route?format=geojson`);
		const coordinates = payload?.data?.geojson?.geometry?.coordinates ?? payload?.geojson?.geometry?.coordinates ?? [];
		geometryByPair.set(pair, { pair, source: representative.source, destination: representative.destination, representativeTrain: representative.id, coordinates });
	} catch (error) { console.warn(`Could not fetch ${pair}: ${error.message}`); }
	fetched += 1;
	await delay(7_100);
}

const routes = [...geometryByPair.values()].filter((route) => route.coordinates?.length > 1);
await writeFile(output, `${JSON.stringify({
	generatedAt: new Date().toISOString(),
	hubs,
	counts: { services: services.length, routes: routes.length, routesRemaining: Math.max(0, routeGroups.size - routes.length) },
	services,
	routes
}, null, 2)}\n`);
console.log(`Wrote ${services.length} services, ${routes.length}/${routeGroups.size} routes; run again to resume missing routes.`);
