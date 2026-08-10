<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { routeCoordinates, services, stations, type TrainService } from '$lib/trains/demo-network';

	let {
		selectedId = null,
		liveProgress = null,
		onselect = (_id: string) => {}
	}: { selectedId?: string | null; liveProgress?: number | null; onselect?: (id: string) => void } = $props();

	let mapElement: HTMLDivElement;
	let showModern = $state(false);
	let historicalOpacity = $state(0.88);
	let map: import('leaflet').Map | null = null;
	let historicalLayer: import('leaflet').TileLayer | null = null;
	let modernLayer: import('leaflet').TileLayer | null = null;
	let trainMarkers = new Map<string, import('leaflet').Marker>();
	let animationFrame = 0;

	function distances(points: [number, number][]) {
		const result = [0];
		for (let index = 1; index < points.length; index += 1) {
			const [lat1, lng1] = points[index - 1];
			const [lat2, lng2] = points[index];
			const x = (lng2 - lng1) * Math.cos(((lat1 + lat2) * Math.PI) / 360);
			const y = lat2 - lat1;
			result.push(result[index - 1] + Math.sqrt(x * x + y * y));
		}
		return result;
	}

	const routeDistances = distances(routeCoordinates);
	const totalDistance = routeDistances.at(-1) ?? 1;

	function positionAlongRoute(progress: number, reverse = false): [number, number] {
		const target = (reverse ? 1 - progress : progress) * totalDistance;
		let index = 1;
		while (index < routeDistances.length && routeDistances[index] < target) index += 1;
		index = Math.min(index, routeCoordinates.length - 1);
		const startDistance = routeDistances[index - 1];
		const span = Math.max(0.000001, routeDistances[index] - startDistance);
		const local = (target - startDistance) / span;
		const from = routeCoordinates[index - 1];
		const to = routeCoordinates[index];
		return [from[0] + (to[0] - from[0]) * local, from[1] + (to[1] - from[1]) * local];
	}

	function serviceProgress(service: TrainService, now = new Date()) {
		const minute = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
		const cycle = 60;
		const elapsed = ((minute - service.startMinutes - service.delayMinutes) % cycle + cycle) % cycle;
		return Math.min(1, elapsed / Math.min(service.durationMinutes, cycle));
	}

	onMount(() => {
		if (!browser) return;
		let disposed = false;
		void import('leaflet').then((leaflet) => {
			if (disposed) return;
			const L = leaflet.default;
			void import('leaflet/dist/leaflet.css');

			map = L.map(mapElement, { zoomControl: false, scrollWheelZoom: true, minZoom: 7, maxZoom: 16 });
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			map.fitBounds(L.latLngBounds(routeCoordinates), { padding: [32, 32] });

			historicalLayer = L.tileLayer('https://geo.nls.uk/mapdata3/india-combined/{z}/{x}/{y}.png', {
				maxZoom: 16,
				opacity: historicalOpacity,
				attribution: 'Historical map tiles © National Library of Scotland'
			}).addTo(map);

			modernLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				opacity: 0.82,
				attribution: '© OpenStreetMap contributors'
			});

			L.polyline(routeCoordinates, { color: '#f8f2df', weight: 5, opacity: 0.72 }).addTo(map);
			L.polyline(routeCoordinates, { color: '#c94b3a', weight: 2.5, opacity: 0.96 }).addTo(map);

			stations.forEach((station) => {
				const icon = L.divIcon({
					className: 'station-icon-shell',
					html: `<span class="station-icon station-icon--${station.shape}" aria-hidden="true"></span>`,
					iconSize: [12, 12],
					iconAnchor: [6, 6]
				});
				L.marker([station.lat, station.lng], { icon, keyboard: true, title: station.name })
					.bindTooltip(`<strong>${station.name}</strong><br><span>${station.code}</span>`, { direction: 'top', offset: [0, -8] })
					.addTo(map!);
			});

			services.forEach((service) => {
				const icon = L.divIcon({
					className: 'train-icon-shell',
					html: `<button class="train-token train-token--${service.direction}${service.id === selectedId ? ' is-selected' : ''}" aria-label="${service.label}"><span></span></button>`,
					iconSize: [19, 10],
					iconAnchor: [10, 5]
				});
				const marker = L.marker(positionAlongRoute(service.id === selectedId && liveProgress !== null ? liveProgress : serviceProgress(service), service.direction === 'southbound'), {
					icon,
					zIndexOffset: 500,
					title: service.label
				}).addTo(map!);
				marker.on('click', () => onselect(service.id));
				trainMarkers.set(service.id, marker);
			});

			const animate = () => {
				services.forEach((service) => {
					const progress = service.id === selectedId && liveProgress !== null ? liveProgress : serviceProgress(service);
					trainMarkers.get(service.id)?.setLatLng(
						positionAlongRoute(progress, service.direction === 'southbound')
					);
				});
				animationFrame = requestAnimationFrame(animate);
			};
			animate();
		});

		return () => {
			disposed = true;
			cancelAnimationFrame(animationFrame);
			map?.remove();
			map = null;
		};
	});

	$effect(() => {
		if (!map || !historicalLayer || !modernLayer) return;
		historicalLayer.setOpacity(historicalOpacity);
		if (showModern && !map.hasLayer(modernLayer)) modernLayer.addTo(map);
		if (!showModern && map.hasLayer(modernLayer)) map.removeLayer(modernLayer);
	});

	$effect(() => {
		trainMarkers.forEach((marker, id) => {
			const element = marker.getElement()?.querySelector('.train-token');
			element?.classList.toggle('is-selected', id === selectedId);
		});
	});
</script>

<div class="map-shell">
	<div class="map-controls" aria-label="Map display controls">
		<label><input type="checkbox" bind:checked={showModern} /> Modern map</label>
		<label class="opacity-control">
			<span>Historical layer</span>
			<input type="range" min="0.25" max="1" step="0.05" bind:value={historicalOpacity} />
		</label>
	</div>
	<div class="train-map" bind:this={mapElement} aria-label="Animated Sealdah to Ranaghat local train map"></div>
</div>

<style>
	.map-shell { position: relative; min-width: 0; height: clamp(34rem, 72vh, 52rem); overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius); background: #d7cfb6; }
	.train-map { width: 100%; height: 100%; }
	.map-controls { position: absolute; z-index: 700; top: var(--space-s); right: var(--space-s); display: grid; gap: .55rem; width: min(14rem, calc(100% - 2rem)); padding: .7rem .8rem; font: 500 var(--step--1)/1.2 var(--font-sans); color: #28251e; background: rgba(250, 246, 233, .9); border: 1px solid rgba(49, 44, 34, .2); border-radius: var(--radius); backdrop-filter: blur(8px); }
	.map-controls label { display: flex; align-items: center; gap: .5rem; }
	.opacity-control { display: grid !important; }
	.opacity-control input { width: 100%; accent-color: #d84b35; }
	:global(.station-icon-shell), :global(.train-icon-shell) { background: transparent !important; border: 0 !important; }
	:global(.station-icon) { display: block; width: 9px; height: 9px; box-sizing: border-box; background: #faf6e9; border: 2px solid #292722; }
	:global(.station-icon--circle) { border-radius: 50%; }
	:global(.station-icon--square) { border-radius: 2px; }
	:global(.station-icon--diamond) { transform: rotate(45deg); border-radius: 2px; }
	:global(.station-icon--triangle) { width: 0; height: 0; background: transparent; border: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 11px solid #292722; position: relative; left: -1px; top: -1px; }
	:global(.train-token) { width: 19px; height: 9px; padding: 0; position: relative; border: 1.5px solid #292722; border-radius: 5px; background: #f2c84b; box-shadow: 0 1px 2px rgba(0,0,0,.24); cursor: pointer; transition: transform .15s ease, filter .15s ease; }
	:global(.train-token span) { position: absolute; inset: 2px 4px; border-radius: 2px; background: rgba(41,39,34,.72); }
	:global(.train-token::before) { content: none; }
	:global(.train-token--southbound) { background: #66c7c1; }
	:global(.train-token.is-selected) { transform: scale(1.22); filter: drop-shadow(0 0 2px rgba(255,255,255,.9)); }
	:global(.leaflet-tooltip) { font-family: var(--font-sans); border: 1px solid rgba(40,37,30,.2); background: #faf6e9; color: #28251e; box-shadow: 0 3px 12px rgba(0,0,0,.13); }
	:global(.leaflet-control-attribution) { font-size: 9px; }
	@media (max-width: 700px) { .map-shell { height: 68vh; min-height: 30rem; } }
</style>
