# Plan

Phased roadmap. Each phase ends with something visible. Update `PROJECT_LOG.md` whenever a phase's decisions shift.

---

## Phase 0 — Foundations ✅ (done 2026-07-20)
- [x] Lock framework: SvelteKit + Pretext (see `PROJECT_LOG.md`)
- [x] Lock information architecture
- [x] Repo structure scaffolded
- [x] Project metadata captured in `src/data/projects.ts`
- [x] This plan + `PROJECT_LOG.md` + README in place

## Phase 1 — SvelteKit scaffold + Pretext reader
Goal: a single essay page rendered with true pretext-quality reflow.

- [ ] `npm create svelte@latest` into repo root (TypeScript, minimal, no SSR library yet)
- [ ] Install `@chenglou/pretext`, `@sveltejs/adapter-static`
- [ ] `src/lib/pretext/PretextText.svelte` — component that:
  - takes `text`, `font`, `lineHeight`, optional obstacle regions
  - runs `prepareWithSegments` once per text/config
  - on resize, only re-runs `layoutNextLineRange`
  - renders each line as its own positioned `<span>` for obstacle-aware flow
- [ ] `src/lib/pretext/obstacles.ts` — helper that builds line-width functions for floated images/blockquotes
- [ ] One demo essay route (`/writing/pretext-demo`) to validate quality against the Dadri demo
- [ ] Global type scale + base stylesheet in `src/lib/styles/`
- **Exit:** long-form prose looks as good as the pretext Dadri demo. Nothing else matters yet.

## Phase 2 — Project index (Whole Earth grid)
Goal: browsable catalog of all work.

- [ ] Implement `src/data/projects.ts` as the single source (already seeded)
- [ ] `/work` grid route with category filter (data · research · writing · art · tooling)
- [ ] Tile = title, year, one-line blurb, thumbnail, hover state
- [ ] Pull thumbnails into `static/images/projects/`
- **Exit:** every project from the README is represented and filterable.

## Phase 3 — Project case studies (Forensic Architecture template)
Goal: dense, image-led long-form page per project.

- [ ] Dynamic route `/work/[slug]` reading from `src/content/projects/<slug>.md`
- [ ] Frontmatter schema: title, year, role, collaborators, tags, repo, liveUrl, hero, summary
- [ ] Long body rendered through the Pretext reader (obstacle-aware around images, charts, pull quotes)
- [ ] Build case studies in priority order:
  1. CBFC Watch (highest public visibility)
  2. Dadri Forecast (already polished prose)
  3. Name Ethnicity Detector
  4. MGNREGA Assets
  5. Sounding Names / Religion
  6. netCDF manipulation
  7. Electoral Rolls WB 2002
- **Exit:** top 3 projects have full case-study pages.

## Phase 4 — Home + About + Colophon
Goal: the personal "place on the internet" feel.

- [ ] Home: hero intro, 3 highlighted works, recent writing, contact line
- [ ] About: transcribed & re-flowed from `Singh_Anindya_Resume.pdf` (bio, education, skills, selected talks/experience)
- [ ] Colophon: indieweb-style — stack, sources, fonts, license
- [ ] Footer + nav (mobile-first)
- **Exit:** site is presentable as a portfolio.

## Phase 5 — Writing feed + notes
Goal: ongoing writing surface (aman.bh-style).

- [ ] `/writing` index of essays
- [ ] Markdown pipeline for `src/content/essays/`
- [ ] Optional: tiny notes/bookmarks feed (microblog-style)
- **Exit:** at least one essay published beyond the demo.

## Phase 6 — Polish & deploy
- [ ] Decide deploy target (Netlify leading — see `PROJECT_LOG.md`)
- [ ] Open Graph images, favicons, RSS feed
- [ ] Reduced-motion + accessibility pass
- [ ] Performance budget (pretext is cheap; keep images optimised)
- [ ] Custom domain wiring
- **Exit:** live at a stable URL.

---

## Design reference (don't lose these)

- **aman.bh** — SvelteKit personal site; "mishmash" structure; tone of voice; indieweb/colophon pattern.
- **wholeearth.info** — catalog grid model; item-per-tile information density; filterable index.
- **forensic-architecture.org** — case-study layout; dark, investigative, image-led long-form.
- **pretext demos** (`somnai-dreams.github.io/pretext-demos`, `chenglou.me/pretext`) — the quality bar for body-text reflow.

Notes on each live in `docs/REFERENCES.md`.
