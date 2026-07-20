<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import PretextText from '$lib/pretext/PretextText.svelte';
	import type { Obstacle } from '$lib/pretext/obstacles';

	const BODY_FONT = '400 18px/1.6 Newsreader, serif';
	const LINE_HEIGHT = 30;

	const note = `QGIS is free, open-source, and occasionally infuriating. I have spent more hours than I care to admit fighting its rendering engine, its Python console, and its idiosyncratic approach to CRS transformations. But it remains the best tool for reproducible spatial analysis on a budget — which is to say, on my budget.

These notes collect the workflow I have settled on after several years of trial and error. They are not exhaustive. They are the path of least resistance I have found for going from raw shapefile to publication-quality map without losing data integrity or my sanity along the way.

The pipeline breaks into five stages: projection, topology, attribution, symbology, and export. Each stage has its own failure modes. Most of them are silent — QGIS will happily render a map from a dataset with broken geometries or mismatched projections, and the error only surfaces when a reviewer tries to replicate the result.`;

	const obstacles: Obstacle[] = [
		{
			id: 'figure-1',
			type: 'left',
			offsetX: 0,
			offsetY: 16,
			width: 180,
			height: 220
		}
	];
</script>

<svelte:head>
	<title>QGIS Workflow Notes — Anindya Singh</title>
	<meta name="description" content="Practical notes on a reproducible QGIS workflow: projection, topology, attribution, symbology, and export." />
</svelte:head>

<article class="page-content">
	<BackLink href="/writing">← Writing</BackLink>

	<header class="entry-header">
		<span class="entry-meta-bar">Note · 2024</span>
		<h1>QGIS Workflow Notes</h1>
		<p class="dek">Practical notes on a reproducible pipeline from raw shapefile to publication-quality map.</p>
	</header>

	<div class="pretext-body">
		<figure class="pretext-figure pretext-figure--left">
			<img
				src="https://picsum.photos/seed/qgis-workflow/180/220"
				alt=""
				width="180"
				height="220"
			/>
			<figcaption>A typical QGIS project layout — layer panel on the left, map canvas centre, processing toolbox docked right.</figcaption>
		</figure>

		<PretextText text={note} font={BODY_FONT} lineHeight={LINE_HEIGHT} {obstacles} />
	</div>
</article>

<style>
	.page-content {
		max-width: var(--measure);
		margin-inline: auto;
		padding: 4rem 1.5rem 6rem;
	}

	.entry-header {
		margin-bottom: 3rem;
	}

	.entry-meta-bar {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.entry-header h1 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 600;
		margin-top: 0.5rem;
		line-height: 1.15;
	}

	.dek {
		font-size: 1.125rem;
		color: var(--color-text-muted);
		margin-top: 0.75rem;
		line-height: 1.5;
	}

	.pretext-body {
		position: relative;
		overflow: hidden;
		min-height: 400px;
	}

	.pretext-figure {
		position: absolute;
		top: 0;
		width: 180px;
		margin: 0;
		z-index: 1;
	}

	.pretext-figure--left {
		left: 0;
	}

	.pretext-figure img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--radius);
	}

	.pretext-figure figcaption {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.4;
		margin-top: 0.5rem;
	}
</style>
