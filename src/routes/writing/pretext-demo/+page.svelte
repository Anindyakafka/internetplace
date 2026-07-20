<script lang="ts">
	import PretextText from '$lib/pretext/PretextText.svelte';
	import type { Obstacle } from '$lib/pretext/obstacles';
	import { onMount } from 'svelte';

	const BODY_FONT = '400 19px/1.7 "Newsreader", Georgia, serif';
	const LINE_HEIGHT = 32;

	let obstacles = $state<Obstacle[]>([]);
	let containerEl: HTMLDivElement;

	// Sample long-form prose for the demo
	const essay = `This is a demonstration of obstacle-aware text reflow powered by pretext. In a traditional CSS float layout, the browser wraps text in a fairly naive way — it shortens line boxes by the width of the floated element but does not consider the optimal break points, hyphenation, or the natural rhythm of the prose.

Pretext, by contrast, segments the text into grapheme clusters, measures each one against the actual font metrics using a canvas, and then walks through the available width for every single line. When an obstacle narrows the available space, pretext recalculates the break point for that specific line, producing text that flows around images and figures with the precision of a professionally typeset book.

Notice how the text wraps tightly against the image. No awkward gaps, no rivers of white space, no orphaned words stranded at line endings. Each line is independently measured against the actual pixels available at that vertical position.

The layout engine works in two phases. The first phase — preparation — runs the text through an Intl.Segmenter and measures every grapheme cluster with canvas.measureText. This is the expensive part, so it happens once. The second phase — layout — is pure arithmetic. It walks the cached widths and breaks lines at the optimal points for whatever width constraint applies at each vertical position. This means that when the window resizes, or when an obstacle changes position, the reflow is nearly instantaneous.

Obstacles can sit on either side of the text. The layout function receives a callback that maps each vertical position to the available line width at that position. When the text reaches the bottom edge of an obstacle, the available width snaps back to full width immediately, with no transition artifacts.

This is what sets pretext apart from simple float behavior. A float gives you a rectangular exclusion zone. Pretext gives you a function — a continuous, per-pixel mapping from vertical position to available width. You can compose multiple overlapping obstacles, L-shaped regions, or any arbitrary polygon, and the text will flow around all of them naturally.`;

	$effect(() => {
		if (!containerEl) return;

		// Measure the floated image to create an obstacle.
		const measure = () => {
			const img = containerEl.querySelector('.demo-float') as HTMLElement | null;
			if (!img) return;

			const imgRect = img.getBoundingClientRect();
			const containerRect = containerEl.getBoundingClientRect();

			obstacles = [
				{
					y0: imgRect.top - containerRect.top,
					y1: imgRect.bottom - containerRect.top,
					side: 'left' as const,
					width: imgRect.width + 24 // image width + gap
				}
			];
		};

		// Wait for layout + image dimensions
		requestAnimationFrame(measure);

		const ro = new ResizeObserver(measure);
		ro.observe(containerEl);
		return () => ro.disconnect();
	});
</script>

<svelte:head>
	<title>Pretext Demo — Obstacle-Aware Text Reflow</title>
	<meta name="description" content="A demonstration of pretext-quality text wrapping with obstacle-aware reflow." />
</svelte:head>

<article class="container demo-article">
	<header class="demo-header">
		<p class="hero-eyebrow">Writing</p>
		<h1>Obstacle-Aware Text Reflow</h1>
		<p class="demo-dek">
			A live demonstration of pretext-powered typography. Resize the browser window and watch the text
			flow around the image with professional-grade precision.
		</p>
	</header>

	<div class="demo-body" bind:this={containerEl}>
		<figure class="demo-float">
			<img
				src="https://picsum.photos/seed/pretext-demo/320/400"
				alt="A placeholder image that the text flows around"
				width="320"
				height="400"
			/>
			<figcaption>The image acts as an obstacle — text calculates its break points per-line based on the pixels available at each vertical position.</figcaption>
		</figure>

		<PretextText
			text={essay}
			font={BODY_FONT}
			lineHeight={LINE_HEIGHT}
			{obstacles}
		/>
	</div>
</article>

<style>
	.demo-article {
		max-width: var(--measure);
		margin-inline: auto;
		padding-block: var(--space-3xl);
	}

	.demo-header {
		margin-bottom: var(--space-2xl);
	}

	.demo-header h1 {
		font-family: var(--font-serif);
		font-size: clamp(1.953rem, 1.5625rem + 1.9531vw, 2.441rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-top: var(--space-2xs);
		margin-bottom: var(--space-sm);
	}

	.demo-dek {
		font-family: var(--font-sans);
		font-size: var(--text-md);
		color: var(--color-muted, #666);
		line-height: 1.6;
		max-width: 32rem;
	}

	.demo-body {
		position: relative;
	}

	.demo-float {
		float: left;
		width: 320px;
		margin: var(--space-xs) var(--space-lg) var(--space-lg) 0;
	}

	.demo-float img {
		width: 100%;
		height: auto;
		border-radius: 4px;
		display: block;
	}

	.demo-float figcaption {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--color-muted, #666);
		margin-top: var(--space-2xs);
		padding-right: var(--space-xs);
	}

	:global(.pretext-text) {
		font-family: 'Newsreader', Georgia, serif;
		font-weight: 400;
		font-size: 19px;
		color: var(--color-text);
	}

	:global(.pretext-line) {
		font-family: 'Newsreader', Georgia, serif;
		font-weight: 400;
		font-size: 19px;
		line-height: 1.7;
	}
</style>
