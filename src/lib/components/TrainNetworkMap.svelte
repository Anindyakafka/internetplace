<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { SealdahNetwork, SealdahService } from '$lib/trains/sealdah-network';

	let { network, selectedId = null, onselect = (_id: string) => {} }: { network: SealdahNetwork; selectedId?: string | null; onselect?: (id: string) => void } = $props();
	let mapElement: HTMLDivElement;
	let showModern = $state(false);
	let historicalOpacity = $state(0.88);
	let map: import('leaflet').Map | null = null;
	let historicalLayer: import('leaflet').TileLayer | null = null;
	let modernLayer: import('leaflet').TileLayer | null = null;
	let trainMarkers = new Map<string, import('leaflet').Marker>();
	let animationFrame = 0;

	const palette = ['#c94b3a','#247ba0','#3f826d','#8a5a9b','#d18b2c','#4c6b4f','#a84965'];
	let validCorridors = $derived(network.corridors.filter((corridor) => corridor.coordinates.length > 1));
	let corridorByCode = $derived(new Map(validCorridors.map((corridor) => [corridor.code, corridor])));

	function pathData(points: [number, number][]) {
		const latLng = points.map(([lng, lat]) => [lat, lng] as [number, number]);
		const distances = [0];
		for (let i = 1; i < latLng.length; i += 1) {
			const [lat1,lng1] = latLng[i-1], [lat2,lng2] = latLng[i];
			const x=(lng2-lng1)*Math.cos(((lat1+lat2)*Math.PI)/360), y=lat2-lat1;
			distances.push(distances[i-1]+Math.sqrt(x*x+y*y));
		}
		return { latLng, distances, total: distances.at(-1) ?? 1 };
	}
	let paths = $derived(new Map(validCorridors.map((corridor) => [corridor.code, pathData(corridor.coordinates)])));

	function position(service: SealdahService, progress: number) {
		const path = paths.get(service.terminal.code); if (!path) return null;
		const directional = service.direction === 'to-sealdah' ? 1-progress : progress;
		const target = directional * path.total;
		let index=1; while(index<path.distances.length && path.distances[index]<target) index+=1;
		index=Math.min(index,path.latLng.length-1);
		const start=path.distances[index-1], span=Math.max(.000001,path.distances[index]-start), local=(target-start)/span;
		const from=path.latLng[index-1], to=path.latLng[index];
		return [from[0]+(to[0]-from[0])*local,from[1]+(to[1]-from[1])*local] as [number,number];
	}

	function activeProgress(service: SealdahService, now = new Date()) {
		const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);
		const value=(type:string)=>Number(parts.find((part)=>part.type===type)?.value ?? 0);
		const current=value('hour')*60+value('minute')+value('second')/60;
		const [hour,minute]=service.sealdahTime.split(':').map(Number);
		const atSealdah=hour*60+minute;
		const duration=Math.max(18,service.distanceKm/34*60);
		const start=service.direction==='from-sealdah'?atSealdah:atSealdah-duration;
		let elapsed=current-start; if(elapsed < -720) elapsed+=1440; if(elapsed>720) elapsed-=1440;
		return elapsed>=0 && elapsed<=duration ? elapsed/duration : null;
	}

	onMount(() => {
		if(!browser)return; let disposed=false;
		void import('leaflet').then((leaflet)=>{
			if(disposed)return; const L=leaflet.default; void import('leaflet/dist/leaflet.css');
			map=L.map(mapElement,{zoomControl:false,scrollWheelZoom:true,minZoom:6,maxZoom:16,preferCanvas:true}); L.control.zoom({position:'bottomright'}).addTo(map);
			const allPoints=validCorridors.flatMap((corridor)=>corridor.coordinates.map(([lng,lat])=>[lat,lng] as [number,number]));
			map.fitBounds(L.latLngBounds(allPoints),{padding:[24,24]});
			historicalLayer=L.tileLayer('https://geo.nls.uk/mapdata3/india-combined/{z}/{x}/{y}.png',{maxZoom:16,opacity:historicalOpacity,attribution:'Historical map tiles © National Library of Scotland'}).addTo(map);
			modernLayer=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:.82,attribution:'© OpenStreetMap contributors'});
			validCorridors.forEach((corridor,index)=>{const points=paths.get(corridor.code)!.latLng; L.polyline(points,{color:'#f8f2df',weight:4,opacity:.55}).addTo(map!); L.polyline(points,{color:palette[index%palette.length],weight:2,opacity:.82}).bindTooltip(`${corridor.name} · ${corridor.serviceCount} services`).addTo(map!); const end=points.at(-1)!; const icon=L.divIcon({className:'station-icon-shell',html:'<span class="station-icon"></span>',iconSize:[10,10],iconAnchor:[5,5]}); L.marker(end,{icon,title:corridor.name}).bindTooltip(`<strong>${corridor.name}</strong><br>${corridor.code}`).addTo(map!);});
			const sealdah=paths.values().next().value?.latLng[0]; if(sealdah){const icon=L.divIcon({className:'station-icon-shell',html:'<span class="station-icon station-icon--hub"></span>',iconSize:[14,14],iconAnchor:[7,7]});L.marker(sealdah,{icon,title:'Sealdah'}).bindTooltip('<strong>Sealdah</strong><br>SDAH').addTo(map);}
			const update=()=>{
				const active=new Set<string>();
				network.services.forEach((service)=>{const progress=activeProgress(service); if(progress===null||!corridorByCode.has(service.terminal.code))return; active.add(service.id); const point=position(service,progress); if(!point)return; let marker=trainMarkers.get(service.id); if(!marker){const icon=L.divIcon({className:'train-icon-shell',html:`<button class="train-token train-token--${service.direction}" aria-label="${service.id}"><span></span></button>`,iconSize:[16,8],iconAnchor:[8,4]});marker=L.marker(point,{icon,zIndexOffset:500,title:`${service.id} · ${service.name}`}).addTo(map!);marker.on('click',()=>onselect(service.id));trainMarkers.set(service.id,marker);}else marker.setLatLng(point); marker.getElement()?.querySelector('.train-token')?.classList.toggle('is-selected',service.id===selectedId);});
				trainMarkers.forEach((marker,id)=>{if(!active.has(id)){marker.remove();trainMarkers.delete(id);}}); animationFrame=requestAnimationFrame(update);
			}; update();
		});
		return()=>{disposed=true;cancelAnimationFrame(animationFrame);map?.remove();map=null;};
	});

	$effect(()=>{if(!map||!historicalLayer||!modernLayer)return;historicalLayer.setOpacity(historicalOpacity);if(showModern&&!map.hasLayer(modernLayer))modernLayer.addTo(map);if(!showModern&&map.hasLayer(modernLayer))map.removeLayer(modernLayer);});
</script>

<div class="map-shell"><div class="map-controls" aria-label="Map display controls"><label><input type="checkbox" bind:checked={showModern}/> Modern map</label><label class="opacity-control"><span>Historical layer</span><input type="range" min="0.25" max="1" step="0.05" bind:value={historicalOpacity}/></label></div><div class="train-map" bind:this={mapElement} aria-label="Animated map of suburban trains to and from Sealdah"></div></div>

<style>
	.map-shell{position:relative;min-width:0;height:clamp(36rem,75vh,54rem);overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius);background:#d7cfb6}.train-map{width:100%;height:100%}.map-controls{position:absolute;z-index:700;top:var(--space-s);right:var(--space-s);display:grid;gap:.55rem;width:min(14rem,calc(100% - 2rem));padding:.7rem .8rem;font:500 var(--step--1)/1.2 var(--font-sans);color:#28251e;background:rgba(250,246,233,.9);border:1px solid rgba(49,44,34,.2);border-radius:var(--radius);backdrop-filter:blur(8px)}.map-controls label{display:flex;align-items:center;gap:.5rem}.opacity-control{display:grid!important}.opacity-control input{width:100%;accent-color:#d84b35}:global(.station-icon-shell),:global(.train-icon-shell){background:transparent!important;border:0!important}:global(.station-icon){display:block;width:8px;height:8px;box-sizing:border-box;background:#faf6e9;border:2px solid #292722;border-radius:50%}:global(.station-icon--hub){width:13px;height:13px;border-radius:3px;border-width:3px}:global(.train-token){width:16px;height:7px;padding:0;position:relative;border:1px solid #292722;border-radius:4px;background:#f2c84b;box-shadow:0 1px 2px rgba(0,0,0,.22);cursor:pointer}:global(.train-token span){position:absolute;inset:1.5px 4px;border-radius:2px;background:rgba(41,39,34,.7)}:global(.train-token--to-sealdah){background:#66c7c1}:global(.train-token.is-selected){transform:scale(1.35);filter:drop-shadow(0 0 2px white)}:global(.leaflet-tooltip){font-family:var(--font-sans);border:1px solid rgba(40,37,30,.2);background:#faf6e9;color:#28251e;box-shadow:0 3px 12px rgba(0,0,0,.13)}:global(.leaflet-control-attribution){font-size:9px}@media(max-width:700px){.map-shell{height:68vh;min-height:30rem}}
</style>
