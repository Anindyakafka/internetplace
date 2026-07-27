<script lang="ts">
	import { browser } from '$app/environment';
	import { projects } from '$data/projects';
	import { indiaMap } from '$lib/actions/india-map';

	type RegionProject = {
		title: string;
		slug: string;
		year: number | string;
	};

	type Region = {
		id: string;
		name: string;
		projects: RegionProject[];
	};

	type StateStory = {
		title: string;
		subtitle: string;
		location: string;
		imageUrl: string;
		fallbackImageUrl?: string;
		bullets: string[];
		repoUrl?: string;
		repoLabel?: string;
	};

	type RegionMetric = {
		adivasiShare: number;
		scShare: number;
		densityIndex: number;
		households: number;
		population: number;
		elevation: number;
	};

	type SeccStateMetric = {
		households: number;
		population: number;
		scPopulation: number;
		stPopulation: number;
		scShare: number;
		stShare: number;
	};

	const regionNames: Record<string, string> = {
		MP: 'Madhya Pradesh',
		UP: 'Uttar Pradesh',
		WB: 'West Bengal',
		BR: 'Bihar',
		DL: 'Delhi',
		MH: 'Maharashtra',
		KA: 'Karnataka',
		RJ: 'Rajasthan',
		HR: 'Haryana'
	};

	const seccStateCodeByIso: Record<string, string> = {
		MP: '23',
		UP: '09',
		WB: '19',
		BR: '10',
		DL: '07',
		MH: '27',
		KA: '29',
		RJ: '08',
		HR: '06'
	};

	const fallbackMetrics: Record<string, RegionMetric> = {
		MP: { adivasiShare: 21.1, scShare: 15.6, densityIndex: 42, households: 0, population: 0, elevation: 0.74 },
		UP: { adivasiShare: 0.9, scShare: 21.1, densityIndex: 24, households: 0, population: 0, elevation: 0.26 },
		WB: { adivasiShare: 5.8, scShare: 23.5, densityIndex: 37, households: 0, population: 0, elevation: 0.48 },
		BR: { adivasiShare: 1.3, scShare: 16.3, densityIndex: 52, households: 0, population: 0, elevation: 0.58 },
		DL: { adivasiShare: 0.4, scShare: 18.0, densityIndex: 12, households: 0, population: 0, elevation: 0.18 },
		MH: { adivasiShare: 9.4, scShare: 12.3, densityIndex: 71, households: 0, population: 0, elevation: 0.82 },
		KA: { adivasiShare: 6.9, scShare: 17.2, densityIndex: 63, households: 0, population: 0, elevation: 0.76 },
		RJ: { adivasiShare: 13.5, scShare: 17.8, densityIndex: 55, households: 0, population: 0, elevation: 0.68 },
		HR: { adivasiShare: 0.0, scShare: 24.7, densityIndex: 21, households: 0, population: 0, elevation: 0.22 }
	};

	const stateStories: Partial<Record<string, StateStory>> = {
		MP: {
			title: 'Building Resilience through MGNREGA Assets',
			subtitle: 'Inclusion Economics India Centre (under Inclusion Economics at Yale University)',
			location: 'Barwani, Madhya Pradesh',
			imageUrl: '/images/states/barwani-map.svg',
			fallbackImageUrl: '/images/states/barwani-map-lite.svg',
			bullets: [
				'Directed a daily field team of 8 surveyors, 2 supervisors, 2 asset auditors, and 1 field manager across two states, running the operation independently with minimal supervision.',
				'Conducted high-frequency checks every day, reducing human and data-entry errors and keeping data quality strong for downstream causal analysis.',
				'Turned slow manual scraping into efficient, reusable pipelines transferable across systems and users, sharply reducing analysis turnaround time.',
				'Secured Letters of Support from district administration through direct stakeholder engagement and built durable relationships beyond the pilot.',
				'Built field operations from the ground up: CTO forms, protocols, hiring, and training; delivered pilot documentation that informed future evaluations of climate resilience outcomes.'
			]
		},
		WB: {
			title: 'West Bengal Electoral Rolls Data (2002 & 2026 SIR)',
			subtitle: 'Independent Research',
			location: 'West Bengal, India',
			imageUrl: '/images/states/west_bengal.svg',
			fallbackImageUrl: '/images/states/west_bengal-lite.svg',
			bullets: [
				'Built two end-to-end scraping pipelines; covering 2002-style booth-level electoral rolls and the 2026 Special Intensive Revision (SIR)/ASD rolls, converting tens of thousands of scattered booth-level PDFs into structured, analyzable electoral data for West Bengal.',
				'Delivered the structured dataset for use in the Bengal Biennale 2026, providing the data backbone for a public exhibition on the state\'s electoral history.',
				'Engineered the pipeline to survive real-world constraints, automatic retries, checksum-verified chunked releases, and resumable downloads, making a dataset too large for standard version control fully reusable for other researchers.'
			],
			repoUrl: 'https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002',
			repoLabel: 'Open GitHub repository'
		}
	};

	let seccCombined = $state<Record<string, SeccStateMetric> | null>(null);

	let hoveredRegionId = $state<string | null>(null);
	let selectedRegionId = $state<string | null>(null);
	let storyLoadToken = 0;
	let storyIsLoading = $state(false);
	let selectedStoryImageUrl = $state<string | null>(null);
	let mapScale = $state(2.2);
	let mapShiftX = $state(0);
	let mapShiftY = $state(0);
	let mapStageEl: HTMLElement | null = $state(null);

	let regions = $derived.by<Region[]>(() => {
		const ids = new Set<string>();
		ids.add('MP');
		projects.forEach((project) => project.regions?.forEach((id) => ids.add(id)));

		return Array.from(ids)
			.map((id) => ({
				id,
				name: regionNames[id] ?? id,
				projects: projects
					.filter((project) => project.regions?.includes(id))
					.map((project) => ({ title: project.title, slug: project.slug, year: project.year }))
			}))
			.sort((a, b) => b.projects.length - a.projects.length);
	});

	let activeRegion = $derived.by<Region | null>(() => {
		if (selectedRegionId) return regions.find((region) => region.id === selectedRegionId) ?? null;
		if (hoveredRegionId) return regions.find((region) => region.id === hoveredRegionId) ?? null;
		return null;
	});

	let activeRegionId = $derived.by<string | null>(() => selectedRegionId ?? hoveredRegionId);

	let activeRegionName = $derived.by<string | null>(() => {
		if (!activeRegionId) return null;
		return regionNames[activeRegionId] ?? activeRegionId;
	});

	let regionMetrics = $derived.by<Record<string, RegionMetric>>(() => {
		const activeRegionIds = regions.map((region) => region.id);
		if (!seccCombined) {
			return activeRegionIds.reduce<Record<string, RegionMetric>>((acc, regionId) => {
				acc[regionId] = fallbackMetrics[regionId] ?? {
					adivasiShare: 0,
					scShare: 0,
					densityIndex: 20,
					households: 0,
					population: 0,
					elevation: 0.2
				};
				return acc;
			}, {});
		}

		const stateRows = activeRegionIds
			.map((regionId) => {
				const seccCode = seccStateCodeByIso[regionId];
				return seccCode ? seccCombined[seccCode] : null;
			})
			.filter((row): row is SeccStateMetric => Boolean(row));

		const maxPopulation = Math.max(1, ...stateRows.map((row) => row.population));

		return activeRegionIds.reduce<Record<string, RegionMetric>>((acc, regionId) => {
			const seccCode = seccStateCodeByIso[regionId];
			const row = seccCode ? seccCombined[seccCode] : undefined;
			if (!row) {
				acc[regionId] = fallbackMetrics[regionId] ?? {
					adivasiShare: 0,
					scShare: 0,
					densityIndex: 20,
					households: 0,
					population: 0,
					elevation: 0.2
				};
				return acc;
			}

			const adivasiShare = row.stShare * 100;
			const scShare = row.scShare * 100;
			const densityIndex = Math.round((row.population / maxPopulation) * 100);
			const elevation = Math.min(1, Math.max(0.2, row.stShare * 1.25));

			acc[regionId] = {
				adivasiShare,
				scShare,
				densityIndex,
				households: row.households,
				population: row.population,
				elevation
			};
			return acc;
		}, {});
	});

	let activeMetric = $derived.by<RegionMetric | null>(() => {
		if (!activeRegionId) return null;
		return regionMetrics[activeRegionId] ?? null;
	});

	let selectedStory = $derived.by<StateStory | null>(() => {
		if (!selectedRegionId) return null;
		return stateStories[selectedRegionId] ?? null;
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
				// Keep fallback metrics when data file is unavailable.
			});

		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		const onScroll = () => {
			const doc = document.documentElement;
			const stageTop = mapStageEl?.offsetTop ?? 0;
			const stageHeight = mapStageEl?.offsetHeight ?? window.innerHeight * 3.4;

			const stageSpan = Math.max(1, stageHeight - window.innerHeight);
			const totalSpan = Math.max(1, doc.scrollHeight - window.innerHeight);
			const remainingPageSpan = Math.max(1, totalSpan - stageTop);
			const effectiveSpan = Math.min(stageSpan, remainingPageSpan);

			const withinStage = window.scrollY - stageTop;
			const progress = Math.max(0, Math.min(1, withinStage / effectiveSpan));

			// Keep the prior zoomed-in feel while allowing enough scroll to finish.
			const startScale = 1.72;
			const endScale = 0.98;
			mapScale = startScale + (endScale - startScale) * progress;

			mapShiftX = -6 + progress * 6;
			mapShiftY = 4 + progress * -6;
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	async function handleRegionClick(regionId: string) {
		if (selectedRegionId === regionId) {
			closeStory();
			return;
		}

		const story = stateStories[regionId];
		if (!story) {
			selectedRegionId = regionId;
			return;
		}

		const token = ++storyLoadToken;
		storyIsLoading = true;
		const loadedUrl = await resolveStoryImage(story);

		if (token !== storyLoadToken) return;
		selectedStoryImageUrl = loadedUrl;
		selectedRegionId = regionId;
		storyIsLoading = false;
	}

	function handleRegionHover(regionId: string | null) {
		hoveredRegionId = regionId;
	}

	function closeStory() {
		storyLoadToken += 1;
		storyIsLoading = false;
		selectedStoryImageUrl = null;
		selectedRegionId = null;
	}

	function preloadImage(src: string) {
		return new Promise<boolean>((resolve) => {
			let done = false;
			const finish = (ok: boolean) => {
				if (done) return;
				done = true;
				resolve(ok);
			};

			const img = new Image();
			img.onload = () => finish(true);
			img.onerror = () => finish(false);
			img.src = src;

			if (img.decode) {
				img.decode().then(() => finish(true)).catch(() => {
					// Keep waiting for onload/onerror when decode is unsupported for this asset.
				});
			}
		});
	}

	async function resolveStoryImage(story: StateStory) {
		const originalOk = await preloadImage(story.imageUrl);
		if (originalOk) return story.imageUrl;

		if (story.fallbackImageUrl) {
			const fallbackOk = await preloadImage(story.fallbackImageUrl);
			if (fallbackOk) return story.fallbackImageUrl;
		}

		return story.imageUrl;
	}
</script>

<svelte:head>
	<title>Anindya Singh</title>
	<meta
		name="description"
		content="Interactive map landing for research, writing, and projects by Anindya Singh."
	/>
</svelte:head>

<section class="map-stage" bind:this={mapStageEl}>
	<div class="map-sticky">
		<h1 class="landing-name">Anindya Singh</h1>

		<div
			class="map-zoom-shell"
			class:loading-story={storyIsLoading}
			style={`--map-scale: ${mapScale}; --map-shift-x: ${mapShiftX}%; --map-shift-y: ${mapShiftY}%;`}
		>
			<div
				class="india-map"
				role="img"
				aria-label="Interactive India map"
				use:indiaMap={{
					regions,
					svgUrl: '/assets/india.svg',
					onRegionClick: handleRegionClick,
					onRegionHover: handleRegionHover,
					interactiveAll: true
				}}
			></div>

		</div>

		{#if activeRegionName && activeMetric}
			<div class="hover-hud" aria-live="polite">
				<p class="hud-region">{activeRegionName}</p>
				<div class="hud-bars" aria-hidden="true">
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.8)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.9)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.74)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.65)}%`}></span>
				</div>
				<p class="hud-value">Adivasi {activeMetric.adivasiShare.toFixed(1)}%</p>
				<p class="hud-value">SC {activeMetric.scShare.toFixed(1)}%</p>
				<p class="hud-value">Density {activeMetric.densityIndex}</p>
				<p class="hud-value">Pop {activeMetric.population.toLocaleString('en-IN')}</p>
			</div>
		{/if}

		{#if selectedStory}
			<div class="state-story-scene" style={`--story-image: url(${selectedStoryImageUrl ?? selectedStory.imageUrl});`}>
				<div class="state-story-scrim"></div>
				<article class="state-story-content" aria-label={`${selectedStory.location} field story`}>
					<button class="story-close" type="button" aria-label="Close" onclick={closeStory}>×</button>
					<p class="story-kicker">Inclusion Economics India Centre</p>
					<h2>{selectedStory.title}</h2>
					<p class="story-subtitle">{selectedStory.subtitle}</p>
					<p class="story-location">{selectedStory.location}</p>
					<ul>
						{#each selectedStory.bullets as bullet}
							<li>{bullet}</li>
						{/each}
					</ul>
					{#if selectedStory.repoUrl}
						<p class="story-repo">
							<a href={selectedStory.repoUrl} target="_blank" rel="noreferrer noopener">
								{selectedStory.repoLabel ?? 'Repository'}
							</a>
						</p>
					{/if}
				</article>
			</div>
		{/if}

		{#if storyIsLoading}
			<div class="story-loading" aria-live="polite">Loading field view…</div>
		{/if}

		{#if !selectedStory && !storyIsLoading}
			<p class="map-instruction">Click a state and wait a moment for its story to load.</p>
		{/if}
	</div>
</section>

<style>
	.map-stage {
		height: 340vh;
		background:
			radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--color-accent-soft) 36%, transparent), transparent 45%),
			radial-gradient(circle at 88% 84%, color-mix(in srgb, var(--color-accent-soft) 28%, transparent), transparent 34%),
			var(--color-bg);
		margin-top: -64px;
	}

	.map-sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		display: grid;
		place-items: center;
	}

	.landing-name {
		position: absolute;
		top: clamp(1.9rem, 5.5vw, 3rem);
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(1.5rem, 3.4vw, 2.6rem);
		letter-spacing: -0.02em;
		z-index: 8;
		text-shadow: 0 6px 28px rgba(0, 0, 0, 0.34);
	}

	.map-zoom-shell {
		width: min(94vw, 78rem);
		height: min(96vh, 58rem);
		display: grid;
		place-items: center;
	}

	.map-zoom-shell.loading-story {
		cursor: progress;
	}

	.india-map {
		width: min(69rem, 95vw);
		transform: translate(var(--map-shift-x), var(--map-shift-y)) scale(var(--map-scale));
		transform-origin: 52% 56%;
		transition: transform 140ms linear;
		filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.28));
	}

	.story-repo {
		margin-top: 0.45rem;
	}

	.story-repo a {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.65rem;
		border-radius: 999px;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--color-text);
		border: 1px solid color-mix(in srgb, var(--color-border) 66%, transparent);
		background: color-mix(in srgb, var(--color-surface) 64%, transparent);
	}

	.story-repo a:hover {
		border-color: var(--color-border-strong);
	}

	.hover-hud {
		position: absolute;
		top: clamp(5.5rem, 10vw, 7.6rem);
		right: clamp(0.9rem, 2vw, 1.7rem);
		width: min(15rem, 44vw);
		padding: var(--space-s);
		border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--color-surface) 90%, transparent);
		backdrop-filter: blur(5px);
		z-index: 10;
	}

	.hud-region {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.45rem;
	}

	.hud-bars {
		height: 3.8rem;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		align-items: end;
		gap: 0.35rem;
		margin-bottom: 0.5rem;
	}

	.hud-bars span {
		display: block;
		border-radius: 0.35rem 0.35rem 0 0;
		background: color-mix(in srgb, var(--color-accent) 64%, transparent);
	}

	.hud-value {
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.state-story-scene {
		position: absolute;
		inset: 0;
		background-image: var(--story-image);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 15;
		animation: fadeIn 220ms ease forwards;
	}

	.state-story-scrim {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 12% 16%, rgba(0, 0, 0, 0.18), transparent 44%),
			radial-gradient(circle at 88% 86%, rgba(0, 0, 0, 0.26), transparent 40%),
			rgba(0, 0, 0, 0.34);
	}

	.state-story-content {
		position: absolute;
		right: clamp(0.85rem, 2.4vw, 2rem);
		top: clamp(4.7rem, 10vh, 6.2rem);
		width: min(40rem, 48vw);
		max-height: calc(100vh - 7.4rem);
		padding: clamp(0.95rem, 2vw, 1.45rem);
		overflow: auto;
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--color-surface) 72%, transparent);
		backdrop-filter: blur(10px) saturate(110%);
		border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
		z-index: 16;
		animation: riseIn 300ms ease forwards;
		display: grid;
		align-content: start;
		gap: 0.55rem;
	}

	.story-close {
		position: absolute;
		top: 0.62rem;
		right: 0.62rem;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--color-border) 66%, transparent);
		background: color-mix(in srgb, var(--color-surface) 88%, transparent);
		color: var(--color-text);
		font-size: 1.15rem;
		line-height: 1;
		cursor: pointer;
		z-index: 2;
	}

	.story-kicker {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.state-story-content h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.3rem, 2.2vw, 1.9rem);
		line-height: 1.18;
	}

	.story-subtitle,
	.story-location {
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.state-story-content ul {
		margin: 0.35rem 0 0;
		padding-left: 1rem;
		display: grid;
		gap: 0.52rem;
	}

	.state-story-content li {
		font-size: var(--step--1);
		line-height: 1.45;
	}

	.story-loading {
		position: absolute;
		bottom: 1.1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: color-mix(in srgb, var(--color-surface) 82%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-border) 64%, transparent);
		color: var(--color-text-muted);
		backdrop-filter: blur(5px);
		z-index: 20;
	}

	.map-instruction {
		position: absolute;
		bottom: 1.1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.5rem 0.85rem;
		border-radius: 999px;
		font-size: var(--step--2);
		font-family: var(--font-mono);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background: color-mix(in srgb, var(--color-surface) 84%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-border) 62%, transparent);
		backdrop-filter: blur(5px);
		z-index: 9;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes riseIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0px);
		}
	}

	@media (max-width: 900px) {
		.map-stage {
			height: 305vh;
			margin-top: -64px;
		}

		.map-zoom-shell {
			width: 100vw;
			height: 90vh;
		}

		.india-map {
			transform-origin: 50% 60%;
		}

		.hover-hud {
			top: auto;
			bottom: 1.2rem;
			right: 0.8rem;
			width: min(13rem, 56vw);
		}

		.state-story-content {
			left: 50%;
			right: auto;
			top: auto;
			bottom: 1rem;
			transform: translateX(-50%);
			width: min(94vw, 34rem);
			max-height: 63vh;
		}

		.map-instruction {
			max-width: 92vw;
			text-align: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.india-map {
			transition: none;
		}

		.state-story-content,
		.state-story-scene {
			animation: none;
		}
	}
</style>
