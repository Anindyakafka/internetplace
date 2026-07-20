<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import PretextText from '$lib/pretext/PretextText.svelte';
	import type { Obstacle } from '$lib/pretext/obstacles';

	const BODY_FONT = '400 18px/1.6 Newsreader, serif';
	const LINE_HEIGHT = 30;

	const essay = `What is in a name? For economists, demographers, and sociologists studying South Asia, the answer is: quite a lot. Names in the subcontinent carry dense information about caste, religion, region, language, and sometimes even family occupation. A surname like Iyer places a person in Tamil Brahmin society; Ansari points to a North Indian Muslim weaving community; Banerjee, written either way, marks a Bengali upper-caste Hindu family.

This density makes names an attractive proxy variable in settings where direct measures of identity are unavailable or politically sensitive. Caste was dropped from the Indian census after 1931; religious affiliation, though still collected, is contested. Administrative datasets — voter rolls, land records, examination results — rarely record either. Names are often the only trace.

The project I built was an attempt to automate the inference of ethnicity and religion from name strings using a large labelled dataset and a character-level model. The technical results were respectable. But the process left me uneasy about what such tools enable, and about the gap between statistical performance and the social reality the statistics are meant to capture.

This essay is not a retraction. The detector works. It is a reflection on what "works" means when the object being measured is itself a historical and political construction.

The dataset was the hardest part. Name-to-religion and name-to-caste mappings do exist — ethnographic dictionaries, colonial-era gazetteers, community-level surveys compiled by social reform movements in the early twentieth century — but they are uneven, contested, and sometimes openly prejudicial. The Ethnographic Survey of India, conducted under Herbert Risley in the 1900s, attempted to classify every community in the subcontinent along a nasolabial index and an accompanying social hierarchy. That taxonomy is discredited. But the names it catalogued — the caste-occupation associations it encoded — still flow, indirectly, into modern labelled datasets. Tracing this lineage is uncomfortable. The training data is not neutral; it inherits a classificatory project whose political purposes were never benign.

I worked around this by combining multiple sources: electoral roll data cross-referenced with constituency-level religious demography, matrimonial website profiles that self-identify caste and community, and a hand-curated dictionary of surname-to-group mappings assembled by linguists. Each source brings its own biases. Electoral rolls overcount common names and undercount minorities in majority areas. Matrimonial profiles skew urban, educated, and English-speaking. The dictionary captures surnames that are still in active use but misses names that have been Sanskritised, Persianised, or secularised — processes by which families reshape their names to signal mobility or assimilation.

The model itself was straightforward: a character-level bidirectional LSTM trained on the labelled pairs, with a final softmax over twelve religion-caste composite classes. Character-level because names are short and morphologically productive — the suffix "-jee" is meaningful in a way that word-level tokenisation would discard. Bidirectional because both prefixes (Muhammad-, Sri-) and suffixes (-nathan, -bhai) carry signal. Twelve classes because finer granularity — say, distinguishing Agarwal from Maheshwari — pushed per-class accuracy below usable thresholds with the data I had.

On a held-out test set, overall accuracy was around 87 per cent. That sounds good. It sounded good to me, too, until I looked at the confusion matrix in detail. The model was excellent at identifying upper-caste Hindu names and Sunni Muslim names — the two largest groups in the training data. It struggled with Christians, Sikhs, and Jains, each comprising less than 3 per cent of the sample. It conflated Dalit and Adivasi surnames with regional identifiers, unable to distinguish a name that signals caste oppression from one that signals geography. And it had no idea what to do with names from the Northeast, where naming conventions follow entirely different structures — clan names, generational rotation, Christian baptismal names layered over indigenous phonology.

This is the standard long-tail problem in classification, and it is usually described as a technical challenge: get more data, rebalance the loss function, try few-shot learning. But in this context, the long tail is the point. The groups the model confuses are the groups that have been historically marginalised — the groups whose names have been reshaped by the very power structures the classifier is, implicitly, trying to measure. A Dalit family that adopted a Sanskritised surname to escape caste discrimination will be classified as upper-caste. The model is not making a random error. It is faithfully reproducing the social process that erased the signal it is looking for.

I began to see the project differently. The question was no longer "how accurate is the detector?" but "accuracy relative to what?" The ground truth labels — the target the model was optimising toward — were themselves an imperfect snapshot of a fluid, contested, and politically loaded set of categories. A name that reads as Hindu in Lucknow might read as Sikh in Ludhiana. A surname that signals landed Jat status in one decade might signal backward-caste political assertion in the next, depending on which community mobilised for reservation benefits in the intervening years. The categories are not stable. The classifier treats them as if they are.

There is also the question of what such a tool is for. The stated motivation — and it was genuine — was research: enabling economists to study discrimination in housing markets, labour markets, and credit access using administrative data that records names but not identity. If a landlord receives an application from "Mohammad Yusuf" and one from "Yusuf Mehta," does the response rate differ? The question is important. The answer requires a method to infer religion from name, because the data will not provide it directly. The detector fills that gap.

But the same tool that enables research on discrimination also enables discrimination itself. A landlord could use it. An employer could use it. A matchmaking service, a political campaign, a mob — the dual-use problem is not hypothetical. I considered not publishing the code. I considered publishing it with access controls. I considered publishing it with a detailed ethics statement and hoping for the best. I did not arrive at a clean answer. The tool exists; suppressing my version would not suppress the idea, and the idea is not hard to reproduce.

What I did do — what I am doing here — is write about the process in a way I hope is honest. Not about the algorithm, which is unremarkable, but about the data, which is not. The categories the classifier learned from are historically produced. The confusion matrix is not just a diagnostic plot; it is a map of whose identity the archive was built to see and whose it was built to erase. Any research that uses name-based inference should grapple with that fact before reporting a coefficient.

I no longer work on this project. Not because I think the research questions are illegitimate — discrimination is real, and measuring it matters — but because I became convinced that the statistical machinery was outrunning the ethical infrastructure. We have the tools to classify at scale. We do not yet have the norms to govern what happens after classification. In the gap between those two facts, a lot of harm can fit.`;

	const obstacles: Obstacle[] = [];
</script>

<svelte:head>
	<title>What's in a Name? Ethnicity Detection and its Discontents — Anindya Singh</title>
	<meta name="description" content="On building a name-to-ethnicity classifier for South Asian names, and what the process revealed about identity as a statistical object." />
</svelte:head>

<article class="page-content">
	<BackLink href="/writing">← Writing</BackLink>

	<header class="entry-header">
		<span class="entry-meta-bar">Essay · 2024</span>
		<h1>What's in a Name? Ethnicity Detection and its Discontents</h1>
		<p class="dek">Building a name-to-ethnicity classifier for South Asian names, and what it revealed about identity as a statistical object.</p>
	</header>

	<div class="pretext-body">
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


</style>
