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

		<div class="hero-portrait">
			<figure class="portrait-frame">
				<img src="/images/anindya2.png" alt="Anindya Singh wearing a colourful ceremonial hat outdoors" />
				<figcaption>Anindya Singh · Research, data, and writing</figcaption>
			</figure>
			<aside class="atlas-note">
				<span>The real deal</span>
				<h2>Annihilation Atlas</h2>
				<p>An anti-caste observatory of land, labour, classification, segregation, resistance, and memory. This is the long project around which the rest of this site will begin to gather.</p>
				<a href="/annihilation-atlas">Enter the project →</a>
			</aside>
		</div>
	</header>

	<div class="sections-grid">
		<article class="section-card">
			<img class="card-image" src="/images/sections/data-methods.jpg?v=2" alt="A clipped survey sheet with a hand-drawn scatterplot" loading="lazy" />
			<h2>Data & Methods</h2>
			<p>
				Pipelines, reproducibility notes, maps, and empirical tools. This area will expand with
				datasets, process logs, and method briefs.
			</p>
			<p class="status">Status: expanding</p>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/writing-essays.jpg?v=2" alt="An open manuscript with one editorial mark and a fountain pen" loading="lazy" />
			<h2>Writing & Essays</h2>
			<p>
				Published essays, methodology notes, and experiments in long-form argument.
			</p>
			<a href="/writing" class="section-link">Open writing index →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/professional-work.jpg?v=2" alt="A field notebook containing a technical diagram beside a ruler" loading="lazy" />
			<h2>Professional Work</h2>
			<p>
				Project implementations, collaborations, and production-grade research tooling.
			</p>
			<a href="/work" class="section-link">Open work index →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/tracks-loiterings.jpg?v=2" alt="A folded map with a stitched route and one photograph" loading="lazy" />
			<h2>Tracks & Loiterings</h2>
			<p>
				Walks, journeys, GPS traces, photographs, and small observations recorded along the way.
			</p>
			<a href="/tracks" class="section-link">Open track archive →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/local-lines.jpg" alt="A branching railway network drawn over an archival map of Bengal" loading="lazy" />
			<h2>Local Lines</h2>
			<p>
				A calculated live portrait of suburban trains moving across a historical map of Bengal.
			</p>
			<a href="/trains" class="section-link">Open the railway map →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/delhi-vehicles.jpg" alt="Small buses moving along routes on a faded historical map of Delhi" loading="lazy" />
			<h2>Delhi Vehicles</h2>
			<p>
				A subtle, live view of Delhi transit movement over a historical map.
				Station and official line geometry will follow from the static GTFS archive.
			</p>
			<a href="/vehicles" class="section-link">Open the vehicle map →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/legal-explorer.jpg?v=2" alt="Two archival papers joined by a single red thread" loading="lazy" />
			<h2>Legal Explorer</h2>
			<p>
				Search parliamentary bills from 1952 onward and trace their passage, assent,
				committees, resulting Acts, and available official documents.
			</p>
			<a href="/legal-explorer" class="section-link">Open the legal record →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/about-coordinates.jpg?v=2" alt="A worn field notebook beside a brass compass" loading="lazy" />
			<h2>About & Coordinates</h2>
			<p>
				Bio, background, and research orientation. Useful if you are landing here for the first
				time.
			</p>
			<a href="/about" class="section-link">Open about page →</a>
		</article>

		<article class="section-card">
			<img class="card-image" src="/images/sections/colophon.jpg?v=2" alt="A letterpress block beside a simple registration proof" loading="lazy" />
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
		min-width: 0;
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
		min-width: 0;
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.8fr);
		align-items: center;
		gap: clamp(var(--space-xl), 6vw, var(--space-3xl));
	}

	.hero-copy {
		min-width: 0;
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
		display: grid;
		gap: var(--space-2xs);
	}

	.portrait-frame {
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

	.atlas-note {
		margin-top: var(--space-m);
		padding: var(--space-l);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface));
	}

	.atlas-note span {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		text-transform: uppercase;
		letter-spacing: .1em;
		color: var(--color-accent);
	}

	.atlas-note h2 {
		margin-top: var(--space-2xs);
		font-family: var(--font-serif);
		font-size: var(--step-2);
	}

	.sections-hero .atlas-note p {
		margin-block: var(--space-s);
		font-size: var(--step--1);
		line-height: 1.5;
	}

	.atlas-note a {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: .04em;
		text-decoration: none;
		color: var(--color-accent);
	}

	.hero-note {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.sections-grid {
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16.5rem, 1fr));
		gap: var(--space-l);
	}

	.section-card {
		position: relative;
		min-width: 0;
		display: grid;
		align-content: start;
		gap: var(--space-s);
		padding: 0 0 var(--space-l);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--color-surface) 86%, transparent);
		overflow: hidden;
		transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
	}

	.section-card:has(.section-link):hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--color-accent) 48%, var(--color-border));
		box-shadow: 0 12px 28px color-mix(in srgb, var(--color-text) 9%, transparent);
	}

	.card-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-bottom: 1px solid var(--color-border);
		filter: saturate(0.86) contrast(1.02);
		transition: filter var(--transition), transform 500ms ease;
	}

	.section-card:has(.section-link):hover .card-image {
		filter: saturate(1) contrast(1.04);
		transform: scale(1.012);
	}

	.section-card h2,
	.section-card p,
	.section-card .section-link {
		margin-inline: var(--space-l);
	}

	.section-card h2 {
		margin-top: var(--space-xs);
		font-family: var(--font-serif);
		font-size: var(--step-2);
		line-height: 1.2;
	}

	.section-card p {
		overflow-wrap: anywhere;
		font-size: var(--step--1);
		line-height: 1.52;
		color: var(--color-text-muted);
	}

	.section-link {
		max-width: 100%;
		overflow-wrap: anywhere;
		justify-self: start;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		color: var(--color-accent);
	}

	.section-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.section-link:focus-visible::after {
		outline: 2px solid var(--color-accent);
		outline-offset: -3px;
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
