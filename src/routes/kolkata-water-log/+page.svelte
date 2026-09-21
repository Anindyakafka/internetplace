<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { waterLogReports, type WaterLogReport } from '$lib/data/kolkata-water-log';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let mapNode: HTMLDivElement;
	let map: import('maplibre-gl').Map | null = null;
	let opacity = $state(100);
	let open = $state(false);
	let screen = $state<'index' | 'report' | 'method'>('index');
	let selected = $state<WaterLogReport | null>(null);
	let ready = $state(false);
	let locating = $state(false);
	let notice = $state('');
	const bounds = { west: 88.18, south: 22.45, east: 88.58, north: 22.72 };
	const reports = [...waterLogReports].sort((a, b) => a.name.localeCompare(b.name));

	function choose(report: WaterLogReport) {
		selected = report; screen = 'report'; open = true;
	}
	function index() { selected = null; screen = 'index'; }
	function closeDrawer() { open = false; }
	function updateOpacity() { if (map?.getLayer('water')) map.setPaintProperty('water', 'raster-opacity', opacity / 100); }
	function locate() {
		if (!map || locating || !browser) return;
		locating = true;
		navigator.geolocation?.getCurrentPosition(({ coords }) => {
			locating = false;
			if (!map) return;
			if (coords.longitude < bounds.west || coords.longitude > bounds.east || coords.latitude < bounds.south || coords.latitude > bounds.north) {
				notice = 'You seem to be outside the Kolkata map. The rain may be kinder where you are.'; return;
			}
			map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 15.2, pitch: 25, duration: 1800 });
		}, () => { locating = false; notice = 'Location could not be read. Check browser permission and try again.'; }, { enableHighAccuracy: true, timeout: 8000 });
	}

	onMount(() => {
		let disposed = false;
		void import('maplibre-gl').then((ml) => {
			if (disposed) return;
			const hash = location.hash.slice(1).split('/').map(Number);
			const valid = hash.length >= 3 && hash.slice(0, 3).every(Number.isFinite);
			map = new ml.Map({
				container: mapNode, style: 'https://tiles.openfreemap.org/styles/liberty',
				center: valid ? [hash[2], hash[1]] : [88.3639, 22.5726], zoom: valid ? hash[0] : 12.7,
				bearing: valid ? hash[3] || 0 : 0, pitch: valid ? hash[4] || 45 : 45,
				minZoom: 11, maxZoom: 18, maxBounds: [[87.98, 22.3], [88.75, 22.86]], attributionControl: false
			});
			map.addControl(new ml.NavigationControl({ visualizePitch: true }), 'bottom-right');
			map.addControl(new ml.AttributionControl({ compact: true }), 'bottom-right');
			map.on('load', () => {
				if (!map) return; ready = true;
				const labels = map.getStyle().layers?.find((l) => l.type === 'symbol')?.id;
				// The terrain raster is extremely fine. Quiet the basemap so its channels
				// remain legible without obscuring streets or labels.
				for (const layer of map.getStyle().layers ?? []) {
					try {
						if (layer.type === 'fill' && layer.id !== 'background') map.setPaintProperty(layer.id, 'fill-opacity', 0.62);
						if (layer.type === 'line' && !layer.id.toLowerCase().includes('water')) map.setPaintProperty(layer.id, 'line-opacity', 0.5);
					} catch { /* Some style expressions cannot be replaced. */ }
				}
				const vector = Object.keys(map.getStyle().sources).find((name) => map?.getSource(name)?.type === 'vector');
				if (vector) try { map.addLayer({ id: 'buildings', type: 'fill-extrusion', source: vector, 'source-layer': 'building', minzoom: 14, paint: { 'fill-extrusion-color': '#d8d2c5', 'fill-extrusion-height': ['coalesce', ['get','render_height'], ['get','height'], 7], 'fill-extrusion-base': 0, 'fill-extrusion-opacity': .45 } }, labels); } catch { /* style schema varies */ }
				map.addSource('water-model', { type: 'image', url: '/data/kolkata-water-log/accumulation.png', coordinates: [[bounds.west,bounds.north],[bounds.east,bounds.north],[bounds.east,bounds.south],[bounds.west,bounds.south]] });
				map.addLayer({ id: 'water', type: 'raster', source: 'water-model', paint: { 'raster-opacity': opacity / 100, 'raster-resampling': 'nearest', 'raster-fade-duration': 250, 'raster-contrast': 0.35, 'raster-saturation': 0.45 } }, labels);
				// Map-native features stay locked to geographic coordinates. DOM markers
				// visibly drift when a pitched WebGL map is panned or zoomed.
				map.addSource('water-reports', {
					type: 'geojson',
					data: { type: 'FeatureCollection', features: waterLogReports.map((report, index) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: report.coordinates }, properties: { index, name: report.name } })) }
				});
				map.addLayer({ id: 'report-points', type: 'circle', source: 'water-reports', paint: { 'circle-radius': 6, 'circle-color': '#286c72', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2, 'circle-pitch-alignment': 'map' } });
				map.addLayer({ id: 'report-labels', type: 'symbol', source: 'water-reports', layout: { 'text-field': ['get','name'], 'text-size': 12, 'text-font': ['Noto Sans Regular'], 'text-anchor': 'left', 'text-offset': [0.8,0], 'text-allow-overlap': false, 'text-pitch-alignment': 'viewport', 'text-rotation-alignment': 'viewport' }, paint: { 'text-color': '#173f42', 'text-halo-color': 'rgba(255,255,255,0.96)', 'text-halo-width': 2.5, 'text-halo-blur': 0.5 } });
				const openReport = (event: import('maplibre-gl').MapLayerMouseEvent) => {
					const reportIndex = Number(event.features?.[0]?.properties?.index);
					if (Number.isInteger(reportIndex) && waterLogReports[reportIndex]) choose(waterLogReports[reportIndex]);
				};
				map.on('click', 'report-points', openReport);
				map.on('click', 'report-labels', openReport);
				for (const layerId of ['report-points','report-labels']) {
					map.on('mouseenter', layerId, () => { if (map) map.getCanvas().style.cursor = 'pointer'; });
					map.on('mouseleave', layerId, () => { if (map) map.getCanvas().style.cursor = ''; });
				}
			});
			map.on('moveend', () => { if (!map) return; const c = map.getCenter(); history.replaceState(null, '', `#${map.getZoom().toFixed(2)}/${c.lat.toFixed(5)}/${c.lng.toFixed(5)}/${map.getBearing().toFixed(0)}/${map.getPitch().toFixed(0)}`); });
		});
		return () => { disposed = true; map?.remove(); map = null; };
	});
</script>

<svelte:head><title>Kolkata Water Log — Anindya Singh</title><meta name="description" content="Explore terrain-derived water-flow and accumulation patterns across Kolkata alongside a living archive of reported waterlogging." /></svelte:head>

<main class="page">
	<div class="map" bind:this={mapNode} aria-label="Interactive pitched map of water accumulation likelihood in Kolkata"></div><div class="shade"></div>
	{#if !ready}<div class="loading"><i></i><span>Reading the terrain…</span></div>{/if}
	<header class="title"><div><h1>Kolkata Water Log</h1><p>Mapping where water drains and gathers</p></div><span class="fill"><i></i><i></i><i></i><i></i></span></header>
	<a class="mark" href="/sections"><b>জ</b><span><small>An internet place by</small><strong>Anindya Singh</strong></span></a>
	<button class="locate" onclick={locate} disabled={locating}><b class:spin={locating}>⌖</b><span>{locating ? 'Locating' : 'Locate me'}</span></button>

	<section class:open class="drawer">
		<button class="trigger" onclick={() => open = !open} aria-expanded={open}>
			<span class="legend"><i class="low"></i>Possible accumulation <i class="mid"></i>Higher <i class="high"></i>Highest</span><b></b>
		</button>
		{#if open}<button class="minimise" onclick={closeDrawer} aria-label="Minimise information panel">Minimise ↓</button>{/if}
		<div class="body">
			{#if screen === 'report' && selected}
				<div class="screen"><header class="screen-head"><div><h2>{selected.name}</h2><p>{selected.neighbourhood}</p></div><button onclick={index}>← Back</button></header>
					<div class="report"><h3>In the news</h3><article><time>{selected.date}</time><div><strong>{selected.source}</strong><p>A documented report of waterlogging around {selected.name}. The marker locates the neighbourhood, not the extent or depth of inundation.</p><a href={selected.url} target="_blank" rel="noreferrer">Read the original report ↗</a></div></article></div><footer class="empty"><b>≈</b><span>That is everything collected here—for now.</span></footer>
				</div>
			{:else if screen === 'method'}
				<div class="screen"><header class="screen-head"><div><h2>Methodology</h2><p>How this surface was made</p></div><button onclick={index}>Back →</button></header>
					<div class="method"><p>A 30-metre Copernicus GLO-30 elevation model was clipped to metropolitan Kolkata. Depressions were filled, a D8 flow direction calculated, and upstream cells accumulated. The logarithm of accumulation was classified at the 78th, 90th and 97th percentiles.</p><p>This is a terrain reading—not a flood forecast. It cannot see rainfall intensity, drains, pumps, sewer failure, tide locking or street-level construction. News reports form a separate documentary layer.</p></div>
					<p class="credit">Method adapted, with permission, from <a href="https://github.com/diagram-chasing/blr-water-log" target="_blank" rel="noreferrer">Diagram Chasing’s BLR Water Log ↗</a>. Map data © OpenStreetMap contributors.</p>
				</div>
			{:else}
				<div class="screen"><div class="intro"><div><p class="eyebrow">The way of water</p><h2>The city interrupts a surface that still remembers how to drain.</h2><p>Blue traces show where terrain concentrates flow. Beside them sits a growing archive of places repeatedly named in reporting.</p></div><div class="diagram"><i></i><i></i><i></i><b></b><span></span></div></div>
					<div class="browse"><div><p>Choose a locality to read its collected report.</p><button onclick={() => { screen = 'method'; }}>Methodology</button></div><nav>{#each reports as report}<button onclick={() => choose(report)}>{report.name}<b>→</b></button>{/each}</nav></div>
					<div class="opacity"><label for="opacity"><span>Water-layer opacity</span><b>{opacity}%</b></label><input id="opacity" type="range" min="0" max="100" bind:value={opacity} oninput={updateOpacity} style={`--p:${opacity}%`} /></div>
				</div>
			{/if}
		</div>
	</section>
	{#if notice}<div class="veil"><button class="dismiss" aria-label="Close location notice" onclick={() => notice = ''}></button><div class="alert" role="alertdialog" tabindex="-1"><h2>Oops!</h2><p>{notice}</p><button onclick={() => notice = ''}>Close</button></div></div>{/if}
</main>

<style>
	:global(body:has(.page)){overflow:hidden}.page{position:relative;height:calc(100dvh - 4rem);min-height:38rem;background:#d7dfdc;color:#293130}.map{position:absolute;inset:0}.shade{position:absolute;z-index:2;inset:0 0 auto;height:18%;pointer-events:none;background:linear-gradient(#17201fa8,transparent)}.loading{position:absolute;z-index:5;inset:0;display:grid;place-content:center;justify-items:center;gap:.8rem;background:#dce5e1;color:#356f73;font:600 .7rem var(--font-mono);text-transform:uppercase}.loading i{width:2.6rem;height:2.6rem;border:3px solid #519ea233;border-top-color:#519ea2;border-radius:50%;animation:spin 1s linear infinite}
	.title{position:absolute;z-index:10;top:1rem;left:50%;width:min(20rem,calc(100% - 10rem));min-height:5.6rem;transform:translateX(-50%);overflow:hidden;border:1px solid #ddd;border-radius:.65rem;background:white;box-shadow:0 8px 25px #0004}.title>div{position:relative;z-index:2;padding:.7rem;text-align:center}.title h1{margin:0;font:700 clamp(1.7rem,3vw,2.5rem)/1 var(--font-sans);text-transform:uppercase}.title p{margin:.3rem 0;font:600 .7rem var(--font-sans)}.fill{position:absolute;inset:auto 0 0;height:46%;background:#74b1b5b5;animation:tide 30s ease-in-out infinite}.fill:before{content:'';position:absolute;left:-10%;top:-8px;width:120%;height:16px;background:radial-gradient(ellipse,#74b1b5 48%,transparent 51%) 0 0/28px 15px;animation:wave 5s linear infinite}.fill i{position:absolute;bottom:-5px;width:5px;height:5px;border-radius:50%;background:#fff9;animation:bubble 4s infinite}.fill i:nth-child(1){left:15%}.fill i:nth-child(2){left:40%;animation-delay:1s}.fill i:nth-child(3){left:65%;animation-delay:2s}.fill i:nth-child(4){left:85%;animation-delay:3s}
	.mark,.locate{position:absolute;z-index:10;border:1px solid #d3d3d0;border-radius:.45rem;background:#fff;box-shadow:0 6px 20px #0004}.mark{left:1rem;bottom:1rem;display:flex;align-items:center;gap:.5rem;padding:.35rem .55rem;color:inherit;text-decoration:none}.mark>b{display:grid;place-items:center;width:2.2rem;height:2.2rem;border-radius:.25rem;background:#74b1b5;color:white;font-size:1.35rem}.mark small,.mark strong{display:block}.mark small{font-size:.58rem}.mark strong{font:.7rem var(--font-mono);text-transform:uppercase}.locate{right:1rem;top:1rem;display:flex;align-items:center;gap:.4rem;padding:.5rem .7rem;color:#356f73;cursor:pointer}.locate b{font-size:1.3rem}.locate span{font-weight:700}
	.drawer{position:absolute;z-index:20;left:50%;bottom:0;width:min(44rem,calc(100% - 1.5rem));height:min(35rem,72dvh);transform:translate(-50%,calc(100% - 5.5rem));transition:transform .4s cubic-bezier(.22,.8,.22,1);border-radius:1.2rem 1.2rem 0 0;background:white;box-shadow:0 -10px 35px #0003}.drawer.open{transform:translate(-50%,0)}.trigger{width:100%;height:5.5rem;border:0;border-radius:inherit;background:white;cursor:pointer}.trigger>b{display:block;width:3rem;height:.35rem;margin:.9rem auto 0;border-radius:1rem;background:#d4d4d4}.minimise{position:absolute;z-index:3;right:.85rem;top:.7rem;padding:.35rem .55rem;border:1px solid #d6d9d7;border-radius:999px;background:#fff;color:#397b80;font:700 .62rem var(--font-mono);cursor:pointer}.legend{display:flex;justify-content:center;align-items:center;gap:.4rem;color:#56605f;font:600 .68rem var(--font-sans)}.legend i{width:1.1rem;height:1.1rem;border-radius:.15rem}.low{background:#c4cdd0}.mid{background:#abced0}.high{background:#519ea2}.body{height:calc(100% - 5.5rem);overflow:hidden;border-top:1px solid #eee}.screen{height:100%;overflow:auto;animation:appear .3s}.screen-head{display:flex;justify-content:space-between;align-items:center;margin:0 1rem;padding:1rem 0;border-bottom:1px solid #e6e6e3}.screen-head h2{margin:0;font-size:1.7rem}.screen-head p{margin:.2rem 0;color:#767d7c}.screen-head button,.browse button{padding:.6rem .9rem;border:1px solid #ddd;border-radius:.45rem;background:#f5f5f3;font-weight:700;cursor:pointer}
	.intro{display:grid;grid-template-columns:1.1fr .9fr;gap:1rem;padding:1rem}.eyebrow{margin:0;color:#397b80;font:700 .7rem var(--font-mono);text-transform:uppercase}.intro h2{margin:.25rem 0 .5rem;font-size:1.7rem;line-height:1.05}.intro p{color:#646c6b}.diagram{position:relative;overflow:hidden;min-height:9rem;border-radius:.5rem;background:linear-gradient(#dce8e6,#f7f5e7)}.diagram span{position:absolute;left:-10%;right:-10%;bottom:-4rem;height:9rem;border-radius:50%;background:#88aa94}.diagram b{position:absolute;z-index:2;left:43%;bottom:0;width:16%;height:55%;clip-path:polygon(35% 0,65% 0,100% 100%,0 100%);background:#5d9da8}.diagram i{position:absolute;z-index:3;top:-2rem;width:2px;height:1.5rem;background:#519ea2;animation:rain 1.5s infinite}.diagram i:nth-child(1){left:25%}.diagram i:nth-child(2){left:55%;animation-delay:.5s}.diagram i:nth-child(3){left:80%;animation-delay:1s}.browse{display:grid;grid-template-columns:.4fr .6fr;gap:1rem;padding:0 1rem 1rem}.browse>div{display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;color:#737b7a}.browse>div p{margin:0}.browse>div button{padding:.5rem 0;border:0;background:none;text-decoration:underline;text-underline-offset:5px}.browse nav{max-height:9rem;overflow:auto;border-block:1px solid #eee}.browse nav button{display:flex;justify-content:space-between;width:100%;padding:.55rem .8rem;border:0;border-bottom:1px solid #eee;border-radius:0;background:white;text-align:left}.browse nav button:hover{background:#eef3f1}.opacity{padding:.8rem 1rem;border-top:1px solid #eee}.opacity label{display:flex;justify-content:space-between;font:600 .7rem var(--font-mono)}.opacity input{width:100%;height:.45rem;appearance:none;border-radius:1rem;background:linear-gradient(to right,#74b1b5 var(--p),#e4e4e1 var(--p));accent-color:#74b1b5}.report{padding:1rem}.report h3{border-bottom:1px solid #eee;padding-bottom:.5rem}.report article{display:grid;grid-template-columns:6rem 1fr;gap:1rem;padding:.9rem;border:1px solid #ddd;border-radius:.5rem;background:#fafaf8}.report time{font:700 .75rem var(--font-mono)}.report p{color:#66706e}.report a,.credit a{color:#397b80;font-weight:700}.empty{display:grid;place-items:center;color:#8a9492}.empty b{font-size:3rem;color:#74b1b5}.method{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;padding:1.2rem;color:#596260;line-height:1.55}.credit{margin:0 1rem;padding-top:1rem;border-top:1px solid #eee;color:#747d7b;font-size:.7rem}.veil{position:fixed;z-index:1000;inset:0;display:grid;place-items:center;background:#0007}.dismiss{position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent}.alert{position:relative;width:min(24rem,calc(100% - 2rem));padding:1.4rem;text-align:center;border-radius:.7rem;background:#fffffff2}.alert h2{font-size:2.5rem;margin:0}.alert button{padding:.5rem 1rem;border:1px solid #397b80;border-radius:.4rem;background:white;color:#397b80;font-weight:700}
	:global(.maplibregl-ctrl-bottom-right){bottom:5.7rem}:global(.maplibregl-ctrl-attrib){font-size:9px}.spin{animation:spin .8s linear infinite}
	@keyframes spin{to{transform:rotate(360deg)}}@keyframes tide{0%,100%{height:25%}50%{height:58%}}@keyframes wave{to{transform:translateX(28px)}}@keyframes bubble{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-5rem)}}@keyframes rain{to{transform:translate(-1rem,11rem)}}@keyframes appear{from{opacity:0;transform:translateX(10px)}}
	@media(max-width:700px){.page{height:calc(100dvh - 3.5rem)}.title{top:.65rem;width:calc(100% - 6.5rem);min-height:4.7rem}.title h1{font-size:1.5rem}.mark{left:.65rem;bottom:.65rem}.mark span{display:none}.locate{right:.65rem;top:.65rem}.locate span{display:none}.drawer{width:calc(100% - .75rem);height:76dvh;transform:translate(-50%,calc(100% - 5.1rem))}.trigger{height:5.1rem}.body{height:calc(100% - 5.1rem)}.legend{font-size:.58rem}.legend i{width:.9rem;height:.9rem}.intro,.method{grid-template-columns:1fr}.diagram{min-height:5rem}.browse{grid-template-columns:.38fr .62fr}.report article{grid-template-columns:1fr}:global(.maplibregl-ctrl-bottom-right){bottom:5.2rem}:global(.maplibregl-ctrl-attrib){display:none}}
	@media(prefers-reduced-motion:reduce){.fill,.fill:before,.fill i,.diagram i,.loading i{animation:none}.drawer{transition:none}}
</style>
