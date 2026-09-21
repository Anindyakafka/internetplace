<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { waterLogReports, type WaterLogReport } from '$lib/data/kolkata-water-log';
	import 'leaflet/dist/leaflet.css';

	let mapElement: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let overlay: import('leaflet').ImageOverlay | null = null;
	let opacity = $state(72);
	let selected = $state<WaterLogReport | null>(null);
	let drawerOpen = $state(false);
	let locating = $state(false);
	let locateMessage = $state('');

	const bounds: [[number, number], [number, number]] = [[22.45, 88.18], [22.72, 88.58]];

	function updateOpacity() {
		overlay?.setOpacity(opacity / 100);
	}

	function locate() {
		if (!map || !browser || locating) return;
		locating = true;
		locateMessage = '';
		map.locate({ setView: false, enableHighAccuracy: true, timeout: 8000 });
	}

	onMount(() => {
		if (!browser) return;
		let disposed = false;
		void import('leaflet').then((module) => {
			if (disposed) return;
			const L = module.default;
			const hash = window.location.hash.slice(1).split('/').map(Number);
			const initial = hash.length >= 3 && hash.every(Number.isFinite)
				? { zoom: hash[0], lat: hash[1], lng: hash[2] }
				: { zoom: 12, lat: 22.5726, lng: 88.3639 };
			map = L.map(mapElement, { zoomControl: false, minZoom: 10, maxZoom: 18, scrollWheelZoom: true, preferCanvas: true }).setView([initial.lat, initial.lng], initial.zoom);
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);
			overlay = L.imageOverlay('/data/kolkata-water-log/accumulation.png', bounds, { opacity: opacity / 100, interactive: false }).addTo(map);

			for (const report of waterLogReports) {
				const icon = L.divIcon({ className: 'water-report-shell', html: `<button class="water-report-marker" aria-label="Open report for ${report.name}"><span></span>${report.name}</button>`, iconAnchor: [8, 8] });
				L.marker([report.coordinates[1], report.coordinates[0]], { icon, title: report.name })
					.on('click', () => { selected = report; drawerOpen = true; })
					.addTo(map);
			}

			map.on('moveend', () => {
				if (!map) return;
				const centre = map.getCenter();
				history.replaceState(null, '', `#${map.getZoom()}/${centre.lat.toFixed(5)}/${centre.lng.toFixed(5)}/0/0`);
			});
			map.on('locationfound', (event) => {
				locating = false;
				if (!map) return;
				if (!L.latLngBounds(bounds).contains(event.latlng)) {
					locateMessage = 'You appear to be outside the Kolkata map.';
					return;
				}
				map.flyTo(event.latlng, 15, { duration: 1.5 });
				L.circleMarker(event.latlng, { radius: 8, color: '#fff', weight: 2, fillColor: '#3c858b', fillOpacity: 1 }).addTo(map).bindTooltip('Your location').openTooltip();
			});
			map.on('locationerror', () => { locating = false; locateMessage = 'Location could not be read. Check browser permission.'; });
		});
		return () => { disposed = true; map?.remove(); map = null; };
	});
</script>

<svelte:head>
	<title>Kolkata Water Log — Anindya Singh</title>
	<meta name="description" content="Explore terrain-derived water-flow and accumulation patterns across Kolkata alongside documented waterlogging reports." />
</svelte:head>

<main class="water-log-page">
	<div class="map" bind:this={mapElement} aria-label="Interactive map of terrain-derived water accumulation likelihood in Kolkata"></div>
	<header class="title-card">
		<p>Kolkata · terrain and drainage</p>
		<h1>Kolkata<br />Water Log</h1>
		<span>Where might water gather and flow?</span>
	</header>
	<button class="locate" onclick={locate} disabled={locating}>{locating ? 'Locating…' : 'Locate me'}</button>

	<section class:open={drawerOpen} class="drawer" aria-label="Map information">
		<button class="drawer-handle" aria-label={drawerOpen ? 'Close information drawer' : 'Open information drawer'} onclick={() => drawerOpen = !drawerOpen}><i></i></button>
		{#if selected}
			<div class="report-detail">
				<p class="kicker">Documented waterlogging · {selected.date}</p>
				<button class="close" onclick={() => { selected = null; drawerOpen = false; }} aria-label="Close report">×</button>
				<h2>{selected.name}</h2>
				<p>{selected.neighbourhood}. The marker is an approximate locality centre, not an inundation boundary.</p>
				<a href={selected.url} target="_blank" rel="noreferrer">Read the report at {selected.source} ↗</a>
			</div>
		{:else}
			<div class="drawer-grid">
				<div>
					<p class="kicker">Read the surface</p>
					<h2>Water follows terrain—but the city changes its path.</h2>
					<p>This layer models likely flow concentration from 30 m elevation data. Darker blue indicates stronger upstream accumulation. It does not forecast rainfall, drain capacity, tide locking, sewer failure, or street-level flood depth.</p>
				</div>
				<div class="controls">
					<label for="opacity"><span>Water layer</span><strong>{opacity}%</strong></label>
					<input id="opacity" type="range" min="0" max="100" bind:value={opacity} oninput={updateOpacity} />
					<div class="legend"><span><i class="low"></i>Possible concentration</span><span><i class="mid"></i>Higher</span><span><i class="high"></i>Highest</span></div>
					<p class="source">Copernicus DEM GLO-30 · D8 flow accumulation · reported locations from linked journalism · method adapted with permission from <a href="https://github.com/diagram-chasing/blr-water-log" target="_blank" rel="noreferrer">Diagram Chasing’s BLR Water Log ↗</a>.</p>
				</div>
			</div>
		{/if}
		{#if locateMessage}<p class="locate-message">{locateMessage}</p>{/if}
	</section>
</main>

<style>
	:global(body:has(.water-log-page)){overflow:hidden}.water-log-page{position:relative;height:calc(100dvh - 4rem);min-height:38rem;background:#d9e2df}.map{position:absolute;inset:0}.title-card{position:absolute;z-index:600;top:clamp(1rem,3vw,2rem);left:clamp(1rem,3vw,2rem);padding:1rem 1.15rem;background:rgba(250,247,237,.9);border:1px solid rgba(42,62,61,.25);box-shadow:0 8px 30px rgba(24,41,40,.12);backdrop-filter:blur(10px)}.title-card p,.kicker{margin:0;color:#397b80;font:600 .68rem/1.2 var(--font-mono);letter-spacing:.09em;text-transform:uppercase}.title-card h1{margin:.3rem 0;font:500 clamp(2.4rem,6vw,5rem)/.78 var(--font-serif);letter-spacing:-.055em;color:#263938}.title-card span{font-size:.72rem;color:#536563}.locate{position:absolute;z-index:600;right:1rem;top:1rem;padding:.65rem .9rem;border:1px solid #315f62;border-radius:999px;background:rgba(250,247,237,.92);color:#315f62;font:600 .7rem var(--font-mono);cursor:pointer}.drawer{position:absolute;z-index:650;left:50%;bottom:0;width:min(56rem,calc(100% - 2rem));min-height:4.1rem;padding:0 1.25rem 1.25rem;box-sizing:border-box;transform:translate(-50%,calc(100% - 4.1rem));transition:transform .35s cubic-bezier(.2,.8,.2,1);background:rgba(250,247,237,.96);border:1px solid rgba(42,62,61,.24);border-bottom:0;border-radius:1rem 1rem 0 0;box-shadow:0 -10px 35px rgba(24,41,40,.14);backdrop-filter:blur(12px)}.drawer.open{transform:translate(-50%,0)}.drawer-handle{width:100%;height:4rem;border:0;background:transparent;cursor:pointer}.drawer-handle i{display:block;width:3rem;height:4px;margin:auto;border-radius:9px;background:#6b7d7b}.drawer-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:2rem}.drawer h2{max-width:22ch;margin:.35rem 0 .7rem;font:500 clamp(1.5rem,3vw,2.5rem)/1.05 var(--font-serif)}.drawer p{color:#536563;line-height:1.5}.controls label{display:flex;justify-content:space-between;color:#263938;font:.72rem var(--font-mono)}.controls input{width:100%;accent-color:#519ea2}.legend{display:flex;flex-wrap:wrap;gap:.55rem 1rem;margin:1rem 0;color:#536563;font:.68rem var(--font-mono)}.legend span{display:flex;align-items:center;gap:.35rem}.legend i{width:.85rem;height:.85rem;display:inline-block}.low{background:rgba(196,205,208,.7)}.mid{background:#abced0}.high{background:#519ea2}.source{font-size:.68rem}.source a,.report-detail a{color:#397b80;font-weight:600}.report-detail{position:relative;max-width:42rem}.report-detail a{font:.74rem var(--font-mono)}.close{position:absolute;right:0;top:-.5rem;border:0;background:transparent;color:#263938;font-size:2rem;cursor:pointer}.locate-message{margin:.75rem 0 0;font-size:.72rem}:global(.water-report-shell){width:auto!important;height:auto!important;background:transparent!important;border:0!important}:global(.water-report-marker){display:flex;align-items:center;gap:.35rem;width:max-content;padding:.25rem .45rem .25rem .25rem;border:1px solid rgba(38,57,56,.35);border-radius:999px;background:rgba(250,247,237,.9);color:#263938;font:600 10px/1 var(--font-sans);box-shadow:0 2px 8px rgba(24,41,40,.12);cursor:pointer}:global(.water-report-marker span){width:.52rem;height:.52rem;border-radius:50%;background:#397b80;box-shadow:0 0 0 3px rgba(81,158,162,.2)}:global(.leaflet-control-attribution){font-size:9px}@media(max-width:700px){.water-log-page{height:calc(100dvh - 3.5rem)}.title-card h1{font-size:2.7rem}.drawer{width:calc(100% - 1rem)}.drawer-grid{grid-template-columns:1fr;gap:1rem}.title-card span{display:none}:global(.water-report-marker){font-size:0;padding:.3rem}:global(.water-report-marker span){width:.62rem;height:.62rem}}
</style>
