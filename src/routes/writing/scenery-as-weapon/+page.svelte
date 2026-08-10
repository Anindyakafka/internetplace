<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';

	const sourceUrl =
		'https://github.com/Anindyakafka/writing-for-ing-sceneries-without-sovereignty';
</script>

<svelte:head>
	<title>Scenery as Weapon — Anindya Singh</title>
	<meta
		name="description"
		content="How aesthetic order and administrative classification erase political life."
	/>
</svelte:head>

<article class="essay-shell">
	<BackLink href="/writing">← Writing</BackLink>

	<header class="essay-header">
		<div class="essay-meta">
			<span>Working essay</span>
			<span>Five movements</span>
			<span>2026</span>
		</div>
		<h1>Scenery as Weapon</h1>
		<p class="subtitle">How aesthetic order and administrative classification erase political life</p>
		<p class="standfirst">A scenery is never only a view. It is a decision.</p>
		<p class="source-note">
			Adapted from an ongoing writing project.
			<a href={sourceUrl} target="_blank" rel="noopener noreferrer">View the drafts and research repository ↗</a>
		</p>
	</header>

	<div class="essay-body">
		<div class="opening">
			<p>
				When land is made to appear as clean surface, uninterrupted horizon, or empty reserve,
				the work that produced it is removed from sight. The names that held it are removed
				from speech. The conflicts that shaped it are pushed outside the frame. What remains
				is beauty without history, ecology without labour, and territory without people. This
				is not neutrality. It is governance.
			</p>
			<p>
				Enclosing, extracting, mapping, demolishing, erasing: in each case, representation and
				administration move together. A map translates occupation into boundary. A category
				translates life into compliance. A photograph translates displacement into atmosphere.
				Scenery is not the opposite of violence. In many contexts, scenery is one of violence’s
				most efficient forms.
			</p>
		</div>

		<nav class="essay-contents" aria-label="Essay contents">
			<p>In this essay</p>
			<ol>
				<li><a href="#legibility">From Landscape to Legibility</a></li>
				<li><a href="#deletion">Deletion as Method</a></li>
				<li><a href="#censors-cut">Cultural Governance and the Censor’s Cut</a></li>
				<li><a href="#innocent-data">Against Innocent Data</a></li>
				<li><a href="#sovereignty">Scenery Without Sovereignty</a></li>
			</ol>
		</nav>

		<section id="legibility" class="essay-section">
			<span class="section-number">01</span>
			<h2>From Landscape to Legibility</h2>
			<p class="section-lede">States inherit land, but they do not rule it until they can read it.</p>
			<p>
				Legibility is often mistaken for clarity. In practice, it is a selective technology.
				Administrative systems privilege what can be coded into columns and filtered by
				categories: residence, religion, age, eligibility, language labels, and geographies of
				jurisdiction. Whatever exceeds those labels is not merely ignored; it is pressured to
				translate itself into them.
			</p>
			<p>
				The roll, register, and survey do not passively describe society. They reorganize social
				life by defining what counts as recognizable presence. A person may have lived in one
				locality for generations and still remain administratively precarious if document chains
				are unstable, script conventions shift, or local naming practices do not map cleanly onto
				standardized forms.
			</p>
			<p>
				In West Bengal, electoral records can be read as archives of both continuity and
				interruption. The 2002 rolls, preserved largely as non-searchable Bengali scans, sit at a
				crucial historical moment: they capture naming patterns, settlement references, and local
				demographic traces before later rounds of digitization and standardization altered the
				evidentiary surface. A current deletion list from 2026 does something different. It
				records institutional withdrawal from prior recognition.
			</p>
			<p>
				Read together, these archives support a rigorous question: not whether exclusion exists
				in the abstract, but where and how recognition contracts over time. If a locality’s
				population remains materially dense while its electoral record becomes thinner, the
				mismatch itself demands investigation.
			</p>
			<aside class="method-note">
				<h3>Counter-legibility in practice</h3>
				<ul>
					<li>Reconstruct machine-readable text from damaged scans.</li>
					<li>Preserve page-level references for audit trails.</li>
					<li>Build transparent confidence thresholds and manual checks.</li>
					<li>Keep uncertainty visible instead of smoothing it away.</li>
				</ul>
			</aside>
			<p>
				OCR failure in Bengali-script PDFs is not only a machine problem; it shapes what can be
				publicly proven. Legibility can be rebuilt from below as counter-legibility: a practice
				that restores names, localities, and continuities that administrative transitions tend
				to fragment.
			</p>
		</section>

		<section id="deletion" class="essay-section">
			<span class="section-number">02</span>
			<h2>Deletion as Method</h2>
			<p class="section-lede">Deletion is often narrated as housekeeping.</p>
			<p>
				The institutional vocabulary is familiar: duplication, migration, correction,
				rationalization. These terms suggest a neutral cleanup operation. But neutrality cannot
				be assumed when the burden of proof, document literacy, and access to officials are
				unevenly distributed.
			</p>
			<p>
				At individual level, every deletion appears procedural. At population level, patterns
				become visible. A sequence of routine removals can produce neighborhood-scale
				disenfranchisement without any dramatic legal rupture. This is how administrative
				violence often works: dispersed, deniable, and cumulative.
			</p>
			<div class="scale-grid">
				<div><strong>Temporal</strong><p>Compare cycles across years and election periods. Look for spikes around political contestation or administrative shifts.</p></div>
				<div><strong>Spatial</strong><p>Cluster deletions by ward, polling part, and assembly segment; examine settlement histories and minority concentration.</p></div>
				<div><strong>Relational</strong><p>Compare deletion intensity against population trends, migration indicators, and previous roll stability.</p></div>
			</div>
			<p>
				Name-based community inference must remain probabilistic, missingness must be reported,
				manual verification should be designed in advance, and qualitative testimony should
				accompany pattern claims. The point is not to accuse first and analyze later. It is to
				make selective exclusion measurable enough to contest.
			</p>
			<p>
				Deletion is not a clerical endpoint. It is an active political process through which a
				population can be thinned on paper while remaining materially present in place.
			</p>
		</section>

		<section id="censors-cut" class="essay-section">
			<span class="section-number">03</span>
			<h2>Cultural Governance and the Censor’s Cut</h2>
			<p class="section-lede">Censorship is usually discussed through scandal. Structured data lets us study it as administration rather than exception.</p>
			<p>
				Certification and cuts are often framed as balancing acts between freedom and public
				order. Yet their patterns can indicate a deeper norm-setting function. Institutions do
				not only react to offense; they pre-shape what can circulate as legitimate feeling,
				history, and dissent.
			</p>
			<div class="evidence-list">
				<p><strong>Theme density</strong> Which recurring motifs receive heightened scrutiny: religion, caste violence, state institutions, insurgency, sexuality, borderlands?</p>
				<p><strong>Lexical triggers</strong> Which words or phrases repeatedly attract cuts, mutes, or substitutions?</p>
				<p><strong>Regional gradients</strong> Do decisions vary by language region, board office, or political context?</p>
				<p><strong>Temporal clusters</strong> Do restrictions intensify around elections, communal flashpoints, or legal reforms?</p>
			</div>
			<p>
				When censor-board records are read beside electoral deletion data, an unsettling
				continuity appears. Both systems classify populations and narratives before they are
				publicly encountered. In one case, people can disappear from democratic arithmetic. In
				the other, language can disappear from public representation.
			</p>
			<p>
				The goal is not to prove a singular central conspiracy. It is to map how institutional
				caution becomes institutional bias, and how bias becomes structure through repetition.
			</p>
		</section>

		<section id="innocent-data" class="essay-section">
			<span class="section-number">04</span>
			<h2>Against Innocent Data</h2>
			<p class="section-lede">Data does not arrive from outside politics.</p>
			<p>
				It is born in forms, offices, legal categories, and infrastructures of extraction. Every
				dataset carries a production history: who collected, who classified, who dropped fields,
				who withheld publication, who relabelled columns, and who decided what was not worth
				recording. Calling data neutral is often a way of avoiding those histories.
			</p>
			<p>
				A political method does not reject quantification. It rejects innocence. It asks how
				numbers were made and what they cannot say on their own. It treats absence as information
				and administrative language as an object of analysis rather than transparent truth.
			</p>
			<blockquote>
				Do not convert contested lives into clean graphics that erase the contest. Let the visual
				hold contradiction, incompleteness, and political stakes in the same frame.
			</blockquote>
			<p>
				Historical Bengali rolls, contemporary deletion patterns, and censor-board decisions are
				incomplete evidentiary streams. Together, they make a stronger argument about selective
				visibility. Visuals should preserve that friction: uncertainty bands, OCR confidence,
				inspectable sources, and annotations that function as argument rather than ornament.
			</p>
		</section>

		<section id="sovereignty" class="essay-section">
			<span class="section-number">05</span>
			<h2>Scenery Without Sovereignty</h2>
			<p class="section-lede">Scenery is power made to look natural.</p>
			<p>
				When struggle is removed from representation, domination can appear as order. A protected
				zone appears without the history of eviction that enabled it. A clean electoral list
				appears without the labour of proving existence. A certified film appears without the
				deleted language that once named violence directly.
			</p>
			<p>
				This conversion of conflict into scenery is politically efficient because it shifts
				argument from justice to aesthetics, from rights to procedure, from history to
				administration. Against this shift, sovereignty has to be rethought from below: not as
				command over territory, but as durable relation to land, language, and collective memory;
				as refusal to disappear from record.
			</p>
			<p>
				A repaired electoral archive can return continuity where records were fractured. A mapped
				deletion pattern can identify where administrative asymmetry is concentrated. A
				structured censorship history can show which vocabularies are repeatedly disciplined out
				of public life. These practices do not restore a pure truth. They open a contested field
				where official narratives lose monopoly.
			</p>
			<p class="closing-line">
				The task is not to perfect the view. It is to interrupt who is allowed to author it.
			</p>
		</section>
	</div>
</article>

<style>
	.essay-shell { max-width: 76rem; margin-inline: auto; padding: 4rem 1.5rem 7rem; }
	.essay-header { max-width: 58rem; margin: 4rem 0 5rem; }
	.essay-meta { display: flex; flex-wrap: wrap; gap: 0.6rem 1.25rem; font-family: var(--font-mono); font-size: var(--step--2); letter-spacing: 0.07em; text-transform: uppercase; color: var(--color-accent); }
	.essay-header h1 { max-width: 12ch; margin: 0.65rem 0; font-family: var(--font-serif); font-size: clamp(3.5rem, 10vw, 8rem); font-weight: 500; line-height: 0.88; letter-spacing: -0.055em; }
	.subtitle { max-width: 39rem; margin: 1.5rem 0; font-family: var(--font-serif); font-size: var(--step-2); line-height: 1.3; color: var(--color-text-muted); }
	.standfirst { margin: 2.5rem 0 0; font-family: var(--font-serif); font-size: var(--step-3); font-style: italic; }
	.source-note { font-family: var(--font-mono); font-size: var(--step--2); line-height: 1.6; color: var(--color-text-muted); }
	.source-note a { color: var(--color-accent); }
	.essay-body { max-width: 68rem; }
	.opening { max-width: 45rem; font-family: var(--font-serif); font-size: var(--step-1); line-height: 1.7; }
	.essay-contents { max-width: 45rem; margin: 4rem 0 6rem; padding: 1.5rem 0; border-block: 1px solid var(--color-border); }
	.essay-contents > p { margin: 0 0 0.75rem; font-family: var(--font-mono); font-size: var(--step--2); letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
	.essay-contents ol { margin: 0; padding-left: 1.4rem; columns: 2; column-gap: 3rem; }
	.essay-contents li { margin-bottom: 0.45rem; padding-left: 0.25rem; break-inside: avoid; }
	.essay-contents a { color: var(--color-text); text-decoration-color: var(--color-border-strong); text-underline-offset: 0.2em; }
	.essay-section { position: relative; max-width: 45rem; margin: 0 0 8rem 8rem; scroll-margin-top: 5rem; }
	.section-number { position: absolute; right: calc(100% + 3.5rem); top: 0.5rem; font-family: var(--font-mono); font-size: var(--step--1); color: var(--color-accent); }
	.essay-section h2 { margin: 0 0 1.5rem; font-family: var(--font-serif); font-size: clamp(2.4rem, 6vw, 4.7rem); font-weight: 500; line-height: 0.98; letter-spacing: -0.035em; }
	.essay-section > p { font-family: var(--font-serif); font-size: 1.16rem; line-height: 1.72; }
	.essay-section .section-lede { margin-bottom: 2rem; font-size: var(--step-2); line-height: 1.35; color: var(--color-text-muted); }
	.method-note { margin: 2.5rem 0; padding: 1.5rem; border-left: 3px solid var(--color-accent); background: var(--color-surface); }
	.method-note h3 { margin: 0 0 0.75rem; font-family: var(--font-mono); font-size: var(--step--1); letter-spacing: 0.05em; text-transform: uppercase; }
	.method-note ul { margin: 0; padding-left: 1.2rem; line-height: 1.65; }
	.scale-grid { display: grid; grid-template-columns: repeat(3, 1fr); width: min(65rem, calc(100vw - 3rem)); margin: 2.5rem 0 2.5rem -4rem; border-block: 1px solid var(--color-border); }
	.scale-grid div { padding: 1.25rem; border-right: 1px solid var(--color-border); }
	.scale-grid div:last-child { border-right: 0; }
	.scale-grid strong, .evidence-list strong { display: block; margin-bottom: 0.45rem; font-family: var(--font-mono); font-size: var(--step--1); text-transform: uppercase; color: var(--color-accent); }
	.scale-grid p { margin: 0; font-size: var(--step--1); line-height: 1.55; color: var(--color-text-muted); }
	.evidence-list { margin: 2.5rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--color-border); border: 1px solid var(--color-border); }
	.evidence-list p { margin: 0; padding: 1.25rem; background: var(--color-bg); font-size: var(--step--1); line-height: 1.55; }
	blockquote { margin: 3rem 0; padding: 0 0 0 1.5rem; border-left: 1px solid var(--color-accent); font-family: var(--font-serif); font-size: var(--step-2); font-style: italic; line-height: 1.45; }
	.closing-line { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--color-border); font-size: var(--step-2) !important; font-style: italic; }
	@media (max-width: 720px) {
		.essay-shell { padding-inline: 1rem; }
		.essay-header { margin-top: 3rem; }
		.essay-header h1 { font-size: clamp(3.3rem, 18vw, 5.8rem); }
		.essay-contents ol { columns: 1; }
		.essay-section { margin-left: 0; margin-bottom: 6rem; }
		.section-number { position: static; display: block; margin-bottom: 0.6rem; }
		.scale-grid { grid-template-columns: 1fr; width: 100%; margin-left: 0; }
		.scale-grid div { border-right: 0; border-bottom: 1px solid var(--color-border); }
		.scale-grid div:last-child { border-bottom: 0; }
		.evidence-list { grid-template-columns: 1fr; }
	}
</style>
