<script lang="ts">
	import { onMount } from 'svelte';
	import TrackEntry from '$lib/components/TrackEntry.svelte';

	interface TrackManifestEntry {
		file: string;
		title: string;
		city: string;
		date: string;
		mode: string;
		description: string;
		privacy: string;
	}

	let entries = $state<TrackManifestEntry[]>([]);
	let loading = $state(true);
	let error = $state('');

	function parseCsv(text: string): TrackManifestEntry[] {
		const rows = text.trim().split(/\r?\n/);
		const headers = rows.shift()?.split(',').map((value) => value.trim()) ?? [];
		return rows
			.map((row) => {
				const values = row.split(',').map((value) => value.trim());
				return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])) as unknown as TrackManifestEntry;
			})
			.filter((entry) => entry.file);
	}

	onMount(async () => {
		try {
			const response = await fetch('/tracks/source/gpx_source.csv');
			if (!response.ok) throw new Error('The tracks manifest could not be loaded.');
			entries = parseCsv(await response.text());
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Unable to load tracks.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Tracks — Anindya Singh</title>
	<meta name="description" content="Walks, journeys, field observations, and GPS traces recorded by Anindya Singh." />
</svelte:head>

<main class="tracks-page">
	<header class="tracks-hero">
		<p class="eyebrow">Tracks · movements · observations</p>
		<h1>Routes through places I’m learning to notice.</h1>
		<p class="intro">
			A growing record of walks and journeys: the line taken, the things that interrupted it,
			and occasional photographs from along the way.
		</p>
	</header>

	<aside class="method-note">
		<p class="method-label">Method</p>
		<p>
			Tracks are recorded as GPX files with OSMTracker. Distance, duration, elevation, and
			waypoint observations are calculated directly from each recording; the full recorded
			route is shown without trimming.
		</p>
	</aside>

	<section class="tracks-feed" aria-label="Track archive">
		{#if loading}<p class="page-state">Opening the track archive…</p>{/if}
		{#if error}<p class="page-state error">{error}</p>{/if}
		{#each entries as entry (entry.file)}
			<TrackEntry {entry} />
		{/each}
	</section>
</main>

<style>
	.tracks-page { max-width: 88rem; margin-inline: auto; padding: var(--space-3xl) var(--space-l); }
	.tracks-hero { max-width: 56rem; padding: var(--space-xl) 0 var(--space-2xl); }
	.eyebrow, .method-label { margin: 0 0 var(--space-s); font-family: var(--font-mono); font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-accent); }
	.tracks-hero h1 { max-width: 13ch; margin: 0; font-family: var(--font-serif); font-size: clamp(3.2rem, 8vw, 7rem); font-weight: 500; line-height: 0.94; letter-spacing: -0.045em; }
	.intro { max-width: 42rem; margin: var(--space-l) 0 0; font-family: var(--font-serif); font-size: var(--step-1); line-height: 1.55; color: var(--color-text-muted); }
	.method-note { display: grid; grid-template-columns: 9rem minmax(0, 42rem); gap: var(--space-l); padding-block: var(--space-l); border-top: 1px solid var(--color-border); }
	.method-note p { margin: 0; line-height: 1.6; color: var(--color-text-muted); }
	.page-state { padding: var(--space-xl) 0; font-family: var(--font-mono); color: var(--color-text-muted); }
	.error { color: #a33; }
	@media (max-width: 680px) {
		.tracks-page { padding-inline: var(--space-m); }
		.method-note { grid-template-columns: 1fr; gap: var(--space-xs); }
	}
</style>
