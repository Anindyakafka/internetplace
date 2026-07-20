<script lang="ts">
	interface WritingEntry {
		slug: string;
		title: string;
		blurb: string;
		date: string;
		category: 'essay' | 'note' | 'demo' | 'experiment';
		readTime?: string;
		featured?: boolean;
		status: 'published' | 'draft' | 'planned';
	}

	const entries: WritingEntry[] = [
		{
			slug: '/writing/pretext-demo/',
			title: 'Pretext Demo',
			blurb: 'Obstacle-aware text reflow experiment using @chenglou/pretext — long-form text that flows around figures, pull quotes, and arbitrary shapes.',
			date: '2025-06-28',
			category: 'demo',
			readTime: '5 min',
			featured: true,
			status: 'published'
		},
		{
			slug: '/writing/dadri-methodology/',
			title: 'Fieldwork in Dadri: A Methodology Note',
			blurb: 'Methodology from fieldwork in Dadri, western Uttar Pradesh: 214 household surveys across seven villages, satellite imagery analysis across two decades, oral histories, and the politics of land records in a peri-urban landscape.',
			date: '2025-03-15',
			category: 'essay',
			readTime: '18 min',
			featured: true,
			status: 'published'
		},
		{
			slug: '/writing/name-ethnicity-essay/',
			title: "What's in a Name? Ethnicity Detection and its Discontents",
			blurb: 'A reflection on the promises and perils of algorithmic name-to-ethnicity classification, drawing on experience building a detector for South Asian names.',
			date: '2024-11-02',
			category: 'essay',
			readTime: '12 min',
			status: 'published'
		},
		{
			slug: '/writing/qgis-workflow/',
			title: 'A Reproducible QGIS Workflow for Electoral Roll Data',
			blurb: 'Notes from processing 2002 West Bengal electoral rolls — geocoding, deduplication, and building shapefiles that can be version-controlled.',
			date: '2024-09-20',
			category: 'note',
			readTime: '8 min',
			status: 'published'
		},
		{
			slug: '/writing/fluid-smoke/',
			title: 'Fluid Smoke: WebGL Meets Typography',
			blurb: 'An exploration of the Somnai pretext-demos fluid smoke effect — how fragment shaders can create living, breathing text backgrounds.',
			date: '2025-07-01',
			category: 'experiment',
			status: 'planned'
		},
		{
			slug: '/writing/r-qgis-interop/',
			title: 'R × QGIS Interop for Survey Data',
			blurb: 'Practical patterns for moving between R data frames and QGIS projects when working with large-scale household survey geodata.',
			date: '2024-06-10',
			category: 'note',
			status: 'draft'
		}
	];

	type Filter = 'all' | 'essay' | 'note' | 'demo' | 'experiment';

	const filters: { id: Filter; label: string }[] = [
		{ id: 'all', label: 'All' },
		{ id: 'essay', label: 'Essays' },
		{ id: 'note', label: 'Notes' },
		{ id: 'demo', label: 'Demos' },
		{ id: 'experiment', label: 'Experiments' }
	];

	let activeFilter = $state<Filter>('all');

	let filteredEntries = $derived(
		activeFilter === 'all' ? entries : entries.filter((e) => e.category === activeFilter)
	);

	let publishedCount = $derived(entries.filter((e) => e.status === 'published').length);

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Writing — Anindya Singh</title>
	<meta name="description" content="Essays, experiments, and notes on data science, economics research, typography, and technology." />
</svelte:head>

<section class="page-content">
	<header class="writing-header">
		<div class="header-top">
			<span class="section-index">§ Writing</span>
			<span class="entry-count">{publishedCount} published · {entries.length} total</span>
		</div>
		<h1 class="writing-title">Writing</h1>
		<p class="writing-intro">
			Essays, experiments, and notes — on research methodology, data tooling,
			typography, and the places where code meets language.
		</p>
	</header>

	<nav class="filter-bar" aria-label="Filter writing by type">
		{#each filters as f}
			<button
				class="filter-btn"
				class:filter-btn--active={activeFilter === f.id}
				onclick={() => (activeFilter = f.id)}
			>
				{f.label}
			</button>
		{/each}
	</nav>

	<div class="writing-grid">
		{#each filteredEntries as entry (entry.slug)}
			{#if entry.status === 'published'}
				<a
					class="entry-card"
					class:entry-card--featured={entry.featured}
					href={entry.slug}
				>
					<div class="entry-meta">
						<span class="entry-date">{formatDate(entry.date)}</span>
						<span class="entry-category-tag">{entry.category}</span>
						{#if entry.readTime}
							<span class="entry-readtime">{entry.readTime}</span>
						{/if}
					</div>

					<h2 class="entry-title">{entry.title}</h2>
					<p class="entry-blurb">{entry.blurb}</p>

					<div class="entry-footer">
						<span class="read-badge">Read →</span>
					</div>
				</a>
			{:else}
				<div
					class="entry-card entry-card--upcoming"
					class:entry-card--featured={entry.featured}
				>
					<div class="entry-meta">
						<span class="entry-date">{formatDate(entry.date)}</span>
						<span class="entry-category-tag">{entry.category}</span>
						{#if entry.readTime}
							<span class="entry-readtime">{entry.readTime}</span>
						{/if}
					</div>

					<h2 class="entry-title">{entry.title}</h2>
					<p class="entry-blurb">{entry.blurb}</p>

					<div class="entry-footer">
						{#if entry.status === 'draft'}
							<span class="status-badge status-badge--draft">In Progress</span>
						{:else}
							<span class="status-badge status-badge--planned">Coming Soon</span>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	{#if filteredEntries.length === 0}
		<p class="empty-state">No entries in this category yet.</p>
	{/if}

	<section class="writing-collab">
		<h2 class="collab-title">Want to collaborate on a piece?</h2>
		<p class="collab-text">
			I'm always open to co-authoring essays, building interactive demos, or writing
			about interesting datasets. If you have an idea, let's talk.
		</p>
		<a class="text-link" href="mailto:hello@anindyasingh.dev">Get in touch →</a>
	</section>
</section>

<style>
	.page-content {
		max-width: var(--max-width);
		margin: 0 auto;
		padding-inline: var(--space-l);
		padding-bottom: var(--space-3xl);
	}

	.writing-header {
		padding-top: var(--space-3xl);
		padding-bottom: var(--space-l);
		border-bottom: 1px solid var(--border);
		margin-bottom: var(--space-l);
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: var(--space-s);
	}

	.section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--accent);
		letter-spacing: 0.05em;
	}

	.entry-count {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--text-muted);
	}

	.writing-title {
		font-family: var(--font-serif);
		font-size: var(--step-5);
		font-weight: 600;
		line-height: 1.1;
		margin: 0 0 var(--space-s) 0;
		color: var(--text);
	}

	.writing-intro {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--text-muted);
		max-width: var(--measure);
		margin: 0;
	}

	/* ── Filter Bar ────────────────────────────── */

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
		margin-bottom: var(--space-l);
	}

	.filter-btn {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		padding: var(--space-3xs) var(--space-xs);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text-muted);
		cursor: pointer;
		transition: all var(--transition);
	}

	.filter-btn:hover {
		border-color: var(--accent);
		color: var(--text);
	}

	.filter-btn--active {
		color: var(--accent);
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	/* ── Writing Grid ──────────────────────────── */

	.writing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
		gap: var(--space-l);
		margin-bottom: var(--space-3xl);
	}

	.entry-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-l) var(--space-l) var(--space-m) var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: inherit;
		transition:
			transform var(--transition),
			box-shadow var(--transition),
			border-color var(--transition);
	}

	.entry-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
		border-color: var(--accent);
	}

	.entry-card--featured {
		grid-column: span 2;
		background: linear-gradient(
			135deg,
			var(--surface) 0%,
			var(--accent-soft) 100%
		);
	}

	.entry-card--upcoming {
		opacity: 0.75;
	}

	.entry-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--text-muted);
		margin-bottom: var(--space-s);
		flex-wrap: wrap;
	}

	.entry-category-tag {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent);
	}

	.entry-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 500;
		line-height: 1.2;
		margin: 0 0 var(--space-xs) 0;
		color: var(--text);
	}

	.entry-card--featured .entry-title {
		font-size: var(--step-3);
	}

	.entry-blurb {
		font-size: var(--step-0);
		line-height: 1.55;
		color: var(--text-muted);
		margin: 0;
		flex-grow: 1;
	}

	.entry-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: var(--space-m);
		padding-top: var(--space-s);
		border-top: 1px solid var(--border);
	}

	.read-badge {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--accent);
		transition: color var(--transition);
	}

	.entry-card:hover .read-badge {
		color: var(--accent-hover);
	}

	.status-badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: var(--space-3xs) var(--space-2xs);
		border-radius: var(--radius);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.status-badge--draft {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.status-badge--planned {
		background: transparent;
		border: 1px dashed var(--border);
		color: var(--text-muted);
	}

	/* ── Empty State ───────────────────────────── */

	.empty-state {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--text-muted);
		text-align: center;
		padding: var(--space-2xl) 0;
	}

	/* ── Collaboration CTA ─────────────────────── */

	.writing-collab {
		padding-top: var(--space-2xl);
		border-top: 1px solid var(--border);
		text-align: center;
	}

	.collab-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 500;
		margin: 0 0 var(--space-xs) 0;
	}

	.collab-text {
		font-size: var(--step-0);
		color: var(--text-muted);
		max-width: 36rem;
		margin: 0 auto var(--space-m) auto;
		line-height: 1.6;
	}

	.text-link {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--accent);
		text-decoration: none;
		transition: color var(--transition);
	}

	.text-link:hover {
		color: var(--accent-hover);
	}

	/* ── Responsive ────────────────────────────── */

	@media (max-width: 768px) {
		.writing-grid {
			grid-template-columns: 1fr;
		}

		.entry-card--featured {
			grid-column: span 1;
		}

		.header-top {
			flex-direction: column;
			gap: var(--space-3xs);
		}

		.writing-title {
			font-size: var(--step-4);
		}
	}

	@media (max-width: 480px) {
		.page-content {
			padding-inline: var(--space-m);
		}

		.filter-bar {
			overflow-x: auto;
			flex-wrap: nowrap;
			-webkit-overflow-scrolling: touch;
			padding-bottom: var(--space-2xs);
		}

		.filter-btn {
			white-space: nowrap;
		}

		.entry-card {
			padding: var(--space-m);
		}

		.entry-title {
			font-size: var(--step-1);
		}
	}

	/* ── Reduced Motion ────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.entry-card {
			transition: none;
		}

		.entry-card:hover {
			transform: none;
		}
	}
</style>
