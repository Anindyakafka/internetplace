<svelte:head>
	<title>Anindya Singh — Researcher, data scientist, and writer</title>
	<meta
		name="description"
		content="Anindya Singh is a researcher, data scientist, and writer working across economics, data, and social impact."
	/>
</svelte:head>

<section class="page-content sections-page">
	<header class="sections-hero">
		<div class="hero-copy">
			<span class="section-index">Based in Kolkata, West Bengal, India</span>
			<h1>Anindya Singh</h1>
			<p class="bio-lede">
				I’m a researcher, data scientist, and writer working at the intersection of economics,
				data, and social impact.
			</p>
			<p>
				My work brings empirical methods into conversation with questions about labour,
				identity, information, and the ways policy shapes everyday life. I build research tools,
				work with large public datasets, and write about the human stories held inside them.
			</p>
			<p class="hero-note">Explore my work, writing, methods, and field notes below.</p>
		</div>

		<figure class="hero-portrait">
			<img src="/images/anindya2.png" alt="Anindya Singh wearing a colourful ceremonial hat outdoors" />
			<figcaption>Anindya Singh · Research, data, and writing</figcaption>
		</figure>
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
			<h2>Tracks & Loiterings</h2>
			<p>
				Walks, journeys, GPS traces, photographs, and small observations recorded along the way.
			</p>
			<a href="/tracks" class="section-link">Open track archive →</a>
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
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.8fr);
		align-items: center;
		gap: clamp(var(--space-xl), 6vw, var(--space-3xl));
	}

	.hero-copy {
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

	.sections-hero .bio-lede {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		line-height: 1.35;
		color: var(--color-text);
	}

	.hero-portrait {
		margin: 0;
		display: grid;
		gap: var(--space-2xs);
	}

	.hero-portrait img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		object-position: center 34%;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		filter: saturate(0.9) contrast(1.03);
	}

	.hero-portrait figcaption {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		line-height: 1.4;
		letter-spacing: 0.04em;
		text-transform: uppercase;
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

		.sections-hero {
			grid-template-columns: 1fr;
		}

		.hero-portrait {
			grid-row: 1;
		}

		.hero-portrait img {
			max-height: 72svh;
		}
	}
</style>
