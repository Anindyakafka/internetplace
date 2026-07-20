<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import PretextText from '$lib/pretext/PretextText.svelte';
	import type { Obstacle } from '$lib/pretext/obstacles';

	const BODY_FONT = '400 18px/1.6 Newsreader, serif';
	const LINE_HEIGHT = 30;

	const note = `QGIS is free, open-source, and occasionally infuriating. I have spent more hours than I care to admit fighting its rendering engine, its Python console, and its idiosyncratic approach to CRS transformations. But it remains the best tool for reproducible spatial analysis on a budget — which is to say, on my budget.

These notes collect the workflow I have settled on after several years of trial and error. They are not exhaustive. They are the path of least resistance I have found for going from raw shapefile to publication-quality map without losing data integrity or my sanity along the way.

The pipeline breaks into five stages: projection, topology, attribution, symbology, and export. Each stage has its own failure modes. Most of them are silent — QGIS will happily render a map from a dataset with broken geometries or mismatched projections, and the error only surfaces when a reviewer tries to replicate the result.

Projection is where everything begins, and where everything goes wrong. The first rule: never trust the CRS metadata in a shapefile you did not create. Survey of India toposheets arrive in EPSG:7755 — the new UTM-based system — but older district-level data is often still in EPSG:32644 or, worse, in an unprojected geographic coordinate system that someone has labelled WGS 84 without checking. The safest practice is to load the layer, check the CRS against the source documentation, and reproject to a common working projection before doing anything else. For most of my work on Indian states, I use EPSG:7755 for analysis and switch to a Web Mercator composite only for the final export, because reviewers and journals expect WGS 84 / Pseudo-Mercator.

Reprojection is not free. Each transformation introduces a small amount of positional error — usually centimetres, but compounding across a multi-step pipeline. If you reproject, then clip, then reproject again, you have introduced two layers of geometric drift. The rule of thumb: project once, do all spatial operations in that CRS, and convert only at the end. This sounds obvious, but QGIS does not enforce it. The "Save As" dialog happily lets you reproject at every step, and nothing in the interface warns you that you are accumulating error.

Topology is the stage that separates cartography from colouring-in. A shapefile of district boundaries looks fine on screen, but zoom in and the adjacent polygons may not share vertices. They may overlap by a few metres. They may have slivers — tiny wedge-shaped gaps between polygons that are invisible at national scale but become glaring at district scale. The Fix Geometries tool in the Processing Toolbox handles most of these: it snaps vertices within a tolerance, removes duplicate nodes, and dissolves overlaps. But the tolerance matters. Set it too tight and you fix nothing; set it too loose and you merge districts that should remain separate. I use a tolerance of 0.0001 degrees for administrative boundaries, which corresponds to roughly 11 metres at the equator — enough to clean up digitisation artefacts without collapsing real boundary features.

After fixing geometries, run a topological check. The v.clean toolset from GRASS — accessible from within QGIS — offers bbreak, rmdupl, and rmsa, which break intersections, remove duplicates, and strip small areas respectively. The output includes an error layer: examine it carefully. If the error layer contains hundreds of features, your input data has structural problems that no amount of automated cleaning will fully resolve. At that point, the honest thing is to document the limitations and move on rather than pretend the data is clean.

Attribution is where the social science lives. A polygon without attributes is just a shape; the attribute table is what turns it into a map of something — literacy rates, road density, population. The task here is joining external data to the spatial layer, and the most common failure is a silent join failure: QGIS performs the join, reports no error, but the matched rows are fewer than expected because of a leading space, a trailing newline, or a mismatched case in the key column. Always check the match rate after a join. If you have 640 districts and the join produces 612 matches, do not proceed until you know which 28 failed and why.

The other attribution problem is field name truncation. Shapefiles limit field names to 10 characters. QGIS and GeoPackage do not, but if your pipeline passes through any shapefile intermediate, the DBF will silently truncate. "DISTRICT_NAME" becomes "DISTRICT_". "LITERACY_RATE" becomes "LITERACY_". This is not a warning; it is a silent corruption. The fix: use GeoPackage as your working format throughout, and export to shapefile only if a collaborator demands it.

Symbology is where analysis meets aesthetics, and where most maps fail. The default graduated colour ramp in QGIS — a blue-to-red diverging scheme — is serviceable but communicates nothing about the data's distribution. Before classifying, examine the histogram. If the distribution is heavily skewed — and for most socioeconomic variables in India, it is — equal-interval classification will lump almost everything into one class and stretch outliers into their own. Quantile classification is better for skewed data, but it can exaggerate differences between categories that are statistically indistinguishable. Natural breaks (Jenks) is the compromise: it minimises within-class variance, but it is data-dependent and not comparable across maps.

The other symbology trap is colour choice for accessibility. Roughly 8% of men have some form of colour vision deficiency. A red-green diverging ramp is invisible to a significant fraction of your audience. Use ColorBrewer's colour-blind-safe palettes — they are built into QGIS under the colour ramp settings — and test your map with a simulator. The Coblis tool (color-blindness.com) will render your exported PNG as it appears to viewers with protanopia, deuteranopia, and tritanopia. If the map becomes illegible, choose a different ramp.

Export is the final stage and the easiest to get wrong in invisible ways. QGIS offers two export paths: "Save Map as Image" and "Layout Manager" (via the Print Layout). The former is quick but produces a raster at screen resolution — usually 96 DPI, which is unacceptable for print. The latter gives you control over DPI, paper size, and scale, but the layout interface is idiosyncratic. The critical settings: set the DPI to 300 for screen and 600 for print, set the scale to match your analysis (do not let QGIS auto-scale), and lock the map extent before adding any other elements. An unlocked extent will shift if you zoom in the main canvas, and the map in your layout will quietly change without warning.

For vector exports — PDF or SVG — QGIS has a long-standing issue with partially transparent fills. A polygon with 50% opacity may render as solid in the PDF, or may render with visible banding. The workaround: avoid transparency in the layout itself, and composite any transparency effects in a raster layer before export. Alternatively, export at high DPI to PNG and convert to the target format in Inkscape or ImageMagick, where transparency handling is more reliable.

One final note: save your QGIS project file as a .qgz (the newer format) rather than .qgs. The .qgz format bundles the project file and any embedded data into a single archive, which makes the project more portable. And store relative paths, not absolute paths, so the project works when moved between machines. These are small choices, but they are the difference between a map you can reproduce in six months and one that loads with every layer broken and every path pointing to a folder that no longer exists.

The deeper lesson is that reproducibility is not a single decision but a discipline. Every step of this pipeline — projection, topology, attribution, symbology, export — has a default that is convenient and wrong. The convenient path produces a map. The disciplined path produces a map that another researcher, given the same inputs, could reconstruct to the pixel. That is the standard I aim for, and that I frequently fall short of. But it is the right direction to fall short in.`;

	const obstacles: Obstacle[] = [
		{
			id: 'figure-1',
			type: 'left',
			offsetX: 0,
			offsetY: 16,
			width: 180,
			height: 220
		}
	];
</script>

<svelte:head>
	<title>QGIS Workflow Notes — Anindya Singh</title>
	<meta name="description" content="Practical notes on a reproducible QGIS workflow: projection, topology, attribution, symbology, and export." />
</svelte:head>

<article class="page-content">
	<BackLink href="/writing">← Writing</BackLink>

	<header class="entry-header">
		<span class="entry-meta-bar">Note · 2024</span>
		<h1>QGIS Workflow Notes</h1>
		<p class="dek">Practical notes on a reproducible pipeline from raw shapefile to publication-quality map.</p>
	</header>

	<div class="pretext-body">
		<figure class="pretext-figure pretext-figure--left">
			<img
				src="https://picsum.photos/seed/qgis-workflow/180/220"
				alt=""
				width="180"
				height="220"
			/>
			<figcaption>A typical QGIS project layout — layer panel on the left, map canvas centre, processing toolbox docked right.</figcaption>
		</figure>

		<PretextText text={note} font={BODY_FONT} lineHeight={LINE_HEIGHT} {obstacles} />
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
		width: 180px;
		margin: 0;
		z-index: 1;
	}

	.pretext-figure--left {
		left: 0;
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
