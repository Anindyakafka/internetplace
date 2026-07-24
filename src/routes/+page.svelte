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
		bullets: string[];
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
			bullets: [
				'Directed a daily field team of 8 surveyors, 2 supervisors, 2 asset auditors, and 1 field manager across two states, running the operation independently with minimal supervision.',
				'Conducted high-frequency checks every day, reducing human and data-entry errors and keeping data quality strong for downstream causal analysis.',
				'Turned slow manual scraping into efficient, reusable pipelines transferable across systems and users, sharply reducing analysis turnaround time.',
				'Secured Letters of Support from district administration through direct stakeholder engagement and built durable relationships beyond the pilot.',
				'Built field operations from the ground up: CTO forms, protocols, hiring, and training; delivered pilot documentation that informed future evaluations of climate resilience outcomes.'
			]
		}
	};

	let seccCombined = $state<Record<string, SeccStateMetric> | null>(null);

	let hoveredRegionId = $state<string | null>(null);
	let selectedRegionId = $state<string | null>(null);
	let mapScale = $state(2.2);
	let mapShiftX = $state(0);
	let mapShiftY = $state(0);

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
			const max = window.innerHeight * 2.1;
			const progress = Math.max(0, Math.min(1, window.scrollY / max));
			mapScale = 2.45 - progress * 1.7;
			mapShiftX = -14 + progress * 14;
			mapShiftY = 8 - progress * 8;
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	function handleRegionClick(regionId: string) {
		selectedRegionId = selectedRegionId === regionId ? null : regionId;
	}

	function handleRegionHover(regionId: string | null) {
		hoveredRegionId = regionId;
	}

	function getRegionElevation(regionId: string) {
		return regionMetrics[regionId]?.elevation ?? 0.2;
	}

	function closeStory() {
		selectedRegionId = null;
	}
</script>

<svelte:head>
	<title>Anindya Singh</title>
	<meta
		name="description"
		content="Interactive map landing for research, writing, and projects by Anindya Singh."
	/>
</svelte:head>

<section class="map-stage">
	<div class="map-sticky">
		<h1 class="landing-name">Anindya Singh</h1>

		<div
			class="map-zoom-shell"
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
					getRegionElevation,
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
			<div class="state-story-backdrop" role="presentation" onclick={closeStory}></div>
			<article class="state-story" aria-label={`${selectedStory.location} field story`}>
				<button class="story-close" type="button" aria-label="Close" onclick={closeStory}>×</button>
				<div class="story-media">
					<img src={selectedStory.imageUrl} alt={`Field map for ${selectedStory.location}`} loading="lazy" />
				</div>
				<div class="story-content">
					<p class="story-kicker">Inclusion Economics India Centre</p>
					<h2>{selectedStory.title}</h2>
					<p class="story-subtitle">{selectedStory.subtitle}</p>
					<p class="story-location">{selectedStory.location}</p>
					<ul>
						{#each selectedStory.bullets as bullet}
							<li>{bullet}</li>
						{/each}
					</ul>
				</div>
			</article>
		{/if}
	</div>
</section>

<style>
	.map-stage {
		height: 265vh;
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
		height: min(92vh, 54rem);
		display: grid;
		place-items: center;
	}

	.india-map {
		width: min(72rem, 96vw);
		transform: translate(var(--map-shift-x), var(--map-shift-y)) scale(var(--map-scale));
		transform-origin: 52% 56%;
		transition: transform 140ms linear;
		filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.28));
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

	.state-story-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.48);
		backdrop-filter: blur(6px);
		z-index: 15;
		animation: fadeIn 220ms ease forwards;
	}

	.state-story {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(82rem, 94vw);
		height: min(84vh, 54rem);
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		border-radius: var(--radius-xl);
		overflow: hidden;
		background: color-mix(in srgb, var(--color-surface) 96%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
		box-shadow: 0 24px 72px rgba(0, 0, 0, 0.35);
		z-index: 16;
		animation: riseIn 300ms ease forwards;
	}

	.story-close {
		position: absolute;
		top: 0.75rem;
		right: 0.85rem;
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

	.story-media {
		position: relative;
		overflow: hidden;
		background: #0b0d11;
	}

	.story-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.story-content {
		padding: clamp(1rem, 2vw, 1.6rem);
		overflow: auto;
		display: grid;
		align-content: start;
		gap: 0.6rem;
	}

	.story-kicker {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.story-content h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.3rem, 2.2vw, 1.9rem);
		line-height: 1.18;
	}

	.story-subtitle,
	.story-location {
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.story-content ul {
		margin: 0.35rem 0 0;
		padding-left: 1rem;
		display: grid;
		gap: 0.52rem;
	}

	.story-content li {
		font-size: var(--step--1);
		line-height: 1.45;
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
			transform: translate(-50%, -46%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	@media (max-width: 900px) {
		.map-stage {
			height: 245vh;
			margin-top: -64px;
		}

		.map-zoom-shell {
			width: 100vw;
			height: 72vh;
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

		.state-story {
			grid-template-columns: 1fr;
			height: min(90vh, 42rem);
		}

		.story-media {
			height: 38%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.india-map {
			transition: none;
		}

		.state-story,
		.state-story-backdrop {
			animation: none;
		}
	}
</style>
