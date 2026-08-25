import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'static/data/west-bengal-railways.json');
const sourceBase = 'https://gist.githubusercontent.com/sankalpsharmaa/0c0587f3ae31277411960f70128d682f/raw/075361e1625bac0e8138dfbc68880c639d871e7b';
const stationUrl = `${sourceBase}/india_railway_stations.geojson`;
const trackUrl = `${sourceBase}/railway_network.geojson`;

async function download(url) {
	console.log(`Downloading ${url.split('/').at(-1)}…`);
	const response = await fetch(url, { headers: { 'User-Agent': 'internetplace-railway-map/1.0' } });
	if (!response.ok) throw new Error(`${url} returned ${response.status}`);
	return response.json();
}

function distanceKm(coordinates) {
	let total = 0;
	for (let index = 1; index < coordinates.length; index += 1) {
		const [lng1, lat1] = coordinates[index - 1];
		const [lng2, lat2] = coordinates[index];
		const latitude = ((lat1 + lat2) / 2) * Math.PI / 180;
		const x = (lng2 - lng1) * Math.cos(latitude);
		const y = lat2 - lat1;
		total += Math.sqrt(x * x + y * y) * 111.32;
	}
	return total;
}

function isNearWestBengalStation(coordinates, stations, maximumKm = 18) {
	const maximumDegreesSquared = (maximumKm / 111.32) ** 2;
	return coordinates.some(([lng, lat]) => stations.some(({ coordinates: [stationLng, stationLat] }) => {
		const x = (lng - stationLng) * Math.cos(lat * Math.PI / 180);
		const y = lat - stationLat;
		return x * x + y * y <= maximumDegreesSquared;
	}));
}

const [stationCollection, trackCollection] = await Promise.all([download(stationUrl), download(trackUrl)]);
const stations = stationCollection.features
	.filter((feature) => feature.properties?.state === 'West Bengal' && feature.geometry?.type === 'Point')
	.map((feature) => ({
		id: feature.properties?.FID ?? feature.properties?.code,
		name: feature.properties?.name ?? 'Unnamed station',
		nameEn: feature.properties?.name ?? null,
		nameBn: null,
		code: feature.properties?.code ?? null,
		type: /halt/i.test(feature.properties?.name ?? '') ? 'halt' : 'station',
		zone: feature.properties?.zone ?? null,
		coordinates: feature.geometry.coordinates
	}));

const tracks = [];
for (const feature of trackCollection.features ?? []) {
	const geometry = feature.geometry;
	const lines = geometry?.type === 'MultiLineString' ? geometry.coordinates : geometry?.type === 'LineString' ? [geometry.coordinates] : [];
	for (const [part, coordinates] of lines.entries()) {
		if (coordinates.length < 2 || !isNearWestBengalStation(coordinates, stations)) continue;
		tracks.push({
			id: `${feature.properties?.FID ?? tracks.length}-${part}`,
			name: null,
			railway: 'rail',
			service: null,
			usage: feature.properties?.EXS_DESCRI ?? null,
			tracks: feature.properties?.FCO_DESCRI ?? null,
			coordinates
		});
	}
}

const trackKm = tracks.reduce((sum, track) => sum + distanceKm(track.coordinates), 0);
const data = {
	generatedAt: new Date().toISOString(),
	source: {
		name: 'Geo-referenced Indian Railways Data, curated by Sankalp Sharma',
		url: 'https://gist.github.com/sankalpsharmaa/0c0587f3ae31277411960f70128d682f',
		method: 'Stations tagged West Bengal; national physical linework retained within 18 km of a West Bengal station to preserve border-spanning segments.'
	},
	counts: {
		trackSegments: tracks.length,
		trackKm: Math.round(trackKm),
		stations: stations.length,
		namedStations: stations.filter((station) => station.name !== 'Unnamed station').length
	},
	tracks,
	stations
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(data)}\n`);
console.log(`Wrote ${tracks.length} physical track segments (${Math.round(trackKm)} km) and ${stations.length} stations/halts to ${output}`);
