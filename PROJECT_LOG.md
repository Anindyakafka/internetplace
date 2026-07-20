# Project Log

Chronological decision log for `internetplace`. Oldest entries first. Updated every session.

Format:
```
### YYYY-MM-DD — Title
**Decision:** what was chosen.
**Context:** why.
**Alternatives considered:** what else was on the table.
**Consequence / next step:** what this implies.
```

---

### 2026-07-20 — Framework and foundational decisions

**Decision:** Build the site with **SvelteKit** (static adapter) + **@chenglou/pretext** for long-form text. Content in Markdown under `src/content/`. Project metadata centralised in `src/data/projects.ts`.

**Context:** Site is a personal portfolio consolidating work currently scattered across `anindya.super.site`, `khanderartspace.netlify.app`, `cbfc.watch`, and several GitHub repos. Owner is comfortable with Svelte. Wants long-form prose to have true obstacle-aware text wrapping (the Dadri-forecast pretext demo is the quality bar — not CSS float hacks). Wants a "cool and modern" aesthetic inspired by aman.bh, wholeearth.info, and forensic-architecture.org.

**Alternatives considered:**
- *Next.js / React* — heavier, owner less comfortable, no clear benefit for this site's scope.
- *Astro* — excellent for content sites and would integrate pretext fine; but owner's Svelte fluency wins, and SvelteKit's SSR + static export covers the same ground.
- *Plain static HTML* — fine for 3 pages, painful once you have a project grid + individual case-study routes.
- *Eleventy / Hugo* — great for blogs, but pretext's manual line layout is a JS concern and would feel grafted-on.

**Why SvelteKit specifically:** one of the inspiration sites (aman.bh) is itself built on SvelteKit (`_app/immutable/assets` fingerprints). Same genre, proven path. Small bundle, no virtual DOM, easy Markdown content, deploys free anywhere.

**Why Pretext specifically:** owner requested it by name. It's framework-agnostic vanilla TS — wrap `prepare()` + `layoutWithLines()` in a Svelte action and render each line manually for proper reflow around floats/images. Used *only* for the long-form reader; the rest of the UI is ordinary Svelte.

**Consequences / next steps:**
1. Scaffold the actual SvelteKit project in this repo (phase 1 of `PLAN.md`).
2. Transcribe relevant CV content from `Singh_Anindya_Resume.pdf` into `src/content/about.md` (PDF stays in repo as the canonical CV).
3. Wire the Pretext reader component before writing essays, so prose quality is right from day one.
4. Decide deployment target (Netlify vs GitHub Pages) — leaning Netlify since other sites already live there.

---

### 2026-07-20 — Site information architecture

**Decision:** Four top-level areas:
1. **Home** — personal intro, selected work highlights, a feed of recent notes/bookmarks (aman.bh vibe).
2. **Work / Index** — Whole-Earth-Catalog-style grid of all projects, filterable by category (data, research, writing, art, tooling).
3. **Project case studies** — one Forensic-Architecture-style dense, image-led long-form page per project, rendered through Pretext.
4. **Writing** — long-form essays and notes, also Pretext-rendered.
Plus an **About** page (from the CV) and a **Colophon** (indieweb-style, credits the stack and sources).

**Context:** The three inspirations map onto distinct site zones rather than competing — Whole Earth = the index, FA = the case-study template, aman.bh = the home + personal voice.

**Consequence:** `src/routes/` should mirror this directly. Content files live under `src/content/{projects,essays}/`.

---

### 2026-07-20 — Repo structure frozen

**Decision:** Adopt the directory layout documented in the README (src/{routes,lib/{pretext,components,styles},content,data}, static, docs). Placeholder files created today so the structure exists before any code is written.

**Context:** Keep the repo structured from day one so the eventual SvelteKit scaffold slots in without moving things around.

**Consequence:** Next session can `npm create svelte@latest` directly into the repo root and start filling `src/routes/`.

---

### 2026-07-21 — Phase 1 Complete: All Core Pages Built

**Decision:** Build all five core pages (Home, About, Work listing, Work detail, Writing) with full content, interactivity, and a cohesive design system matching the inspirations (aman.bh, wholeearth.info, forensic-architecture.org).

**Context:** Phase 0 established scaffolding, docs, and Pretext integration. Phase 1 was the implementation phase — turning the skeleton into a living site. Each page needed to be visually distinctive yet share a consistent design language (typography scale, colour tokens, spacing rhythm). The user emphasised "cool and modern, not mediocre."

**What was built:**

1. **PretextText component** (`src/lib/pretext/PretextText.svelte`) — wraps `@chenglou/pretext` v0.0.8 `prepareWithSegments` / `layoutNextLineRange` / `materializeLineRange`. Figures positioned `absolute` inside `overflow: hidden` containers to avoid BFC collapse (the float bug). Obstacles system (`src/lib/pretext/obstacles.ts`) provides drop-cap and inline-figure obstacles. Demo route at `/writing/pretext-demo`.

2. **Home** (`src/routes/+page.svelte`, ~760 lines) — Hero with animated `fadeUp` / `fadeIn` / `cardIn` keyframes, status-dot pulse, discipline grid (3-col), featured project cards with hover lift + shadow, writing preview section. Responsive at 768px and 480px breakpoints. Reduced-motion media query.

3. **About** (`src/routes/about/+page.svelte`) — CV content rendered: education (M.Sc. Economics Shiv Nadar Inst. 2023–2025, B.Sc. Economics Bidhannagar Govt. College 2020–2023), experience (Research Consultant at Inclusion Economics India Centre / Yale, Research Assistant at Centre for Sustainable Employment / Azim Premji Univ), skills (Python, R, STATA, QGIS, JavaScript, C++, LaTeX, Git, SQL). Mix of prose and structured CV layout.

4. **Work listing** (`src/routes/work/+page.svelte`, ~600 lines) — Whole-Earth-Catalog-style grid of all 7 projects from `src/data/projects.ts`. Interactive category filter using Svelte 5 runes (`$state` for active filter, `$derived` for filtered list). 6 filter categories (all, data, research, tooling, writing, art). Project cards with title, blurb, tags, year badge, collaborator note. Collaboration CTA at bottom. Responsive grid `repeat(auto-fill, minmax(20rem, 1fr))`.

5. **Work detail** (`src/routes/work/[slug]/+page.ts` + `+page.svelte`) — Dynamic routes using SvelteKit `load` function. `+page.ts` finds project by slug with `error(404)` fallback, exports `entries()` for prerendering and `prerender = true`. `+page.svelte` displays all project fields (title, year, status, blurb, categories, repo/live links, collaborators) with a back-link to `/work`.

6. **Writing** (`src/routes/writing/+page.svelte`) — Creative writing index page with essay/notes list, Pretext demo link, collaboration CTA. Matches the home/work design patterns (local `.page-content` styles, section headers, card/list layout, animations, responsive breakpoints, reduced-motion rules).

7. **Data layer** (`src/data/projects.ts`, 150 lines) — `ProjectCategory` type, `Project` interface, 7 projects (cbfc-watch, dadri-forecast, name-ethnicity-detector, mgnrega-assets-bihar, sounding-names-religion, netcdf-manipulation-conversion, electoral-rolls-wb-2002). Exports `featuredProjects`, `projects`, `projectsByCategory(cat)`.

**Alternatives considered:**
- *Filling content lazily (stub pages first, flesh out later)* — rejected; the user wanted creative, complete pages from the start, not placeholder stubs.
- *Putting `.page-content` in global.css* — rejected; each page needs slightly different layout, so keeping it local gives per-page control while still feeling consistent.
- *Using markdown files for project content instead of a typed data file* — rejected for now; `projects.ts` gives type safety, easy filtering, and IDE autocompletion. Markdown case studies can be layered on top later for the long-form Pretext reader.

**Consequence / next step:** Core site is feature-complete. Next priorities: (1) write actual long-form essays / case studies using PretextText, (2) add a Colophon page, (3) wire up deployment to Netlify, (4) iterative visual polish and content review.
