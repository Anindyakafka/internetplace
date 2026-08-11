<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
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
	let stageProgress = $state(0);
	let noteScrollOpacity = $state(1);
	let noteDismissed = $state(false);
	let noteDragging = $state(false);
	let noteDragX = $state(0);
	let noteDragY = $state(0);
	let noteDragStartX = 0;
	let noteDragStartY = 0;
	let mapStageEl: HTMLElement | null = $state(null);
	let terminalInput = $state('');
	let terminalLogEl: HTMLDivElement | null = $state(null);
	let terminalLines = $state<string[]>([
		'CHHIPI/42 collective boot sequence initialized...',
		'Checking bourgeoisie influence... [TOO HIGH, AS EXPECTED]',
		'Loading comrades protocol... [FUNCTIONAL]',
		'Private property detector... [UNFORTUNATELY ACTIVE]',
		'',
		'Do not panic. Organize.',
		"Type 'help'. I will reply with disciplined sarcasm.",
		''
	]);
	let operatorOnline = $state(false);
	let istTimeLabel = $state('LOADING IST...');
	let weatherLabel = $state('SIGNAL PENDING');

	const terminalPrompt = 'heart-of-gold@chhipi:~ %';

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

	$effect(() => {
		if (!browser) return;

		const updatePresenceAndTime = () => {
			const now = new Date();
			const hour24 = Number(
				new Intl.DateTimeFormat('en-GB', {
					timeZone: 'Asia/Kolkata',
					hour: '2-digit',
					hour12: false
				}).format(now)
			);

			const timeText = new Intl.DateTimeFormat('en-IN', {
				timeZone: 'Asia/Kolkata',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}).format(now);

			// "Online" means the tab is visible and it's a plausible work window in IST.
			operatorOnline = document.visibilityState === 'visible' && hour24 >= 9 && hour24 < 23;
			istTimeLabel = `${timeText} IST`;
		};

		const weatherCodeToLabel: Record<number, string> = {
			0: 'CLEAR',
			1: 'MOSTLY CLEAR',
			2: 'PARTLY CLOUDY',
			3: 'OVERCAST',
			45: 'FOGGY',
			48: 'FREEZING FOG',
			51: 'LIGHT DRIZZLE',
			53: 'DRIZZLE',
			55: 'HEAVY DRIZZLE',
			61: 'LIGHT RAIN',
			63: 'RAIN',
			65: 'HEAVY RAIN',
			71: 'LIGHT SNOW',
			73: 'SNOW',
			75: 'HEAVY SNOW',
			80: 'RAIN SHOWERS',
			81: 'STRONG SHOWERS',
			82: 'VIOLENT SHOWERS',
			95: 'THUNDERSTORM'
		};

		const refreshWeather = async () => {
			try {
				const url =
					'https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,weather_code&timezone=Asia%2FKolkata';
				const response = await fetch(url);
				if (!response.ok) throw new Error('weather fetch failed');

				const payload = (await response.json()) as {
					current?: { temperature_2m?: number; weather_code?: number };
				};

				const temp = payload.current?.temperature_2m;
				const code = payload.current?.weather_code;
				if (typeof temp !== 'number') throw new Error('missing weather data');

				const descriptor = typeof code === 'number' ? (weatherCodeToLabel[code] ?? 'ATMOSPHERIC DRAMA') : 'ATMOSPHERIC DRAMA';
				weatherLabel = `${Math.round(temp)}°C, ${descriptor}`;
			} catch {
				weatherLabel = 'API HAVING FEELINGS';
			}
		};

		updatePresenceAndTime();
		void refreshWeather();

		const onVisibility = () => updatePresenceAndTime();
		document.addEventListener('visibilitychange', onVisibility);

		const clockTimer = window.setInterval(updatePresenceAndTime, 60_000);
		const weatherTimer = window.setInterval(() => {
			void refreshWeather();
		}, 30 * 60_000);

		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			window.clearInterval(clockTimer);
			window.clearInterval(weatherTimer);
		};
	});

	// Preload all state story images on page mount so the first click feels instant.
	$effect(() => {
		if (!browser) return;
		for (const id in stateStories) {
			if (stateStories[id]) void preloadImage(stateStories[id].imageUrl);
		}
	});

	$effect(() => {
		const onScroll = () => {
			const stageTop = mapStageEl?.offsetTop ?? 0;
			const stageHeight = mapStageEl?.offsetHeight ?? window.innerHeight * 3.8;
			const stageSpan = Math.max(1, stageHeight - window.innerHeight);
			const withinStage = window.scrollY - stageTop;
			stageProgress = Math.max(0, Math.min(1, withinStage / stageSpan));
			noteScrollOpacity = noteDismissed ? 0 : Math.max(0, 1 - stageProgress * 1.55);

			if (window.innerWidth <= 900) {
				// Keep phone layouts stable; transform-driven map motion causes overlay drift in orientation changes.
				mapScale = 1;
				mapShiftX = 0;
				mapShiftY = 0;
				return;
			}

			const progress = Math.max(0, Math.min(1, withinStage / stageSpan));

			const isTablet = window.innerWidth > 900 && window.innerWidth <= 1100;

			if (isTablet) {
				const startScale = 1.42;
				const endScale = 0.92;
				mapScale = startScale + (endScale - startScale) * progress;
				mapShiftX = -3 + progress * 6;
				mapShiftY = 8 + progress * -24;
				return;
			}

			const startScale = 1.5;
			const endScale = 0.9;
			mapScale = startScale + (endScale - startScale) * progress;
			mapShiftX = -4 + progress * 8;
			mapShiftY = 6 + progress * -20;
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	function handleNotePointerDown(event: PointerEvent) {
		if (noteDismissed) return;
		const target = event.target as HTMLElement;
		if (target.closest('a, button, input, select, textarea')) return;
		noteDragging = true;
		noteDragStartX = event.clientX - noteDragX;
		noteDragStartY = event.clientY - noteDragY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function handleNotePointerMove(event: PointerEvent) {
		if (!noteDragging || noteDismissed) return;
		noteDragX = event.clientX - noteDragStartX;
		noteDragY = event.clientY - noteDragStartY;
	}

	function handleNotePointerUp(event: PointerEvent) {
		if (!noteDragging) return;
		noteDragging = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

		const dragDistance = Math.hypot(noteDragX, noteDragY);
		if (dragDistance > 130) {
			noteDismissed = true;
			noteDragX += Math.sign(noteDragX || 1) * 420;
			noteDragY -= 220;
			noteScrollOpacity = 0;
			return;
		}

		noteDragX = 0;
		noteDragY = 0;
	}

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

	function appendTerminalLines(lines: string[]) {
		terminalLines = [...terminalLines, ...lines];
	}

	function pickOne(options: string[]) {
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}

	const terminalRoutes: Record<string, string> = {
		'/': '/',
		home: '/',
		about: '/about',
		work: '/work',
		writing: '/writing',
		colophon: '/colophon',
		sections: '/sections',
		map: '/map',
		tracks: '/tracks',
		trains: '/trains',
		vehicles: '/vehicles',
		notes: '/writing',
		'blog-roll': '/work',
		blog: '/writing',
		contact: '/about#contact'
	};

	$effect(() => {
		if (!browser || !terminalLogEl) return;
		terminalLines;
		requestAnimationFrame(() => {
			if (!terminalLogEl) return;
			terminalLogEl.scrollTop = terminalLogEl.scrollHeight;
		});
	});

	function handleTerminalCommand(rawCommand: string) {
		const command = rawCommand.trim();
		if (!command) return;

		appendTerminalLines([`${terminalPrompt} ${command}`]);

		const [base, ...rest] = command.toLowerCase().split(/\s+/);
		const argument = rest.join(' ').trim();
		switch (base) {
			case 'help':
				appendTerminalLines([
					'Available commands for the computational proletariat:',
					'- help: show command registry',
					'- cd <route>: navigate (about, work, writing, colophon, sections, map, trains, vehicles, contact)',
					'- ls: list available routes',
					'- sudo: attempt superuser mode (you will be judged)',
					'- polly <text>: have polly imitate your line',
					'- 8ball <question>: yes/no oracle with attitude',
					'- clear: clear screen',
					'- clean: clear terminal history',
					'- status: check if operator is online',
					'- socials: reveal communication channels',
					'- weather: inspect Kolkata atmosphere conditions',
					'- about: brief ideological firmware summary',
					'- ping: verify the network still serves the people'
				]);
				break;
			case 'ls':
				appendTerminalLines([
					pickOne([
						'📂 Directory of anti-bourgeois hyperlinks:',
						'📂 Route commons currently available:',
						'📂 Public navigation infrastructure:'
					]),
					'about work writing colophon sections map trains vehicles contact'
				]);
				break;
			case 'cd': {
				if (!argument) {
					appendTerminalLines([
						'cd requires a destination. Example: cd work',
						'Valid: about work writing colophon sections map trains vehicles contact / home'
					]);
					break;
				}

				const target = terminalRoutes[argument] ?? terminalRoutes[argument.replace(/^\//, '')];
				if (!target) {
					appendTerminalLines([
						`No such route: ${argument}`,
						'Try ls before issuing spatial commands, comrade bourgeoisie.'
					]);
					break;
				}

				appendTerminalLines([
					pickOne([
						`Routing collective transport to ${target}`,
						`Reassigning coordinates → ${target}`,
						`Mobilizing navigation cadres to ${target}`
					])
				]);

				if (browser) {
					window.location.href = target;
				}
				break;
			}
			case 'sudo':
				appendTerminalLines([
					pickOne([
						'Lmao, what are you trying to sudo, bourgeoisie? Credentials denied.',
						'Superuser mode refused. Means of production are not yours.',
						'Nice try. Root belongs to the collective, not private ambition.'
					])
				]);
				break;
			case 'polly':
				if (!argument) {
					appendTerminalLines(['Usage: polly <text to imitate>']);
					break;
				}
				appendTerminalLines([
					pickOne([
						`Polly says: "${argument.toUpperCase()}"`,
						`Polly (unimpressed): "${argument} ... wow, historic."`,
						`Polly echoes: "${argument.split('').reverse().join('')}"`
					])
				]);
				break;
			case '8ball':
				if (!argument) {
					appendTerminalLines(['Usage: 8ball <yes/no question>']);
					break;
				}
				appendTerminalLines([
					`Question: ${argument}`,
					pickOne([
						'8BALL: Yes. But only after committee review.',
						'8BALL: No. History has voted otherwise.',
						'8BALL: Ask again when the material conditions improve.',
						'8BALL: Outlook uncertain. Organize first, decide later.',
						'8BALL: Absolutely. Seize the moment, not just the means.'
					])
				]);
				break;
			case 'status':
				appendTerminalLines([
					`CURRENTLY: ${operatorOnline ? 'ONLINE' : 'OFFLINE'}`,
					'OPERATOR: COMRADE ANINDYA',
					`STATUS: ${operatorOnline ? 'SCRIBBLING' : 'DEAD'}`,
					`LOCALTIME: ${istTimeLabel}`,
					`WEATHER: ${weatherLabel}`,
					pickOne([
						'NOTE: bourgeois productivity metrics remain rejected.',
						'NOTE: deadlines acknowledged, hierarchy ignored.',
						'NOTE: output exists, managerial theatre does not.'
					])
				]);
				break;
			case 'socials':
				appendTerminalLines([
					'LinkedIn: https://linkedin.com/in/anindyakafka',
					'GitHub: https://github.com/anindyakafka',
					'Instagram: https://www.instagram.com/anindya.hajabarala/',
					'Twitter: https://x.com/Kafkanindya7',
					'Contact: /about#contact'
				]);
				break;
			case 'weather':
				appendTerminalLines([
					`KOLKATA WEATHER: ${weatherLabel}`,
					pickOne([
						'Even the monsoon is more accountable than most ruling classes.',
						'Forecast says humidity and class contradiction both remain high.',
						'Atmospheric pressure stable. Social pressure: escalating.'
					])
				]);
				break;
			case 'about':
				appendTerminalLines([
					pickOne([
						'CHHIPI v3.0: a sarcastic shell for maps, memory, and organized dissent.',
						'CHHIPI v3.0: terminal interface for field notes and anti-bourgeois diagnostics.',
						'CHHIPI v3.0: where navigation meets snark and class analysis.'
					])
				]);
				break;
			case 'ping':
				appendTerminalLines([
					pickOne([
						'pong. Infrastructure still resists privatization.',
						'pong. Packets delivered by unionized electrons.',
						'pong. Network alive, bourgeois latency ignored.'
					])
				]);
				break;
			case 'clear':
				terminalLines = [];
				break;
			case 'clean':
				terminalLines = [];
				appendTerminalLines([
					pickOne([
						'History cleaned. Archives remain with the people.',
						'Terminal memory reset. Ideology cache untouched.',
						'Logs purged. Material evidence redistributed.'
					])
				]);
				break;
			default:
				appendTerminalLines([
					`Unknown command: ${base}${rest.length ? ` ${rest.join(' ')}` : ''}`,
					pickOne([
						"Type 'help', bourgeoisie, and try collective discipline next time.",
						"Command not found. Even chaos has a syntax.",
						"No such command. Consult help before improvising capitalism."
					])
				]);
		}
	}

	function submitTerminalInput() {
		handleTerminalCommand(terminalInput);
		terminalInput = '';
	}

	function navigateToSectionsFromNote(event: MouseEvent | PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		noteDragging = false;
		void goto('/sections');
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
		<aside
			class="landing-note"
			class:dismissed={noteDismissed}
			class:dragging={noteDragging}
			aria-label="Exploration note"
			onpointerdown={handleNotePointerDown}
			onpointermove={handleNotePointerMove}
			onpointerup={handleNotePointerUp}
			onpointercancel={handleNotePointerUp}
			style={`--note-opacity:${noteScrollOpacity}; --note-drag-x:${noteDragX}px; --note-drag-y:${noteDragY}px; --note-rot:${noteDragX * 0.045}deg;`}
		>
			<p class="landing-note-kicker">Field Note 00</p>
			<p>
				Spend a minute clicking around this map. Every state opens a small dossier: who is
				seen, who is erased, and what the record refuses to confess.
			</p>
			<p>The story may feel bureaucratic, surreal, absurd, or quietly metamorphic.</p>
			<a
				class="landing-note-link"
				href="/sections"
				onpointerdown={(event) => event.stopPropagation()}
				onpointerup={(event) => event.stopPropagation()}
				onclick={navigateToSectionsFromNote}
			>
				Click here to explore the site sections →
			</a>
		</aside>
		<p class="portrait-only-notice" role="status">Rotate to portrait mode to explore stories.</p>

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

		<div class="mobile-region-picker" aria-label="Mobile region picker">
			<label for="mobile-region-select">Select a state</label>
			<select
				id="mobile-region-select"
				onchange={(event) => {
					const regionId = (event.currentTarget as HTMLSelectElement).value;
					if (regionId) void handleRegionClick(regionId);
				}}
			>
				<option value="">Choose a state</option>
				{#each regions as region}
					<option value={region.id}>{region.name}</option>
				{/each}
			</select>
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

		{#if activeRegionName && activeMetric}
			<div class="mobile-hud" aria-live="polite">
				<span class="mobile-hud-region">{activeRegionName}</span>
				<span>Adivasi {activeMetric.adivasiShare.toFixed(1)}%</span>
				<span>SC {activeMetric.scShare.toFixed(1)}%</span>
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

<footer class="home-footer" aria-label="Site footer">
	<div class="footer-strip">
		<section class="footer-link-block" aria-labelledby="socials-heading">
			<h2 id="socials-heading">Socials</h2>
			<ul>
				<li><a href="https://linkedin.com/in/anindyakafka" target="_blank" rel="noreferrer noopener">LinkedIn</a></li>
				<li><a href="mailto:anindya2232@gmail.com">Email</a></li>
				<li><a href="https://www.instagram.com/anindya.hajabarala/" target="_blank" rel="noreferrer noopener">Instagram</a></li>
				<li><a href="https://x.com/Kafkanindya7" target="_blank" rel="noreferrer noopener">Twitter</a></li>
				<li><a href="https://github.com/anindyakafka" target="_blank" rel="noreferrer noopener">GitHub</a></li>
			</ul>
		</section>

		<section class="footer-link-block" aria-labelledby="misc-heading">
			<h2 id="misc-heading">Miscellaneous</h2>
			<ul>
				<li><a href="/colophon">Colophon</a></li>
				<li><a href="/writing">Notes</a></li>
				<li><a href="/work">Blog Roll</a></li>
				<li><a href="https://github.com/Anindyakafka/internetplace" target="_blank" rel="noreferrer noopener">Source code</a></li>
			</ul>
		</section>

		<section class="status-panel" aria-label="Operator status panel">
			<p class="status-currently">
				Currently <strong>{operatorOnline ? 'ONLINE' : 'OFFLINE'}</strong>
			</p>
			<div class="status-grid">
				<p><span>OPERATOR:</span> ANINDYA</p>
				<p><span>STATUS:</span> {operatorOnline ? 'SCRIBBLING' : 'DEAD'}</p>
				<p><span>MODE:</span> {operatorOnline ? 'MARGIN NOTES IN PROGRESS' : 'OFFLINE'}</p>
				<p><span>LOCALTIME:</span> {istTimeLabel}</p>
				<p><span>WEATHER:</span> {weatherLabel}</p>
			</div>
		</section>

		<section class="chhipi-terminal" aria-label="Interactive terminal">
			<div class="terminal-shell" role="region" aria-live="polite" aria-label="Terminal output">
				<div class="terminal-log" role="log" aria-label="Terminal log" bind:this={terminalLogEl}>
					{#each terminalLines as line, index (index)}
						<p>{line}</p>
					{/each}
				</div>
				<div class="terminal-input-row">
					<span>{terminalPrompt}</span>
					<input
						type="text"
						placeholder="Enter command"
						bind:value={terminalInput}
						onkeydown={(event) => {
							if (event.key === 'Enter') submitTerminalInput();
						}}
					/>
				</div>
			</div>
		</section>
	</div>

	<section class="footer-video-reel" aria-label="Footer reel">
		<video
			class="footer-video"
			autoplay
			muted
			loop
			playsinline
			preload="auto"
			onended={(event) => {
				// Some browsers still hitch at loop boundaries; force immediate replay.
				const video = event.currentTarget as HTMLVideoElement;
				video.currentTime = 0;
				void video.play();
			}}
		>
			<source src="/videos/intro.web.mp4" media="(min-width: 1200px)" type="video/mp4" />
			<source src="/videos/intro.web.720.mp4" type="video/mp4" />
		</video>
	</section>
</footer>

<style>
	.map-stage {
		position: relative;
		height: 430vh;
		background:
			radial-gradient(circle at 12% 11%, rgba(95, 95, 95, 0.13), transparent 46%),
			radial-gradient(circle at 86% 82%, rgba(78, 78, 78, 0.11), transparent 36%),
			radial-gradient(circle at 50% 56%, rgba(120, 120, 120, 0.06), transparent 58%),
			var(--color-bg);
		background-size: auto, auto, auto, auto;
		background-repeat: no-repeat, no-repeat, no-repeat, repeat;
		margin-top: -64px;
	}

	.map-stage::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
		background-size: 96px 96px;
		background-repeat: repeat;
		opacity: 0.3;
		mix-blend-mode: screen;
	}

	.map-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: hidden;
		z-index: 1;
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
		transform-origin: 50% 54%;
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

	.mobile-region-picker {
		display: none;
	}

	.mobile-hud {
		display: none;
	}

	.landing-note {
		position: absolute;
		right: clamp(0.8rem, 2vw, 1.6rem);
		top: clamp(5.8rem, 12vh, 8.8rem);
		width: min(23rem, 32vw);
		padding: 0.95rem 1rem 0.9rem;
		border-radius: 0.2rem;
		background:
			repeating-linear-gradient(
				180deg,
				rgba(28, 48, 108, 0.08) 0,
				rgba(28, 48, 108, 0.08) 1px,
				transparent 1px,
				transparent 1.48rem
			),
			linear-gradient(140deg, rgba(250, 246, 232, 0.98), rgba(239, 231, 205, 0.98));
		border: 1px solid rgba(88, 72, 42, 0.34);
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
		z-index: 12;
		display: grid;
		gap: 0.45rem;
		cursor: grab;
		touch-action: none;
		opacity: var(--note-opacity);
		transform: translate(var(--note-drag-x), var(--note-drag-y)) rotate(var(--note-rot));
		transition: opacity 220ms ease, transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 220ms ease;
	}

	.landing-note::before {
		content: '';
		position: absolute;
		top: 0.55rem;
		left: -0.35rem;
		width: 0.16rem;
		height: calc(100% - 1.1rem);
		background: rgba(220, 93, 60, 0.58);
	}

	.landing-note::after {
		content: '';
		position: absolute;
		top: -0.55rem;
		left: 1.1rem;
		width: 3.4rem;
		height: 1.1rem;
		background: rgba(255, 245, 201, 0.72);
		transform: rotate(-4deg);
		filter: saturate(80%);
	}

	.landing-note.dragging {
		cursor: grabbing;
		box-shadow: 0 20px 34px rgba(0, 0, 0, 0.28);
	}

	.landing-note.dismissed {
		pointer-events: none;
	}

	.landing-note p {
		margin: 0;
		font-family: 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive;
		font-size: 0.94rem;
		line-height: 1.42;
		color: rgba(34, 30, 20, 0.9);
	}

	.landing-note-kicker {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.67rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(42, 36, 24, 0.9);
	}

	.landing-note-link {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		font-family: 'JetBrains Mono', monospace;
		font-size: var(--step--2);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.34rem 0.52rem;
		border-radius: 0.22rem;
		text-decoration: none;
		color: rgba(27, 40, 89, 0.95);
		border: 1px dashed rgba(27, 40, 89, 0.48);
		background: rgba(248, 244, 228, 0.7);
	}

	.landing-note-link:hover {
		border-color: rgba(27, 40, 89, 0.85);
	}

	.portrait-only-notice {
		display: none;
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
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.4rem 0.85rem;
		padding: 0.35rem 0.55rem;
		border-radius: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 62%, transparent);
		background: color-mix(in srgb, var(--color-surface) 78%, transparent);
	}

	.story-meta > p {
		margin: 0;
	}

	.story-location {
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.story-stats {
		text-align: right;
		font-family: var(--font-mono);
		font-size: var(--step--2);
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
		bottom: calc(1.1rem + env(safe-area-inset-bottom));
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

	.home-footer {
		position: relative;
		padding: clamp(0.82rem, 1.6vw, 1.06rem) clamp(0.75rem, 1.8vw, 1.3rem) clamp(1.05rem, 2.1vw, 1.5rem);
		border-top: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-surface) 96%, transparent),
			color-mix(in srgb, var(--color-surface) 92%, transparent)
		);
	}

	.footer-strip {
		max-width: min(74rem, 96vw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(8.8rem, 0.84fr) minmax(8.8rem, 0.84fr) minmax(8.1rem, 0.62fr) minmax(18.8rem, 1.95fr);
		gap: clamp(0.42rem, 0.9vw, 0.62rem);
		align-items: start;
		padding-bottom: 0.14rem;
	}

	.footer-video-reel {
		max-width: min(74rem, 96vw);
		height: clamp(13rem, 28vw, 22rem);
		margin: clamp(0.55rem, 1.2vw, 0.8rem) auto 0;
		border: 1px solid color-mix(in srgb, var(--color-border-strong) 72%, transparent);
		background: #060b06;
		overflow: hidden;
	}

	.footer-video {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 64%;
		filter: saturate(0.96) contrast(1.03) brightness(0.88);
	}

	.footer-link-block h2 {
		margin: 0 0 0.24rem;
		font-family: var(--font-mono);
		font-size: 0.61rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.footer-link-block ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.12rem;
	}

	.footer-link-block a {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		text-decoration: none;
		color: var(--color-text);
		border-bottom: 1px solid transparent;
		width: fit-content;
		line-height: 1.15;
	}

	.footer-link-block a:hover {
		border-bottom-color: color-mix(in srgb, var(--color-accent) 66%, transparent);
	}

	.chhipi-terminal {
		max-width: none;
		margin: 0;
		display: grid;
		gap: 0.24rem;
	}

	.terminal-shell {
		border: 1px solid rgba(98, 155, 94, 0.62);
		border-radius: 0;
		background: linear-gradient(180deg, #081109, #060b06);
		padding: 0.36rem;
		box-shadow: inset 0 0 0 1px rgba(65, 111, 67, 0.45);
	}

	.terminal-log {
		max-height: 6.6rem;
		overflow: auto;
		padding-right: 0.14rem;
		display: grid;
		gap: 0.06rem;
		scrollbar-width: thin;
		scrollbar-color: rgba(142, 204, 136, 0.55) transparent;
	}

	.terminal-log::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.terminal-log::-webkit-scrollbar-track {
		background: transparent;
	}

	.terminal-log::-webkit-scrollbar-thumb {
		background: rgba(142, 204, 136, 0.36);
		border-radius: 999px;
	}

	.terminal-log::-webkit-scrollbar-corner {
		background: transparent;
	}

	.terminal-log p {
		margin: 0;
		font-family: 'Courier New', 'JetBrains Mono', monospace;
		font-size: 0.64rem;
		line-height: 1.16;
		color: #9ce889;
		white-space: pre;
	}

	.terminal-input-row {
		margin-top: 0.28rem;
		padding-top: 0.22rem;
		border-top: 1px solid rgba(98, 155, 94, 0.35);
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0.24rem;
	}

	.terminal-input-row span {
		font-family: 'Courier New', 'JetBrains Mono', monospace;
		font-size: 0.59rem;
		color: #6de65d;
	}

	.terminal-input-row input {
		width: 100%;
		border: 1px solid rgba(75, 131, 76, 0.72);
		border-radius: 0;
		background: #050905;
		padding: 0.24rem 0.3rem;
		font-family: 'Courier New', 'JetBrains Mono', monospace;
		font-size: 0.63rem;
		color: #b2ff9f;
		caret-color: #b2ff9f;
	}

	.terminal-input-row input::placeholder {
		color: rgba(141, 198, 128, 0.62);
	}

	.terminal-input-row input:focus {
		outline: 1px solid rgba(143, 208, 125, 0.8);
		outline-offset: 1px;
	}

	.status-panel {
		margin: 0;
		padding: 0.34rem 0.4rem;
		border-radius: 0;
		border: 1px solid color-mix(in srgb, var(--color-border-strong) 82%, transparent);
		background: color-mix(in srgb, var(--color-surface) 90%, transparent);
	}

	.status-currently {
		margin: 0 0 0.22rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
	}

	.status-currently strong {
		font-size: 0.66rem;
	}

	.status-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.08rem;
	}

	.status-grid p {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.61rem;
		line-height: 1.14;
	}

	.status-grid span {
		color: var(--color-text-muted);
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

	@media (max-width: 900px) and (orientation: portrait) {
		.map-stage {
			height: 235svh;
			margin-top: -64px;
		}

		.map-sticky {
			height: 100svh;
		}

		.map-zoom-shell {
			width: 100vw;
			height: 74svh;
		}

		.india-map {
			width: min(96vw, 31rem);
			transform: none !important;
			transform-origin: 50% 50%;
		}

		.hover-hud {
			display: none;
		}

		.mobile-hud {
			display: flex;
			position: absolute;
			left: 50%;
			bottom: calc(4.8rem + env(safe-area-inset-bottom));
			transform: translateX(-50%);
			gap: 0.5rem;
			flex-wrap: wrap;
			justify-content: center;
			max-width: 92vw;
			padding: 0.42rem 0.62rem;
			border-radius: 999px;
			font-family: var(--font-mono);
			font-size: 0.66rem;
			letter-spacing: 0.03em;
			background: color-mix(in srgb, var(--color-surface) 90%, transparent);
			border: 1px solid color-mix(in srgb, var(--color-border) 62%, transparent);
			backdrop-filter: blur(5px);
			z-index: 14;
		}

		.mobile-hud-region {
			font-weight: 600;
		}

		.mobile-region-picker {
			display: grid;
			position: absolute;
			left: 50%;
			bottom: calc(0.9rem + env(safe-area-inset-bottom));
			transform: translateX(-50%);
			width: min(92vw, 26rem);
			gap: 0.3rem;
			z-index: 18;
		}

		.mobile-region-picker label {
			font-family: var(--font-mono);
			font-size: 0.62rem;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--color-text-muted);
		}

		.mobile-region-picker select {
			appearance: none;
			border-radius: 0.75rem;
			padding: 0.55rem 0.7rem;
			font-size: 0.84rem;
			font-family: var(--font-sans);
			color: var(--color-text);
			border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
			background: color-mix(in srgb, var(--color-surface) 92%, transparent);
		}

		.mobile-region-picker select:focus {
			outline: 2px solid color-mix(in srgb, var(--color-accent) 66%, transparent);
			outline-offset: 1px;
		}

		.state-story-scene {
			inset: auto 0 calc(11rem + env(safe-area-inset-bottom)) 0;
			height: auto;
			display: grid;
			justify-items: center;
			gap: 0.45rem;
			pointer-events: none;
		}

		.state-story-image {
			position: relative;
			inset: auto;
			display: block;
			width: min(94vw, 34rem);
			height: min(24svh, 13rem);
			border-radius: 0.85rem;
			object-fit: cover;
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.24);
			pointer-events: none;
		}

		.state-story-scrim {
			display: none;
		}

		.state-story-content {
			position: relative;
			left: auto;
			right: auto;
			top: auto;
			bottom: auto;
			transform: none;
			margin: 0 auto;
			width: min(94vw, 34rem);
			max-height: 44svh;
			padding: 0.9rem;
			background: color-mix(in srgb, var(--color-surface) 96%, transparent);
			backdrop-filter: blur(2px) saturate(105%);
			box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
			pointer-events: auto;
		}

		.map-instruction {
			max-width: 92vw;
			text-align: center;
			bottom: calc(6.1rem + env(safe-area-inset-bottom));
		}

		.story-meta {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}

		.story-location {
			white-space: normal;
			overflow: visible;
			text-overflow: clip;
		}

		.story-stats {
			text-align: left;
		}

		.home-footer {
			padding-inline: 0.6rem;
		}

		.footer-strip {
			grid-template-columns: 1fr;
			gap: 0.42rem;
		}

		.footer-video-reel {
			height: clamp(9.5rem, 38vw, 14rem);
		}

		.status-grid {
			grid-template-columns: 1fr;
		}

		.terminal-input-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}

		.landing-note {
			left: 50%;
			right: auto;
			top: 4.7rem;
			transform: translateX(-50%) translate(var(--note-drag-x), var(--note-drag-y)) rotate(var(--note-rot));
			width: min(94vw, 30rem);
			gap: 0.34rem;
			padding: 0.52rem 0.62rem;
			cursor: default;
			touch-action: auto;
		}

		.landing-note p {
			font-size: 0.72rem;
			line-height: 1.35;
		}
	}

	@media (max-width: 900px) and (orientation: landscape) {
		.map-stage {
			height: 100svh;
		}

		.landing-name {
			top: 0.9rem;
			font-size: clamp(1.05rem, 3.2vw, 1.35rem);
		}

		.map-sticky {
			place-items: center;
		}

		.portrait-only-notice {
			display: block;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: min(88vw, 28rem);
			padding: 0.9rem 1rem;
			border-radius: 0.85rem;
			text-align: center;
			font-family: var(--font-mono);
			font-size: 0.74rem;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--color-text-muted);
			background: color-mix(in srgb, var(--color-surface) 92%, transparent);
			border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
			z-index: 30;
		}

		.map-zoom-shell,
		.mobile-region-picker,
		.mobile-hud,
		.landing-note,
		.state-story-scene,
		.story-loading,
		.map-instruction,
		.hover-hud {
			display: none;
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
