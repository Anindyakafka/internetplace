<script lang="ts">
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

	type RegionMetric = {
		adivasiShare: number;
		densityIndex: number;
		elevation: number;
	};

	const regionNames: Record<string, string> = {
		UP: 'Uttar Pradesh',
		WB: 'West Bengal',
		BR: 'Bihar',
		DL: 'Delhi',
		MH: 'Maharashtra',
		KA: 'Karnataka',
		RJ: 'Rajasthan',
		HR: 'Haryana'
	};

	// Placeholder values for interactive prototype until real data is provided.
	const regionMetrics: Record<string, RegionMetric> = {
		UP: { adivasiShare: 0.9, densityIndex: 24, elevation: 0.26 },
		WB: { adivasiShare: 5.8, densityIndex: 37, elevation: 0.48 },
		BR: { adivasiShare: 1.3, densityIndex: 52, elevation: 0.58 },
		DL: { adivasiShare: 0.4, densityIndex: 12, elevation: 0.18 },
		MH: { adivasiShare: 9.4, densityIndex: 71, elevation: 0.82 },
		KA: { adivasiShare: 6.9, densityIndex: 63, elevation: 0.76 },
		RJ: { adivasiShare: 13.5, densityIndex: 55, elevation: 0.68 },
		HR: { adivasiShare: 0.0, densityIndex: 21, elevation: 0.22 }
	};

	let hoveredRegionId = $state<string | null>(null);
	let selectedRegionId = $state<string | null>(null);
	let mapScale = $state(2.2);

	let regions = $derived.by<Region[]>(() => {
		const ids = new Set<string>();
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

	let activeMetric = $derived.by<RegionMetric | null>(() => {
		if (!activeRegion) return null;
		return regionMetrics[activeRegion.id] ?? null;
	});

	$effect(() => {
		const onScroll = () => {
			const max = window.innerHeight * 1.35;
			const progress = Math.max(0, Math.min(1, window.scrollY / max));
			mapScale = 2.25 - progress * 1.25;
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

		<div class="map-zoom-shell" style={`--map-scale: ${mapScale};`}>
			<div
				class="india-map"
				role="img"
				aria-label="Interactive India map"
				use:indiaMap={{
					regions,
					svgUrl: '/assets/india.svg',
					onRegionClick: handleRegionClick,
					onRegionHover: handleRegionHover,
					getRegionElevation
				}}
			></div>
		</div>

		{#if activeRegion && activeMetric}
			<div class="hover-hud" aria-live="polite">
				<p class="hud-region">{activeRegion.name}</p>
				<div class="hud-bars" aria-hidden="true">
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.8)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.9)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.74)}%`}></span>
					<span style={`height:${Math.max(8, activeMetric.densityIndex * 0.65)}%`}></span>
				</div>
				<p class="hud-value">Adivasi share {activeMetric.adivasiShare.toFixed(1)}%</p>
				<p class="hud-value">Terrain density {activeMetric.densityIndex}</p>
			</div>

			<div class="region-dock">
				{#each activeRegion.projects as project}
					<a class="dock-link" href={`/work/${project.slug}`}>{project.title}</a>
				{/each}
				<a class="dock-link dock-link--ghost" href="/work">Work</a>
				<a class="dock-link dock-link--ghost" href="/writing">Writing</a>
				<a class="dock-link dock-link--ghost" href="/about">About</a>
				<a class="dock-link dock-link--ghost" href="/colophon">Colophon</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.map-stage {
		height: 240vh;
		background:
			radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--color-accent-soft) 36%, transparent), transparent 45%),
			radial-gradient(circle at 88% 84%, color-mix(in srgb, var(--color-accent-soft) 28%, transparent), transparent 34%),
			var(--color-bg);
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
		top: clamp(1.4rem, 3.4vw, 2.6rem);
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(1.5rem, 3.4vw, 2.6rem);
		letter-spacing: -0.02em;
		z-index: 8;
	}

	.map-zoom-shell {
		width: min(94vw, 78rem);
		height: min(86vh, 52rem);
		display: grid;
		place-items: center;
	}

	.india-map {
		width: min(72rem, 96vw);
		transform: scale(var(--map-scale));
		transform-origin: 50% 56%;
		transition: transform 140ms linear;
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

	.region-dock {
		position: absolute;
		bottom: clamp(0.8rem, 2.4vw, 1.8rem);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		max-width: min(66rem, 92vw);
		z-index: 11;
	}

	.dock-link {
		padding: 0.55rem 0.85rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 66%, transparent);
		border-radius: 999px;
		text-decoration: none;
		font-family: var(--font-sans);
		font-size: var(--step--1);
		line-height: 1.2;
		background: color-mix(in srgb, var(--color-surface) 87%, transparent);
		color: var(--color-text);
		transition: transform var(--transition), border-color var(--transition);
	}

	.dock-link--ghost {
		font-family: var(--font-mono);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.dock-link:hover {
		transform: translateY(-2px);
		border-color: var(--color-border-strong);
	}

	@media (max-width: 900px) {
		.map-stage {
			height: 220vh;
		}

		.map-zoom-shell {
			width: 100vw;
			height: 72vh;
		}

		.india-map {
			transform-origin: 50% 58%;
		}

		.hover-hud {
			top: auto;
			bottom: 4.2rem;
			right: 0.8rem;
			width: min(13rem, 56vw);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.india-map,
		.dock-link {
			transition: none;
		}
	}
</style>
