# internetplace

Anindya's portfolio website — a personal "place on the internet" collecting research, data work, writing, and projects scattered across other sites into one home.

Built with **SvelteKit** + **Pretext** (chenglou's text-layout library) for the long-form reader.

---

## What lives here

| Path | Purpose |
| --- | --- |
| `src/routes/` | Pages: home, project grid, project case studies, essays, about |
| `src/lib/pretext/` | Svelte actions/components wrapping `@chenglou/pretext` |
| `src/lib/components/` | Reusable UI (cards, nav, grid, footer) |
| `src/lib/styles/` | Global styles, type scale, tokens |
| `src/content/` | Long-form Markdown (essays, project write-ups, about) |
| `src/data/projects.ts` | Single source of truth for project metadata |
| `static/` | Images, fonts, favicons, CV PDF |
| `docs/` | Reference notes, inspiration, design rationale |
| `PROJECT_LOG.md` | Chronological decision log (oldest → newest) |
| `PLAN.md` | Phased roadmap and milestones |

## The stack

- **Framework:** [SvelteKit](https://kit.svelte.dev/) (static adapter)
- **Long-form text:** [@chenglou/pretext](https://github.com/chenglou/pretext) — DOM-free measurement + manual line layout for true obstacle-aware reflow
- **Content:** Markdown in `src/content/`, loaded at build time
- **Deploy:** Netlify / Vercel / GitHub Pages (TBD — see `PROJECT_LOG.md`)
- **Fonts:** system + one display face (TBD)

## Quick start

> Scaffolding the SvelteKit project itself is phase 1 of `PLAN.md`. Once done:

```bash
npm install
npm run dev -- --open
```

## Projects indexed here

- **CBFC Watch** — [cbfc.watch](https://cbfc.watch/) · interactive explorer of Indian film censor cuts (data: [CensorBoard_records](https://github.com/Anindyakafka/CensorBoard_records))
- **Dadri Forecast** — militant research manifesto · [khanderartspace](https://khanderartspace.netlify.app/dadri-forecast)
- **Name Ethnicity Detector** — PyTorch name→ethnicity classifier, 9 model configs · [repo](https://github.com/Anindyakafka/name-ethnicity-detector)
- **MGNREGA Assets (Bihar)** — scraping + processing pipeline · [repo](https://github.com/Anindyakafka/MGNREGA_assets)
- **Sounding Names / Religion** — [repo](https://github.com/Anindyakafka/Sounding-Names_religion)
- **netCDF manipulation & conversion** — [repo](https://github.com/Anindyakafka/netCDF_manipulation_x_conversion)
- **Electoral Rolls West Bengal 2002** — [repo](https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002)
- (Older writing/research at [anindya.super.site](https://anindya.super.site/))

## Conventions

- **`PROJECT_LOG.md` is updated every session**, chronological, oldest first. Every non-trivial decision gets an entry.
- Project metadata is edited in **one place**: `src/data/projects.ts`. Pages read from there.
- Long-form prose lives in **Markdown**, rendered through Pretext — no bespoke HTML for body copy.
- No commit is pushed with the CV's personal contact details exposed in plaintext beyond the PDF already in repo.

## License

See [LICENSE](./LICENSE).
