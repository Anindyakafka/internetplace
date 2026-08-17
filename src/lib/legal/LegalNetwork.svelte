<script lang="ts">
	import type { LegalRecord } from './types';
	export let records: LegalRecord[] = [];
	export let focus: LegalRecord | null = null;
	export let onselect: (record: LegalRecord) => void = () => {};
	type Related = { record: LegalRecord; score: number; reasons: string[] };
	$: active = focus ?? records[0] ?? null;
	$: attributes = active ? [
		{ label:'Ministry', value:active.ministry ?? 'Not recorded', color:'#b85d42' },
		{ label:'Category', value:active.category ?? 'Uncategorised', color:'#4f7c72' },
		{ label:'House', value:active.introducedInHouse ?? 'Not recorded', color:'#6076a0' },
		{ label:'Status', value:active.status ?? 'Unlabelled', color:'#9a793d' },
		{ label:'Act', value:active.actNumber ? `${active.actNumber} of ${active.actYear ?? '?'}` : 'No linked Act', color:'#795f87' }
	] : [];
	$: related = active ? findRelated(active, records) : [];
	function findRelated(record: LegalRecord, candidates: LegalRecord[]): Related[] {
		return candidates.filter((c)=>c.id!==record.id).map((candidate)=>{ const reasons:string[]=[]; let score=0;
			if(record.category&&candidate.category===record.category){score+=4;reasons.push('category')}
			if(record.ministry&&candidate.ministry===record.ministry){score+=3;reasons.push('ministry')}
			if(record.actNumber&&candidate.actNumber===record.actNumber&&candidate.actYear===record.actYear){score+=5;reasons.push('Act')}
			if(record.status&&candidate.status===record.status){score+=1;reasons.push('status')}
			return {record:candidate,score,reasons}; }).filter((item)=>item.score>=3).sort((a,b)=>b.score-a.score||Math.abs((record.year??0)-(a.record.year??0))-Math.abs((record.year??0)-(b.record.year??0))).slice(0,10);
	}
	function short(text:string,length=36){return text.length>length?`${text.slice(0,length-1)}…`:text}
</script>

<section class="network-shell" aria-label="Bill relationship network">
	<header><div><p>Relationship view</p><h2>{active ? active.title : 'No bill selected'}</h2></div><div class="legend"><span><i class="attribute-dot"></i>Recorded attribute</span><span><i class="bill-dot"></i>Related bill</span></div></header>
	{#if active}<div class="canvas-wrap"><svg viewBox="0 0 1000 560" role="img" aria-labelledby="network-title network-desc"><title id="network-title">Connections for {active.title}</title><desc id="network-desc">The focus bill connects to attributes on the left and related bills on the right.</desc>
		{#each attributes as attribute,index}<line x1="350" y1="280" x2="125" y2={78+index*100} class="attribute-line" style={`--line-color:${attribute.color}`} />{/each}
		{#each related as item,index}<line x1="650" y1="280" x2="850" y2={45+index*52} class="bill-line" class:strong={item.score>=7} />{/each}
		<g class="focus-node"><rect x="350" y="215" width="300" height="130" rx="12"/><text x="375" y="248" class="node-label">FOCUS BILL · {active.year??'YEAR N/A'}</text><foreignObject x="375" y="263" width="250" height="66"><div class="focus-title">{short(active.title,72)}</div></foreignObject></g>
		{#each attributes as attribute,index}<g class="attribute-node" transform={`translate(15 ${48+index*100})`}><rect width="220" height="60" rx="8" style={`--node-color:${attribute.color}`}/><text x="14" y="21" class="node-label">{attribute.label}</text><foreignObject x="14" y="27" width="192" height="28"><div>{short(attribute.value,32)}</div></foreignObject></g>{/each}
		{#each related as item,index}<g class="related-node" transform={`translate(765 ${22+index*52})`} role="button" tabindex="0" onclick={()=>onselect(item.record)} onkeydown={(event)=>{if(event.key==='Enter'||event.key===' ')onselect(item.record)}}><rect width="220" height="44" rx="6"/><foreignObject x="10" y="6" width="198" height="32"><div><strong>{short(item.record.title,39)}</strong><small>{item.record.year??'n/a'} · {item.reasons.join(' + ')}</small></div></foreignObject></g>{/each}
	</svg></div><p class="explanation">Connections use exact shared metadata. Category and resulting Act carry more weight than ministry; status is only a minor signal. The ten strongest matches in the current filtered result are shown.</p>{:else}<p class="empty">No record is available in the current filter.</p>{/if}
</section>

<style>
	.network-shell{border:1px solid var(--color-border);background:var(--color-surface)}header{display:flex;justify-content:space-between;gap:2rem;padding:1rem 1.2rem;border-bottom:1px solid var(--color-border)}header p{margin:0;color:var(--color-accent);font:var(--step--2)/1.2 var(--font-mono);text-transform:uppercase}header h2{max-width:48rem;margin:.35rem 0 0;font:500 var(--step-1)/1.2 var(--font-serif)}.legend{display:flex;flex-wrap:wrap;align-content:start;gap:.7rem 1rem;color:var(--color-text-muted);font:var(--step--2)/1.2 var(--font-mono)}.legend span{display:flex;align-items:center;gap:.4rem}.legend i{width:.6rem;height:.6rem;display:inline-block}.attribute-dot{border-radius:50%;background:#4f7c72}.bill-dot{background:var(--color-accent)}.canvas-wrap{overflow-x:auto;background:color-mix(in srgb,var(--color-bg) 94%,var(--color-text) 6%)}svg{display:block;width:100%;min-width:760px;height:auto}.attribute-line,.bill-line{stroke-width:1.5;stroke:var(--color-border-strong);opacity:.65}.attribute-line{stroke:var(--line-color)}.bill-line.strong{stroke:var(--color-accent);stroke-width:2.5}.focus-node rect{fill:var(--color-bg);stroke:var(--color-accent);stroke-width:2}.node-label{fill:var(--color-text-muted);font:11px var(--font-mono);letter-spacing:.05em}.focus-title{color:var(--color-text);font:500 18px/1.15 var(--font-serif)}.attribute-node rect{fill:var(--color-bg);stroke:var(--node-color);stroke-width:1.5}.attribute-node foreignObject div{color:var(--color-text);font:12px/1.2 var(--font-sans)}.related-node{cursor:pointer}.related-node rect{fill:var(--color-bg);stroke:var(--color-border-strong)}.related-node:hover rect,.related-node:focus rect{stroke:var(--color-accent);stroke-width:2}.related-node foreignObject div{color:var(--color-text);font:10px/1.1 var(--font-sans)}.related-node strong,.related-node small{display:block}.related-node small{margin-top:3px;color:var(--color-text-muted);font-family:var(--font-mono)}.explanation,.empty{margin:0;padding:1rem 1.2rem;border-top:1px solid var(--color-border);color:var(--color-text-muted);font-size:var(--step--1);line-height:1.5}@media(max-width:700px){header{flex-direction:column}}
</style>
