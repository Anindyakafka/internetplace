<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	type Vehicle = { id: string | null; label: string | null; routeId: string | null; latitude: number; longitude: number; bearing: number | null; timestamp: number | null };
	let mapElement: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let markers = new Map<string, import('leaflet').Marker>();
	let vehicleCount = $state(0);
	let fetchedAt = $state<string | null>(null);
	let feedState = $state<'loading' | 'live' | 'error'>('loading');
	let error = $state('');

	onMount(() => {
		let disposed = false;
		let timer: ReturnType<typeof setInterval>;
		void import('leaflet').then((leaflet) => {
			if (disposed) return;
			const L = leaflet.default;
			map = L.map(mapElement, { zoomControl: false, preferCanvas: true }).setView([28.6139, 77.209], 11);
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);

			const refresh = async () => {
				try {
					const response = await fetch('/.netlify/functions/dmrc-vehicles');
					if (!response.ok) throw new Error(`DMRC feed returned ${response.status}`);
					const payload = await response.json();
					const live = (payload.vehicles ?? []) as Vehicle[];
					vehicleCount = live.length; fetchedAt = payload.fetchedAt ?? null; feedState = 'live'; error = '';
					const active = new Set<string>();
					live.forEach((vehicle, index) => {
						if (!Number.isFinite(vehicle.latitude) || !Number.isFinite(vehicle.longitude)) return;
						const id = vehicle.id ?? `${vehicle.latitude}-${vehicle.longitude}-${index}`; active.add(id);
						const point: [number, number] = [vehicle.latitude, vehicle.longitude];
						let marker = markers.get(id);
						if (!marker) {
							const icon = L.divIcon({ className: 'metro-vehicle-shell', html: '<span class="metro-vehicle"></span>', iconSize: [12, 12], iconAnchor: [6, 6] });
							marker = L.marker(point, { icon, title: vehicle.label ?? vehicle.routeId ?? 'DMRC vehicle' }).addTo(map!);
							marker.bindTooltip(`${vehicle.label ?? 'Metro vehicle'}${vehicle.routeId ? `<br>Route ${vehicle.routeId}` : ''}`, { direction: 'top', offset: [0, -6] });
							markers.set(id, marker);
						} else marker.setLatLng(point);
					});
					markers.forEach((marker, id) => { if (!active.has(id)) { marker.remove(); markers.delete(id); } });
				} catch (cause) { feedState = 'error'; error = cause instanceof Error ? cause.message : 'Live DMRC data is unavailable.'; }
			};
			void refresh(); timer = setInterval(refresh, 20_000);
		});
		return () => { disposed = true; clearInterval(timer); map?.remove(); map = null; };
	});
</script>

<svelte:head><title>Delhi Metro — Anindya Singh</title><meta name="description" content="A live map of Delhi Metro vehicle positions from Delhi Open Transit Data." /></svelte:head>

<main class="metro-page">
	<header class="metro-header"><p class="eyebrow">Delhi Metro · live feed</p><h1>Delhi, in motion.</h1><p class="lede">Vehicle positions from Delhi Open Transit Data, refreshed every 20 seconds. Station names and official line geometry will be layered in from the DMRC static GTFS package.</p><div class="status"><span class:online={feedState === 'live'} class="status-dot"></span>{#if feedState === 'loading'}Connecting…{:else if feedState === 'live'}{vehicleCount.toLocaleString('en-IN')} vehicles live{:else}{error}{/if}{#if fetchedAt}<small>Updated {new Date(fetchedAt).toLocaleTimeString('en-IN')}</small>{/if}</div></header>
	<section class="metro-map" aria-label="Live Delhi Metro vehicle map"><div bind:this={mapElement}></div></section>
	<p class="note">Live positions are supplied by Delhi Open Transit Data and may be incomplete or delayed. This map is not suitable for travel decisions.</p>
</main>

<style>
	.metro-page{width:min(100%,94rem);margin-inline:auto;padding:var(--space-3xl) clamp(var(--space-m),3vw,var(--space-2xl)) var(--space-4xl);box-sizing:border-box}.metro-header{max-width:62rem;margin-bottom:var(--space-l)}.eyebrow{margin:0 0 var(--space-s);font:600 var(--step--1)/1.2 var(--font-mono);text-transform:uppercase;letter-spacing:.1em;color:var(--color-accent)}h1{margin:0;font:500 clamp(3rem,7vw,6.5rem)/.92 var(--font-serif);letter-spacing:-.045em}.lede{max-width:68ch;margin:var(--space-l) 0 0;color:var(--color-text-muted);font-size:var(--step-1);line-height:1.6}.status{display:flex;align-items:center;gap:.5rem;margin-top:var(--space-l);font:600 var(--step--1)/1.2 var(--font-mono);color:var(--color-text-muted)}.status small{font-weight:400}.status-dot{width:.55rem;height:.55rem;border-radius:50%;background:#a37b3b}.status-dot.online{background:#3f826d;box-shadow:0 0 0 4px color-mix(in srgb,#3f826d 18%,transparent)}.metro-map{height:clamp(34rem,72vh,54rem);overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius);background:#d9d0bb}.metro-map>div{width:100%;height:100%}.note{max-width:80ch;margin:var(--space-m) 0 0;color:var(--color-text-muted);font-size:var(--step--1);line-height:1.5}:global(.metro-vehicle-shell){background:transparent!important;border:0!important}:global(.metro-vehicle){display:block;width:10px;height:10px;border:2px solid #292722;border-radius:50%;background:#c94b3a;box-shadow:0 1px 4px rgba(0,0,0,.3)}:global(.leaflet-tooltip){font-family:var(--font-sans);background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border)}@media(max-width:640px){.metro-page{padding-inline:var(--space-m)}.metro-map{height:68vh;min-height:30rem}.status{align-items:flex-start;flex-direction:column;gap:.25rem}}
</style>
