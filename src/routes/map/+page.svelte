<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { projects } from '$data/projects';
	import { page } from '$app/stores';

	type Region = {
		id: string;
		name: string;
		projects: Array<{ title: string; slug: string; blurb: string; year: string; categories: string[] }>;
	};

	// Project-location mapping
	const regionMap: Record<string, string[]> = {
		'UP': ['dadri-forecast'],
		'WB': ['electoral-rolls-wb-2002'],
		'BH': ['mgnrega-assets-bihar'],
		'DL': ['cbfc-watch'],
		'MH': ['sounding-names-religion', 'name-ethnicity-detector'],
		'KA': ['netcdf-manipulation-conversion'],
		'RJ': ['dadri-forecast'],
		'HR': ['dadri-forecast']
	};

	let selectedRegion = $state<Region | null>(null);
	let hoveredRegionId = $state<string | null>(null);
	let searchQuery = $state('');

	// Build regions list from project data
	let regions = $derived<Region[]>(() => {
		const regionSet = new Set<string>();
		
		// Collect all regions from mapped projects
		Object.values(regionMap).forEach(slugs => {
			slugs.forEach(slug => {
				const proj = projects.find(p => p.slug === slug);
				if (proj?.regions) {
					proj.regions.forEach(r => regionSet.add(r));
				}
			});
		});

		// Build region objects
		const regionList: Region[] = Array.from(regionSet).map(regionId => {
			const relatedProjects = projects.filter(p => 
				p.regions?.includes(regionId)
			).map(p => ({
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
		});

		// Sort by project count (most active first)
		return regionList.sort((a, b) => b.projects.length - a.projects.length);
	});

	// Filter regions based on search
	let filteredRegions = $derived(() => {
		if (!searchQuery.trim()) return regions;
		
		const query = searchQuery.toLowerCase();
		return regions.filter(region =>
			region.name.toLowerCase().includes(query) ||
			region.projects.some(proj =>
				proj.title.toLowerCase().includes(query) ||
				proj.blurb.toLowerCase().includes(query)
			)
		);
	});

	function getRegionName(regionId: string): string {
		const names: Record<string, string> = {
			'UP': 'Uttar Pradesh',
			'WB': 'West Bengal',
			'BH': 'Bihar',
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

	function handleRegionMouseEnter(regionId: string) {
		hoveredRegionId = regionId;
	}

	function handleRegionMouseLeave() {
		hoveredRegionId = null;
	}

	function clearSelection() {
		selectedRegion = null;
	}

	function navigateToProject(slug: string) {
		window.location.href = `/work/${slug}`;
	}
</script>

<svelte:head>
	<title>Map — Geographic Distribution of Work</title>
	<meta
		name="description"
		content="Interactive map showing geographic distribution of research and data science projects across India."
	/>
</svelte:head>

<div class="map-page" use:reveal>
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
				<img
					src="/images/india-map.svg"
					alt="India map with clickable regions"
					class="india-map"
					use:indiaMap={{ regions, onRegionClick: handleRegionClick, onRegionHover: handleRegionMouseEnter, onRegionLeave: handleRegionMouseLeave }}
				/>
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
									onmouseenter={() => handleRegionMouseEnter(region.id)}
									onmouseleave={handleRegionMouseLeave}
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
		</aside>
	</section>

	<!-- ═══════════════════════════════════════════════
	     REGION LIST (ALTERNATE VIEW)
	     ═══════════════════════════════════════════════ -->
	<section class="region-grid-section">
		<h2 class="section-title">All Regions</h2>
		<div class="region-grid">
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
	</section>

	<!-- ═══════════════════════════════════════════════
	     FOOTER CTA
	     ═══════════════════════════════════════════════ -->
	<section class="map-footer">
		<div class="footer-content">
			<p class="footer-text">
				Working on something in a new region? 
				<a href="mailto:hello@anindyasingh.dev">Let's collaborate</a>.
			</p>
		</div>
	</section>
</div>

<style>
	/* ═══ MAP PAGE LAYOUT ═══ */
	.map-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ═══ MAP HERO ═══ */
	.map-hero {
		padding: var(--space-2xl) 0 var(--space-lg);
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
		margin-bottom: var(--space-md);
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
		margin-top: var(--space-sm);
	}

	/* ═══ SEARCH BAR ═══ */
	.map-search {
		position: relative;
		max-width: var(--measure);
	}

	.search-input {
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		padding-right: {searchQuery ? '3.5rem' : 'var(--space-lg)'};
		font-size: var(--step-0);
		font-family: var(--font-sans);
		border: 1px solid var(--color-border);
		border-radius: 8px;
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
		right: var(--space-md);
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
		padding: var(--space-xl) 0;
		align-items: start;
	}

	.map-container {
		position: sticky;
		top: var(--space-xl);
	}

	.india-map-wrapper {
		position: relative;
		background: var(--color-surface);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.india-map {
		width: 100%;
		height: auto;
		display: block;
	}

	.india-map path {
		cursor: pointer;
		transition: fill var(--transition), opacity var(--transition);
	}

	.india-map path:hover {
		opacity: 0.8;
	}

	/* ═══ LEGEND ═══ */
	.map-legend {
		margin-top: var(--space-lg);
		padding: var(--space-lg);
		background: var(--color-surface);
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.legend-title {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.legend-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
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
		border-radius: 12px;
		padding: var(--space-lg);
		border: 1px solid var(--color-border);
		max-height: calc(100vh - var(--space-2xl));
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
		padding: var(--space-xs) var(--space-sm);
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		cursor: pointer;
		transition: color var(--transition);
		margin-bottom: var(--space-lg);
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
		margin-bottom: var(--space-lg);
	}

	.region-projects {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.project-card {
		padding: var(--space-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
		margin-bottom: var(--space-sm);
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
		border-radius: 4px;
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
		margin-bottom: var(--space-sm);
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

	.guide-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 400;
		color: var(--color-text);
		margin-bottom: var(--space-md);
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
		margin-bottom: var(--space-md);
	}

	.regions-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
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
		padding: var(--space-sm) var(--space-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 6px;
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
		border-radius: 12px;
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
		margin-bottom: var(--space-lg);
		line-height: 1.2;
	}

	.region-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: var(--space-md);
	}

	.region-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
		font-family: var(--font-sans);
		font-size: var(--step-0);
		color: var(--color-text);
		text-align: left;
	}

	.region-card:hover:not(.empty) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
	.map-footer {
		padding: var(--space-2xl) 0 var(--space-3xl);
		border-top: 1px solid var(--color-border);
		margin-top: auto;
	}

	.footer-content {
		max-width: var(--measure-wide);
	}

	.footer-text {
		font-size: var(--step-1);
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.footer-text a {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid var(--color-accent-soft);
		transition: color var(--transition), border-color var(--transition);
	}

	.footer-text a:hover {
		color: var(--color-accent-hover);
		border-color: var(--color-accent);
	}

	/* ═══ RESPONSIVE ═══ */
	@media (max-width: 1024px) {
		.map-visualization {
			grid-template-columns: 1fr;
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
	}

	@media (max-width: 768px) {
		.map-hero {
			padding: var(--space-xl) 0 var(--space-md);
		}

		.map-title {
			font-size: clamp(2rem, 6vw, 3rem);
		}

		.map-subtitle {
			font-size: var(--step-0);
		}

		.map-visualization {
			padding: var(--space-lg) 0;
			gap: var(--space-lg);
		}

		.region-grid {
			grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		}

		.region-card {
			padding: var(--space-md);
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
			padding: var(--space-md);
		}
	}

	/* ═══ REDUCED MOTION ═══ */
	@media (prefers-reduced-motion: reduce) {
		.india-map path {
			transition: none;
		}

		.region-card,
		.region-button,
		.project-card,
		.region-details,
		.region-preview {
			transition: none;
			animation: none;
		}

		@keyframes fadeUp {
			none;
		}
	}
</style>