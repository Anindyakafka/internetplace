<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	type Flight = {
		icao24: string | null;
		callsign: string | null;
		originCountry: string | null;
		timePosition: string | null;
		lastContact: string | null;
		latitude: number;
		longitude: number;
		baroAltitude: number | null;
		onGround: boolean;
		velocity: number | null;
		heading: number | null;
		verticalRate: number | null;
		geoAltitude: number | null;
		squawk: string | null;
		spi: boolean;
		positionSource: number | null;
		category: number | null;
	};
	type TrailPoint = [number, number];

	type Leaflet = typeof import('leaflet');

	let mapElement: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let historicalLayer: import('leaflet').TileLayer | null = null;
	let leaflet: Leaflet | null = null;
	let flightLayer: import('leaflet').LayerGroup | null = null;
	let flightRenderer: import('leaflet').Canvas | null = null;
	let flights = $state<Flight[]>([]);
	let fetchedAt = $state<string | null>(null);
	let feedState = $state<'loading' | 'live' | 'error'>('loading');
	let error = $state('');
	let modernOnly = $state(false);
	let flightCount = $state(0);
	let authenticated = $state(false);
	const trails = new Map<string, TrailPoint[]>();
	const lastSeen = new Map<string, number>();

	function setMapStyle() {
		if (!map || !historicalLayer) return;
		if (modernOnly) {
			historicalLayer.remove();
			return;
		}
		historicalLayer.addTo(map);
	}

	function drawFlights() {
		if (!map || !leaflet || !flightLayer) return;
		flightLayer.clearLayers();
		const L = leaflet;
		const zoom = map.getZoom();
		for (const f of flights) {
			const key = f.icao24 ?? `${f.latitude}:${f.longitude}`;
			const trail = trails.get(key) ?? [];
			if (trail.length > 1) {
				L.polyline(trail, {
					color: '#9a4b3b', weight: zoom >= 5 ? 1.35 : .85,
					opacity: .48, interactive: false, renderer: flightRenderer ?? undefined
				}).addTo(flightLayer);
			}
			const heading = Number.isFinite(f.heading) ? f.heading : 0;
			const marker = L.marker([f.latitude, f.longitude], {
				icon: L.divIcon({
					className: 'flight-icon-shell',
					html: `<span class="aircraft${f.onGround ? ' is-grounded' : ''}" style="--heading:${heading}deg"><svg viewBox="0 0 14 16" aria-hidden="true"><path d="M7 0.8 8.7 6l4.6 2v1.7L8.6 9l-.7 5.3 1.8 1v.7L7 15.5 4.3 16v-.7l1.8-1L5.4 9l-4.7.7V8l4.6-2L7 .8Z"/></svg></span>`,
					iconSize: [14, 16], iconAnchor: [7, 8]
				}),
				keyboard: true,
				riseOnHover: true
			}).addTo(flightLayer);
			const speed = f.velocity === null ? '' : ` · ${Math.round(f.velocity * 3.6)} km/h`;
			const altitude = f.geoAltitude === null ? '' : ` · ${Math.round(f.geoAltitude).toLocaleString('en-IN')} m`;
			const direction = f.heading === null ? '' : ` · ${Math.round(f.heading)}°`;
			const label = `${f.callsign ?? f.icao24 ?? 'Flight'}${f.originCountry ? ` · ${f.originCountry}` : ''}${speed}${altitude}${direction}`;
			marker.bindTooltip(label, { direction: 'top', opacity: 0.92 });
		}
	}

	function updateTrails(nextFlights: Flight[]) {
		const now = Date.now();
		for (const flight of nextFlights) {
			if (!flight.icao24) continue;
			const point: TrailPoint = [flight.latitude, flight.longitude];
			const trail = trails.get(flight.icao24) ?? [];
			const previous = trail.at(-1);
			if (!previous || Math.abs(previous[0] - point[0]) + Math.abs(previous[1] - point[1]) > .001) {
				trail.push(point);
				if (trail.length > 12) trail.shift();
				trails.set(flight.icao24, trail);
			}
			lastSeen.set(flight.icao24, now);
		}
		for (const [key, seen] of lastSeen) {
			if (now - seen > 30 * 60_000) {
				lastSeen.delete(key);
				trails.delete(key);
			}
		}
	}

	onMount(() => {
		let disposed = false;
		let timer: ReturnType<typeof setInterval> | undefined;
		void import('leaflet').then((module) => {
			if (disposed) return;
			leaflet = module.default;
			const L = leaflet;
			map = L.map(mapElement, { zoomControl: false, preferCanvas: true, scrollWheelZoom: true }).setView([23.0, 80.0], 4);
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);
			historicalLayer = L.tileLayer('https://geo.nls.uk/mapdata3/india-combined/{z}/{x}/{y}.png', { maxZoom: 15, opacity: 0.88, attribution: 'Historical map tiles © National Library of Scotland' });
			if (!modernOnly) historicalLayer.addTo(map);
			flightRenderer = L.canvas({ padding: 0.36, tolerance: 8 });
			flightLayer = L.layerGroup().addTo(map);
			map.on('zoomend', drawFlights);

			const refresh = async () => {
				try {
					const response = await fetch('/.netlify/functions/flights');
					const payload = await response.json().catch(() => ({}));
					if (!response.ok) throw new Error(payload.error ?? `Flight feed returned ${response.status}`);
					const nextFlights = ((payload.flights ?? []) as Flight[]).filter((f) => Number.isFinite(f.latitude) && Number.isFinite(f.longitude));
					updateTrails(nextFlights);
					flights = nextFlights;
					flightCount = flights.length;
					fetchedAt = payload.fetchedAt ?? null;
					authenticated = Boolean(payload.authenticated);
					feedState = 'live';
					error = '';
					drawFlights();
				} catch (cause) {
					feedState = 'error';
					const message = cause instanceof Error ? cause.message : '';
					error = message.includes('404') ? 'Netlify functions are unavailable in Vite Preview; use npm run dev:netlify.' : message || 'Flight data is unavailable.';
				}
			};
			void refresh();
			timer = setInterval(refresh, 120_000);
		});
		return () => { disposed = true; if (timer) clearInterval(timer); map?.remove(); map = null; flightRenderer = null; };
	});
</script>

<svelte:head>
	<title>Flights over India — Anindya Singh</title>
	<meta name="description" content="OpenSky flight tracking over a historical India map." />
</svelte:head>

<main class="flight-page">
	<header>
		<p class="eyebrow">India · airspace watch</p>
		<h1>Flights over India</h1>
		<p class="lede">A sketch of visible aircraft positions over the Indian subcontinent, read through a historical India map archive. The feed mirrors the OpenSky network’s live global list inside the regional bounding box.</p>
		<div class="status">
			<i class:online={feedState === 'live'}></i>
			{#if feedState === 'loading'}Connecting to OpenSky…{:else if feedState === 'live'}{flightCount.toLocaleString('en-IN')} aircraft in the latest bin{:else}{error}{/if}
			{#if fetchedAt}<small>Updated {new Date(fetchedAt).toLocaleTimeString('en-IN')} · {authenticated ? 'authenticated feed' : 'anonymous feed'}</small>{/if}
		</div>
	</header>

	<section class="map-shell" aria-label="OpenSky flight map">
		<div class="map-toolbar">
			<div>
				<strong>{modernOnly ? 'Modern map' : 'Historical map'}</strong>
				<span>{modernOnly ? 'OpenStreetMap' : 'National Library of Scotland'}</span>
			</div>
			<label class="map-switch">
				<input type="checkbox" bind:checked={modernOnly} onchange={setMapStyle} />
				<span aria-hidden="true"></span>
				Modern map
			</label>
		</div>
		<div class="flight-map"><div bind:this={mapElement}></div></div>
		<div class="legend">
			<span><i class="flight-marker">✈</i>Heading and recent path</span>
			<p>Source: OpenSky Network state vectors for the India footprint. Aircraft point in their reported direction; trails accumulate from observations received while this page remains open.</p>
		</div>
	</section>
</main>

<style>
	@font-face { font-family: 'Ticketing'; src: url('/fonts/ticketing/Ticketing.otf') format('opentype'); font-style: normal; font-weight: 400; font-display: swap; }
	.flight-page { --font-ticketing: 'Ticketing', var(--font-mono); width: min(100%, 94rem); margin-inline: auto; padding: var(--space-3xl) clamp(var(--space-m), 3vw, var(--space-2xl)) var(--space-4xl); box-sizing: border-box; font-family: var(--font-ticketing); }
	header { max-width: 68rem; margin-bottom: var(--space-2xl); }
	.eyebrow { margin: 0 0 var(--space-s); font: 400 var(--step--1)/1.2 var(--font-ticketing); text-transform: uppercase; letter-spacing: .1em; color: var(--color-accent); }
	h1 { margin: 0; font: 400 clamp(3rem, 7vw, 6.5rem)/.92 var(--font-ticketing); letter-spacing: -.025em; }
	.lede { max-width: 72ch; margin: var(--space-l) 0 0; color: var(--color-text-muted); font-size: var(--step-1); line-height: 1.6; }
	.status { display: flex; align-items: center; gap: .55rem; margin-top: var(--space-l); color: var(--color-text-muted); font: 400 var(--step--1)/1.2 var(--font-ticketing); }
	.status > i { width: .5rem; height: .5rem; border-radius: 50%; background: #a37b3b; }
	.status > i.online { background: #557f70; box-shadow: 0 0 0 4px color-mix(in srgb, #557f70 16%, transparent); }
	.status small { font-weight: 400; }
	.map-shell { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); }
	.map-toolbar { min-height: 4.4rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem var(--space-l); box-sizing: border-box; border-bottom: 1px solid var(--color-border); }
	.map-toolbar strong, .map-toolbar span { display: block; }
	.map-toolbar strong { font: 400 var(--step--1)/1.2 var(--font-ticketing); }
	.map-toolbar span { margin-top: .2rem; color: var(--color-text-muted); font-size: .72rem; }
	.map-switch { display: flex; align-items: center; gap: .55rem; color: var(--color-text-muted); font: 400 .72rem/1 var(--font-ticketing); cursor: pointer; }
	.map-switch input { position: absolute; opacity: 0; }
	.map-switch > span { width: 2.2rem; height: 1.2rem; position: relative; border: 1px solid var(--color-border); border-radius: 999px; background: var(--color-bg); }
	.map-switch > span::after { content: ''; position: absolute; top: .16rem; left: .16rem; width: .76rem; height: .76rem; border-radius: 50%; background: var(--color-accent); transition: transform var(--transition); }
	.map-switch input:checked + span::after { transform: translateX(1rem); }
	.flight-map { min-height: min(76svh, 52rem); position: relative; }
	.flight-map > div { position: absolute; inset: 0; }
	.legend { display: flex; align-items: center; gap: .8rem; padding: .8rem var(--space-l); border-top: 1px solid var(--color-border); color: var(--color-text-muted); font: 400 var(--step--1)/1.4 var(--font-ticketing); }
	.legend span { display: flex; align-items: center; gap: .5rem; color: var(--color-text); }
	.legend p { max-width: 62ch; margin: 0; line-height: 1.5; }
	.legend .flight-marker { display:inline-grid; width:1rem; height:1rem; place-items:center; color:var(--color-accent); font:700 .8rem/1 sans-serif; transform:rotate(45deg); }
	:global(.flight-icon-shell) { border:0 !important; background:transparent !important; }
	:global(.aircraft) { --heading:0deg; display:block; width:14px; height:16px; color:#a94736; filter:drop-shadow(0 1px 1px rgba(255,255,255,.8)); transform:rotate(var(--heading)); transform-origin:50% 50%; transition:transform .35s linear; }
	:global(.aircraft svg) { display:block; width:100%; height:100%; }
	:global(.aircraft path) { fill:currentColor; stroke:#f7f0dc; stroke-width:.65; vector-effect:non-scaling-stroke; }
	:global(.aircraft.is-grounded) { color:#756e5f; opacity:.68; }
	:global(.leaflet-tooltip) { font-family: var(--font-mono); font-size: .72rem; background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); }
	@media (max-width: 640px) { .map-toolbar, .legend { align-items: flex-start; flex-direction: column; } .flight-map { min-height: 36rem; } }
</style>
