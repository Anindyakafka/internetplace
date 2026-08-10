<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	type TrackPoint = { lat: number; lon: number; elevation?: number; time?: Date };
	type Waypoint = TrackPoint & { name: string; imageUrl?: string };

	interface TrackManifestEntry {
		file: string;
		title: string;
		city: string;
		date: string;
		mode: string;
		description: string;
		privacy: string;
	}

	let { entry }: { entry: TrackManifestEntry } = $props();

	let mapElement: HTMLDivElement;
	let loading = $state(true);
	let error = $state('');
	let distanceKm = $state(0);
	let durationMinutes = $state<number | null>(null);
	let elevationGain = $state<number | null>(null);
	let waypoints = $state<Waypoint[]>([]);

	const folder = $derived(entry.file.replace(/\.gpx$/i, ''));
	const baseUrl = $derived(`/tracks/source/${folder}`);
	const gpxUrl = $derived(`${baseUrl}/${entry.file}`);
	const historicalMapUrl = 'https://geo.nls.uk/mapdata3/india-combined/{z}/{x}/{y}.png';

	function haversine(a: TrackPoint, b: TrackPoint): number {
		const radius = 6371;
		const toRadians = (value: number) => (value * Math.PI) / 180;
		const dLat = toRadians(b.lat - a.lat);
		const dLon = toRadians(b.lon - a.lon);
		const lat1 = toRadians(a.lat);
		const lat2 = toRadians(b.lat);
		const value =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
		return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
	}

	function textFrom(node: Element, tag: string): string | undefined {
		return node.getElementsByTagNameNS('*', tag)[0]?.textContent?.trim() || undefined;
	}

	function pointFrom(node: Element): TrackPoint {
		const elevation = Number(textFrom(node, 'ele'));
		const timeText = textFrom(node, 'time');
		return {
			lat: Number(node.getAttribute('lat')),
			lon: Number(node.getAttribute('lon')),
			elevation: Number.isFinite(elevation) ? elevation : undefined,
			time: timeText ? new Date(timeText) : undefined
		};
	}

	function formatDuration(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const remainder = Math.round(minutes % 60);
		return hours ? `${hours}h ${remainder}m` : `${remainder}m`;
	}

	function formatDate(value: string): string {
		const [day, month, year] = value.split('-').map(Number);
		if (!day || !month || !year) return value;
		return new Intl.DateTimeFormat('en-IN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(year, month - 1, day));
	}

	onMount(() => {
		let map: import('leaflet').Map | undefined;
		let disposed = false;

		void (async () => {
		try {
			const [response, L] = await Promise.all([fetch(gpxUrl), import('leaflet')]);
			if (disposed) return;
			if (!response.ok) throw new Error(`Could not load ${entry.file}`);

			const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
			if (xml.querySelector('parsererror')) throw new Error('The GPX file could not be parsed.');

			const trackPoints = Array.from(xml.getElementsByTagNameNS('*', 'trkpt')).map(pointFrom);
			if (trackPoints.length < 2) throw new Error('This GPX file has no usable track.');

			waypoints = Array.from(xml.getElementsByTagNameNS('*', 'wpt')).map((node) => {
				const link = node.getElementsByTagNameNS('*', 'link')[0]?.getAttribute('href');
				return {
					...pointFrom(node),
					name: textFrom(node, 'name') ?? 'Waypoint',
					imageUrl: link ? `${baseUrl}/${link}` : undefined
				};
			});

			distanceKm = trackPoints.slice(1).reduce(
				(total, point, index) => total + haversine(trackPoints[index], point),
				0
			);

			const timedPoints = trackPoints.filter((point) => point.time);
			if (timedPoints.length > 1) {
				durationMinutes =
					(timedPoints[timedPoints.length - 1].time!.getTime() - timedPoints[0].time!.getTime()) /
					60_000;
			}

			const elevated = trackPoints.filter((point) => point.elevation !== undefined);
			if (elevated.length > 1) {
				elevationGain = elevated.slice(1).reduce((gain, point, index) => {
					const change = point.elevation! - elevated[index].elevation!;
					return gain + Math.max(0, change);
				}, 0);
			}

			map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: true });
			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				maxZoom: 20
			}).addTo(map);

			const historicalMapPane = map.createPane('historical-map');
			historicalMapPane.style.zIndex = '250';
			L.tileLayer(historicalMapUrl, {
				pane: 'historical-map',
				opacity: 0.74,
				maxZoom: 18,
				attribution:
					'Historical map courtesy of the <a href="https://maps.nls.uk/">National Library of Scotland</a>'
			}).addTo(map);

			const coordinates = trackPoints.map((point) => [point.lat, point.lon] as [number, number]);
			const route = L.polyline(coordinates, {
				color: '#315fce',
				weight: 5,
				opacity: 0.92,
				lineCap: 'round',
				lineJoin: 'round'
			}).addTo(map);

			L.circleMarker(coordinates[0], {
				radius: 8,
				color: '#fff',
				weight: 3,
				fillColor: '#77855b',
				fillOpacity: 1
			}).bindTooltip('Start').addTo(map);

			L.circleMarker(coordinates[coordinates.length - 1], {
				radius: 8,
				color: '#fff',
				weight: 3,
				fillColor: '#b64e4e',
				fillOpacity: 1
			}).bindTooltip('End').addTo(map);

			for (const waypoint of waypoints) {
				L.circleMarker([waypoint.lat, waypoint.lon], {
					radius: 5,
					color: '#fff',
					weight: 2,
					fillColor: '#141414',
					fillOpacity: 0.88
				})
					.bindTooltip(waypoint.name)
					.addTo(map);
			}

			map.fitBounds(route.getBounds(), { padding: [28, 28] });
			loading = false;
		} catch (cause) {
			if (disposed) return;
			error = cause instanceof Error ? cause.message : 'Unable to display this track.';
			loading = false;
		}
		})();

		return () => {
			disposed = true;
			map?.remove();
		};
	});
</script>

<article class="track-entry">
	<header class="track-header">
		<div>
			<p class="track-kicker">{entry.mode} · {entry.city}</p>
			<h2>{entry.title}</h2>
			{#if entry.description}<p class="track-description">{entry.description}</p>{/if}
		</div>
		<time datetime={entry.date}>{formatDate(entry.date)}</time>
	</header>

	<div class="map-frame">
		<div class="map" bind:this={mapElement} aria-label={`Map of ${entry.title}`}></div>
		{#if loading}<p class="map-state">Reading the track…</p>{/if}
		{#if error}<p class="map-state map-error">{error}</p>{/if}
	</div>

	{#if !loading && !error}
		<dl class="track-stats">
			<div><dt>Distance</dt><dd>{distanceKm.toFixed(1)} km</dd></div>
			{#if durationMinutes !== null}<div><dt>Duration</dt><dd>{formatDuration(durationMinutes)}</dd></div>{/if}
			{#if elevationGain !== null}<div><dt>Recorded ascent</dt><dd>{Math.round(elevationGain)} m</dd></div>{/if}
			<div><dt>Observations</dt><dd>{waypoints.length}</dd></div>
		</dl>
	{/if}

	{#if waypoints.length}
		<div class="observations">
			<h3>Along the way</h3>
			<div class="observation-grid">
				{#each waypoints as waypoint}
					<figure class:observation-with-image={waypoint.imageUrl}>
						{#if waypoint.imageUrl}
							<img src={waypoint.imageUrl} alt={`Photograph from ${entry.title}`} loading="lazy" />
						{/if}
						<figcaption>
							<p>{waypoint.name}</p>
							{#if waypoint.time}<time datetime={waypoint.time.toISOString()}>{waypoint.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>{/if}
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	{/if}
</article>

<style>
	.track-entry { display: grid; gap: var(--space-l); padding-block: var(--space-2xl); border-top: 1px solid var(--color-border); }
	.track-header { display: flex; align-items: start; justify-content: space-between; gap: var(--space-l); }
	.track-kicker, .track-header > time { margin: 0 0 var(--space-2xs); font-family: var(--font-mono); font-size: var(--step--2); letter-spacing: 0.07em; text-transform: uppercase; color: var(--color-accent); }
	.track-header h2 { margin: 0; font-family: var(--font-serif); font-size: var(--step-4); font-weight: 500; line-height: 1.05; }
	.track-description { max-width: 40rem; margin: var(--space-xs) 0 0; color: var(--color-text-muted); line-height: 1.6; }
	.track-header > time { color: var(--color-text-muted); white-space: nowrap; }
	.map-frame { position: relative; min-height: min(68svh, 44rem); overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
	.map { position: absolute; inset: 0; z-index: 0; }
	.map-state { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; margin: 0; background: var(--color-surface); font-family: var(--font-mono); font-size: var(--step--1); color: var(--color-text-muted); }
	.map-error { color: #a33; }
	.track-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; border-block: 1px solid var(--color-border); }
	.track-stats div { padding: var(--space-s); border-right: 1px solid var(--color-border); }
	.track-stats div:last-child { border-right: 0; }
	.track-stats dt { font-family: var(--font-mono); font-size: var(--step--2); text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); }
	.track-stats dd { margin: var(--space-3xs) 0 0; font-family: var(--font-serif); font-size: var(--step-2); }
	.observations { display: grid; gap: var(--space-s); }
	.observations h3 { margin: 0; font-family: var(--font-mono); font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.07em; color: var(--color-text-muted); }
	.observation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: var(--space-s); }
	.observation-grid figure { margin: 0; display: grid; align-content: end; min-height: 8rem; padding: var(--space-s); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); overflow: hidden; }
	.observation-grid .observation-with-image { grid-column: span 2; padding: 0; }
	.observation-grid img { width: 100%; height: min(52svh, 32rem); object-fit: cover; }
	.observation-grid figcaption { padding: var(--space-s); }
	.observation-grid figure:not(.observation-with-image) figcaption { padding: 0; }
	.observation-grid p { margin: 0; font-family: var(--font-serif); font-size: var(--step-1); line-height: 1.35; }
	.observation-grid time { display: block; margin-top: var(--space-xs); font-family: var(--font-mono); font-size: var(--step--2); color: var(--color-text-muted); }
	:global(.leaflet-control-attribution) { font-size: 9px !important; }
	@media (max-width: 680px) {
		.track-header { display: grid; }
		.track-header h2 { font-size: var(--step-3); }
		.map-frame { min-height: 56svh; }
		.track-stats { grid-template-columns: 1fr 1fr; }
		.track-stats div:nth-child(2) { border-right: 0; }
		.track-stats div:nth-child(-n + 2) { border-bottom: 1px solid var(--color-border); }
		.observation-grid .observation-with-image { grid-column: span 1; }
	}
</style>
