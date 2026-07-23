export interface ProjectDetailContent {
	overview: string;
	dataAndSources: string[];
	workflow: string[];
	outputs: string[];
	note: string;
}

export const projectDetails: Record<string, ProjectDetailContent> = {
	'cbfc-watch': {
		overview:
			'CBFC Watch is an open archive of film censorship decisions in India, tracking certification-level modifications and cuts across offices and content categories. It is designed as a public research interface rather than a static dataset dump.',
		dataAndSources: [
			'CBFC certification records and modification notes (2017-2025) scraped incrementally from public board pages.',
			'Raw tables for metadata, modifications, and categories, then a joined processed dataset for analysis and publishing.',
			'Additional enhancement layers from scripted analysis, including content-type tags and duration normalization.'
		],
		workflow: [
			'Ingestion scripts fetch certificates, category tables, and modification entries in append-only runs.',
			'Cleaning scripts standardize inconsistent formats (especially durations and timestamp fragments).',
			'Join and analysis stages produce a single analyzable output used by the public site and trend views.'
		],
		outputs: [
			'Public web explorer with search, trends, office-level statistics, and topic filters.',
			'CSV-first data release for independent audits and downstream civic research workflows.',
			'Release artifacts maintained for transparent versioning and reproducibility.'
		],
		note:
			'This project treats censorship records as a living archive: the interface is built to support both close reading of single films and aggregate statistical inspection.'
	},
	'dadri-forecast': {
		overview:
			'Dadri Forecast is a militant-research initiative rooted in Gautam Buddha Nagar, focused on land transformation, ecological collapse, caste and communal violence, and extractive development. The project is built as an archive and organizing space, not just a publication.',
		dataAndSources: [
			'Field-grounded documentation from community networks around Khandera and Dadri.',
			'Archive texts, manifesto documents, and local histories assembled for counter-narrative work.',
			'Collaborative materials produced through ongoing workshops, events, and pedagogical sessions.'
		],
		workflow: [
			'Build a narrative spine around locality-specific ecological and social rupture.',
			'Publish modular archive sections for collaborators, support, events, and project material.',
			'Keep the format open to community contribution rather than freezing it into a closed report.'
		],
		outputs: [
			'Public manifesto and archive sections for political education and dissemination.',
			'Cross-media outputs such as zines, reports, and visual pedagogical material.',
			'An evolving platform for linking artistic, activist, and research practice.'
		],
		note:
			'The intention is to forecast consequences of extractive growth and build collective political imagination from the ground up.'
	},
	'name-ethnicity-detector': {
		overview:
			'This toolkit predicts likely ethnicity labels from names using character-level modeling pipelines and multiple model configurations. It is oriented toward research and audit use-cases where direct demographic labels are unavailable.',
		dataAndSources: [
			'Input CSV workflows based on a names column, plus optional prediction distribution output.',
			'Model configuration bundles covering broad multi-national and targeted country-specific setups.',
			'PyTorch-based inference stack with configurable device, batch-size, and model selection.'
		],
		workflow: [
			'Choose a model family depending on classification granularity and target population.',
			'Run batch or single-name inference with optional full probability distributions.',
			'Export prediction outputs to CSV for review, QA, and downstream analytic use.'
		],
		outputs: [
			'Configurable ethnicity prediction pipeline with command-line execution modes.',
			'Comparative model results across several predefined label systems.',
			'Portable prediction outputs for bias analysis and exploratory empirical workflows.'
		],
		note:
			'Interpretation requires caution: model confidence is not a substitute for social ground truth, especially for contested identity categories.'
	},
	'mgnrega-assets-bihar': {
		overview:
			'A resilient data-engineering pipeline for scraping and processing Bihar MGNREGA asset records at district scale, with checkpointed runs and retry logic for unstable endpoints.',
		dataAndSources: [
			'Bhuvan and MGNREGA-linked public records assembled into district-level raw and processed directories.',
			'Creation-time sheets and checkpoint files used to support resumable long runs.',
			'Structured intermediate layers that separate raw capture from categorization and merged outputs.'
		],
		workflow: [
			'Parallelized extraction with capped workers and controlled retry/backoff patterns.',
			'Checkpoint-aware execution to resume failed jobs and avoid expensive reruns.',
			'Merge and categorize district outputs into clean processed tables for analysis.'
		],
		outputs: [
			'District-level datasets ready for policy analysis and infrastructure auditing.',
			'Smoke-test modes and reproducible run scripts for operational reliability.',
			'A maintainable package structure for extending beyond Bihar.'
		],
		note:
			'The architecture prioritizes reliability under real-world scraping constraints, not just one-off extraction speed.'
	},
	'sounding-names-religion': {
		overview:
			'Sounding Names predicts religion and race-ethnicity attributes from personal names using two linked inference systems: a character n-gram TF-IDF plus SVM religion classifier and a CNN-based race-ethnicity classifier.',
		dataAndSources: [
			'Name datasets in CSV format with optional household-name concat fields for religion tasks.',
			'Pretrained vectorizers, tokenizers, encoders, and model weights bundled in-repo.',
			'Optional GIS/demographic prior inputs for enhanced race-ethnicity model modes.'
		],
		workflow: [
			'Normalize and clean names with transliteration and character-level preprocessing.',
			'Run binary or multiclass religion inference depending on selected model artifacts.',
			'Run CNN race-ethnicity inference in text-only or prior-augmented mode.'
		],
		outputs: [
			'Prediction files with class labels plus score distributions for audit interpretation.',
			'Notebook and script pathways for local or Colab execution.',
			'Operational documentation for environment compatibility and model constraints.'
		],
		note:
			'The repository includes an explicit ethics notice: protected-attribute inference carries misuse risks and should remain research-limited.'
	},
	'netcdf-manipulation-conversion': {
		overview:
			'A compact utility set for working with multidimensional climate netCDF files, including variable extraction, spatial subsetting, and conversion into tabular formats for analysis.',
		dataAndSources: [
			'netCDF atmospheric datasets (including sulfur dioxide variables) read via netCDF4.',
			'Latitude-longitude arrays used to locate target points and extract time series.',
			'Pandas-ready conversion outputs for joining with broader analysis pipelines.'
		],
		workflow: [
			'Load multidimensional arrays and identify grid indices nearest to chosen coordinates.',
			'Extract variable slices by time and location.',
			'Convert extracted values into structured CSV/DataFrame output for downstream use.'
		],
		outputs: [
			'Python scripts for repeatable netCDF to CSV transformation.',
			'Quick-start methods for exploratory climate-data processing.',
			'Utility patterns reusable across atmospheric and environmental datasets.'
		],
		note:
			'The project focuses on practical conversion and extraction workflows that reduce friction between geoscience formats and social-science analysis tools.'
	},
	'electoral-rolls-wb-2002': {
		overview:
			'This repository implements end-to-end workflows for collecting West Bengal electoral roll PDFs across two eras, then packaging large-scale outputs for reliable release and reuse.',
		dataAndSources: [
			'Booth-level 2002 roll links from ceowestbengal.nic.in captured into manifest tables.',
			'ASD/MOM 2025 flows from wb.gov.in public endpoints with district-level filtering.',
			'Raw, interim, processed, and metadata layers tracked as separate pipeline stages.'
		],
		workflow: [
			'Automate URL collection and PDF download with retry logic and status-aware manifests.',
			'Provide targeted failure-retry scripts rather than restarting full download cycles.',
			'Build release assets as chunked zip parts with checksums and scripted publish plans.'
		],
		outputs: [
			'Large archival electoral-roll collections structured for reproducible distribution.',
			'Operational scripts for reruns, recovery, and release automation.',
			'Portable release artifacts for independent research and verification.'
		],
		note:
			'It is a logistics-heavy data pipeline project: reliability, resumability, and packaging discipline are core design goals.'
	}
};
