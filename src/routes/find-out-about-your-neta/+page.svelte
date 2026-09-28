<script lang="ts">
	import { onMount } from 'svelte';

	type Representative = Record<string, string | number | boolean | null> & {
		candidate: string; state_ut_name: string; ls_seat_name: string; party_x: string;
		criminal_cases: number; education_x: string; total_assets: number; attendance: number;
		questions: number; debates: number; age_y: number; gender: string; candidate_id: number;
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
	let mode: Mode = 'all';
	let loading = true;
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

	$: filtered = query.trim()
		? representatives.filter((item) => `${item.ls_seat_name} ${item.state_ut_name} ${item.candidate} ${item.party_x}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 40)
		: representatives.slice().sort((a,b) => a.ls_seat_name.localeCompare(b.ls_seat_name)).slice(0, 40);
	$: selectedCandidates = selected ? candidates.filter((item) => item.constituency.toLowerCase() === selected?.ls_seat_name.toLowerCase()) : [];
	$: selectedConstituency = selected ? constituencies.find((item) => item.constituency.toLowerCase() === selected?.ls_seat_name.toLowerCase()) : null;
	$: maxTopic = selected ? Math.max(1, ...topics.map(([key]) => Number(selected?.[key]) || 0)) : 1;

	function key(state: string, seat: string) { return `${state}`.trim().toLowerCase() + '|' + `${seat}`.trim().toLowerCase(); }
	function money(value: unknown) {
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
		selected = item; mobilePanel = true;
	}
	function mapPath(coordinates: any): string {
		const point = ([lng,lat]: number[]) => `${((lng-67.5)/30.5*760).toFixed(1)},${((37.7-lat)/31.7*780).toFixed(1)}`;
		const ring = (points: number[][]) => `M${points.map(point).join('L')}Z`;
		if (!Array.isArray(coordinates?.[0]?.[0]?.[0])) return coordinates.map(ring).join('');
		return coordinates.flatMap((polygon: number[][][]) => polygon.map(ring)).join('');
	}
	function featureFill(record?: Representative): string {
		if (!record) return '#d8d4ca';
		if (mode === 'cases') return Number(record.criminal_cases) >= 8 ? '#244f68' : Number(record.criminal_cases) >= 3 ? '#5b91a2' : Number(record.criminal_cases) >= 1 ? '#a8ced2' : '#edf3f4';
		if (mode === 'attendance') { const value=Number(record.attendance)||0; return value>=85?'#315f50':value>=70?'#779a73':value>=50?'#b8c7a5':'#ece8de'; }
		if (mode === 'assets') { const value=Number(record.total_assets)||0; return value>=1_000_000_000?'#651f30':value>=100_000_000?'#bd6758':value>=10_000_000?'#e2b785':'#f3eee6'; }
		if (mode === 'education') return ({'Doctorate':'#6d547e','Post Graduate':'#446f86','Graduate Professional':'#5e907f','Graduate':'#9eb46d','12th Pass':'#dfb55b','10th Pass':'#d9825f'} as Record<string,string>)[String(record.education_x)] ?? '#c9c4b8';
		return '#d9d4ca';
	}

	onMount(() => {
		let disposed = false;
		Promise.all([
			fetch('/data/neta/representatives-2019.json').then((r) => r.json()),
			fetch('/data/neta/candidates-2024.json').then((r) => r.json()),
			fetch('/data/neta/constituencies.json').then((r) => r.json()),
			fetch('/data/neta/constituencies.geojson').then((r) => r.json())
		]).then(([repData, candidateData, constituencyData, geojson]) => {
			if (disposed) return;
			representatives = repData; candidates = candidateData; constituencies = constituencyData;
			const bySeat = new Map<string, Representative>(representatives.map((item) => [key(item.state_ut_name,item.ls_seat_name),item]));
			for (const feature of geojson.features) {
				const recordKey = key(feature.properties.state_ut_name,feature.properties.ls_seat_name);
				const record = bySeat.get(recordKey);
				feature.properties = { ...feature.properties, recordKey, assets:Number(record?.total_assets)||0, cases:Number(record?.criminal_cases)||0, attendance:Number(record?.attendance)||0, education:record?.education_x ?? 'Others' };
			}
			mapFeatures = geojson.features.map((feature: any) => ({ d:mapPath(feature.geometry.coordinates), recordKey:feature.properties.recordKey, record:bySeat.get(feature.properties.recordKey) }));
			selected = representatives.find((item) => item.state_ut_name === 'West Bengal') ?? representatives[0];
			if (selected) choose(selected);
			loading = false;
		}).catch((reason) => { console.error(reason); error='The constituency archive could not be opened.'; loading=false; });
		return () => { disposed=true; };
	});
</script>

<svelte:head><title>Find out about your neta — Anindya Singh</title><meta name="description" content="Explore constituencies, representatives, affidavits, assets, criminal cases, attendance, questions, and 2024 candidates." /></svelte:head>

<main class="neta-page">
	<header class="hero"><div><p class="eyebrow">A public record of representation</p><h1>Find out about your neta.</h1></div><div class="hero-copy"><p>Read the country constituency by constituency: who represented it in the 17th Lok Sabha, what they declared, how they participated, and who contested in 2024.</p><p class="dated">Historical archive · 2019–2024 · Not a live office-holder directory</p></div></header>

	{#if error}<p class="error">{error}</p>{:else}
	<section class="explorer">
		<div class="map-column">
			<div class="mode-bar" aria-label="Map view">{#each modes as item}<button class:active={mode===item.id} onclick={() => changeMode(item.id)}>{item.label}</button>{/each}</div>
			<div class="map-wrap"><svg class="constituency-map" viewBox="0 0 760 780" role="img" aria-label="Interactive map of Lok Sabha constituencies">{#each mapFeatures as feature}<path d={feature.d} fill={featureFill(feature.record)} class:selected={selected && feature.recordKey===key(selected.state_ut_name,selected.ls_seat_name)} role="button" tabindex="-1" onclick={() => feature.record && choose(feature.record)} onkeydown={(event) => { if ((event.key==='Enter'||event.key===' ') && feature.record) choose(feature.record); }}><title>{feature.record ? `${feature.record.ls_seat_name}, ${feature.record.state_ut_name}` : 'Constituency boundary'}</title></path>{/each}</svg>{#if loading}<div class="loading"><i></i><span>Opening 545 constituencies…</span></div>{/if}<div class="map-key"><span>{modes.find((item)=>item.id===mode)?.label}</span><i class={`ramp ramp--${mode}`}></i><small>{mode==='all'?'Select any constituency':mode==='assets'?'Lower → higher declared value':mode==='cases'?'None → more declared cases':mode==='attendance'?'Lower → higher attendance':'Education categories'}</small></div></div>
			<div class="search"><label for="neta-search">Search constituency, representative, state or party</label><input id="neta-search" bind:value={query} placeholder="Try Kolkata Dakshin or West Bengal" /><div class="results">{#each filtered as item}<button class:selected={selected===item} onclick={() => choose(item)}><span><strong>{item.ls_seat_name}</strong><small>{item.state_ut_name}</small></span><span><b>{item.candidate}</b><small>{item.party_x}</small></span></button>{/each}</div></div>
		</div>

		<aside class:open={mobilePanel} class="dossier">
			{#if selected}
			<button class="mobile-close" onclick={() => mobilePanel=false} aria-label="Close constituency dossier">×</button>
			<p class="seat">{selected.ls_seat_name} · {selected.state_ut_name}</p><div class="name-row"><h2>{selected.candidate}</h2><span>{selected.party_x}</span></div>
			<div class="facts"><article><small>Declared assets · 2019</small><strong>{money(selected.total_assets)}</strong>{#if selected.end_total_assets}<em>2024: {money(selected.end_total_assets)}</em>{/if}</article><article><small>Declared criminal cases</small><strong>{selected.criminal_cases ?? '—'}</strong></article><article><small>Lok Sabha attendance</small><strong>{selected.attendance ? `${Number(selected.attendance).toFixed(1)}%` : 'Not tracked'}</strong></article><article><small>Questions · Debates</small><strong>{selected.questions ?? '—'} · {selected.debates ?? '—'}</strong></article><article><small>Education</small><strong>{selected.education_x || 'Not reported'}</strong></article><article><small>Age · Gender</small><strong>{selected.age_y || '—'} · {selected.gender || '—'}</strong></article></div>
			<section class="questions"><div><p class="mini-title">Questions by subject</p><span>{selected.questions ?? 0} questions in total</span></div>{#each topics as [topicKey,label]}{@const value=Number(selected[topicKey])||0}<div class="topic"><span>{label}</span><i><b style={`width:${value/maxTopic*100}%`}></b></i><strong>{value}</strong></div>{/each}</section>
			{#if selectedConstituency}<section class="history"><p class="mini-title">Earlier elections</p><div>{#each Object.entries(selectedConstituency.historical) as [year,result]}<article><h3>{year}<span>{result.Turnout ? `${result.Turnout}% turnout` : ''}</span></h3>{#each Object.entries(result).filter(([party])=>party!=='Turnout').sort((a,b)=>b[1]-a[1]).slice(0,4) as [party,share]}<p><span>{party}</span><i><b style={`width:${share}%`}></b></i><strong>{share}%</strong></p>{/each}</article>{/each}</div></section>{/if}
			<section class="candidate-list"><div><p class="mini-title">Candidates in 2024</p><span>{selectedCandidates.length} records</span></div><ul>{#each selectedCandidates as person}<li><div><strong>{person.candidate}</strong><small>{person.party}</small></div><span>{person.gender?.toUpperCase()} · {person.age || 'Age —'}</span></li>{/each}</ul>{#if selectedConstituency?.adr_id}<a href={`https://www.myneta.info/LokSabha2024/index.php?action=show_candidates&constituency_id=${selectedConstituency.adr_id}`} target="_blank" rel="noreferrer">Open detailed affidavits ↗</a>{/if}</section>
			{:else}<p>Select a constituency from the map or search.</p>{/if}
		</aside>
	</section>
	{/if}

	<section class="method"><p class="eyebrow">Read before using</p><div><h2>This is an archive, not a verdict.</h2><p>Assets, education and criminal cases are self-reported in election affidavits. A declared criminal case is not a conviction. Attendance and parliamentary activity require context: ministers, Speakers and some office-holders are reported differently.</p><p>Representative records describe the 17th Lok Sabha. Candidate records and historical election panels include the 2024 general election, but the page does not identify present office-holders.</p></div><div class="sources"><h3>Data sources</h3><a href="https://myneta.info/" target="_blank" rel="noreferrer">Election affidavits · MyNeta ↗</a><a href="https://prsindia.org/" target="_blank" rel="noreferrer">Parliamentary activity · PRS India ↗</a><a href="https://github.com/shijithpk/2024_maps_supplement/" target="_blank" rel="noreferrer">Constituency boundaries ↗</a></div></section>
</main>

<style>
	.constituency-map{position:absolute;inset:0;width:100%;height:100%;padding:1.2rem;box-sizing:border-box;background:#eeeae1}.constituency-map path{stroke:#756f66;stroke-width:.42;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .2s,stroke-width .2s}.constituency-map path:hover{stroke:#171614;stroke-width:1.5}.constituency-map path.selected{stroke:#171614;stroke-width:3}
	.neta-page{width:min(100%,105rem);margin:auto;padding:clamp(2rem,5vw,5rem) clamp(1rem,3vw,2.5rem) 6rem;box-sizing:border-box}.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(2rem,7vw,8rem);align-items:end;padding:2rem 0 4rem;border-bottom:1px solid var(--color-border)}.eyebrow,.mini-title{margin:0;color:var(--color-accent);font:600 var(--step--1)/1.2 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}.hero h1{max-width:9ch;margin:.65rem 0 0;font:500 clamp(4.2rem,10vw,9rem)/.79 var(--font-serif);letter-spacing:-.06em}.hero-copy{color:var(--color-text-muted);font-size:var(--step-1);line-height:1.55}.dated{font:600 var(--step--2)/1.4 var(--font-mono);text-transform:uppercase}.explorer{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(23rem,.85fr);min-height:62rem;margin-top:1.5rem;border:1px solid var(--color-border-strong);background:var(--color-surface)}.map-column{display:grid;grid-template-rows:auto minmax(35rem,62vh) auto;min-width:0;border-right:1px solid var(--color-border-strong)}.mode-bar{display:flex;overflow:auto;border-bottom:1px solid var(--color-border)}.mode-bar button{flex:1;min-width:max-content;padding:.8rem;border:0;border-right:1px solid var(--color-border);background:transparent;color:var(--color-text-muted);font:600 .7rem var(--font-mono);cursor:pointer}.mode-bar button.active{background:var(--color-text);color:var(--color-bg)}.map-wrap{position:relative;min-height:35rem}.map{position:absolute;inset:0}.loading{position:absolute;z-index:3;inset:0;display:grid;place-content:center;justify-items:center;gap:.7rem;background:#eeeae1;color:#615d55;font:600 .7rem var(--font-mono);text-transform:uppercase}.loading i{width:2rem;height:2rem;border:2px solid #b8b2a8;border-top-color:#651f30;border-radius:50%;animation:spin .8s linear infinite}.map-key{position:absolute;z-index:2;left:1rem;bottom:1rem;width:13rem;padding:.7rem;border:1px solid #aaa49a;background:#f7f4eddd;color:#36332e;box-shadow:0 5px 18px #0002}.map-key span,.map-key small{display:block;font:.65rem var(--font-mono)}.ramp{display:block;height:.45rem;margin:.4rem 0;background:#d9d4ca}.ramp--assets{background:linear-gradient(90deg,#f3eee6,#e2b785,#bd6758,#651f30)}.ramp--cases{background:linear-gradient(90deg,#edf3f4,#a8ced2,#5b91a2,#244f68)}.ramp--attendance{background:linear-gradient(90deg,#ece8de,#b8c7a5,#779a73,#315f50)}.ramp--education{background:linear-gradient(90deg,#d9825f,#dfb55b,#9eb46d,#5e907f,#446f86,#6d547e)}.search{padding:1rem}.search label{display:block;margin-bottom:.4rem;font:600 .72rem var(--font-mono)}.search input{width:100%;box-sizing:border-box;padding:.8rem;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text);font:inherit}.results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-height:14rem;overflow:auto;margin-top:.7rem;border-top:1px solid var(--color-border)}.results button{display:flex;justify-content:space-between;gap:.7rem;padding:.65rem;border:0;border-bottom:1px solid var(--color-border);background:transparent;color:var(--color-text);text-align:left;cursor:pointer}.results button:nth-child(odd){border-right:1px solid var(--color-border)}.results button:hover,.results button.selected{background:var(--color-accent-soft)}.results span,.results strong,.results b,.results small{display:block;min-width:0}.results span:last-child{text-align:right}.results strong,.results b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.73rem}.results b{font-weight:500}.results small{color:var(--color-text-muted);font-size:.62rem}.dossier{position:relative;min-width:0;max-height:calc(100vh - 5rem);overflow:auto;align-self:start;position:sticky;top:4rem}.mobile-close{display:none}.seat{margin:0;padding:1rem;border-bottom:1px solid var(--color-border);color:var(--color-accent);font:600 .7rem var(--font-mono);text-transform:uppercase}.name-row{display:flex;justify-content:space-between;gap:1rem;align-items:start;padding:1.3rem}.name-row h2{margin:0;font:500 clamp(2rem,4vw,4rem)/.92 var(--font-serif)}.name-row span{padding:.35rem .5rem;border:1px solid var(--color-border-strong);font:700 .7rem var(--font-mono)}.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-block:1px solid var(--color-border)}.facts article{display:grid;align-content:start;min-height:5.3rem;padding:1rem;border-right:1px solid var(--color-border);border-bottom:1px solid var(--color-border)}.facts article:nth-child(even){border-right:0}.facts small,.facts em{color:var(--color-text-muted);font:.65rem var(--font-mono)}.facts strong{margin-top:.35rem;font:500 var(--step-1)/1.15 var(--font-serif)}.facts em{margin-top:.3rem;font-style:normal}.questions,.history,.candidate-list{padding:1.2rem;border-bottom:1px solid var(--color-border)}.questions>div:first-child,.candidate-list>div:first-child{display:flex;justify-content:space-between;margin-bottom:.8rem}.questions>div:first-child span,.candidate-list>div:first-child span{color:var(--color-text-muted);font:.65rem var(--font-mono)}.topic{display:grid;grid-template-columns:7.5rem 1fr 2rem;gap:.5rem;align-items:center;margin:.3rem 0;font-size:.67rem}.topic i,.history i{height:.35rem;background:var(--color-border)}.topic b{display:block;height:100%;background:var(--color-accent)}.topic strong{text-align:right;font-family:var(--font-mono)}.history>div{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:.8rem}.history article{padding:.7rem;border:1px solid var(--color-border)}.history h3{display:flex;justify-content:space-between;margin:0 0 .6rem;font:600 .8rem var(--font-mono)}.history h3 span{color:var(--color-text-muted);font-size:.55rem}.history article p{display:grid;grid-template-columns:2.5rem 1fr 2.5rem;gap:.3rem;align-items:center;margin:.3rem 0;font-size:.58rem}.history i b{display:block;height:100%;background:var(--color-text)}.candidate-list ul{max-height:16rem;overflow:auto;margin:0;padding:0;list-style:none}.candidate-list li{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 0;border-top:1px solid var(--color-border)}.candidate-list li strong,.candidate-list li small{display:block}.candidate-list li strong{font-size:.75rem}.candidate-list li small,.candidate-list li>span{color:var(--color-text-muted);font:.6rem var(--font-mono)}.candidate-list a,.sources a{display:block;margin-top:.8rem;color:var(--color-accent);font:600 .7rem var(--font-mono)}.method{display:grid;grid-template-columns:.45fr 1.1fr .65fr;gap:clamp(1.5rem,5vw,5rem);padding:5rem 0;border-bottom:1px solid var(--color-border)}.method h2{margin:0;font:500 var(--step-3)/1 var(--font-serif)}.method p{color:var(--color-text-muted);line-height:1.6}.sources h3{margin:0 0 1rem;font:500 var(--step-1) var(--font-serif)}.error{padding:3rem;border:1px solid var(--color-border);color:var(--color-accent)}@keyframes spin{to{transform:rotate(360deg)}}
	@media(max-width:950px){.explorer{grid-template-columns:1fr}.map-column{border-right:0}.dossier{position:fixed;z-index:50;inset:4rem 0 0;display:none;max-height:none;background:var(--color-bg);box-shadow:0 -1rem 3rem #0004}.dossier.open{display:block}.mobile-close{position:sticky;z-index:2;top:.5rem;float:right;display:grid;place-items:center;width:2.4rem;height:2.4rem;margin:.5rem;border:1px solid var(--color-border);border-radius:50%;background:var(--color-bg);color:var(--color-text);font-size:1.5rem}.method{grid-template-columns:1fr}.history>div{grid-template-columns:repeat(3,1fr)}}
	@media(max-width:650px){.neta-page{padding-inline:1rem}.hero{grid-template-columns:1fr;padding-top:0}.hero h1{font-size:clamp(3.4rem,20vw,6rem)}.explorer{margin-inline:-1rem;border-inline:0}.map-column{grid-template-rows:auto 62vh auto}.mode-bar button{font-size:.62rem}.results{grid-template-columns:1fr}.results button:nth-child(odd){border-right:0}.history>div{grid-template-columns:1fr}.facts{grid-template-columns:1fr}.facts article{border-right:0}.topic{grid-template-columns:6.5rem 1fr 2rem}}
	@media(prefers-reduced-motion:reduce){.loading i{animation:none}}
</style>
