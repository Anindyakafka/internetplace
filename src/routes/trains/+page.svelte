<script lang="ts">
	import { onMount } from 'svelte';
	import TrainNetworkMap from '$lib/components/TrainNetworkMap.svelte';
	import type { SealdahDirection, SealdahNetwork } from '$lib/trains/sealdah-network';

	type HubCode = 'SDAH' | 'HWH' | 'MJT' | 'KOAA' | 'SHM';
	const hubNames: Record<HubCode, string> = {
		SDAH: 'Sealdah',
		HWH: 'Howrah',
		MJT: 'Majerhat',
		KOAA: 'Kolkata',
		SHM: 'Shalimar'
	};
	const hubCodes = Object.keys(hubNames) as HubCode[];

	let network = $state<SealdahNetwork | null>(null);
	let networks = $state<Record<string, SealdahNetwork>>({});
	let activeHub = $state<HubCode>('SDAH');
	let loadError = $state(false);
	let query = $state('');
	let direction = $state<'all' | SealdahDirection>('all');
	let terminal = $state('all');
	let selectedId = $state<string | null>(null);
	let liveState = $state<'idle' | 'loading' | 'live' | 'fallback' | 'error'>('idle');
	let liveDelay = $state<number | null>(null);
	let liveSource = $state<string | null>(null);

	let terminals = $derived(network ? [...network.corridors].sort((a, b) => a.name.localeCompare(b.name)) : []);
	let filteredServices = $derived((network?.services ?? []).filter((service) => {
		const needle = query.trim().toLowerCase();
		return (direction === 'all' || service.direction === direction)
			&& (terminal === 'all' || service.terminal.code === terminal)
			&& (!needle || `${service.id} ${service.name} ${service.terminal.name} ${service.terminal.code}`.toLowerCase().includes(needle));
	}));
	let selected = $derived(network?.services.find((service) => service.id === selectedId) ?? null);
	let hubName = $derived(network?.station.name ?? 'Sealdah');

	function distanceKm(coordinates: [number, number][]) {
		let total = 0;
		for (let index = 1; index < coordinates.length; index += 1) {
			const [lng1, lat1] = coordinates[index - 1]; const [lng2, lat2] = coordinates[index];
			const latRadians = ((lat1 + lat2) / 2) * Math.PI / 180;
			const x = (lng2 - lng1) * Math.cos(latRadians); const y = lat2 - lat1;
			total += Math.sqrt(x * x + y * y) * 111.32;
		}
		return Math.round(total * 10) / 10;
	}

	function networkForHub(data: any, code: HubCode, name: string): SealdahNetwork {
		const routes = (data.routes ?? []).filter((route: any) => route.source?.code === code || route.destination?.code === code);
		const corridorMap = new Map<string, any>();
		for (const route of routes) {
			const outbound = route.source.code === code;
			const terminal = outbound ? route.destination : route.source;
			const coordinates = outbound ? route.coordinates : route.coordinates.toReversed();
			if (!corridorMap.has(terminal.code)) corridorMap.set(terminal.code, { code: terminal.code, name: terminal.name, representativeTrain: route.representativeTrain, serviceCount: 0, coordinates });
		}
		const corridors = [...corridorMap.values()];
		const corridorByCode = new Map(corridors.map((corridor: any) => [corridor.code, corridor]));
		const services = (data.services ?? []).filter((service: any) => service.anchor === code).flatMap((service: any) => {
			const outbound = service.source.code === code;
			const terminal = outbound ? service.destination : service.source;
			const corridor: any = corridorByCode.get(terminal.code);
			if (!corridor) return [];
			corridor.serviceCount += 1;
			return [{ id: service.id, name: service.name, direction: outbound ? 'from-sealdah' : 'to-sealdah', terminal, sealdahTime: service.anchorTime, dayOffset: 1, distanceKm: distanceKm(corridor.coordinates), runDays: service.runDays ?? [] }];
		});
		return { generatedAt: data.generatedAt, station: { code, name }, counts: { services: services.length, fromSealdah: services.filter((service: any) => service.direction === 'from-sealdah').length, toSealdah: services.filter((service: any) => service.direction === 'to-sealdah').length, corridors: corridors.length }, services, corridors } as SealdahNetwork;
	}

	function selectHub(code: HubCode) {
		activeHub = code; network = networks[code]; selectedId = network?.services[0]?.id ?? null; terminal = 'all'; direction = 'all'; query = '';
	}

	onMount(async () => {
		try {
			const response = await fetch('/data/west-bengal-trains.json');
			if (!response.ok) throw new Error();
			const data = await response.json();
			networks = Object.fromEntries(hubCodes.map((code) => [code, networkForHub(data, code, hubNames[code])]));
			network = networks.SDAH;
			selectedId = network?.services[0]?.id ?? null;
		} catch { loadError = true; }
	});

	$effect(() => {
		if (!selectedId) return;
		const controller = new AbortController();
		liveState = 'loading'; liveDelay = null; liveSource = null;
		fetch(`/.netlify/functions/train-status?number=${encodeURIComponent(selectedId)}`, { signal: controller.signal })
			.then(async (response) => { if (!response.ok) throw new Error(); return response.json(); })
			.then((payload) => {
				liveDelay = Number.isFinite(Number(payload?.data?.delayMinutes)) ? Number(payload.data.delayMinutes) : null;
				liveSource = payload?.meta?.source ?? null;
				liveState = payload?.data?.isLive ? 'live' : 'fallback';
			})
			.catch((error) => { if (error?.name !== 'AbortError') liveState = 'error'; });
		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>Kolkata Local Lines — Anindya Singh</title>
	<meta name="description" content="Suburban train services from Sealdah and Howrah, mapped over a historical map of Bengal." />
</svelte:head>

<main class="train-page">
	<header class="page-intro">
		<p class="eyebrow">Local lines · Kolkata suburban network</p>
		<h1>{hubName}, in motion.</h1>
		<p class="lede">Suburban services beginning or ending at {hubName}, traced across the currently verified terminal corridors on a historical map. Positions are calculated from timetable times and route distance, with reported data checked for the selected train.</p>
		<div class="hub-switch" aria-label="Railway hub">
			{#each hubCodes as code}
				<button class:active={activeHub === code} onclick={() => selectHub(code)}>
					{hubNames[code]} <small>{networks[code]?.counts.services ?? 0}</small>
				</button>
			{/each}
		</div>
		{#if network}<div class="totals"><span><strong>{network.counts.services}</strong> services</span><span><strong>{network.counts.corridors}</strong> corridors</span><span><strong>{network.counts.fromSealdah}</strong> departing</span><span><strong>{network.counts.toSealdah}</strong> arriving</span></div>{/if}
	</header>

	{#if loadError}
		<p class="load-error">The cached Sealdah network could not be loaded.</p>
	{:else if !network}
		<p class="loading">Drawing the Sealdah network…</p>
	{:else}
		<section class="network-layout" aria-label="Sealdah train explorer">
			<aside class="train-sidebar">
				<div class="search-block"><label for="train-search">Find a train or destination</label><input id="train-search" type="search" bind:value={query} placeholder="Train number, station, code…" /></div>
				<div class="filters">
					<div class="direction-filter" aria-label="Direction filter">
						<button class:active={direction === 'all'} onclick={() => direction = 'all'}>All</button>
						<button class:active={direction === 'from-sealdah'} onclick={() => direction = 'from-sealdah'}>From {hubName}</button>
						<button class:active={direction === 'to-sealdah'} onclick={() => direction = 'to-sealdah'}>To {hubName}</button>
					</div>
					<select bind:value={terminal} aria-label="Terminal corridor"><option value="all">All {network.counts.corridors} corridors</option>{#each terminals as item}<option value={item.code}>{item.name} ({item.serviceCount})</option>{/each}</select>
				</div>
				<p class="result-count">{filteredServices.length} services</p>
				<div class="service-list">
					{#each filteredServices.slice(0, 150) as service}
						<button class="service-card" class:selected={selectedId === service.id} onclick={() => selectedId = service.id}>
							<span class="service-dot service-dot--{service.direction}"></span><span><strong>{service.id} · {service.terminal.name}</strong><small>{service.direction === 'from-sealdah' ? 'Departs' : 'Arrives'} {service.sealdahTime} · {service.distanceKm} km</small></span>
						</button>
					{:else}<p class="empty">No services match these filters.</p>{/each}
					{#if filteredServices.length > 150}<p class="list-note">Showing the first 150 results. Refine the search to find a specific train.</p>{/if}
				</div>
				{#if selected}<div class="selected-panel"><p class="panel-label">{liveState === 'loading' ? 'Checking running data…' : liveState === 'live' ? 'Live correction available' : 'Calculated position'}</p><h2>{selected.id}</h2><p class="train-name">{selected.name}</p><dl><div><dt>Journey</dt><dd>{selected.direction === 'from-sealdah' ? `${hubName} → ${selected.terminal.name}` : `${selected.terminal.name} → ${hubName}`}</dd></div><div><dt>At {hubName}</dt><dd>{selected.sealdahTime}</dd></div><div><dt>Distance</dt><dd>{selected.distanceKm} km</dd></div><div><dt>Delay</dt><dd>{liveDelay === null ? 'Not reported' : `${liveDelay} min`}</dd></div>{#if liveSource}<div><dt>Source</dt><dd>{liveSource}</dd></div>{/if}</dl></div>{/if}
			</aside>
			{#key activeHub}<TrainNetworkMap {network} {selectedId} onselect={(id) => selectedId = id} />{/key}
		</section>
	{/if}

	<section class="map-notes"><div class="direction-legend"><p><strong>Direction</strong><span><i class="legend-token legend-token--away"></i>Away from {hubName}</span><span><i class="legend-token legend-token--toward"></i>Towards {hubName}</span></p></div><div><span class="legend-line"></span><p><strong>{network?.counts.corridors ?? 0} corridors</strong>Each line uses verified route geometry from a representative service.</p></div><div><span class="legend-station"></span><p><strong>Terminals</strong>Select a corridor or search {network?.counts.services ?? 0} services.</p></div><p class="disclaimer">Calculated positions are approximate and not suitable for boarding decisions. Historical tiles are provided by the National Library of Scotland. Service and route data were refreshed from RailRadar on {network ? new Date(network.generatedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'the latest data refresh'}.</p></section>
</main>

<style>
	.hub-switch{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:var(--space-l)}.hub-switch button{padding:.55rem .8rem;border:1px solid var(--color-border);border-radius:999px;background:transparent;color:var(--color-text-muted);font:600 var(--step--1)/1 var(--font-sans);cursor:pointer}.hub-switch button.active{border-color:var(--color-accent);background:var(--color-accent);color:#fff}.hub-switch small{margin-left:.35rem;opacity:.72}
	.train-page{width:min(100%,94rem);margin-inline:auto;padding:var(--space-3xl) clamp(var(--space-m),3vw,var(--space-2xl)) var(--space-4xl);box-sizing:border-box}.page-intro{max-width:62rem;margin-bottom:var(--space-2xl)}.eyebrow,.panel-label{margin:0 0 var(--space-s);font:600 var(--step--1)/1.2 var(--font-mono);text-transform:uppercase;letter-spacing:.1em;color:var(--color-accent)}h1{margin:0;font:500 clamp(3rem,7vw,6.5rem)/.92 var(--font-serif);letter-spacing:-.045em}.lede{max-width:70ch;margin:var(--space-l) 0 0;color:var(--color-text-muted);font-size:var(--step-1);line-height:1.6}.totals{display:flex;flex-wrap:wrap;gap:.6rem 1.5rem;margin-top:var(--space-l);color:var(--color-text-muted);font-size:var(--step--1)}.totals strong{color:var(--color-text);font-size:var(--step-1)}.network-layout{display:grid;grid-template-columns:minmax(18rem,23rem) minmax(0,1fr);gap:var(--space-l)}.train-sidebar{min-width:0;display:flex;flex-direction:column;padding:var(--space-l);border:1px solid var(--color-border);border-radius:var(--radius);background:var(--color-surface)}.search-block{display:grid;gap:var(--space-2xs)}.search-block label{font:600 var(--step--1)/1.2 var(--font-sans)}input,select{width:100%;box-sizing:border-box;padding:.72rem;color:var(--color-text);background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius);font:inherit}.filters{margin:var(--space-m) 0 var(--space-s)}.direction-filter{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.55rem}.direction-filter button{padding:.42rem .62rem;border:1px solid var(--color-border);border-radius:999px;color:var(--color-text-muted);background:transparent;font:500 .72rem/1 var(--font-sans);cursor:pointer}.direction-filter button.active{color:#fff;border-color:var(--color-accent);background:var(--color-accent)}.result-count{margin:.3rem 0;color:var(--color-text-muted);font-size:.72rem}.service-list{display:grid;gap:.25rem;max-height:22rem;overflow:auto}.service-card{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr);gap:.6rem;align-items:center;padding:.6rem;text-align:left;color:var(--color-text);background:transparent;border:1px solid transparent;border-radius:var(--radius);cursor:pointer}.service-card:hover,.service-card.selected{background:var(--color-bg);border-color:var(--color-border)}.service-card strong,.service-card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.service-card strong{font-size:var(--step--1)}.service-card small{margin-top:.18rem;color:var(--color-text-muted);font-size:.68rem}.service-dot,.legend-token{width:.65rem;height:.65rem;border:1.5px solid #292722;border-radius:4px;background:#f2c84b}.service-dot--to-sealdah,.legend-token--toward{background:#66c7c1}.selected-panel{margin-top:var(--space-l);padding-top:var(--space-l);border-top:1px solid var(--color-border)}.selected-panel h2{margin:0;font:500 var(--step-2)/1 var(--font-serif)}.train-name{margin:.35rem 0 var(--space-m);color:var(--color-text-muted);font-size:.75rem}.selected-panel dl{margin:0;display:grid;gap:.45rem}.selected-panel dl div{display:flex;justify-content:space-between;gap:1rem;font-size:.75rem}.selected-panel dt{color:var(--color-text-muted)}.selected-panel dd{margin:0;text-align:right}.map-notes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-l);margin-top:var(--space-l)}.map-notes>div{display:flex;gap:.7rem}.map-notes p{margin:0;color:var(--color-text-muted);font-size:var(--step--1);line-height:1.45}.map-notes strong{display:block;color:var(--color-text)}.direction-legend p span{display:flex;align-items:center;gap:.45rem;margin-top:.3rem}.direction-legend i{display:inline-block}.legend-token,.legend-line,.legend-station{flex:0 0 auto;margin-top:.2rem}.legend-line{width:1.3rem;height:3px;margin-top:.5rem;background:#c94b3a}.legend-station{width:.7rem;height:.7rem;border:2px solid var(--color-text);border-radius:50%;background:var(--color-bg)}.disclaimer{grid-column:1/-1;max-width:95ch;padding-top:var(--space-m);border-top:1px solid var(--color-border)}.list-note,.empty,.loading,.load-error{color:var(--color-text-muted);font-size:var(--step--1)}@media(max-width:900px){.network-layout{grid-template-columns:1fr}.train-sidebar{order:2}}@media(max-width:640px){.train-page{padding-inline:var(--space-m)}.map-notes{grid-template-columns:1fr}}
</style>
