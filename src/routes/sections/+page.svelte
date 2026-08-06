<svelte:head>
	<title>Sections — Anindya Singh</title>
	<meta
		name="description"
		content="A living skeleton of this website's sections: data work, writing, personal notes, and professional documentation."
	/>
</svelte:head>

<section class="page-content sections-page">
	<header class="sections-hero">
		<span class="section-index">◇ Sections</span>
		<h1>Site Atlas (Skeleton)</h1>
		<p>
			This is the staging ground for what comes next: more data-driven work, more long-form
			articles, and clearer pathways between personal and professional threads.
		</p>
		<p class="hero-note">
			Start anywhere. Return often. This map will keep changing.
		</p>
	</header>

	<div class="sections-grid">
		<article class="section-card">
			<h2>Data & Methods</h2>
			<p>
				Pipelines, reproducibility notes, maps, and empirical tools. This area will expand with
				datasets, process logs, and method briefs.
			</p>
			<p class="status">Status: expanding</p>
		</article>

		<article class="section-card">
			<h2>Writing & Essays</h2>
			<p>
				Published essays, methodology notes, and experiments in long-form argument.
			</p>
			<a href="/writing" class="section-link">Open writing index →</a>
		</article>

		<article class="section-card">
			<h2>Professional Work</h2>
			<p>
				Project implementations, collaborations, and production-grade research tooling.
			</p>
			<a href="/work" class="section-link">Open work index →</a>
		</article>

		<article class="section-card">
			<h2>Personal Field Notes</h2>
			<p>
				A future space for process diaries, reading fragments, and small observations from
				the field.
			</p>
			<p class="status">Status: planned</p>
		</article>

		<article class="section-card">
			<h2>About & Coordinates</h2>
			<p>
				Bio, background, and research orientation. Useful if you are landing here for the first
				time.
			</p>
			<a href="/about" class="section-link">Open about page →</a>
		</article>

		<article class="section-card">
			<h2>How This Site Is Built</h2>
			<p>
				Stack choices, typography, and design logic. The technical and editorial backbone.
			</p>
			<a href="/colophon" class="section-link">Open colophon →</a>
		</article>
	</div>
</section>

<style>
	.page-content {
		max-width: var(--max-width);
		margin: 0 auto;
		padding-inline: var(--space-l);
	}

	.sections-page {
		padding-top: var(--space-3xl);
		padding-bottom: var(--space-3xl);
		display: grid;
		gap: var(--space-2xl);
	}

	.section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		letter-spacing: 0.06em;
	}

	.sections-hero {
		max-width: min(46rem, 100%);
		display: grid;
		gap: var(--space-s);
	}

	.sections-hero h1 {
		font-family: var(--font-serif);
		font-size: var(--step-5);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.sections-hero p {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.hero-note {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16.5rem, 1fr));
		gap: var(--space-l);
	}

	.section-card {
		display: grid;
		align-content: start;
		gap: var(--space-s);
		padding: var(--space-l);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--color-surface) 86%, transparent);
	}

	.section-card h2 {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		line-height: 1.2;
	}

	.section-card p {
		font-size: var(--step--1);
		line-height: 1.52;
		color: var(--color-text-muted);
	}

	.section-link {
		justify-self: start;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		color: var(--color-accent);
	}

	.section-link:hover {
		color: var(--color-accent-hover);
	}

	.status {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	@media (max-width: 640px) {
		.sections-page {
			padding-top: var(--space-2xl);
		}
	}
</style>
