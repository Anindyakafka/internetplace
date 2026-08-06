# internetplace

internetplace is my portfolio site: one home for projects, writing, field stories, and data work previously spread across multiple repositories and sites.

The site is built with SvelteKit (static output) and uses Pretext for long-form text layout.

## Highlights

- Interactive India map landing page with region stories and state-level metrics.
- Writing and project routes powered by Markdown + typed project metadata.
- Static deployment-friendly build, including a large-data preparation pipeline for SECC summaries.

## Tech Stack

- Framework: SvelteKit 2 + Svelte 5
- Build tool: Vite 5
- Adapter: @sveltejs/adapter-static
- Type checking: TypeScript + svelte-check
- Long-form text layout: @chenglou/pretext

## Getting Started

Requirements:

- Node.js 20+ recommended
- npm 10+

Install dependencies:

		npm install

Run development server:

		npm run dev

Build production output:

		npm run build

Preview built site locally:

		npm run preview

Run type and Svelte checks:

		npm run check

## Available Scripts

- npm run dev: start local dev server
- npm run data:prepare: generate state summary data from local SECC CSVs
- npm run build: run data prep, then build static site
- npm run preview: serve the latest built output from build/
- npm run check: sync kit types and run svelte-check
- npm run check:watch: run checks in watch mode

## Data Pipeline (SECC / SHRUG)

This project supports very large local CSV inputs without committing raw data to Git.

- Input folders (gitignored):
	- src/data/shrug-secc-mord-rural-csv/
	- src/data/shrug-secc-parsed-urban-csv/
- Generator script:
	- scripts/prepare-secc-state-summary.mjs
- Generated output:
	- static/data/secc_state_summary.json

Notes:

- npm run build always runs npm run data:prepare first.
- If raw CSVs are missing in CI/deployment environments, the build still succeeds.
- See docs/SECC_DEPLOYMENT.md for deployment modes and caveats.

## Deployment

Netlify configuration is defined in netlify.toml:

- Build command: npm run build
- Publish directory: build
- Fallback redirect to 404.html for unknown routes

## Project Structure

Below is a practical, developer-focused structure map (not every generated file is listed):

		.
		├─ docs/
		│  ├─ PRETEXT.md
		│  ├─ REFERENCES.md
		│  ├─ SECC_DEPLOYMENT.md
		│  └─ STACK.md
		├─ scripts/
		│  └─ prepare-secc-state-summary.mjs
		├─ src/
		│  ├─ app.d.ts
		│  ├─ app.html
		│  ├─ content/
		│  │  ├─ essays/
		│  │  └─ projects/
		│  │     └─ cbfc-watch.md
		│  ├─ data/
		│  │  ├─ projects.ts
		│  │  ├─ project-details.ts
		│  │  ├─ shrug-secc-mord-rural-csv/        (local, gitignored)
		│  │  └─ shrug-secc-parsed-urban-csv/      (local, gitignored)
		│  ├─ lib/
		│  │  ├─ actions/
		│  │  │  ├─ india-map.ts
		│  │  │  └─ reveal.ts
		│  │  ├─ components/
		│  │  │  ├─ BackLink.svelte
		│  │  │  └─ MarkdownLayout.svelte
		│  │  ├─ pretext/
		│  │  │  ├─ obstacles.ts
		│  │  │  └─ PretextText.svelte
		│  │  └─ styles/
		│  │     └─ global.css
		│  └─ routes/
		│     ├─ +layout.svelte
		│     ├─ +layout.ts
		│     ├─ +page.svelte
		│     ├─ about/
		│     │  └─ +page.svelte
		│     ├─ colophon/
		│     │  └─ +page.svelte
		│     ├─ map/
		│     │  └─ +page.svelte
		│     ├─ work/
		│     │  ├─ +page.svelte
		│     │  └─ [slug]/
		│     └─ writing/
		│        ├─ +page.svelte
		│        ├─ dadri-methodology/
		│        ├─ name-ethnicity-essay/
		│        ├─ pretext-demo/
		│        │  └─ +page.svelte
		│        └─ qgis-workflow/
		├─ static/
		│  ├─ assets/
		│  ├─ data/
		│  │  └─ secc_state_summary.json
		│  ├─ images/
		│  │  ├─ projects/
		│  │  └─ states/
		│  └─ favicon.svg
		├─ netlify.toml
		├─ package.json
		├─ PLAN.md
		├─ PROJECT_LOG.md
		├─ svelte.config.js
		├─ tsconfig.json
		└─ vite.config.ts

## Content and Metadata Workflow

- Project metadata source of truth: src/data/projects.ts
- Long-form and project prose: src/content/
- Shared UI and actions: src/lib/
- Route composition: src/routes/

## Conventions

- PROJECT_LOG.md is maintained chronologically (oldest to newest) and updated each working session.
- Avoid exposing personal contact details in plaintext; CV is stored as a PDF in repo root.

## External Project Links

- Dadri Forecast: https://khanderartspace.netlify.app/dadri-forecast
- Name Ethnicity Detector: https://github.com/Anindyakafka/name-ethnicity-detector
- MGNREGA Assets (Bihar): https://github.com/Anindyakafka/MGNREGA_assets
- Sounding Names / Religion: https://github.com/Anindyakafka/Sounding-Names_religion
- netCDF manipulation and conversion: https://github.com/Anindyakafka/netCDF_manipulation_x_conversion
- Electoral Rolls West Bengal 2002: https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002