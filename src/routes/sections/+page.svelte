<svelte:head>
	<title>Explore the archive — Anindya Singh</title>
	<meta
		name="description"
		content="Explore Anindya Singh’s live data maps, research projects, writing, methods, field tracks, and Annihilation Atlas."
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
				<p class="atlas-status">In progress · Dadri prototype underway</p>
				<a href="/annihilation-atlas">Enter the project →</a>
			</aside>
		</div>
	</header>

	<nav class="live-projects" aria-labelledby="live-projects-title">
		<div><span>Live instruments</span><h2 id="live-projects-title">Start with the maps that are moving.</h2></div>
		<a href="/trains"><strong>Local Lines</strong><span>West Bengal tracks, stations, and calculated trains →</span></a>
		<a href="/vehicles"><strong>Delhi Vehicles</strong><span>Live public-transport positions on a historical map →</span></a>
		<a href="/legal-explorer"><strong>Legal Explorer</strong><span>Search and connect parliamentary bills since 1952 →</span></a>
	</nav>
	<p class="archive-note"><strong>An archive under construction.</strong> The live instruments are usable now; essays, methods, and the Annihilation Atlas grow as work is documented and verified. Planned rooms are labelled instead of being presented as finished collections.</p>

	<div class="sections-grid">
		<article class="section-card section-card--data">
			<img class="card-image" src="/images/sections/data-methods.jpg?v=2" alt="A clipped survey sheet with a hand-drawn scatterplot" loading="lazy" />
			<h2>Data & Methods</h2>
			<p>
				Pipelines, reproducibility notes, maps, and empirical tools. This area will expand with
				datasets, process logs, and method briefs.
			</p>
			<p class="status">Live · expanding</p>
			<a href="/map" class="section-link">Open the data atlas →</a>
		</article>

		<article class="section-card section-card--writing">
			<img class="card-image" src="/images/sections/writing-essays.jpg?v=2" alt="An open manuscript with one editorial mark and a fountain pen" loading="lazy" />
			<h2>Writing & Essays</h2>
			<p>
				Published essays, methodology notes, and experiments in long-form argument.
			</p>
			<a href="/writing" class="section-link">Open writing index →</a>
		</article>

		<article class="section-card section-card--work">
			<img class="card-image" src="/images/sections/professional-work.jpg?v=2" alt="A field notebook containing a technical diagram beside a ruler" loading="lazy" />
			<h2>Professional Work</h2>
			<p>
				Project implementations, collaborations, and production-grade research tooling.
			</p>
			<a href="/work" class="section-link">Open work index →</a>
		</article>

		<article class="section-card section-card--tracks">
			<img class="card-image" src="/images/sections/tracks-loiterings.jpg?v=2" alt="A folded map with a stitched route and one photograph" loading="lazy" />
			<h2>Tracks & Loiterings</h2>
			<p>
				Walks, journeys, GPS traces, photographs, and small observations recorded along the way.
			</p>
			<a href="/tracks" class="section-link">Open track archive →</a>
		</article>

		<article class="section-card section-card--trains">
			<img class="card-image" src="/images/sections/local-lines.jpg" alt="A branching railway network drawn over an archival map of Bengal" loading="lazy" />
			<h2>Local Lines</h2>
			<p>
				A calculated live portrait of suburban trains moving across a historical map of Bengal.
			</p>
			<a href="/trains" class="section-link">Open the railway map →</a>
		</article>

		<article class="section-card section-card--vehicles">
			<img class="card-image" src="/images/sections/delhi-vehicles.jpg" alt="Small buses moving along routes on a faded historical map of Delhi" loading="lazy" />
			<h2>Delhi Vehicles</h2>
			<p>
				A subtle, live view of Delhi transit movement over a historical map.
				Station and official line geometry will follow from the static GTFS archive.
			</p>
			<a href="/vehicles" class="section-link">Open the vehicle map →</a>
		</article>

		<article class="section-card section-card--legal">
			<img class="card-image" src="/images/sections/legal-explorer.jpg?v=2" alt="Two archival papers joined by a single red thread" loading="lazy" />
			<h2>Legal Explorer</h2>
			<p>
				Search parliamentary bills from 1952 onward and trace their passage, assent,
				committees, resulting Acts, and available official documents.
			</p>
			<a href="/legal-explorer" class="section-link">Open the legal record →</a>
		</article>

		<article class="section-card section-card--about">
			<img class="card-image" src="/images/sections/about-coordinates.jpg?v=2" alt="A worn field notebook beside a brass compass" loading="lazy" />
			<h2>About & Coordinates</h2>
			<p>
				Bio, background, and research orientation. Useful if you are landing here for the first
				time.
			</p>
			<a href="/about" class="section-link">Open about page →</a>
		</article>

		<article class="section-card section-card--colophon">
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

	.atlas-status { font-family: var(--font-mono); color: var(--color-accent); text-transform: uppercase; letter-spacing: .04em; }

	.live-projects { display:grid; grid-template-columns:minmax(14rem,1.1fr) repeat(3,minmax(10rem,1fr)); border:1px solid var(--color-border-strong); background:var(--color-surface); }
	.live-projects > * { min-width:0; padding:var(--space-m); border-right:1px solid var(--color-border); }
	.live-projects > *:last-child { border-right:0; }
	.live-projects div > span { font:600 var(--step--2)/1.2 var(--font-mono); color:var(--color-accent); letter-spacing:.08em; text-transform:uppercase; }
	.live-projects h2 { margin-top:var(--space-2xs); font:500 var(--step-2)/1.05 var(--font-serif); }
	.live-projects a { display:grid; align-content:space-between; gap:var(--space-l); color:var(--color-text); text-decoration:none; }
	.live-projects a:hover { background:var(--color-accent-soft); }
	.live-projects a strong { font:500 var(--step-1)/1.1 var(--font-serif); }
	.live-projects a span { color:var(--color-text-muted); font-size:var(--step--1); line-height:1.4; }
	.archive-note { max-width:78ch; margin:calc(var(--space-l) * -1) 0 0; padding-left:var(--space-m); border-left:3px solid var(--color-accent); color:var(--color-text-muted); line-height:1.6; }
	.archive-note strong { color:var(--color-text); }
	@media(max-width:850px){.live-projects{grid-template-columns:1fr}.live-projects>*{border-right:0;border-bottom:1px solid var(--color-border)}.live-projects>*:last-child{border-bottom:0}}

	.hero-note {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.sections-grid {
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1rem, 2.2vw, 2rem);
		align-items: stretch;
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

	.section-card--trains { order: 1; }
	.section-card--data { order: 2; }
	.section-card--vehicles { order: 3; }
	.section-card--legal { order: 4; }
	.section-card--writing { order: 5; }
	.section-card--tracks { order: 6; }
	.section-card--work { order: 7; }
	.section-card--about { order: 8; }
	.section-card--colophon { order: 9; }
	.section-card--colophon .card-image { object-position: center 58%; }

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

		.sections-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 641px) and (max-width: 960px) {
		.sections-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
</style>
