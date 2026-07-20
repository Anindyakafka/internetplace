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

---

### 2026-07-22 — Long-form essay content expanded (3 essays)

**Decision:** Expand three essay pages from stubs/placeholders into full-length long-form prose pieces, each 800–1200 words with rich, specific detail from the actual research projects.

**Context:** Phase 1 left the writing section with essay pages that had only short teaser content. The user's core requirement was to "really use pretext for all the long format text" — meaning these pages needed substantial body content to justify and showcase the Pretext obstacle-aware reflow engine. Stubs defeat the purpose.

**What was expanded:**

1. **`/writing/dadri-methodology`** — Full methodology narrative for the Dadri air-quality forecasting project. Covers data sources (Sentinel-5P TROPOMI, CPCB monitoring stations, ERA5 meteorological reanalysis), spatial interpolation approach (IDW + kriging comparison), temporal modelling (ARIMA baseline vs LSTM), and validation strategy (walk-forward CV against held-out station data).

2. **`/writing/name-ethnicity-essay`** — Extended essay on the name-to-ethnicity classifier: training data assembly (Florida voter rolls + ethnicolr-classified supplements), model architecture (character-level CNN with grapheme clusters), fairness considerations (Brahmin vs Dalit name overlap, colonial-era surnames), and downstream application to the caste-wage-gap literature.

3. **`/writing/qgis-workflow`** — Detailed QGIS workflow writeup: raw NetCDF ingestion via `r.grow.distance`, CRS reconciliation (EPSG:4326 → 7755 for South Asia), raster algebra for NO₂ anomalies, mapComposer automation through PyQGIS, and export pipeline producing both print-ready PDFs and web tiles.

**Alternatives considered:**
- *Writing essays as standalone Markdown files under `src/content/`* — the original architecture planned for this, but the PretextText component already handles the rendering pipeline inside `.svelte` pages. Adding a Markdown loader would introduce an extra hop without benefit at this stage. Can still be done later if content volume grows.
- *Keeping essays short (500 words)* — rejected; the whole point of Pretext is long-form reflow, and short copy doesn't stress-test the obstacle system.

**Consequence / next step:** The writing section now has three substantive long-form pieces. Future additions (MGNREGA assets, electoral rolls) can follow the same page template. If essay count grows beyond ~6, consider migrating to Markdown files + a dynamic `writing/[slug]` route.

---

### 2026-07-22 — Colophon page created

**Decision:** Add a dedicated **Colophon** page at `/colophon` documenting the site's technology, typography, colour system, and design inspirations.

**Context:** The original site architecture (2026-07-20 IA decision) called for a Colophon as part of the indieweb-inspired structure. It was deferred during Phase 1 to prioritise the five core pages. Now that those are complete, the Colophon rounds out the site and satisfies the "I want everything there" requirement.

**What was built:**

- **`src/routes/colophon/+page.svelte`** — Full page with four sections:
  1. *Stack* — SvelteKit + adapter-static, Svelte 5 runes, @chenglou/pretext v0.0.8, prerendered static output.
  2. *Typography* — Inter (sans), Newsreader (serif), JetBrains Mono (mono). Type scale based on 1.250 Major Third ratio with `clamp()` fluid sizing.
  3. *Colour* — Light/dark themes via `prefers-color-scheme`. Accent: #2b5acf (light) / #6b9bff (dark). Warm off-white background #fafaf7 / near-black #0e0e10.
  4. *Inspirations* — Credits aman.bh, wholeearth.info, and forensic-architecture.org with descriptions of what was borrowed from each.

- Page uses the same `page-content` container pattern, local CSS scoping, and animation keyframes as other pages. Reduced-motion query included.

**Alternatives considered:**
- *Omitting the Colophon entirely* — rejected; it's a standard indieweb convention and the user explicitly wanted a complete site.
- *Putting it in the footer as a small block* — rejected; the Colophon deserves its own page since it documents real design decisions and credits.

**Consequence / next step:** Colophon is linked from the footer and the navigation bar. Content may be updated if the stack changes or new inspirations are incorporated.

---

### 2026-07-22 — Footer and navigation wired for Colophon; CSS anchor fix

**Decision:** (1) Add Colophon to the `navLinks` array in `+layout.svelte` so it appears in the top navigation bar. (2) Convert the footer "Colophon" label from a plain `<p>` to an `<a href="/colophon">` link. (3) Add `text-decoration: none` and explicit `color: var(--color-text-muted)` to the `.footer-label` CSS rule to prevent the anchor from inheriting global link styling.

**Context:** After creating the Colophon page, it was unreachable — not in the nav, and the footer label was non-clickable. The prerenderer follows all `a href` links, so a page with no inbound links would be orphaned (though `+layout.svelte` nav links would have caught it once added). Separately, once the footer label became an anchor, it would inherit the global `a` styling (accent colour #2b5acf / #6b9bff, underline on hover), which clashed with the muted, uppercase monospace label aesthetic.

**What changed in `+layout.svelte`:**
- `navLinks` array: added `{ href: '/colophon', label: 'Colophon' }` as the fifth entry.
- Footer markup: `<p class="footer-label">Colophon</p>` → `<a class="footer-label" href="/colophon">Colophon</a>`.
- `.footer-label` CSS: added `text-decoration: none;` (prevents underline) and confirmed `color: var(--color-text-muted);` (prevents accent-colour inheritance).

**Alternatives considered:**
- *Leaving Colophon out of the nav bar (footer-only link)* — rejected; the nav bar is the primary navigation surface and the Colophon is a top-level page.
- *Creating a separate `.footer-label-link` class instead of reusing `.footer-label`* — rejected; the label styling should be identical whether it's a link or not. Adding a new class would be unnecessary duplication. The `text-decoration: none` override on the existing class is cleaner.

**Consequence / next step:** All pages are now linked from both the nav bar and the footer. The Colophon is fully reachable. No orphaned routes. Ready for final build verification.

---

### 2026-07-22 — Final build verification: PASS

**Decision:** Run `npm run build` as the final verification step for the complete portfolio site.

**Context:** After all content expansion (3 essays), Colophon page creation, and footer/nav wiring were complete, a clean production build was needed to confirm no regressions and that all routes prerender correctly for static deployment.

**Result:** ✅ **BUILD PASSED.**
- SSR bundle: 175 modules transformed in 1.36s
- Client bundle: 203 modules transformed
- All routes prerendered: `/`, `/work`, `/work/[slug]` (7 project pages), `/writing`, `/writing/dadri-methodology`, `/writing/name-ethnicity-essay`, `/writing/qgis-workflow`, `/about`, `/colophon`
- Static site written to `build/` directory
- One non-critical warning: unused pretext type imports in `PretextText.svelte` (type-only, expected — runtime usage is via dynamic reference)

**Consequence / next step:** The portfolio website is feature-complete and production-ready. Next steps when the user is ready: (1) deploy to Netlify (or other static host), (2) iterative content/visual polish, (3) optionally address the unused import warning for cleanliness.

---

### 2026-07-21 — Netlify deploy fix: page not found after successful publish

**Decision:** Add a root-level `netlify.toml` file to explicitly configure Netlify's build settings and SPA fallback for the SvelteKit static adapter.

**Context:** The site was deploying to Netlify successfully (build passed, "Published" status in Netlify dashboard), but every URL returned the "Page not found / Looks like you've followed a broken link" 404 page. The project uses `@sveltejs/adapter-static` with `fallback: '404.html'` and `pages: 'build'`, writing prerendered HTML to `build/`. Without a `netlify.toml`, Netlify was inferring the publish directory incorrectly (likely defaulting to the repo root or `dist`), so it never served the actual built site. Even with the correct publish directory, Netlify needs an explicit catch-all redirect rule to serve `404.html` as the SPA fallback for any path that doesn't match a prerendered file.

**What was added (`netlify.toml`):**
- `[build]` section: `command = "npm run build"`, `publish = "build"` — pins the build command and publish directory.
- `[[redirects]]` block: `from = "/*"`, `to = "/404.html"`, `status = 404` — serves the SPA fallback for any unmatched route, enabling client-side routing on Netlify's CDN edge.

**Alternatives considered:**
- *Switching to `@sveltejs/adapter-netlify`* — would add SSR/functions capability we don't need; the static adapter produces fully prerendered HTML and is simpler. The only missing piece was Netlify config, not the adapter.
- *Configuring publish directory only via the Netlify UI* — works but is fragile (not version-controlled, lost if the site is re-linked). `netlify.toml` is the source of truth and travels with the repo.
- *Using a 200 (rewrite) instead of 404 for the fallback* — Netlify's SPA rewrite convention is status 200 with `force = false`, but for a fully prerendered static site the 404 fallback is the canonical pattern; every prerendered page already exists as a real HTML file.

**Consequence / next step:** Redeploy on Netlify. The `netlify.toml` should be picked up automatically on the next push. Verify the homepage and at least one deep link (e.g. `/writing/dadri-methodology`) load correctly in the deployed site.
