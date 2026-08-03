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
		kicker?: string;
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
		AN: 'Andaman and Nicobar Islands',
		AP: 'Andhra Pradesh',
		AR: 'Arunachal Pradesh',
		AS: 'Assam',
		BR: 'Bihar',
		CH: 'Chandigarh',
		CT: 'Chhattisgarh',
		DH: 'Dadra and Nagar Haveli and Daman and Diu',
		DL: 'Delhi',
		GA: 'Goa',
		GJ: 'Gujarat',
		HP: 'Himachal Pradesh',
		HR: 'Haryana',
		JH: 'Jharkhand',
		JK: 'Jammu and Kashmir',
		KA: 'Karnataka',
		KL: 'Kerala',
		LA: 'Ladakh',
		LD: 'Lakshadweep',
		MH: 'Maharashtra',
		ML: 'Meghalaya',
		MN: 'Manipur',
		MP: 'Madhya Pradesh',
		MZ: 'Mizoram',
		NL: 'Nagaland',
		OR: 'Odisha',
		PB: 'Punjab',
		PY: 'Puducherry',
		RJ: 'Rajasthan',
		SK: 'Sikkim',
		TG: 'Telangana',
		TN: 'Tamil Nadu',
		TR: 'Tripura',
		UA: 'Uttarakhand',
		UT: 'Uttarakhand',
		UP: 'Uttar Pradesh',
		WB: 'West Bengal'
	};

	const seccStateCodeByIso: Record<string, string> = {
		AN: '35',
		AP: '28',
		AR: '12',
		AS: '18',
		BR: '10',
		CH: '04',
		CT: '22',
		DH: '26',
		DL: '07',
		GA: '30',
		GJ: '24',
		HP: '02',
		HR: '06',
		JH: '20',
		JK: '01',
		KA: '29',
		KL: '32',
		LA: '38',
		LD: '31',
		MH: '27',
		ML: '17',
		MN: '14',
		MP: '23',
		MZ: '15',
		NL: '13',
		OR: '21',
		PB: '03',
		PY: '34',
		RJ: '08',
		SK: '11',
		TG: '36',
		TN: '33',
		TR: '16',
		UT: '05',
		UA: '05',
		UP: '09',
		WB: '19'
	};

	const fallbackMetrics: Record<string, RegionMetric> = {
		MP: { adivasiShare: 21.1, scShare: 15.6, densityIndex: 42, households: 0, population: 0, elevation: 0.74 },
		UP: { adivasiShare: 0.9, scShare: 21.1, densityIndex: 24, households: 0, population: 0, elevation: 0.26 },
		WB: { adivasiShare: 5.8, scShare: 23.5, densityIndex: 37, households: 0, population: 0, elevation: 0.48 },
		BR: { adivasiShare: 1.3, scShare: 16.3, densityIndex: 52, households: 0, population: 0, elevation: 0.58 },
		DL: { adivasiShare: 0.4, scShare: 18.0, densityIndex: 12, households: 0, population: 0, elevation: 0.18 },
		MH: { adivasiShare: 9.4, scShare: 12.3, densityIndex: 71, households: 0, population: 0, elevation: 0.82 },
		ML: { adivasiShare: 90.8, scShare: 1.0, densityIndex: 18, households: 0, population: 0, elevation: 0.9 },
		OR: { adivasiShare: 22.9, scShare: 17.3, densityIndex: 49, households: 0, population: 0, elevation: 0.42 },
		AN: { adivasiShare: 8.6, scShare: 0.8, densityIndex: 14, households: 0, population: 0, elevation: 0.24 },
		AP: { adivasiShare: 6.6, scShare: 16.4, densityIndex: 58, households: 0, population: 0, elevation: 0.52 },
		AR: { adivasiShare: 68.8, scShare: 0.2, densityIndex: 11, households: 0, population: 0, elevation: 0.92 },
		AS: { adivasiShare: 12.4, scShare: 7.2, densityIndex: 47, households: 0, population: 0, elevation: 0.41 },
		CH: { adivasiShare: 0.0, scShare: 17.2, densityIndex: 8, households: 0, population: 0, elevation: 0.18 },
		CT: { adivasiShare: 31.8, scShare: 12.9, densityIndex: 43, households: 0, population: 0, elevation: 0.61 },
		DH: { adivasiShare: 61.9, scShare: 1.7, densityIndex: 9, households: 0, population: 0, elevation: 0.46 },
		GA: { adivasiShare: 9.1, scShare: 1.7, densityIndex: 16, households: 0, population: 0, elevation: 0.22 },
		GJ: { adivasiShare: 14.8, scShare: 6.7, densityIndex: 61, households: 0, population: 0, elevation: 0.54 },
		HP: { adivasiShare: 5.4, scShare: 25.2, densityIndex: 26, households: 0, population: 0, elevation: 0.33 },
		JH: { adivasiShare: 26.2, scShare: 11.8, densityIndex: 46, households: 0, population: 0, elevation: 0.63 },
		JK: { adivasiShare: 10.8, scShare: 7.4, densityIndex: 19, households: 0, population: 0, elevation: 0.31 },
		KL: { adivasiShare: 1.4, scShare: 9.2, densityIndex: 54, households: 0, population: 0, elevation: 0.2 },
		LA: { adivasiShare: 2.0, scShare: 1.6, densityIndex: 5, households: 0, population: 0, elevation: 0.27 },
		LD: { adivasiShare: 94.8, scShare: 0.0, densityIndex: 2, households: 0, population: 0, elevation: 0.12 },
		MN: { adivasiShare: 41.1, scShare: 0.4, densityIndex: 13, households: 0, population: 0, elevation: 0.88 },
		TN: { adivasiShare: 0.9, scShare: 17.9, densityIndex: 68, households: 0, population: 0, elevation: 0.2 },
		MZ: { adivasiShare: 94.4, scShare: 0.1, densityIndex: 10, households: 0, population: 0, elevation: 0.91 },
		NL: { adivasiShare: 86.5, scShare: 0.0, densityIndex: 12, households: 0, population: 0, elevation: 0.89 },
		PB: { adivasiShare: 0.0, scShare: 32.0, densityIndex: 33, households: 0, population: 0, elevation: 0.2 },
		PY: { adivasiShare: 0.2, scShare: 16.7, densityIndex: 7, households: 0, population: 0, elevation: 0.16 },
		KA: { adivasiShare: 6.9, scShare: 17.2, densityIndex: 63, households: 0, population: 0, elevation: 0.76 },
		RJ: { adivasiShare: 13.5, scShare: 17.8, densityIndex: 55, households: 0, population: 0, elevation: 0.68 },
		SK: { adivasiShare: 33.8, scShare: 4.4, densityIndex: 6, households: 0, population: 0, elevation: 0.79 },
		TG: { adivasiShare: 9.6, scShare: 15.4, densityIndex: 50, households: 0, population: 0, elevation: 0.57 },
		TR: { adivasiShare: 31.8, scShare: 17.1, densityIndex: 24, households: 0, population: 0, elevation: 0.66 },
		UT: { adivasiShare: 2.9, scShare: 18.7, densityIndex: 27, households: 0, population: 0, elevation: 0.24 },
		HR: { adivasiShare: 0.0, scShare: 24.7, densityIndex: 21, households: 0, population: 0, elevation: 0.22 }
	};

	const stateStories: Partial<Record<string, StateStory>> = {
		MP: {
			title: 'Building Resilience through MGNREGA Assets',
			subtitle: 'Field Research at scale',
			location: 'Barwani, Madhya Pradesh',
			imageUrl: '/images/states/barwani.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'I directed a daily field team of 8 surveyors, 2 supervisors, 2 asset auditors, and 1 field manager across two states, keeping the operation running independently with minimal supervision.',
				'I built the field QA routine, running high-frequency checks every day to reduce human and data-entry errors and keep the downstream causal analysis reliable.',
				'I turned slow manual scraping into reusable pipelines that could be transferred across systems and users, cutting analysis turnaround time.',
				'I secured Letters of Support from district administration through direct stakeholder engagement and built durable relationships beyond the pilot.',
				'I built the field operations from the ground up: CTO forms, protocols, hiring, and training, and delivered pilot documentation that informed later climate-resilience evaluations.'
			]
		},
		BR: {
			title: 'Building Resilience through MGNREGA Assets',
			subtitle: 'Field Research at scale',
			location: 'Bihar, India',
			imageUrl: '/images/states/bihar.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'I directed a daily field team of 8 surveyors, 2 supervisors, 2 asset auditors, and 1 field manager across two states, keeping the operation running independently with minimal supervision.',
				'I built the field QA routine, running high-frequency checks every day to reduce human and data-entry errors and keep the downstream causal analysis reliable.',
				'I turned slow manual scraping into reusable pipelines that could be transferred across systems and users, cutting analysis turnaround time.',
				'I secured Letters of Support from district administration through direct stakeholder engagement and built durable relationships beyond the pilot.',
				'I built the field operations from the ground up: CTO forms, protocols, hiring, and training, and delivered pilot documentation that informed later climate-resilience evaluations.'
			],
			repoUrl: 'https://github.com/Anindyakafka/MGNREGA_assets',
			repoLabel: 'Open GitHub repository'
		},
		WB: {
			title: 'West Bengal Electoral Rolls Data (2002 & 2026 SIR)',
			subtitle: 'Independent Research',
			location: 'West Bengal, India',
			imageUrl: '/images/states/west_bengal.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'Built two end-to-end scraping pipelines; covering 2002-style booth-level electoral rolls and the 2026 Special Intensive Revision (SIR)/ASD rolls, converting tens of thousands of scattered booth-level PDFs into structured, analyzable electoral data for West Bengal.',
				'Delivered the structured dataset for use in the Bengal Biennale 2026, providing the data backbone for a public exhibition on the state\'s electoral history.',
				'Engineered the pipeline to survive real-world constraints, automatic retries, checksum-verified chunked releases, and resumable downloads, making a dataset too large for standard version control fully reusable for other researchers.'
			],
			repoUrl: 'https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002',
			repoLabel: 'Open GitHub repository'
		},
		DL: {
			title: 'Name Ethnicity Detector',
			subtitle: 'Research Tooling',
			location: 'Delhi',
			imageUrl: '/images/states/delhi.png',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'PyTorch name→ethnicity classifier with nine model configurations, up to 99% accuracy on single-country splits.',
				'Supports batch and single-name inference with optional probability distributions and CSV outputs.',
				'Built for research and audit workflows where direct demographic labels are unavailable, with caution around interpretability and misuse risks.'
			],
			repoUrl: 'https://github.com/Anindyakafka/name-ethnicity-detector',
			repoLabel: 'Open GitHub repository'
		},
		MH: {
			title: 'Climate Resilient Decision Support',
			subtitle: 'X Moonshot Factory scoping visit',
			location: 'Nandurbar, Maharashtra',
			imageUrl: '/images/states/maharashtra.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'I joined the X Moonshot Factory / IEIC scoping visit between 19 and 27 February 2026 to refine a prototype AI tool for district-level budgeting and climate-resilient decision support.',
				'In Nandurbar, I discussed watershed management and reducing out-migration through asset generation with district stakeholders.',
				'I documented how political and operational realities push visible, labour-intensive works over longer-term climate investments, and how the tool could help district collectors allocate limited funds and manpower better.',
				'I recorded Nandurbar as a priority district for piloting because of its water-management stress and climate shocks.'
			]
		},
		ML: {
			title: 'Climate Resilient Decision Support',
			subtitle: 'X Moonshot Factory scoping visit',
			location: 'Shillong, Meghalaya',
			imageUrl: '/images/states/meghalaya.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'I joined the X Moonshot Factory / IEIC scoping visit to show how a prototype tool could integrate fragmented departmental data for climate-risk budgeting.',
				'In Shillong, I met state and district officials, including the Rural Development and Disaster Management teams, to map what data they actually needed for planning.',
				'I documented the data-sovereignty requirement directly: government data had to remain under government control, with no external access path.',
				'I flagged East Khasi Hills and West Garo Hills as priority pilot districts because of landslides, flash floods, and access constraints.'
			]
		},
		TN: {
			title: 'Climate Resilient Decision Support',
			subtitle: 'X Moonshot Factory scoping visit',
			location: 'Chennai and Ramanathapuram, Tamil Nadu',
			imageUrl: '/images/states/tamil_nadu.webp',
			kicker: 'Inclusion Economics India Centre',
			bullets: [
				'I joined the X Moonshot Factory / IEIC scoping visit to review how a prototype AI tool could support district-level budgeting and climate-resilient investment planning.',
				'In Chennai and Ramanathapuram, I met officials to connect departmental data, local climate risk, and the evidence needed to justify funding climate investments.',
				'I noted the project directions that emerged for Tamil Nadu: Payment for Ecosystem Services, island restoration, and more defensible district planning.',
				'I framed the tool as a way to make climate planning more legible, operational, and usable for district decision-makers.'
			]
		},
		UP: {
			title: 'Dadri Forecast',
			subtitle: 'Militant research on land, ecology, and extractive development',
			location: 'Dadri, Gautam Buddha Nagar, Uttar Pradesh',
			imageUrl: '/images/states/dadri.webp',
			kicker: 'Khandera Art Space',
			bullets: [
				'A militant-research initiative rooted in Gautam Buddha Nagar, examining land transformation, ecological collapse, and caste and communal violence in the shadow of extractive development.',
				'Fieldwork across seven villages combined household surveys, oral histories, and spatial analysis of satellite imagery from 2003 to 2023 — revealing agricultural land decline from roughly 71% to 53% over two decades.',
				'An archive and organizing space built as a counter-narrative against developmental modernity, producing zines, reports, and visual pedagogical material from field-grounded community documentation.',
				'An evolving platform linking artistic, activist, and research practice to forecast the consequences of extractive growth and build collective political imagination from the ground up.'
			],
			repoUrl: 'https://khanderartspace.netlify.app/dadri-forecast',
			repoLabel: 'Visit Dadri Forecast'
		}
	};

	let seccCombined = $state<Record<string, SeccStateMetric> | null>(null);

	let hoveredRegionId = $state<string | null>(null);
	let selectedRegionId = $state<string | null>(null);
	let storyLoadToken = 0;
	let storyIsLoading = $state(false);
	let selectedStoryImageUrl = $state<string | null>(null);
	let storySceneVisible = $state(false);
	let mapScale = $state(2.2);
	let mapShiftX = $state(0);
	let mapShiftY = $state(0);
	let mapStageEl: HTMLElement | null = $state(null);

	let regions = $derived.by<Region[]>(() => {
		const ids = new Set<string>();
		Object.keys(regionNames).forEach((id) => ids.add(id));
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

	// Preload all state story images on page mount so the first click feels instant.
	$effect(() => {
		if (!browser) return;
		for (const id in stateStories) {
			void preloadImage(stateStories[id].imageUrl);
		}
	});

	$effect(() => {
		const onScroll = () => {
			const doc = document.documentElement;
			const stageTop = mapStageEl?.offsetTop ?? 0;
			const stageHeight = mapStageEl?.offsetHeight ?? window.innerHeight * 5.5;

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

		// WebP maps are ~1 MB — small enough to show directly.
		selectedStoryImageUrl = story.imageUrl;
		storySceneVisible = false;
		selectedRegionId = regionId;
		await nextFrame();
		if (token !== storyLoadToken) return;
		storySceneVisible = true;
		storyIsLoading = false;
	}

	function handleRegionHover(regionId: string | null) {
		hoveredRegionId = regionId;
		if (regionId && stateStories[regionId]?.imageUrl) {
			void preloadImage(stateStories[regionId].imageUrl);
		}
	}

	function closeStory() {
		storyLoadToken += 1;
		storyIsLoading = false;
		storySceneVisible = false;
		selectedStoryImageUrl = null;
		selectedRegionId = null;
	}

	function nextFrame() {
		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});
	}

	function preloadImage(src: string, timeoutMs = 7000) {
		return new Promise<boolean>((resolve) => {
			let done = false;
			const finish = (ok: boolean) => {
				if (done) return;
				done = true;
				resolve(ok);
			};

			const timeoutId = setTimeout(() => finish(false), timeoutMs);

			const img = new Image();
			img.onload = () => {
				clearTimeout(timeoutId);
				finish(true);
			};
			img.onerror = () => {
				clearTimeout(timeoutId);
				finish(false);
			};
			img.src = src;

			if (img.decode) {
				img.decode().then(() => finish(true)).catch(() => {
					// Keep waiting for onload/onerror when decode is unsupported for this asset.
				});
			}
		});
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
			<div class="state-story-scene" class:revealed={storySceneVisible}>
				<img
					class="state-story-image"
					src={selectedStoryImageUrl ?? selectedStory.imageUrl}
					alt=""
					aria-hidden="true"
					decoding="async"
				/>
				<div class="state-story-scrim"></div>
				<article class="state-story-content" aria-label={`${selectedStory.location} field story`}>
					<button class="story-close" type="button" aria-label="Close" onclick={closeStory}>×</button>
							<p class="story-kicker">{selectedStory.kicker ?? 'Inclusion Economics India Centre'}</p>
					<h2>{selectedStory.title}</h2>
					<div class="story-meta" aria-label="Story details">
						<p class="story-subtitle">{selectedStory.subtitle}</p>
						<p class="story-location">{selectedStory.location}</p>
						<p class="story-stats">Adivasi share {activeMetric ? activeMetric.adivasiShare.toFixed(1) : '—'}%</p>
					</div>
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
		height: 980vh;
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
		opacity: 0;
		transition: opacity 220ms ease;
		z-index: 15;
	}

	.state-story-scene.revealed {
		opacity: 1;
	}

	.state-story-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
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

	.story-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.9rem;
		align-items: baseline;
	}

	.story-meta > p {
		margin: 0;
	}

	.state-story-content h2 {
		font-family: var(--font-serif);
		font-size: clamp(1.3rem, 2.2vw, 1.9rem);
		line-height: 1.18;
	}

	.story-subtitle,
	.story-location,
	.story-stats {
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
			height: 900vh;
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

		.state-story-content {
			animation: none;
		}

		.state-story-scene {
			transition: none;
		}
	}
</style>
