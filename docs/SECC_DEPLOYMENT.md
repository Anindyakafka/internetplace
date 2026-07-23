# SECC Data Deployment Strategy

This project keeps raw SHRUG/SECC CSV files local and out of GitHub, then deploys only lightweight derived outputs.

## Current raw data footprint

- Rural CSV bundle: ~560 MB+
- Urban CSV bundle: ~15 MB+
- Largest single file: secc_rural_shrid.csv (~564 MB)

Raw files are intentionally ignored in Git via entries in .gitignore.

## What is deployed

A derived JSON file is generated at:

- static/data/secc_state_summary.json

It contains per-state totals and shares for:

- households
- population
- SC population and share
- ST population and share

## Build-time preparation

A new script runs before build:

- npm run data:prepare

The script:

1. Reads local CSVs if present.
2. Aggregates by pc11_state_id.
3. Writes static/data/secc_state_summary.json.
4. Exits successfully if CSVs are missing (so CI/build still works).

Environment variable overrides are supported:

- SECC_RURAL_CSV
- SECC_URBAN_CSV

## Recommended deployment modes

### Mode A: Local-first deployment (best if raw data must stay local)

1. Keep raw CSVs only on your machine.
2. Run npm run build locally (this auto-runs data:prepare).
3. Deploy the built build/ directory manually using your hosting CLI.

This keeps raw data private and still ships a data-backed site.

### Mode B: Git-driven CI deployment

If Netlify builds from GitHub and cannot access local CSVs, choose one:

1. Commit only the derived static/data/secc_state_summary.json (not raw CSVs).
2. Or host raw data in object storage and build from a separate secure pipeline.

For this repository's current setup, option 1 is simpler.

### CI-safe checklist (recommended)

When deploying from GitHub (for example Netlify auto-build):

1. Run `npm run data:prepare` locally after updating raw CSVs.
2. Commit `static/data/secc_state_summary.json` to the repository.
3. Push and let CI run `npm run build`.

Because raw CSVs are gitignored, CI cannot regenerate this file by itself unless you also provide external data access.

## License and attribution note

SHRUG data includes licensing terms in the dataset README. If you publish derived outputs, keep source attribution and usage constraints visible in your project docs.
