<script lang="ts">
	import { browser } from '$app/environment';
	import { reveal } from '$lib/actions/reveal';
	import { indiaMap } from '$lib/actions/india-map';
	import { projects } from '$data/projects';
	import { goto } from '$app/navigation';

	type Region = {
		id: string;
		name: string;
		projects: Array<{ title: string; slug: string; blurb: string; year: string; categories: string[] }>;
	};

	type SeccStateMetric = {
		households: number;
		population: number;
		scPopulation: number;
		stPopulation: number;
		scShare: number;
		stShare: number;
	};

	type RegionMetric = {
		scShare: number;
		stShare: number;
		households: number;
		population: number;
		densityIndex: number;
		elevation: number;
	};

	let selectedRegion = $state<Region | null>(null);
	let hoveredRegionId = $state<string | null>(null);
	let searchQuery = $state('');
	let seccCombined = $state<Record<string, SeccStateMetric> | null>(null);

	const seccStateCodeByIso: Record<string, string> = {
		UP: '09',
		WB: '19',
		BR: '10',
		DL: '07',
		MH: '27',
		KA: '29',
		RJ: '08',
		HR: '06'
	};

	// Build regions list directly from project metadata.
	// Each project's `regions` field is the source of truth for geography.
	let regions = $derived.by<Region[]>(() => {
		const regionIds = new Set<string>();
		projects.forEach((p) => p.regions?.forEach((r) => regionIds.add(r)));

		return Array.from(regionIds)
			.map((regionId) => {
				const relatedProjects = projects
					.filter((p) => p.regions?.includes(regionId))
					.map((p) => ({
						title: p.title,
						slug: p.slug,
						blurb: p.blurb,
						year: p.year.toString(),
						categories: p.categories
					}));

				return {
					id: regionId,
					name: getRegionName(regionId),
					projects: relatedProjects
				};
			})
			.sort((a, b) => b.projects.length - a.projects.length);
	});

	// Filter regions based on search
	let filteredRegions = $derived.by<Region[]>(() => {
		if (!searchQuery.trim()) return regions;

		const query = searchQuery.toLowerCase();
		return regions.filter(
			(region) =>
				region.name.toLowerCase().includes(query) ||
				region.projects.some(
					(proj) =>
						proj.title.toLowerCase().includes(query) ||
						proj.blurb.toLowerCase().includes(query)
				)
		);
	});

	let regionMetrics = $derived.by<Record<string, RegionMetric>>(() => {
		if (!seccCombined) return {};

		const rows = regions
			.map((region) => seccCombined[seccStateCodeByIso[region.id]])
			.filter((row): row is SeccStateMetric => Boolean(row));
		const maxPopulation = Math.max(1, ...rows.map((row) => row.population));

		return regions.reduce<Record<string, RegionMetric>>((acc, region) => {
			const row = seccCombined[seccStateCodeByIso[region.id]];
			if (!row) return acc;

			acc[region.id] = {
				scShare: row.scShare * 100,
				stShare: row.stShare * 100,
				households: row.households,
				population: row.population,
				densityIndex: Math.round((row.population / maxPopulation) * 100),
				elevation: Math.min(1, Math.max(0.2, row.stShare * 1.25))
			};
			return acc;
		}, {});
	});

	$effect(() => {
		if (!browser) return;
		let cancelled = false;

		fetch('/data/secc_state_summary.json')
			.then((response) => (response.ok ? response.json() : null))
			.then((payload) => {
				if (cancelled || !payload?.states?.combined) return;
				seccCombined = payload.states.combined as Record<string, SeccStateMetric>;
			})
			.catch(() => {
				// Keep map usable even if summary file is absent.
			});

		return () => {
			cancelled = true;
		};
	});

	function getRegionName(regionId: string): string {
		const names: Record<string, string> = {
			'UP': 'Uttar Pradesh',
			'WB': 'West Bengal',
			'BR': 'Bihar',
			'DL': 'Delhi',
			'MH': 'Maharashtra',
			'KA': 'Karnataka',
			'RJ': 'Rajasthan',
			'HR': 'Haryana'
		};
		return names[regionId] || regionId;
	}

	function handleRegionClick(regionId: string) {
		const region = regions.find(r => r.id === regionId);
		if (region && region.projects.length > 0) {
			selectedRegion = region;
		}
	}

	function handleRegionHover(regionId: string | null) {
		hoveredRegionId = regionId;
	}

	function clearSelection() {
		selectedRegion = null;
	}

	function navigateToProject(slug: string) {
		goto(`/work/${slug}`);
	}

	function getRegionElevation(regionId: string): number {
		return regionMetrics[regionId]?.elevation ?? 0.2;
	}
</script>

<svelte:head>
	<title>Map — Geographic Distribution of Work</title>
	<meta
		name="description"
		content="Interactive map showing geographic distribution of research and data science projects across India."
	/>
</svelte:head>

<div class="map-page">
	<!-- ═══════════════════════════════════════════════
	     MAP HERO
	     ═══════════════════════════════════════════════ -->
	<section class="map-hero">
		<div class="hero-content">
			<h1 class="map-title">The Map</h1>
			<p class="map-subtitle">
				Geographic distribution of work across India.
				<span class="map-meta">{regions.length} regions with active projects</span>
			</p>
		</div>

		<!-- Search Bar -->
		<div class="map-search">
			<input
				type="text"
				placeholder="Search regions or projects..."
				bind:value={searchQuery}
				class="search-input"
				aria-label="Search regions or projects"
			/>
			{#if searchQuery}
				<button
					class="search-clear"
					onclick={() => (searchQuery = '')}
					aria-label="Clear search"
				>
					✕
				</button>
			{/if}
		</div>
	</section>

	<!-- ═══════════════════════════════════════════════
	     MAP VISUALIZATION
	     ═══════════════════════════════════════════════ -->
	<section class="map-visualization">
		<div class="map-container">
			<!-- India SVG Map -->
			<div class="india-map-wrapper">
				<div
				class="india-map"
				role="img"
				aria-label="India map with clickable regions"
				use:indiaMap={{
					regions,
					svgUrl: '/assets/india.svg',
					onRegionClick: handleRegionClick,
					onRegionHover: handleRegionHover,
					getRegionElevation
				}}
				></div>
			</div>

			<!-- Legend -->
			<div class="map-legend">
				<h3 class="legend-title">Legend</h3>
				<div class="legend-items">
					<div class="legend-item">
						<span class="legend-color legend-active"></span>
						<span class="legend-label">Active region ({regions.length})</span>
					</div>
					<div class="legend-item">
						<span class="legend-color legend-inactive"></span>
						<span class="legend-label">Inactive region</span>
					</div>
				</div>
			</div>
		</div>

		<!-- ═══════════════════════════════════════════════
		     SIDEBAR - REGION DETAILS
		     ═══════════════════════════════════════════════ -->
		<aside class="map-sidebar">
			{#if selectedRegion}
				<div class="region-details">
					<button class="back-button" onclick={clearSelection}>
						← Back to map
					</button>
					
					<h2 class="region-name">{selectedRegion.name}</h2>
					<p class="region-count">
						{selectedRegion.projects.length} project{selectedRegion.projects.length !== 1 ? 's' : ''}
					</p>
					{#if regionMetrics[selectedRegion.id]}
						<p class="region-count">ST {regionMetrics[selectedRegion.id].stShare.toFixed(1)}% · SC {regionMetrics[selectedRegion.id].scShare.toFixed(1)}%</p>
						<p class="region-count">Pop {regionMetrics[selectedRegion.id].population.toLocaleString('en-IN')}</p>
					{/if}

					<ul class="region-projects">
						{#each selectedRegion.projects as project}
							<li class="project-card">
								<a
									href={`/work/${project.slug}`}
									class="project-link"
									onclick={(e) => {
										e.preventDefault();
										navigateToProject(project.slug);
									}}
								>
									<span class="project-year">{project.year}</span>
									<h3 class="project-title">{project.title}</h3>
									<p class="project-blurb">{project.blurb}</p>
									<div class="project-tags">
										{#each project.categories as cat}
											<span class="tag">{cat}</span>
										{/each}
									</div>
									<span class="project-arrow" aria-hidden="true">→</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else if hoveredRegionId}
				{#if filteredRegions.find(r => r.id === hoveredRegionId)}
					{@const hoveredRegion = filteredRegions.find(r => r.id === hoveredRegionId)!}
					<div class="region-preview">
						<h3 class="preview-name">{hoveredRegion.name}</h3>
						<p class="preview-count">
							{hoveredRegion.projects.length} project{hoveredRegion.projects.length !== 1 ? 's' : ''}
						</p>
						{#if regionMetrics[hoveredRegion.id]}
							<p class="preview-count">ST {regionMetrics[hoveredRegion.id].stShare.toFixed(1)}%</p>
						{/if}
						{#if hoveredRegion.projects.length > 0}
							<p class="preview-projects">
								{hoveredRegion.projects.map(p => p.title).join(', ')}
							</p>
						{/if}
					</div>
				{/if}
			{:else}
				<div class="region-guide">
					<h3 class="guide-title">Explore by Region</h3>
					<p class="guide-text">
						Click on any active region to view projects located there. Search or browse the full list below.
					</p>

					<h4 class="regions-list-title">Active Regions</h4>
					<ul class="regions-list">
						{#each filteredRegions as region}
							<li class="region-item">
								<button
									class="region-button"
									onclick={() => handleRegionClick(region.id)}
								onmouseenter={() => handleRegionHover(region.id)}
								onmouseleave={() => handleRegionHover(null)}
									class:hovered={hoveredRegionId === region.id}
								>
									<span class="region-item-name">{region.name}</span>
									<span class="region-item-count">{region.projects.length}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

				<div class="sidebar-extras">
					<div class="sidebar-compact-header">
						<span class="sidebar-kicker">Browse all regions</span>
						<span class="sidebar-note">{filteredRegions.length} matched</span>
					</div>

					<div class="region-grid region-grid--compact">
						{#each filteredRegions as region}
							<button
								class="region-card"
								onclick={() => handleRegionClick(region.id)}
								class:empty={region.projects.length === 0}
								disabled={region.projects.length === 0}
							>
								<span class="region-card-name">{region.name}</span>
								<span class="region-card-badge">{region.projects.length} projects</span>
							</button>
						{/each}
					</div>

					<p class="sidebar-footer-text">
						Working on something in a new region?
						<a href="mailto:hello@anindyasingh.dev">Let's collaborate</a>.
					</p>
				</div>
		</aside>
	</section>
</div>

<style>
	/* ═══ MAP PAGE LAYOUT ═══ */
	.map-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-bottom: var(--space-2xl);
		background:
			radial-gradient(circle at top left, color-mix(in srgb, var(--color-accent-soft) 20%, transparent), transparent 32rem),
			linear-gradient(to bottom, var(--color-bg), var(--color-surface));
	}

	/* ═══ MAP HERO ═══ */
	.map-hero {
		padding: var(--space-xl) 0 var(--space-l);
		border-bottom: 1px solid var(--color-border);
	}

	.hero-content {
		max-width: var(--measure-wide);
		margin-bottom: var(--space-lg);
	}

	.map-title {
		font-family: var(--font-serif);
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1.1;
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-m);
		color: var(--color-text);
	}

	.map-subtitle {
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--color-text-muted);
		max-width: var(--measure);
	}

	.map-meta {
		display: block;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		opacity: 0.8;
		margin-top: var(--space-s);
	}

	/* ═══ SEARCH BAR ═══ */
	.map-search {
		position: relative;
		max-width: var(--measure);
	}

	.search-input {
		width: 100%;
		padding: var(--space-m) var(--space-l);
		font-size: var(--step-0);
		font-family: var(--font-sans);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		color: var(--color-text);
		transition: border-color var(--transition), box-shadow var(--transition);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-accent-soft);
	}

	.search-input::placeholder {
		color: var(--color-text-muted);
		opacity: 0.7;
	}

	.search-clear {
		position: absolute;
		right: var(--space-m);
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-size: 1.25rem;
		cursor: pointer;
		padding: var(--space-2xs);
		line-height: 1;
		transition: color var(--transition);
	}

	.search-clear:hover {
		color: var(--color-text);
	}

	/* ═══ MAP VISUALIZATION LAYOUT ═══ */
	.map-visualization {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: var(--space-xl);
		padding: var(--space-xl) 0 var(--space-2xl);
		align-items: start;
	}

	.map-container {
		position: sticky;
		top: var(--space-xl);
	}

	.india-map-wrapper {
		position: relative;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.india-map {
		width: 100%;
		height: auto;
		display: block;
	}

	/* ═══ LEGEND ═══ */
	.map-legend {
		margin-top: var(--space-lg);
		padding: var(--space-lg);
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.legend-title {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-m);
	}

	.legend-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}

	.legend-active {
		background: var(--color-accent);
	}

	.legend-inactive {
		background: var(--color-border);
		opacity: 0.3;
	}

	/* ═══ SIDEBAR ═══ */
	.map-sidebar {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
		border: 1px solid var(--color-border);
		max-height: calc(100vh - var(--space-xl));
		overflow-y: auto;
		position: sticky;
		top: var(--space-xl);
	}

	/* ═══ REGION DETAILS (SIDEBAR) ═══ */
	.region-details {
		animation: fadeUp 0.3s ease-out;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-xs) var(--space-s);
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		cursor: pointer;
		transition: color var(--transition);
		margin-bottom: var(--space-l);
	}

	.back-button:hover {
		color: var(--color-accent);
	}

	.region-name {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 400;
		color: var(--color-text);
		margin-bottom: var(--space-xs);
		line-height: 1.2;
	}

	.region-count {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		margin-bottom: var(--space-l);
	}

	.region-projects {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}

	.project-card {
		padding: var(--space-m);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
		border-color: var(--color-accent-soft);
	}

	.project-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.project-year {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--color-text-muted);
		margin-bottom: var(--space-2xs);
		display: block;
	}

	.project-title {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		font-weight: 500;
		color: var(--color-text);
		margin-bottom: var(--space-xs);
		line-height: 1.3;
	}

	.project-blurb {
		font-size: var(--step-0);
		color: var(--color-text-muted);
		line-height: 1.5;
		margin-bottom: var(--space-s);
	}

	.project-tags {
		display: flex;
		gap: var(--space-2xs);
		flex-wrap: wrap;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.2em 0.5em;
		background: var(--color-accent-soft);
		color: var(--color-accent);
		border-radius: var(--radius);
	}

	.project-arrow {
		float: right;
		font-size: var(--step-1);
		color: var(--color-accent);
		opacity: 0;
		transition: opacity var(--transition), transform var(--transition);
	}

	.project-card:hover .project-arrow {
		opacity: 1;
		transform: translateX(4px);
	}

	/* ═══ REGION PREVIEW (HOVER) ═══ */
	.region-preview {
		animation: fadeUp 0.2s ease-out;
	}

	.preview-name {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 400;
		color: var(--color-text);
		margin-bottom: var(--space-2xs);
		line-height: 1.2;
	}

	.preview-count {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		margin-bottom: var(--space-s);
	}

	.preview-projects {
		font-size: var(--step-0);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	/* ═══ REGION GUIDE (DEFAULT SIDEBAR) ═══ */
	.region-guide {
		animation: fadeUp 0.3s ease-out;
	}

	.sidebar-extras {
		margin-top: var(--space-l);
		padding-top: var(--space-l);
		border-top: 1px solid var(--color-border);
	}

	.sidebar-compact-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-s);
		margin-bottom: var(--space-s);
	}

	.sidebar-kicker {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
	}

	.sidebar-note {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--color-text-muted);
	}

	.guide-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 400;
		color: var(--color-text);
		margin-bottom: var(--space-m);
		line-height: 1.2;
	}

	.guide-text {
		font-size: var(--step-0);
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-xl);
	}

	.regions-list-title {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-m);
	}

	.regions-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.region-item {
		display: flex;
		align-items: center;
	}

	.region-button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-s) var(--space-m);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: calc(var(--radius-lg) - 2px);
		cursor: pointer;
		transition: background var(--transition), border-color var(--transition), transform var(--transition);
		font-family: var(--font-sans);
		font-size: var(--step-0);
		color: var(--color-text);
		text-align: left;
	}

	.region-button:hover {
		background: var(--color-surface);
		border-color: var(--color-accent);
		transform: translateX(4px);
	}

	.region-button.hovered {
		background: var(--color-surface);
		border-color: var(--color-accent);
		transform: translateX(4px);
	}

	.region-item-name {
		font-weight: 500;
	}

	.region-item-count {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		background: var(--color-accent-soft);
		padding: 0.2em 0.5em;
		border-radius: var(--radius-lg);
	}

	/* ═══ REGION GRID SECTION ═══ */
	.region-grid-section {
		padding: var(--space-xl) 0;
		border-top: 1px solid var(--color-border);
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 400;
		color: var(--color-text);
		margin-bottom: var(--space-l);
		line-height: 1.2;
	}

	.region-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: var(--space-m);
	}

	.region-grid--compact {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-s);
	}

	.region-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-l);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
		font-family: var(--font-sans);
		font-size: var(--step-0);
		color: var(--color-text);
		text-align: left;
	}

	.region-card:hover:not(.empty) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
		border-color: var(--color-accent);
	}

	.region-card.empty {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.region-card-name {
		font-weight: 500;
		margin-bottom: var(--space-xs);
	}

	.region-card-badge {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	/* ═══ MAP FOOTER ═══ */
	.sidebar-footer-text {
		margin-top: var(--space-l);
		font-size: var(--step-0);
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.sidebar-footer-text a {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid var(--color-accent-soft);
		transition: color var(--transition), border-color var(--transition);
	}

	.sidebar-footer-text a:hover {
		color: var(--color-accent-hover);
		border-color: var(--color-accent);
	}

	/* ═══ RESPONSIVE ═══ */
	@media (max-width: 1024px) {
		.map-visualization {
			grid-template-columns: 1fr;
			padding-bottom: var(--space-xl);
		}

		.map-container {
			position: relative;
			top: 0;
		}

		.map-sidebar {
			position: relative;
			top: 0;
			max-height: 60vh;
		}

		.region-grid--compact {
			grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		}
	}

	@media (max-width: 768px) {
		.map-hero {
			padding: var(--space-xl) 0 var(--space-m);
		}

		.map-title {
			font-size: clamp(2rem, 6vw, 3rem);
		}

		.map-subtitle {
			font-size: var(--step-0);
		}

		.map-visualization {
			padding: var(--space-l) 0;
			gap: var(--space-l);
		}

		.region-grid {
			grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		}

		.region-grid--compact {
			grid-template-columns: 1fr;
		}

		.region-card {
			padding: var(--space-m);
		}
	}

	@media (max-width: 640px) {
		.map-visualization {
			grid-template-columns: 1fr;
		}

		.map-sidebar {
			max-height: none;
		}

		.region-grid {
			grid-template-columns: 1fr;
		}

		.project-card {
			padding: var(--space-m);
		}
	}

	/* ═══ REDUCED MOTION ═══ */
	@media (prefers-reduced-motion: reduce) {
		.region-card,
		.region-button,
		.project-card,
		.region-details,
		.region-preview,
		.region-guide {
			transition: none;
			animation: none;
		}

		@keyframes fadeUp {
			from {
				opacity: 1;
				transform: none;
			}
			to {
				opacity: 1;
				transform: none;
			}
		}
	}
</style>