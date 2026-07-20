<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import PretextText from '$lib/pretext/PretextText.svelte';
	import type { Obstacle } from '$lib/pretext/obstacles';

	const BODY_FONT = '400 18px/1.6 Newsreader, serif';
	const LINE_HEIGHT = 30;

	const essay = `Dadri is a tehsil in the district of Gautam Buddh Nagar, Uttar Pradesh, sitting at the edge of the National Capital Region where the sprawl of Delhi gives way to the flat, irrigated farmland of the western Gangetic plain. The landscape here is not picturesque in any obvious sense. There are no hills, no forests, no dramatic water features. But it is dense with economic activity, social friction, and the residue of a long agrarian history that is being overwritten, parcel by parcel, into something else entirely.

My fieldwork in Dadri began as an attempt to understand how land-use change proceeds in a peri-urban context. The standard narrative is one of displacement: farmers lose their land to developers, factories, and highways, and are pushed into urban precarity. This narrative is not wrong, but it is incomplete. What I found was a far more tangled process in which the category of "the farmer" itself was unstable, in which land records were contested and sometimes fabricated, in which the boundaries between agricultural and non-agricultural work were blurred beyond recognition, and in which the state was not a monolithic force but a set of competing offices with contradictory incentives and jurisdictions that overlapped in confusing ways.

The methodology I developed tried to hold this complexity rather than reduce it. I combined household surveys with oral histories, spatial analysis of land records with ethnographic observation of property disputes, and statistical modelling of crop choices with close reading of legal documents. Each method captured a different facet of the transformation, and none was sufficient on its own. The challenge was not just methodological but epistemological: how do you produce knowledge about a process that is itself contested, opaque, and continuously shifting beneath your feet?

The household survey was the backbone of the quantitative component. Working with a team of three local research assistants, I surveyed 214 households across seven villages in the tehsil over a period of four months. The survey instrument went through nine iterations before we settled on a final version. Early drafts were too long, too ambitious, modelled on the assumption that respondents would sit for ninety minutes in the heat of a north Indian summer. They would not. The final instrument took thirty-five minutes on average and focused on four domains: landholding and tenure status, cropping patterns and input costs, household labour allocation, and perceived changes in the surrounding landscape over the previous decade.

The sampling strategy was stratified by village and by distance from the nearest industrial cluster, on the assumption that proximity to non-agricultural land use would correlate with different experiences of transformation. This assumption was partially borne out by the data but also complicated by the fact that "distance" in Dadri is not a simple geometric property. A household two kilometres from a power plant might be more affected than one five hundred metres away, depending on wind patterns, road access, groundwater flow, and the social networks that mediate access to compensation and employment.

Oral histories provided what the survey could not: texture, sequence, and the subjective experience of change over time. I conducted forty-one unstructured interviews, ranging from forty minutes to three hours, with respondents identified through snowball sampling beginning with survey participants who expressed willingness to talk further. These conversations were the most rewarding and the most difficult part of the fieldwork. They were rewarding because they revealed temporal patterns invisible in cross-sectional data — the slow attrition of grazing land, the year a particular tube well went dry, the season when the first factory workers arrived as tenants in village homes. They were difficult because memory is selective, because the recent past is politically charged, and because the act of asking about land loss could reopen wounds that had not healed.

Spatial analysis formed the third pillar. I georeferenced satellite imagery from 2003, 2013, and 2023, and manually classified land use into six categories: agricultural, built-up, industrial, water bodies, roads and infrastructure, and vacant or uncultivated land. The classification was done at a resolution of thirty metres, which meant that small features — individual homes, informal paths, marginal gardens — were lost. But at the tehsil scale, the pattern was clear: agricultural land declined from roughly seventy-one percent of total area to fifty-three percent over two decades, while built-up and industrial land more than doubled. These figures became the empirical anchor for the rest of the analysis, the numbers I returned to when the qualitative material threatened to dissolve into ambiguity.

What made this spatial work harder than expected was the state of the land records themselves. The revenue documents known as khatian and khasra, maintained by the tehsil office, were often decades out of date. Plots that had been subdivided among heirs appeared as single units. Plots that had been acquired for industrial use still showed agricultural classification. Plots that had never existed appeared in the records with owners who had died years ago. Cross-referencing the satellite imagery with the revenue maps required a kind of interpretive patience that I had not anticipated, and the resulting dataset, while useful, carries an irreducible margin of uncertainty that I have tried to acknowledge rather than paper over.

Ethnographic observation of property disputes was the most improvisational method and the hardest to systematise. I attended eighteen hearings at the tehsildar's office and the sub-divisional magistrate's court, sitting in the back, taking notes, and talking to litigants during the long intervals between cases. I also accompanied a local lawyer on three field visits to disputed plots, where I saw firsthand how the abstract categories of property law intersected with the material reality of boundary walls, standing crops, and inherited trees. These experiences shaped my understanding of the land records not as neutral descriptions of reality but as instruments in ongoing struggles — documents that were weaponised, fabricated, strategically neglected, and sometimes, despite everything, accurate.

The statistical modelling attempted to identify correlates of land-use change at the household level. Using the survey data, I estimated logistic regression models predicting whether a household had sold, leased, or lost agricultural land in the previous ten years. The predictors included household size, total landholding, educational attainment, caste category, distance to nearest industrial cluster, and participation in non-farm labour markets. The results were suggestive rather than definitive. Landholding size was negatively associated with land loss, as expected. Educational attainment was positively associated, which was less expected and which I attribute, tentatively, to the greater ability of educated households to navigate the bureaucratic processes of land acquisition and compensation. But the models explained only a modest share of the variance, and the standard errors were large enough that most confidence intervals comfortably included zero. I report these results not because they are statistically powerful but because the pattern of null and weak findings is itself informative about the limits of this kind of analysis in a context where the most important variables are political and relational rather than measurable.

Close reading of legal documents — acquisition notices, compensation awards, court orders, and the occasional FIR — provided the institutional context that the other methods could not. The legal paper trail in Dadri is voluminous, contradictory, and often deliberately obscure. But tracing a single acquisition case from the initial notification under Section 4 of the Land Acquisition Act through to the final compensation disbursement revealed a process marked by long delays, procedural irregularities, and a persistent gap between the letter of the law and its implementation. This gap is not a failure to be corrected but a structural feature of how land governance works in this context, and any methodology that treats it as noise rather than signal will misunderstand the process it is trying to study.

Ethical considerations pervaded every stage of this research. Informed consent was obtained orally for all interviews and surveys, in Hindi and in the local dialect where appropriate, with a clear explanation of the research purpose and the right to withdraw at any time. Respondents were not compensated financially, following the advice of local collaborators who warned that payment could distort sampling and create expectations that would affect future researchers. I have anonymised all villages, households, and individuals in the resulting publications, and I have withheld specific details that could identify litigants in ongoing property disputes. The line between thoroughness and intrusion is not always clear in fieldwork, and I have tried to err on the side of caution.

What follows is an account of that methodology — not as a recipe to be followed, but as a set of decisions made under constraints, with all the trade-offs those decisions entailed. I describe what I did, why I did it, what it revealed, and what it missed. The account is offered in the spirit of transparency rather than authority, as one researcher's attempt to make visible the machinery behind findings that might otherwise appear more certain than they are.`;

	const obstacles: Obstacle[] = [
		{
			id: 'figure-1',
			type: 'left',
			offsetX: 0,
			offsetY: 16,
			width: 200,
			height: 260
		}
	];
</script>

<svelte:head>
	<title>Fieldwork in Dadri — Anindya Singh</title>
	<meta name="description" content="Notes on methodology from fieldwork in Dadri, western Uttar Pradesh." />
</svelte:head>

<article class="page-content">
	<BackLink href="/writing">← Writing</BackLink>

	<header class="entry-header">
		<span class="entry-meta-bar">Essay · 2024</span>
		<h1>Fieldwork in Dadri: A Methodology Note</h1>
		<p class="dek">On combining surveys, oral histories, and spatial analysis in a peri-urban field site.</p>
	</header>

	<div class="pretext-body">
		<figure class="pretext-figure">
			<img
				src="https://picsum.photos/seed/dadri-fieldwork/200/260"
				alt=""
				width="200"
				height="260"
			/>
			<figcaption>Fields on the edge of Dadri, where agricultural land meets industrial encroachment.</figcaption>
		</figure>

		<PretextText text={essay} font={BODY_FONT} lineHeight={LINE_HEIGHT} {obstacles} />
	</div>
</article>

<style>
	.page-content {
		max-width: var(--measure);
		margin-inline: auto;
		padding: 4rem 1.5rem 6rem;
	}

	.entry-header {
		margin-bottom: 3rem;
	}

	.entry-meta-bar {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.entry-header h1 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 600;
		margin-top: 0.5rem;
		line-height: 1.15;
	}

	.dek {
		font-size: 1.125rem;
		color: var(--color-text-muted);
		margin-top: 0.75rem;
		line-height: 1.5;
	}

	.pretext-body {
		position: relative;
		overflow: hidden;
		min-height: 400px;
	}

	.pretext-figure {
		position: absolute;
		top: 0;
		left: 0;
		width: 200px;
		margin: 0;
		z-index: 1;
	}

	.pretext-figure img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--radius);
	}

	.pretext-figure figcaption {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.4;
		margin-top: 0.5rem;
	}
</style>
