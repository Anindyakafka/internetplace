<script lang="ts">
	import TrainNetworkMap from '$lib/components/TrainNetworkMap.svelte';
	import { services, stations } from '$lib/trains/demo-network';

	let query = $state('');
	let direction = $state<'all' | 'northbound' | 'southbound'>('all');
	let selectedId = $state<string | null>(services[0].id);
	let liveState = $state<'idle' | 'loading' | 'live' | 'fallback' | 'error'>('idle');
	let liveProgress = $state<number | null>(null);
	let liveDelay = $state<number | null>(null);
	let liveUpdatedAt = $state<string | null>(null);
	let liveSource = $state<string | null>(null);

	let filteredServices = $derived(
		services.filter((service) => {
			const needle = query.trim().toLowerCase();
			const matchesDirection = direction === 'all' || service.direction === direction;
			const matchesQuery = !needle || service.label.toLowerCase().includes(needle) || stations.some((station) => station.name.toLowerCase().includes(needle) || station.code.toLowerCase().includes(needle));
			return matchesDirection && matchesQuery;
		})
	);

	let selected = $derived(services.find((service) => service.id === selectedId) ?? null);

	$effect(() => {
		if (!selectedId) return;
		const controller = new AbortController();
		liveState = 'loading';
		liveProgress = null;

		fetch(`/.netlify/functions/train-status?number=${encodeURIComponent(selectedId)}`, { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) throw new Error('Live data unavailable');
				return response.json();
			})
			.then((payload) => {
				const data = payload?.data;
				const progress = Number(data?.currentLocation?.segmentProgress);
				liveProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : null;
				liveDelay = Number.isFinite(Number(data?.delayMinutes)) ? Number(data.delayMinutes) : null;
				liveUpdatedAt = data?.lastUpdatedAt ?? payload?.meta?.timestamp ?? null;
				liveSource = payload?.meta?.source ?? null;
				liveState = data?.isLive ? 'live' : 'fallback';
			})
			.catch((error) => {
				if (error?.name !== 'AbortError') liveState = 'error';
			});

		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>Local Lines — Anindya Singh</title>
	<meta name="description" content="A calculated live portrait of local trains moving through the Sealdah–Ranaghat corridor." />
</svelte:head>

<main class="train-page">
	<header class="page-intro">
		<p class="eyebrow">Local lines · Prototype 01</p>
		<h1>West Bengal, in motion.</h1>
		<p class="lede">A calculated live portrait of suburban trains, drawn over a historical map. Trains move from timetable progress for now; reported running data will correct their positions when the live feed is connected.</p>
	</header>

	<section class="network-layout" aria-label="Train explorer">
		<aside class="train-sidebar">
			<div class="search-block">
				<label for="train-search">Find a train or station</label>
				<input id="train-search" type="search" bind:value={query} placeholder="Sealdah, RHA, Ranaghat…" />
			</div>
			<div class="direction-filter" aria-label="Direction filter">
				<button class:active={direction === 'all'} onclick={() => direction = 'all'}>All</button>
				<button class:active={direction === 'northbound'} onclick={() => direction = 'northbound'}>Towards Ranaghat</button>
				<button class:active={direction === 'southbound'} onclick={() => direction = 'southbound'}>Towards Sealdah</button>
			</div>

			<div class="service-list">
				{#each filteredServices as service}
					<button class="service-card" class:selected={selectedId === service.id} onclick={() => selectedId = service.id}>
						<span class="service-dot service-dot--{service.direction}"></span>
						<span><strong>{service.label}</strong><small>{service.status} position{service.delayMinutes ? ` · ${service.delayMinutes} min delay` : ' · on time'}</small></span>
					</button>
				{:else}
					<p class="empty">No prototype services match that search.</p>
				{/each}
			</div>

			{#if selected}
				<div class="selected-panel">
					<p class="panel-label">
						{#if liveState === 'loading'}Checking live position…
						{:else if liveState === 'live'}Live correction available
						{:else}Calculated service{/if}
					</p>
					<h2>{selected.label}</h2>
					<dl>
						<div><dt>Position</dt><dd>{liveState === 'live' && liveProgress !== null ? 'Reported + calculated' : 'Scheduled'}</dd></div>
						<div><dt>Delay</dt><dd>{liveDelay !== null ? `${liveDelay} min` : 'Not reported'}</dd></div>
						<div><dt>Corridor</dt><dd>SDAH–RHA</dd></div>
						{#if liveSource}<div><dt>Source</dt><dd>{liveSource}</dd></div>{/if}
					</dl>
					{#if liveUpdatedAt}
						<p class="updated-time">Updated {new Date(liveUpdatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
					{:else if liveState === 'error'}
						<p class="updated-time">Live data is unavailable; the marker continues on its scheduled calculation.</p>
					{/if}
				</div>
			{/if}
		</aside>

		<TrainNetworkMap {selectedId} {liveProgress} onselect={(id) => selectedId = id} />
	</section>

	<section class="map-notes">
		<div><span class="legend-token legend-token--reported"></span><p><strong>Calculated</strong>Adjusted using the latest known delay.</p></div>
		<div><span class="legend-token legend-token--scheduled"></span><p><strong>Scheduled</strong>Moving according to timetable only.</p></div>
		<div><span class="legend-station"></span><p><strong>Custom stations</strong>Shapes mark terminals, junctions and key interchanges.</p></div>
		<p class="disclaimer">Prototype positions are illustrative and not suitable for boarding decisions. Historical map tiles are provided by the National Library of Scotland; modern railway placement is approximate pending verified route data.</p>
	</section>
</main>

<style>
	.train-page { width: min(100%, 94rem); margin-inline: auto; padding: var(--space-3xl) clamp(var(--space-m), 3vw, var(--space-2xl)) var(--space-4xl); box-sizing: border-box; }
	.page-intro { max-width: 54rem; margin-bottom: var(--space-2xl); }
	.eyebrow, .panel-label { margin: 0 0 var(--space-s); font: 600 var(--step--1)/1.2 var(--font-mono); text-transform: uppercase; letter-spacing: .1em; color: var(--color-accent); }
	h1 { margin: 0; font: 500 clamp(3rem, 7vw, 6.5rem)/.92 var(--font-serif); letter-spacing: -.045em; }
	.lede { max-width: 65ch; margin: var(--space-l) 0 0; color: var(--color-text-muted); font-size: var(--step-1); line-height: 1.6; }
	.network-layout { display: grid; grid-template-columns: minmax(17rem, 22rem) minmax(0, 1fr); gap: var(--space-l); align-items: stretch; }
	.train-sidebar { min-width: 0; display: flex; flex-direction: column; padding: var(--space-l); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); }
	.search-block { display: grid; gap: var(--space-2xs); }
	.search-block label { font: 600 var(--step--1)/1.2 var(--font-sans); }
	.search-block input { width: 100%; box-sizing: border-box; padding: .75rem; color: var(--color-text); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius); font: inherit; }
	.direction-filter { display: flex; flex-wrap: wrap; gap: .35rem; margin: var(--space-m) 0; }
	.direction-filter button { padding: .42rem .62rem; border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-text-muted); background: transparent; font: 500 .72rem/1 var(--font-sans); cursor: pointer; }
	.direction-filter button.active { color: #fff; border-color: var(--color-accent); background: var(--color-accent); }
	.service-list { display: grid; gap: .35rem; max-height: 19rem; overflow: auto; padding-right: .2rem; }
	.service-card { width: 100%; display: grid; grid-template-columns: auto minmax(0,1fr); gap: .65rem; align-items: center; padding: .7rem; text-align: left; color: var(--color-text); background: transparent; border: 1px solid transparent; border-radius: var(--radius); cursor: pointer; }
	.service-card:hover, .service-card.selected { background: var(--color-bg); border-color: var(--color-border); }
	.service-card strong, .service-card small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.service-card strong { font-size: var(--step--1); }
	.service-card small { margin-top: .2rem; color: var(--color-text-muted); font-size: .7rem; text-transform: capitalize; }
	.service-dot, .legend-token { width: .75rem; height: .75rem; border: 2px solid currentColor; border-radius: 3px; background: #ffd447; color: #25231f; }
	.service-dot--southbound { background: #66c7c1; }
	.selected-panel { margin-top: auto; padding-top: var(--space-l); border-top: 1px solid var(--color-border); }
	.selected-panel h2 { margin: 0 0 var(--space-m); font: 500 var(--step-2)/1.05 var(--font-serif); }
	.updated-time { margin: var(--space-m) 0 0; color: var(--color-text-muted); font-size: .72rem; line-height: 1.4; }
	dl { margin: 0; display: grid; gap: .45rem; }
	dl div { display: flex; justify-content: space-between; gap: 1rem; font-size: var(--step--1); }
	dt { color: var(--color-text-muted); } dd { margin: 0; text-transform: capitalize; }
	.map-notes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-l); margin-top: var(--space-l); }
	.map-notes > div { display: flex; align-items: flex-start; gap: .7rem; }
	.map-notes p { margin: 0; color: var(--color-text-muted); font-size: var(--step--1); line-height: 1.45; }
	.map-notes strong { display: block; color: var(--color-text); }
	.legend-token { flex: 0 0 auto; margin-top: .2rem; }
	.legend-token--scheduled { background: #66c7c1; }
	.legend-station { flex: 0 0 auto; width: .8rem; height: .8rem; margin-top: .2rem; border: 3px solid var(--color-text); border-radius: 50%; background: var(--color-bg); }
	.disclaimer { grid-column: 1 / -1; max-width: 90ch; padding-top: var(--space-m); border-top: 1px solid var(--color-border); }
	.empty { padding: var(--space-m); color: var(--color-text-muted); font-size: var(--step--1); }
	@media (max-width: 900px) { .network-layout { grid-template-columns: 1fr; } .train-sidebar { order: 2; } .selected-panel { margin-top: var(--space-l); } }
	@media (max-width: 640px) { .train-page { padding-inline: var(--space-m); } .map-notes { grid-template-columns: 1fr; } }
</style>
