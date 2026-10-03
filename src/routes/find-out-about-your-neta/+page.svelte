<script lang="ts">
	import { onMount } from 'svelte';

	type Representative = Record<string, string | number | boolean | null> & {
		candidate: string; state_ut_name: string; ls_seat_name: string; party_x: string;
		criminal_cases: number | null; education_x: string; total_assets: number | null; attendance: number | null;
		questions: number | null; debates: number | null; age_y: number | null; gender: string | null; candidate_id: number | null;
		end_total_assets?: number;
	};
	type Candidate = { candidate: string; state: string; constituency: string; party: string; gender: string; age: string };
	type Constituency = { id: string; constituency: string; state: string; adr_id: string; historical: Record<string, Record<string, number>> };
	type Mode = 'all' | 'assets' | 'cases' | 'attendance' | 'education';

	let mapFeatures: { d: string; recordKey: string; record?: Representative }[] = [];
	let representatives: Representative[] = [];
	let candidates: Candidate[] = [];
	let constituencies: Constituency[] = [];
	let selected: Representative | null = null;
	let query = '';
	let selectedState = '';
	let mode: Mode = 'all';
	let loading = true;
	let mapLoading = false;
	let mapLoaded = false;
	let candidatesLoading = false;
	let zoom = 1;
	let panX = 0;
	let panY = 0;
	let dragging = false;
	let dragMoved = false;
	let dragX = 0;
	let dragY = 0;
	let error = '';
	let mobilePanel = false;

	const modes: { id: Mode; label: string }[] = [
		{ id: 'all', label: 'All constituencies' }, { id: 'assets', label: 'Declared assets' },
		{ id: 'cases', label: 'Criminal cases' }, { id: 'attendance', label: 'Attendance' },
		{ id: 'education', label: 'Education' }
	];
	const topics = [
		['health_and_family_welfare','Health'], ['agriculture_and_farmers_welfare','Agriculture'],
		['railways','Railways'], ['finance','Finance'], ['education','Education'],
		['environment_forest_and_climate_change','Environment'], ['jal_shakti','Water'],
		['women_and_child_development','Women & children'], ['road_transport_and_highways','Roads'],
		['housing_and_urban_affairs','Housing'], ['home_affairs','Home affairs'], ['labour_and_employment','Labour']
	] as const;

	$: states = [...new Set(representatives.map((item) => item.state_ut_name))].sort((a,b) => a.localeCompare(b));
	$: filtered = representatives
		.filter((item) => !selectedState || item.state_ut_name === selectedState)
		.filter((item) => !query.trim() || `${item.ls_seat_name} ${item.state_ut_name} ${item.candidate} ${item.party_x}`.toLowerCase().includes(query.trim().toLowerCase()))
		.sort((a,b) => a.ls_seat_name.localeCompare(b.ls_seat_name))
		.slice(0, 40);
	$: selectedCandidates = selected ? candidates.filter((item) => canonicalSeat(item.constituency) === canonicalSeat(selected?.ls_seat_name ?? '')) : [];
	$: selectedConstituency = selected ? constituencies.find((item) => key(item.state,item.constituency) === key(selected?.state_ut_name ?? '',selected?.ls_seat_name ?? '')) : null;
	$: maxTopic = selected ? Math.max(1, ...topics.map(([key]) => Number(selected?.[key]) || 0)) : 1;
	$: hasTopicData = selected ? topics.some(([topicKey]) => selected?.[topicKey] != null) : false;
	$: mapViewBox = `${panX} ${panY} ${760 / zoom} ${780 / zoom}`;

	function cleanKey(value: string) {
		return `${value}`.toLowerCase().replace(/\(ex [^)]+\)/g,'').replace(/\((sc|st)\)/g,'').replace(/\band\b/g,'').replace(/[^a-z0-9]/g,'');
	}
	function canonicalSeat(seat: string) {
		const seatAliases: Record<string,string> = { andamannicobarislands:'andamannicobar',gauhati:'guwahati',hardwar:'haridwar',pondicherry:'puducherry',davanagere:'davangere',narasaraopet:'narsaraopet',tirupati:'thirupati',anantapur:'ananthapur',kurnool:'kurnoolu',palamu:'palamau',darrangudalguri:'darangudalguri',pataliputra:'patliputra',arambag:'arambagh',jaynagar:'joynagar',bahraich:'baharaich',sreerampur:'srerampur' };
		const seatKey = cleanKey(seat);
		return seatAliases[seatKey] ?? seatKey;
	}
	function key(state: string, seat: string) {
		const stateAliases: Record<string,string> = { andamannicobarislands:'andamannicobar', dadranagarhaveli:'dadranagarhavelidamandiu', damandiu:'dadranagarhavelidamandiu' };
		const stateKey=cleanKey(state), seatKey=canonicalSeat(seat);
		return (stateAliases[stateKey] ?? stateKey) + '|' + seatKey;
	}
	function money(value: unknown) {
		if (value == null || value === '') return 'Not reported';
		const amount = Number(value);
		if (!Number.isFinite(amount)) return 'Not reported';
		if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(amount >= 100_000_000 ? 0 : 1)} crore`;
		if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} lakh`;
		return `₹${amount.toLocaleString('en-IN')}`;
	}
	function metricColor(): unknown {
		if (mode === 'assets') return ['interpolate',['linear'],['coalesce',['get','assets'],0],0,'#f3eee6',10_000_000,'#e2b785',100_000_000,'#bd6758',1_000_000_000,'#651f30'];
		if (mode === 'cases') return ['step',['coalesce',['get','cases'],0],'#edf3f4',1,'#a8ced2',3,'#5b91a2',8,'#244f68'];
		if (mode === 'attendance') return ['interpolate',['linear'],['coalesce',['get','attendance'],0],0,'#ece8de',50,'#b8c7a5',75,'#779a73',100,'#315f50'];
		if (mode === 'education') return ['match',['get','education'],'Doctorate','#6d547e','Post Graduate','#446f86','Graduate Professional','#5e907f','Graduate','#9eb46d','12th Pass','#dfb55b','10th Pass','#d9825f','#c9c4b8'];
		return '#d9d4ca';
	}
	function changeMode(next: Mode) {
		mode = next;
	}
	function choose(item: Representative) {
		selected = item; selectedState = item.state_ut_name; mobilePanel = true;
		if (!candidates.length) loadCandidates();
	}
	function changeSelection() {
		selected = null; mobilePanel = false;
	}
	async function loadCandidates() {
		if (candidates.length || candidatesLoading) return;
		candidatesLoading = true;
		try { candidates = await fetch('/data/neta/candidates-2024.json').then((r) => r.json()); }
		catch (reason) { console.error('Candidate archive unavailable', reason); }
		finally { candidatesLoading = false; }
	}
	async function loadMap() {
		if (mapLoaded || mapLoading) return;
		mapLoading = true;
		try {
			const geojson = await fetch('/data/neta/constituencies.geojson').then((r) => r.json());
			const bySeat = new Map<string, Representative>(representatives.map((item) => [key(item.state_ut_name,item.ls_seat_name),item]));
			mapFeatures = geojson.features.map((feature: any) => {
				const recordKey = key(feature.properties.state_ut_name,feature.properties.ls_seat_name);
				return { d:mapPath(feature.geometry.coordinates), recordKey, record:bySeat.get(recordKey) };
			});
			mapLoaded = true;
		} catch (reason) { console.error(reason); error='The constituency map could not be opened.'; }
		finally { mapLoading=false; }
	}
	function setZoom(next: number, anchorX = .5, anchorY = .5) {
		const bounded = Math.min(8, Math.max(1, next));
		const oldWidth = 760 / zoom, oldHeight = 780 / zoom;
		const newWidth = 760 / bounded, newHeight = 780 / bounded;
		panX = Math.max(0, Math.min(760-newWidth, panX+(oldWidth-newWidth)*anchorX));
		panY = Math.max(0, Math.min(780-newHeight, panY+(oldHeight-newHeight)*anchorY));
		zoom = bounded;
	}
	function zoomMap(event: WheelEvent) {
		event.preventDefault();
		const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
		setZoom(zoom*(event.deltaY<0?1.22:.82),(event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height);
	}
	function startPan(event: PointerEvent) {
		if (event.button !== 0) return;
		dragging = true;
		dragMoved = false;
		dragX = event.clientX;
		dragY = event.clientY;
	}
	function movePan(event: PointerEvent) {
		if (!dragging) return;
		const movedX = event.clientX-dragX;
		const movedY = event.clientY-dragY;
		if (Math.abs(movedX) <= 2 && Math.abs(movedY) <= 2) return;
		if (!dragMoved) {
			dragMoved = true;
			(event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
		}
		// At 100% the viewBox already contains the entire map, so there is no
		// off-screen area to pan into. A deliberate drag gently enters the
		// pannable view instead of appearing to do nothing.
		if (zoom === 1) {
			setZoom(1.25, .5, .5);
			dragX = event.clientX;
			dragY = event.clientY;
			return;
		}
		const rect=(event.currentTarget as SVGElement).getBoundingClientRect();
		const width=760/zoom, height=780/zoom;
		panX=Math.max(0,Math.min(760-width,panX-(event.clientX-dragX)*width/rect.width));
		panY=Math.max(0,Math.min(780-height,panY-(event.clientY-dragY)*height/rect.height));
		dragX=event.clientX; dragY=event.clientY;
	}
	function endPan(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const map = event.currentTarget as SVGElement;
		if (map.hasPointerCapture(event.pointerId)) map.releasePointerCapture(event.pointerId);
	}
	function chooseFromMap(event: PointerEvent, item: Representative | undefined) {
		if (event.button === 0 && !dragMoved && item) choose(item);
	}
	function resetMap() { zoom=1; panX=0; panY=0; }
	function mapPath(coordinates: any): string {
		const point = ([lng,lat]: number[]) => `${((lng-67.5)/30.5*760).toFixed(1)},${((37.7-lat)/31.7*780).toFixed(1)}`;
		const ring = (points: number[][]) => `M${points.map(point).join('L')}Z`;
		if (!Array.isArray(coordinates?.[0]?.[0]?.[0])) return coordinates.map(ring).join('');
		return coordinates.flatMap((polygon: number[][][]) => polygon.map(ring)).join('');
	}
	function featureFill(record: Representative | undefined, currentMode: Mode): string {
		if (!record) return '#d8d4ca';
		if (currentMode === 'cases' && record.criminal_cases == null) return '#d8d4ca';
		if (currentMode === 'attendance' && record.attendance == null) return '#d8d4ca';
		if (currentMode === 'assets' && record.total_assets == null) return '#d8d4ca';
		if (currentMode === 'cases') return Number(record.criminal_cases) >= 8 ? '#244f68' : Number(record.criminal_cases) >= 3 ? '#5b91a2' : Number(record.criminal_cases) >= 1 ? '#a8ced2' : '#edf3f4';
		if (currentMode === 'attendance') { const value=Number(record.attendance)||0; return value>=85?'#315f50':value>=70?'#779a73':value>=50?'#b8c7a5':'#ece8de'; }
		if (currentMode === 'assets') { const value=Number(record.total_assets)||0; return value>=1_000_000_000?'#651f30':value>=100_000_000?'#bd6758':value>=10_000_000?'#e2b785':'#f3eee6'; }
		if (currentMode === 'education') return ({'Doctorate':'#6d547e','Post Graduate':'#446f86','Graduate Professional':'#5e907f','Graduate':'#9eb46d','12th Pass':'#dfb55b','10th Pass':'#d9825f'} as Record<string,string>)[String(record.education_x)] ?? '#c9c4b8';
		return '#d9d4ca';
	}

	onMount(() => {
		let disposed = false;
		Promise.all([
			fetch('/data/neta/representatives-2024.json').then((r) => r.json()),
			fetch('/data/neta/constituencies.json').then((r) => r.json())
		]).then(([repData, constituencyData]) => {
			if (disposed) return;
			representatives = repData; constituencies = constituencyData;
			loading = false;
			loadMap();
		}).catch((reason) => { console.error(reason); error='The constituency archive could not be opened.'; loading=false; });
		return () => { disposed=true; };
	});
</script>

<svelte:head><title>Find out about your neta — Anindya Singh</title><meta name="description" content="Explore constituencies, representatives, affidavits, assets, criminal cases, attendance, questions, and 2024 candidates." /></svelte:head>

<main class="neta-page">
	<header class="hero"><div><p class="eyebrow">A public record of representation</p><h1>Find out about your neta.</h1></div><div class="hero-copy"><p>Read the 18th Lok Sabha constituency by constituency: who represents it, what they declared for the 2024 election, and how they have participated in Parliament.</p><p class="dated">18th Lok Sabha · Activity through 13 August 2026 · Affidavit data is self-reported</p></div></header>
	<ol class="steps" aria-label="How to use this explorer"><li class:active={!selected}><span>1</span><b>Explore the map</b></li><li class:active={!!selectedState && !selected}><span>2</span><b>Pick a constituency</b></li><li class:active={!!selected}><span>3</span><b>See the record</b></li></ol>

	{#if error}<p class="error">{error}</p>{:else}
	<div class:has-selection={!!selected} class="map-workspace">
	<section id="constituency-map-panel" class="map-panel"><div class="mode-control"><span>Shade constituencies by:</span><div class="mode-bar" aria-label="Shade constituencies by">{#each modes as item}<button class:active={mode===item.id} onclick={() => changeMode(item.id)}>{item.label}</button>{/each}</div></div><div class="map-wrap"><svg class:dragging class="constituency-map" viewBox={mapViewBox} role="img" aria-label="Interactive, zoomable and draggable map of Lok Sabha constituencies" onwheel={zoomMap} onpointerdown={startPan} onpointermove={movePan} onpointerup={endPan} onpointercancel={endPan}>{#each mapFeatures as feature}<path d={feature.d} fill={featureFill(feature.record, mode)} class:selected={selected && feature.recordKey===key(selected.state_ut_name,selected.ls_seat_name)} role="button" tabindex="0" onpointerup={(event) => chooseFromMap(event, feature.record)} onkeydown={(event) => { if ((event.key==='Enter'||event.key===' ') && feature.record) choose(feature.record); }}><title>{feature.record ? `${feature.record.ls_seat_name}, ${feature.record.state_ut_name}` : 'Constituency boundary'}</title></path>{/each}</svg>{#if mapLoading || loading}<div class="loading"><i></i><span>Drawing 545 constituencies…</span></div>{/if}{#if mapLoaded}<div class="map-tools" aria-label="Map zoom controls"><button onclick={() => setZoom(zoom*1.35)} aria-label="Zoom in">+</button><button onclick={() => setZoom(zoom/1.35)} aria-label="Zoom out">−</button><button onclick={resetMap}>Reset</button><span>{Math.round(zoom*100)}%</span></div><div class="map-key"><span>{modes.find((item)=>item.id===mode)?.label}</span><i class={`ramp ramp--${mode}`}></i><small>{mode==='all'?'Click any constituency':mode==='assets'?'Lower → higher declared value':mode==='cases'?'None → more declared cases':mode==='attendance'?'Lower → higher attendance':'Education categories'}</small></div>{/if}</div></section>
	<details class="search-first" aria-busy={loading}><summary>Search by name or state instead</summary><div class="search-heading"><div><p class="eyebrow">Alternative route</p><h2>Find a constituency</h2></div>{#if loading}<span class="index-loading">Opening the record index…</span>{/if}</div><div class="search-controls"><label><span>Pick a state</span><select bind:value={selectedState}><option value="">All states and union territories</option>{#each states as state}<option value={state}>{state}</option>{/each}</select></label><label for="neta-search"><span>Search constituency, representative or party</span><input id="neta-search" bind:value={query} placeholder="Try Kolkata Dakshin" /></label></div>{#if !loading}<div class="results" aria-live="polite">{#each filtered as item}<button class:selected={selected===item} onclick={() => choose(item)}><span><strong>{item.ls_seat_name}</strong><small>{item.state_ut_name}</small></span><span><b>{item.candidate}</b><small>{item.party_x}</small></span></button>{/each}</div>{/if}</details>
	{#if selected}
	<section class="selection-bar"><div><small>Selected constituency</small><strong>{selected.ls_seat_name} · {selected.state_ut_name}</strong></div><button onclick={changeSelection}>Change constituency</button></section>
	<section class="explorer"><aside class:open={mobilePanel} class="dossier">
			<button class="mobile-close" onclick={() => mobilePanel=false} aria-label="Close constituency dossier">×</button>
			<p class="seat">{selected.ls_seat_name} · {selected.state_ut_name}</p><div class="name-row"><h2>{selected.candidate}</h2><span>{selected.party_x}</span></div>
			<div class="facts"><article><small>Declared assets · 2024</small><strong>{money(selected.total_assets)}</strong></article><article><small>Declared criminal cases · 2024</small><strong>{selected.criminal_cases ?? 'Not matched'}</strong></article><article><small>18th Lok Sabha attendance</small><strong>{selected.attendance != null ? `${Number(selected.attendance).toFixed(1)}%` : 'Not reported'}</strong></article><article><small>Questions · Debates · Bills</small><strong>{selected.questions ?? '—'} · {selected.debates ?? '—'} · {selected.private_member_bills ?? '—'}</strong></article><article><small>Education</small><strong>{selected.education_x || 'Not reported'}</strong></article><article><small>Age · Gender</small><strong>{selected.age_y || '—'} · {selected.gender || '—'}</strong></article></div>
			{#if hasTopicData}<section class="questions"><div><p class="mini-title">Questions by subject</p><span>{selected.questions ?? 0} questions in total</span></div>{#each topics as [topicKey,label]}{@const value=Number(selected[topicKey])||0}<div class="topic"><span>{label}</span><i><b style={`width:${value/maxTopic*100}%`}></b></i><strong>{value}</strong></div>{/each}</section>{/if}
			{#if selectedConstituency}<section class="history"><p class="mini-title">Earlier elections</p><div>{#each Object.entries(selectedConstituency.historical) as [year,result]}<article><h3>{year}<span>{result.Turnout ? `${result.Turnout}% turnout` : ''}</span></h3>{#each Object.entries(result).filter(([party])=>party!=='Turnout').sort((a,b)=>b[1]-a[1]).slice(0,4) as [party,share]}<p><span>{party}</span><i><b style={`width:${share}%`}></b></i><strong>{share}%</strong></p>{/each}</article>{/each}</div></section>{/if}
			<section class="candidate-list"><div><p class="mini-title">Candidates in 2024</p><span>{candidatesLoading ? 'Loading records…' : `${selectedCandidates.length} records`}</span></div><ul>{#each selectedCandidates as person}<li><div><strong>{person.candidate}</strong><small>{person.party}</small></div><span>{person.gender?.toUpperCase()} · {person.age || 'Age —'}</span></li>{/each}</ul>{#if selectedConstituency?.adr_id}<a href={`https://www.myneta.info/LokSabha2024/index.php?action=show_candidates&constituency_id=${selectedConstituency.adr_id}`} target="_blank" rel="noreferrer">Open detailed affidavits ↗</a>{/if}</section>
		</aside>
	</section>
	{/if}
	</div>
	{/if}

	<section class="method"><p class="eyebrow">Read before using</p><details><summary>Full context, limitations and data sources</summary><div class="method-body"><div><h2>This is a public record, not a verdict.</h2><p>Assets, education and criminal cases come from self-reported 2024 election affidavits. A declared criminal case is not a conviction. Where a current MP could not be matched safely to an affidavit record, those fields say “Not reported” or “Not matched” rather than borrowing another person's declaration.</p><p>Parliamentary activity describes the 18th Lok Sabha through 13 August 2026. Attendance and activity require context: ministers, the Speaker and some office-holders are reported differently by PRS.</p></div><div class="sources"><h3>Data sources</h3><a href="https://www.myneta.info/LokSabha2024/index.php?action=show_winners" target="_blank" rel="noreferrer">2024 election affidavits · ADR/MyNeta ↗</a><a href="https://prsindia.org/mptrack" target="_blank" rel="noreferrer">18th Lok Sabha activity · PRS India ↗</a><a href="https://github.com/shijithpk/2024_maps_supplement/" target="_blank" rel="noreferrer">Constituency boundaries ↗</a></div></div></details></section>
</main>

<style>
	.constituency-map{position:absolute;inset:0;width:100%;height:100%;padding:1.2rem;box-sizing:border-box;background:#eeeae1;cursor:grab;touch-action:none}.constituency-map.dragging{cursor:grabbing}.constituency-map path{stroke:#756f66;stroke-width:.42;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .2s,stroke-width .2s}.constituency-map path:hover{stroke:#171614;stroke-width:1.5}.constituency-map path.selected{stroke:#171614;stroke-width:3}
	.neta-page{width:min(100%,105rem);margin:auto;padding:clamp(2rem,5vw,5rem) clamp(1rem,3vw,2.5rem) 6rem;box-sizing:border-box}.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(2rem,7vw,8rem);align-items:end;padding:2rem 0 4rem;border-bottom:1px solid var(--color-border)}.eyebrow,.mini-title{margin:0;color:var(--color-accent);font:600 var(--step--1)/1.2 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.hero h1{max-width:9ch;margin:.65rem 0 0;font:500 clamp(4.2rem,10vw,9rem)/.79 var(--font-serif);letter-spacing:-.06em}.hero-copy{color:var(--color-text-muted);font-size:var(--step-1);line-height:1.55}.dated{font:600 var(--step--2)/1.4 var(--font-mono);text-transform:uppercase}.explorer{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(23rem,.85fr);min-height:62rem;margin-top:1.5rem;border:1px solid var(--color-border-strong);background:var(--color-surface)}.mode-bar{display:flex;overflow:auto;border-bottom:1px solid var(--color-border)}.mode-bar button{flex:1;min-width:max-content;padding:.8rem;border:0;border-right:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);font:600 .7rem var(--font-mono);cursor:pointer}.mode-bar button.active{background:var(--color-text);color:var(--color-bg)}.map-wrap{position:relative;min-height:35rem}.loading{position:absolute;z-index:3;inset:0;display:grid;place-content:center;justify-items:center;gap:.7rem;background:#eeeae1;color:#615d55;font:600 .7rem var(--font-mono);text-transform:uppercase}.loading i{width:2rem;height:2rem;border:2px solid #b8b2a8;border-top-color:#651f30;border-radius:50%;animation:spin .8s linear infinite}.map-key{position:absolute;z-index:2;left:1rem;bottom:1rem;width:13rem;padding:.7rem;border:1px solid #aaa49a;background:#f7f4eddd;color:#36332e;box-shadow:0 5px 18px #0002}.map-key span,.map-key small{display:block;font:.65rem var(--font-mono)}.ramp{display:block;height:.45rem;margin:.4rem 0;background:#d9d4ca}.ramp--assets{background:linear-gradient(90deg,#f3eee6,#e2b785,#bd6758,#651f30)}.ramp--cases{background:linear-gradient(90deg,#edf3f4,#a8ced2,#5b91a2,#244f68)}.ramp--attendance{background:linear-gradient(90deg,#ece8de,#b8c7a5,#779a73,#315f50)}.ramp--education{background:linear-gradient(90deg,#d9825f,#dfb55b,#9eb46d,#5e907f,#446f86,#6d547e)}.results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-height:14rem;overflow:auto;margin-top:.7rem;border-top:1px solid var(--color-border)}.results button{display:flex;justify-content:space-between;gap:.7rem;padding:.65rem;border:0;border-bottom:1px solid var(--color-border);background:transparent;color:var(--color-text);text-align:left;cursor:pointer}.results button:nth-child(odd){border-right:1px solid var(--color-border)}.results button:hover,.results button.selected{background:var(--color-accent-soft)}.results span,.results strong,.results b,.results small{display:block;min-width:0}.results span:last-child{text-align:right}.results strong,.results b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.73rem}.results b{font-weight:500}.results small{color:var(--color-text-muted);font-size:.62rem}.dossier{position:relative;min-width:0;max-height:calc(100vh - 5rem);overflow:auto;align-self:start;position:sticky;top:4rem}.mobile-close{display:none}.seat{margin:0;padding:1rem;border-bottom:1px solid var(--color-border);color:var(--color-accent);font:600 .7rem var(--font-mono);text-transform:uppercase}.name-row{display:flex;justify-content:space-between;gap:1rem;align-items:start;padding:1.3rem}.name-row h2{margin:0;font:500 clamp(2rem,4vw,4rem)/.92 var(--font-serif)}.name-row span{padding:.35rem .5rem;border:1px solid var(--color-border-strong);font:700 .7rem var(--font-mono)}.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-block:1px solid var(--color-border)}.facts article{display:grid;align-content:start;min-height:5.3rem;padding:1rem;border-right:1px solid var(--color-border);border-bottom:1px solid var(--color-border)}.facts article:nth-child(even){border-right:0}.facts small{color:var(--color-text-muted);font:.65rem var(--font-mono)}.facts strong{margin-top:.35rem;font:500 var(--step-1)/1.15 var(--font-serif)}.questions,.history,.candidate-list{padding:1.2rem;border-bottom:1px solid var(--color-border)}.questions>div:first-child,.candidate-list>div:first-child{display:flex;justify-content:space-between;margin-bottom:.8rem}.questions>div:first-child span,.candidate-list>div:first-child span{color:var(--color-text-muted);font:.65rem var(--font-mono)}.topic{display:grid;grid-template-columns:7.5rem 1fr 2rem;gap:.5rem;align-items:center;margin:.3rem 0;font-size:.67rem}.topic i,.history i{height:.35rem;background:var(--color-border)}.topic b{display:block;height:100%;background:var(--color-accent)}.topic strong{text-align:right;font-family:var(--font-mono)}.history>div{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:.8rem}.history article{padding:.7rem;border:1px solid var(--color-border)}.history h3{display:flex;justify-content:space-between;margin:0 0 .6rem;font:600 .8rem var(--font-mono)}.history h3 span{color:var(--color-text-muted);font-size:.55rem}.history article p{display:grid;grid-template-columns:2.5rem 1fr 2.5rem;gap:.3rem;align-items:center;margin:.3rem 0;font-size:.58rem}.history i b{display:block;height:100%;background:var(--color-text)}.candidate-list ul{max-height:16rem;overflow:auto;margin:0;padding:0;list-style:none}.candidate-list li{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 0;border-top:1px solid var(--color-border)}.candidate-list li strong,.candidate-list li small{display:block}.candidate-list li strong{font-size:.75rem}.candidate-list li small,.candidate-list li>span{color:var(--color-text-muted);font:.6rem var(--font-mono)}.candidate-list a,.sources a{display:block;margin-top:.8rem;color:var(--color-accent);font:600 .7rem var(--font-mono)}.method{display:grid;grid-template-columns:.45fr 1.1fr .65fr;gap:clamp(1.5rem,5vw,5rem);padding:5rem 0;border-bottom:1px solid var(--color-border)}.method h2{margin:0;font:500 var(--step-3)/1 var(--font-serif)}.method p{color:var(--color-text-muted);line-height:1.6}.sources h3{margin:0 0 1rem;font:500 var(--step-1) var(--font-serif)}.error{padding:3rem;border:1px solid var(--color-border);color:var(--color-accent)}@keyframes spin{to{transform:rotate(360deg)}}
	.steps{display:grid;grid-template-columns:repeat(3,1fr);margin:0;padding:0;border-bottom:1px solid var(--color-border);list-style:none}.steps li{display:flex;gap:.65rem;align-items:center;padding:1rem;color:var(--color-text-muted);font:600 .7rem var(--font-mono);text-transform:uppercase}.steps li+li{border-left:1px solid var(--color-border)}.steps span{display:grid;place-items:center;width:1.7rem;height:1.7rem;border:1px solid var(--color-border-strong);border-radius:50%}.steps li.active{color:var(--color-text)}.steps li.active span{background:var(--color-text);color:var(--color-bg)}
	.map-workspace{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(22rem,.85fr);grid-template-rows:auto minmax(0,1fr) auto}.map-workspace .map-panel{grid-column:1/-1;grid-row:1/3}.map-workspace.has-selection .map-panel{grid-column:1}.map-workspace .search-first{grid-column:1/-1;grid-row:3}.map-workspace .selection-bar{grid-column:2;grid-row:1;margin:0}.map-workspace .explorer{grid-column:2;grid-row:2;min-width:0;min-height:0}.map-workspace .dossier{height:calc(min(68rem,72vh) - 3.9rem);max-height:none;overflow:auto}
	.map-workspace.has-selection .mode-control{display:block}.map-workspace.has-selection .mode-control>span{display:block;padding-bottom:.55rem}.map-workspace.has-selection .mode-bar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));overflow:visible}.map-workspace.has-selection .mode-bar button{min-width:0;white-space:normal;border-top:1px solid var(--color-border)}
	.search-first{padding:0 clamp(1rem,3vw,2rem) clamp(1rem,3vw,2rem);border:1px solid var(--color-border-strong);border-top:0}.search-first>summary{margin-inline:calc(clamp(1rem,3vw,2rem) * -1);padding:1rem clamp(1rem,3vw,2rem);cursor:pointer;font:600 .72rem var(--font-mono)}.search-heading,.selection-bar{display:flex;justify-content:space-between;gap:1rem;align-items:center}.search-heading{padding-top:1rem}.search-heading h2{margin:.35rem 0 0;font:500 var(--step-3)/1 var(--font-serif)}.index-loading{font:600 .65rem var(--font-mono);text-transform:uppercase}.search-controls{display:grid;grid-template-columns:minmax(13rem,.55fr) minmax(15rem,1fr);gap:1rem;margin-top:1.5rem}.search-controls label span{display:block;margin-bottom:.4rem;font:600 .7rem var(--font-mono)}.search-controls input,.search-controls select{width:100%;box-sizing:border-box;padding:.8rem;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text);font:inherit}.search-first .results{max-height:19rem}
	.map-panel{min-width:0;border:1px solid var(--color-border-strong);border-top:0}.mode-control{position:relative;z-index:4;display:flex;align-items:center;border-bottom:1px solid var(--color-border);background:var(--color-bg)}.mode-control>span{padding:.8rem 1rem;white-space:nowrap;font:600 .7rem var(--font-mono)}.mode-bar{flex:1;min-width:0}.map-panel .map-wrap{height:min(68rem,72vh);min-height:35rem}.constituency-map path:focus,.constituency-map path:focus-visible{outline:none!important;outline-color:transparent}.constituency-map path:focus-visible{stroke:#171614;stroke-width:3}.map-tools{position:absolute;z-index:2;top:1rem;right:1rem;display:flex;align-items:center;border:1px solid #aaa49a;background:#f7f4edee;color:#36332e;box-shadow:0 5px 18px #0002}.map-tools button,.map-tools span{min-width:2.25rem;padding:.55rem;border:0;border-right:1px solid #aaa49a;background:transparent;color:inherit;font:600 .65rem var(--font-mono)}.map-tools button{cursor:pointer}.map-tools span{border:0;text-align:center}
	.selection-bar{margin-top:1.5rem;padding:1rem 1.2rem;border:1px solid var(--color-border-strong);background:var(--color-text);color:var(--color-bg)}.selection-bar small,.selection-bar strong{display:block}.selection-bar small{font:.6rem var(--font-mono);text-transform:uppercase}.selection-bar button{padding:.55rem .8rem;border:1px solid currentColor;background:transparent;color:inherit;font:600 .65rem var(--font-mono);cursor:pointer}.explorer{display:block;min-height:0;margin-top:0}.dossier{position:static;max-height:none}.method{grid-template-columns:.35fr 1.65fr}.method details{min-width:0}.method summary{cursor:pointer;font:500 var(--step-1) var(--font-serif)}.method-body{display:grid;grid-template-columns:1fr .55fr;gap:clamp(1.5rem,5vw,5rem);padding-top:2rem}
	@media(max-width:950px){.map-workspace,.map-workspace.has-selection{display:block}.map-workspace .selection-bar{display:none}.map-workspace .dossier{position:fixed;z-index:50;inset:4rem 0 0;display:none;height:auto;max-height:none;overflow:auto;background:var(--color-bg);box-shadow:0 -1rem 3rem #0004}.map-workspace .dossier.open{display:block}.mobile-close{position:sticky;z-index:2;top:.5rem;float:right;display:grid;place-items:center;width:2.4rem;height:2.4rem;margin:.5rem;border:1px solid var(--color-border);border-radius:50%;background:var(--color-bg);color:var(--color-text);font-size:1.5rem}.method{grid-template-columns:1fr}.method-body{grid-template-columns:1fr}.history>div{grid-template-columns:repeat(3,1fr)}}
	@media(max-width:650px){.neta-page{padding-inline:1rem}.hero{grid-template-columns:1fr;padding-top:0}.hero h1{font-size:clamp(3.4rem,20vw,6rem)}.steps{grid-template-columns:1fr}.steps li+li{border-top:1px solid var(--color-border);border-left:0}.search-controls{grid-template-columns:1fr}.mode-control{display:block}.mode-control>span{display:block}.mode-bar button{font-size:.62rem}.map-panel .map-wrap{height:62vh;min-height:28rem}.selection-bar{align-items:flex-start}.results{grid-template-columns:1fr}.results button:nth-child(odd){border-right:0}.history>div{grid-template-columns:1fr}.facts{grid-template-columns:1fr}.facts article{border-right:0}.topic{grid-template-columns:6.5rem 1fr 2rem}}
	@media(prefers-reduced-motion:reduce){.loading i{animation:none}}
</style>
