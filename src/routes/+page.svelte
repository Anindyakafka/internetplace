<script lang="ts">
	import { featuredProjects } from '$data/projects';

	let year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Anindya Singh — Researcher, Data Scientist, Writer</title>
	<meta
		name="description"
		content="Portfolio of Anindya Singh — researcher, data scientist, and writer. Data projects, research, and essays on caste, labour, names, and political ecology."
	/>
	<meta name="author" content="Anindya Singh" />
	<meta property="og:title" content="Anindya Singh — Researcher, Data Scientist, Writer" />
	<meta
		property="og:description"
		content="Data projects, research, and essays on caste, labour, names, and political ecology."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- ═══════════════════════════════════════════════
     HERO
     ═══════════════════════════════════════════════ -->
<section class="hero">
	<div class="hero-inner">
		<div class="hero-overline">
			<span class="status-dot" aria-hidden="true"></span>
			<span>Available for research collaborations &middot; {year}</span>
		</div>

		<h1 class="hero-title">
			<span class="hero-line">Researcher.</span>
			<span class="hero-line">Data&nbsp;scientist.</span>
			<span class="hero-line hero-line--accent">Writer.</span>
		</h1>

		<p class="hero-tagline">
			Working at the intersection of <em>economics</em>, <em>data</em>, and
			<em>social impact</em> — building tools and writing about caste, labour, names,
			and the political ecology of South Asia.
		</p>

		<div class="hero-cta">
			<a href="/work" class="btn btn--primary">
				<span>View work</span>
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</a>
			<a href="/about" class="btn btn--ghost">About me</a>
		</div>
	</div>

	<div class="hero-grid-decoration" aria-hidden="true">
		<div class="grid-line grid-line--1"></div>
		<div class="grid-line grid-line--2"></div>
		<div class="grid-line grid-line--3"></div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════
     WHAT I DO
     ═══════════════════════════════════════════════ -->
<section class="disciplines">
	<div class="section-header">
		<span class="section-index">01</span>
		<h2 class="section-title">What I do</h2>
	</div>
	<div class="discipline-grid">
		<article class="discipline">
			<span class="discipline-mark">◇</span>
			<h3>Data &amp; computation</h3>
			<p>
				Building scrapers, classifiers, and data pipelines. Python, PyTorch, R, Stata,
				and GIS — from raw data to reproducible analysis.
			</p>
		</article>
		<article class="discipline">
			<span class="discipline-mark">◇</span>
			<h3>Research</h3>
			<p>
				Empirical economics and political ecology — caste, labour, names, identity. Work
				with Inclusion Economics (Yale) and Azim Premji University.
			</p>
		</article>
		<article class="discipline">
			<span class="discipline-mark">◇</span>
			<h3>Writing</h3>
			<p>
				Essays and manifestos on the politics of data, caste, and ecology. Published
				through art spaces and academic venues.
			</p>
		</article>
	</div>
</section>

<!-- ═══════════════════════════════════════════════
     FEATURED WORK
     ═══════════════════════════════════════════════ -->
<section class="featured">
	<div class="section-header section-header--row">
		<div>
			<span class="section-index">02</span>
			<h2 class="section-title">Featured work</h2>
		</div>
		<a href="/work" class="see-all">
			All projects
			<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
				<path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" />
			</svg>
		</a>
	</div>

	<div class="project-list">
		{#each featuredProjects as project, i}
			<article class="project-card" style="--delay: {i * 80}ms">
				<a
					href={project.liveUrl ?? project.repo ?? '#'}
					class="project-card-link"
					target={project.liveUrl || project.repo ? '_blank' : undefined}
					rel={project.liveUrl || project.repo ? 'noopener noreferrer' : undefined}
				>
					<div class="project-card-head">
						<span class="project-num">{String(i + 1).padStart(2, '0')}</span>
						<span
							class="project-status project-status--{project.status}"
							title="Status: {project.status}"
						></span>
					</div>
					<div class="project-card-body">
						<h3 class="project-title">{project.title}</h3>
						<p class="project-blurb">{project.blurb}</p>
						<div class="project-tags">
							{#each project.categories as cat}
								<span class="tag">{cat}</span>
							{/each}
						</div>
					</div>
					<div class="project-card-foot">
						<span class="project-year">{project.year}</span>
						<span class="project-arrow" aria-hidden="true">→</span>
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>

<!-- ═══════════════════════════════════════════════
     WRITING PREVIEW
     ═══════════════════════════════════════════════ -->
<section class="writing-preview">
	<div class="section-header section-header--row">
		<div>
			<span class="section-index">03</span>
			<h2 class="section-title">Writing</h2>
		</div>
		<a href="/writing" class="see-all">
			All essays
			<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
				<path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" />
			</svg>
		</a>
	</div>
	<div class="writing-note">
		<p>
			Essays and manifestos on caste, labour, and the politics of data — published through
			art spaces and independent venues.
		</p>
		<a href="/writing" class="text-link">Read the archive →</a>
	</div>
</section>

<style>
	/* ═══ HERO ═══ */
	.hero {
		position: relative;
		padding: var(--space-4xl) 0 var(--space-3xl);
		overflow: hidden;
		min-height: 70vh;
		display: flex;
		align-items: center;
	}

	.hero-inner {
		max-width: var(--measure);
		position: relative;
		z-index: 2;
	}

	.hero-overline {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		margin-bottom: var(--space-xl);
		letter-spacing: 0.01em;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
		animation: pulse 2.4s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
		}
	}

	.hero-title {
		font-family: var(--font-serif);
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		line-height: 0.95;
		letter-spacing: -0.03em;
		font-weight: 600;
		margin-bottom: var(--space-xl);
	}

	.hero-line {
		display: block;
		opacity: 0;
		animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.hero-line:nth-child(1) {
		animation-delay: 0.1s;
	}
	.hero-line:nth-child(2) {
		animation-delay: 0.22s;
	}
	.hero-line:nth-child(3) {
		animation-delay: 0.34s;
	}

	.hero-line--accent {
		color: var(--color-accent);
		font-style: italic;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(0.3em);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-tagline {
		font-size: var(--step-1);
		line-height: 1.55;
		color: var(--color-text-muted);
		max-width: 34rem;
		margin-bottom: var(--space-2xl);
		opacity: 0;
		animation: fadeIn 0.6s ease 0.5s forwards;
	}

	.hero-tagline em {
		font-style: italic;
		color: var(--color-text);
		font-family: var(--font-serif);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.hero-cta {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		opacity: 0;
		animation: fadeIn 0.6s ease 0.65s forwards;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: 0.7rem 1.4rem;
		font-size: var(--step-0);
		font-family: var(--font-sans);
		font-weight: 500;
		border-radius: var(--radius);
		transition: all var(--transition);
		cursor: pointer;
		text-decoration: none;
		border: 1px solid transparent;
	}

	.btn--primary {
		background: var(--color-accent);
		color: white;
	}

	.btn--primary:hover {
		background: var(--color-accent-hover);
		transform: translateY(-1px);
	}

	.btn--ghost {
		color: var(--color-text);
		border-color: var(--color-border);
		background: transparent;
	}

	.btn--ghost:hover {
		background: var(--color-surface);
		border-color: var(--color-text-muted);
	}

	/* Hero decoration lines */
	.hero-grid-decoration {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 40%;
		pointer-events: none;
		z-index: 1;
	}

	.grid-line {
		position: absolute;
		top: -10%;
		bottom: -10%;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			var(--color-border) 20%,
			var(--color-border) 80%,
			transparent
		);
		opacity: 0.5;
	}

	.grid-line--1 {
		right: 20%;
	}
	.grid-line--2 {
		right: 40%;
	}
	.grid-line--3 {
		right: 60%;
	}

	/* ═══ SECTIONS ═══ */
	.disciplines,
	.featured,
	.writing-preview {
		padding: var(--space-3xl) 0;
		border-top: 1px solid var(--color-border);
	}

	.section-header {
		margin-bottom: var(--space-2xl);
	}

	.section-header--row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: var(--space-2xs);
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.see-all {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--transition);
		padding-bottom: 0.15rem;
	}

	.see-all:hover {
		color: var(--color-accent);
	}

	/* ═══ DISCIPLINES ═══ */
	.discipline-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-xl);
	}

	.discipline {
		padding: var(--space-lg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		transition:
			transform var(--transition),
			border-color var(--transition);
	}

	.discipline:hover {
		transform: translateY(-2px);
		border-color: var(--color-accent);
	}

	.discipline-mark {
		color: var(--color-accent);
		font-size: var(--step-1);
		display: block;
		margin-bottom: var(--space-sm);
	}

	.discipline h3 {
		font-size: var(--step-1);
		margin-bottom: var(--space-xs);
		font-weight: 600;
	}

	.discipline p {
		font-size: var(--step-0);
		line-height: 1.55;
		color: var(--color-text-muted);
	}

	/* ═══ FEATURED PROJECTS ═══ */
	.project-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.project-card {
		opacity: 0;
		transform: translateY(12px);
		animation: cardIn 0.5s ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes cardIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.project-card-link {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--space-lg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		text-decoration: none;
		color: inherit;
		transition:
			border-color var(--transition),
			transform var(--transition),
			box-shadow var(--transition);
	}

	.project-card-link:hover {
		border-color: var(--color-accent);
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
	}

	.project-card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-lg);
	}

	.project-num {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.project-status {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.project-status--live {
		background: #22c55e;
	}
	.project-status--external {
		background: var(--color-accent);
	}
	.project-status--planned {
		background: var(--color-text-muted);
	}

	.project-card-body {
		flex: 1;
	}

	.project-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 500;
		margin-bottom: var(--space-xs);
		letter-spacing: -0.01em;
	}

	.project-blurb {
		font-size: var(--step-0);
		line-height: 1.5;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs);
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: 0.15rem 0.5rem;
		border-radius: 3px;
		background: var(--color-accent-soft);
		color: var(--color-accent);
		letter-spacing: 0.02em;
	}

	.project-card-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-lg);
		padding-top: var(--space-sm);
		border-top: 1px solid var(--color-border);
	}

	.project-year {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.project-arrow {
		color: var(--color-text-muted);
		transition: color var(--transition), transform var(--transition);
	}

	.project-card-link:hover .project-arrow {
		color: var(--color-accent);
		transform: translateX(3px);
	}

	/* ═══ WRITING PREVIEW ═══ */
	.writing-note {
		max-width: var(--measure);
	}

	.writing-note p {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.text-link {
		font-size: var(--step-0);
		color: var(--color-accent);
		text-decoration: none;
		transition: color var(--transition);
	}

	.text-link:hover {
		color: var(--color-accent-hover);
	}

	/* ═══ RESPONSIVE ═══ */
	@media (max-width: 768px) {
		.hero {
			min-height: 60vh;
			padding: var(--space-3xl) 0;
		}

		.hero-grid-decoration {
			display: none;
		}

		.discipline-grid,
		.project-list {
			grid-template-columns: 1fr;
		}

		.section-header--row {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}
	}

	@media (max-width: 480px) {
		.hero-cta {
			flex-direction: column;
		}

		.btn {
			justify-content: center;
		}
	}

	/* ═══ REDUCED MOTION ═══ */
	@media (prefers-reduced-motion: reduce) {
		.hero-line,
		.hero-tagline,
		.hero-cta,
		.project-card {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
