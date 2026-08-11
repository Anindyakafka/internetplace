<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	type Vehicle = { id: string | null; label: string | null; routeId: string | null; latitude: number; longitude: number; bearing: number | null; timestamp: number | null };
	type Leaflet = typeof import('leaflet');

	let mapElement: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let historicalLayer: import('leaflet').TileLayer | null = null;
	let vehicleLayer: import('leaflet').LayerGroup | null = null;
	let leaflet: Leaflet | null = null;
	let vehicles: Vehicle[] = [];
	let modernOnly = $state(false);
	let vehicleCount = $state(0);
	let fetchedAt = $state<string | null>(null);
	let feedState = $state<'loading' | 'live' | 'error'>('loading');
	let error = $state('');

	function setMapStyle() {
		if (!map || !historicalLayer) return;
		if (modernOnly) historicalLayer.remove();
		else historicalLayer.addTo(map);
	}

	function drawVehicles() {
		if (!map || !leaflet || !vehicleLayer) return;
		vehicleLayer.clearLayers();
		const L = leaflet;
		const zoom = map.getZoom();

		if (zoom < 12) {
			const cellSize = zoom <= 9 ? 0.08 : zoom === 10 ? 0.045 : 0.025;
			const cells = new Map<string, { latitude: number; longitude: number; count: number }>();
			for (const vehicle of vehicles) {
				const x = Math.round(vehicle.longitude / cellSize);
				const y = Math.round(vehicle.latitude / cellSize);
				const key = `${x}:${y}`;
				const cell = cells.get(key);
				if (cell) { cell.latitude += vehicle.latitude; cell.longitude += vehicle.longitude; cell.count += 1; }
				else cells.set(key, { latitude: vehicle.latitude, longitude: vehicle.longitude, count: 1 });
			}
			for (const cell of cells.values()) {
				const point: [number, number] = [cell.latitude / cell.count, cell.longitude / cell.count];
				L.circleMarker(point, {
					radius: Math.min(12, 2.5 + Math.sqrt(cell.count) * 0.75),
					weight: 1,
					color: '#4b4030',
					fillColor: '#c84f3b',
					fillOpacity: Math.min(0.48, 0.15 + cell.count / 100),
					opacity: 0.38,
					interactive: false,
					renderer: L.canvas()
				}).addTo(vehicleLayer);
			}
			return;
		}

		for (const vehicle of vehicles) {
			const marker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
				radius: zoom >= 14 ? 3 : 2.25,
				weight: 0.7,
				color: '#292722',
				fillColor: '#d65a43',
				fillOpacity: 0.72,
				opacity: 0.7,
				renderer: L.canvas()
			}).addTo(vehicleLayer);
			marker.bindTooltip(`${vehicle.label ?? 'Delhi transit vehicle'}${vehicle.routeId ? `<br>Route ${vehicle.routeId}` : ''}`, { direction: 'top' });
		}
	}

	onMount(() => {
		let disposed = false;
		let timer: ReturnType<typeof setInterval>;
		void import('leaflet').then((module) => {
			if (disposed) return;
			leaflet = module.default;
			const L = leaflet;
			map = L.map(mapElement, { zoomControl: false, preferCanvas: true, scrollWheelZoom: true }).setView([28.6139, 77.209], 10);
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);
			historicalLayer = L.tileLayer('https://geo.nls.uk/mapdata3/india-combined/{z}/{x}/{y}.png', { maxZoom: 15, opacity: 0.88, attribution: 'Historical map tiles © National Library of Scotland' }).addTo(map);
			vehicleLayer = L.layerGroup().addTo(map);
			map.on('zoomend', drawVehicles);

			const refresh = async () => {
				try {
					const response = await fetch('/.netlify/functions/delhi-vehicles');
					if (!response.ok) throw new Error(`Vehicle feed returned ${response.status}`);
					const payload = await response.json();
					vehicles = ((payload.vehicles ?? []) as Vehicle[]).filter((v) => Number.isFinite(v.latitude) && Number.isFinite(v.longitude));
					vehicleCount = vehicles.length; fetchedAt = payload.fetchedAt ?? null; feedState = 'live'; error = '';
					drawVehicles();
				} catch (cause) {
					feedState = 'error';
					const message = cause instanceof Error ? cause.message : '';
					error = message.includes('404') ? 'Netlify functions are unavailable in Vite Preview; use npm run dev:netlify.' : message || 'Vehicle data is unavailable.';
				}
			};
			void refresh(); timer = setInterval(refresh, 20_000);
		});
		return () => { disposed = true; clearInterval(timer); map?.remove(); map = null; };
	});
</script>

<svelte:head><title>Delhi Vehicles — Anindya Singh</title><meta name="description" content="Delhi transit vehicle movement visualized over a historical map." /></svelte:head>

<main class="vehicle-page">
	<header><p class="eyebrow">Delhi · transit movement</p><h1>The city, in motion.</h1><p class="lede">A quiet view of Delhi's public transit vehicles over the historical city. At a distance they gather into fields of activity; zoom in to see individual vehicles.</p><div class="status"><i class:online={feedState === 'live'}></i>{#if feedState === 'loading'}Connecting…{:else if feedState === 'live'}{vehicleCount.toLocaleString('en-IN')} vehicles in the latest feed{:else}{error}{/if}{#if fetchedAt}<small>Updated {new Date(fetchedAt).toLocaleTimeString('en-IN')}</small>{/if}</div></header>
	<section class="map-shell" aria-label="Delhi public transit vehicle map">
		<div class="map-toolbar"><div><strong>{modernOnly ? 'Modern map' : 'Historical map'}</strong><span>{modernOnly ? 'OpenStreetMap' : 'National Library of Scotland'}</span></div><label class="map-switch"><input type="checkbox" bind:checked={modernOnly} onchange={setMapStyle} /><span aria-hidden="true"></span>Modern map</label></div>
		<div class="vehicle-map"><div bind:this={mapElement}></div></div>
		<div class="legend"><span><i class="density"></i>Concentration of vehicles</span><span><i class="vehicle"></i>Individual vehicle (zoomed in)</span><p>Positions refresh every 20 seconds and may be delayed or incomplete. This is an exploratory visualization, not a journey-planning tool.</p></div>
	</section>
</main>

<style>
	.vehicle-page{width:min(100%,94rem);margin-inline:auto;padding:var(--space-3xl) clamp(var(--space-m),3vw,var(--space-2xl)) var(--space-4xl);box-sizing:border-box}header{max-width:68rem;margin-bottom:var(--space-2xl)}.eyebrow{margin:0 0 var(--space-s);font:600 var(--step--1)/1.2 var(--font-mono);text-transform:uppercase;letter-spacing:.1em;color:var(--color-accent)}h1{margin:0;font:500 clamp(3rem,7vw,6.5rem)/.92 var(--font-serif);letter-spacing:-.045em}.lede{max-width:72ch;margin:var(--space-l) 0 0;color:var(--color-text-muted);font-size:var(--step-1);line-height:1.6}.status{display:flex;align-items:center;gap:.55rem;margin-top:var(--space-l);color:var(--color-text-muted);font:600 var(--step--1)/1.2 var(--font-mono)}.status>i{width:.5rem;height:.5rem;border-radius:50%;background:#a37b3b}.status>i.online{background:#557f70;box-shadow:0 0 0 4px color-mix(in srgb,#557f70 16%,transparent)}.status small{font-weight:400}.map-shell{overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius);background:var(--color-surface)}.map-toolbar{min-height:4.4rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.8rem var(--space-l);box-sizing:border-box;border-bottom:1px solid var(--color-border)}.map-toolbar strong,.map-toolbar span{display:block}.map-toolbar strong{font:600 var(--step--1)/1.2 var(--font-sans)}.map-toolbar span{margin-top:.2rem;color:var(--color-text-muted);font-size:.72rem}.map-switch{display:flex;align-items:center;gap:.55rem;color:var(--color-text-muted);font:600 .72rem/1 var(--font-sans);cursor:pointer}.map-switch input{position:absolute;opacity:0}.map-switch>span{width:2.2rem;height:1.2rem;position:relative;border:1px solid var(--color-border);border-radius:999px;background:var(--color-bg)}.map-switch>span::after{content:'';position:absolute;top:.16rem;left:.16rem;width:.76rem;height:.76rem;border-radius:50%;background:var(--color-text-muted);transition:.2s}.map-switch input:checked+span::after{transform:translateX(1rem);background:var(--color-accent)}.map-switch input:focus-visible+span{outline:2px solid var(--color-accent);outline-offset:3px}.vehicle-map{height:clamp(35rem,72vh,52rem);background:#d9d0bb}.vehicle-map>div{width:100%;height:100%}.legend{display:flex;align-items:center;flex-wrap:wrap;gap:.7rem 1.5rem;padding:var(--space-m) var(--space-l);border-top:1px solid var(--color-border);color:var(--color-text-muted);font-size:.72rem}.legend span{display:flex;align-items:center;gap:.45rem}.legend i{display:inline-block;border:1px solid #4b4030;background:#c84f3b}.legend .density{width:.85rem;height:.85rem;border-radius:50%;opacity:.45}.legend .vehicle{width:.4rem;height:.4rem;border-radius:50%;opacity:.8}.legend p{flex-basis:100%;max-width:90ch;margin:.15rem 0 0;line-height:1.5}:global(.leaflet-tooltip){font-family:var(--font-sans);font-size:.72rem;background:#faf6e9;color:#292722;border:1px solid rgba(41,39,34,.2)}@media(max-width:640px){.vehicle-page{padding-inline:var(--space-m)}.vehicle-map{height:64vh;min-height:30rem}.map-toolbar,.legend{padding-inline:var(--space-m)}.status{align-items:flex-start;flex-direction:column;gap:.3rem}}
</style>
