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

---

### 2026-07-22 — Map page initiated

**Decision:** Create a new **Map** landing page at `/map` featuring an interactive India SVG that shows geographic distribution of work and allows clicking on states/regions to explore related projects.

**Context:** The portfolio site, though complete, lacked a geographic visualization component. Given that most work is India-focused (Dadri air quality in Uttar Pradesh, West Bengal electoral rolls, Bihar MGNREGA assets, caste-wage-gap studies), a map interface provides an intuitive, visual way to discover projects by location. Matches the "cool and modern" aesthetic while adding functional depth.

**What will be built:**
- **`src/routes/map/+page.svelte`** — Full-screen or large-section map page with:
  1. Interactive India SVG (states as clickable paths with hover states)
  2. Sidebar or overlay panel showing projects for selected region
  3. Search/filter by location or project type
  4. Responsive layout (mobile-first)
  5. Visual indicators for regions with active projects
  6. Same design language as rest of site (Inter/Newsreader, colour tokens, spacing rhythm)
  7. Reduced-motion support for accessibility

- **India SVG asset** — to be placed at `static/images/india-map.svg`. Once placed, will be loaded via `<img>` with inline fallback until implementation completes.

- **Navigation integration** — Add Map to `navLinks` array in `+layout.svelte` for consistent site-wide access.

**Alternatives considered:**
- *Using a map library like Leaflet or Mapbox* — rejected; overkill for static project locations, adds significant bundle weight, India boundaries require custom tiles anyway. Inline SVG gives total control and is lightweight.
- *Building only a static map image* — rejected; interactivity (hover states, click-to-filter) is what makes a map useful for navigation and discovery.
- *Waiting until SVG is placed* — rejected; can scaffold the page with placeholder that works once SVG is in place. Structure is more important than asset timing.

---

### 2026-07-22 — Landing realigned: map-centered navigation, navbar pages removed

**Decision:** Redesign the homepage as a map-centered exploration canvas and remove top-navbar page links from the global header. Route discovery to About, Work, Writing, and Colophon is now embedded directly into the landing page.

**Context:** The previous homepage felt visually misaligned and linear (hero + list sections), while the interactive map lived in a separate route and read more like a data explorer. User feedback requested a more spatial, exploratory landing where the map sits centered, with navigation distributed across the page rather than in a conventional navbar.

**What changed:**

---

### 2026-07-23 — Large local SECC data strategy for static deployment

**Decision:** Keep raw SHRUG/SECC CSV datasets local and untracked in Git, and generate a lightweight deployable state-summary JSON before build.

**Context:** The repository contains very large source data (`secc_rural_shrid.csv` ~564 MB plus additional CSVs). User requirement was to avoid pushing these files to GitHub while still supporting deployment (Netlify/static build).

**What changed:**

1. **Build pipeline wiring (`package.json`)**
  - Added `data:prepare` script: `node scripts/prepare-secc-state-summary.mjs`.
  - Updated `build` script to run data preparation first: `npm run data:prepare && vite build`.

2. **Data-prep implementation (`scripts/prepare-secc-state-summary.mjs`)**
  - Added a Node streaming aggregation script for large CSVs.
  - Reads local rural and urban `*_shrid.csv` files when present.
  - Derives state code robustly from available columns, including `pc11_state_id` and SHRUG `shrid2` composite keys.
  - Outputs `static/data/secc_state_summary.json` with combined/rural/urban state totals and SC/ST shares.
  - Gracefully skips generation if raw CSVs are unavailable (so CI builds still succeed).

3. **Git tracking policy (`.gitignore`)**
  - Added ignores for:
    - `src/data/shrug-secc-mord-rural-csv/`
    - `src/data/shrug-secc-parsed-urban-csv/`
  - Added local artifact ignores (`file_list.txt`, `temp_build_output.txt`).

4. **Documentation**
  - Added `docs/SECC_DEPLOYMENT.md` documenting deployment modes, build behavior, and attribution considerations.
  - Updated `README.md` with a “Large data workflow (SECC / SHRUG)” section.

**Validation:**
- `npm run data:prepare` now succeeds and produces `static/data/secc_state_summary.json` with 33 state keys.
- `npm run build` succeeds after pipeline changes.

**Alternatives considered:**
- Committing raw CSVs to GitHub (rejected due to size and repo hygiene).
- Switching to a serverful adapter and querying raw CSV at runtime (rejected for current static-site goals).
- Leaving deployment dependent on local manual artifacts without scripted prep (rejected for reproducibility).

**Consequence / next step:**
- Site can deploy from lightweight derived data while raw datasets stay local.
- Next data step is to map the generated state metrics into the homepage/map interaction layer for real hover values.

1. **Global header simplification (`src/routes/+layout.svelte`)**
  - Removed nav link array and mobile menu toggle.
  - Header now keeps only site identity (home link) and theme toggle.
  - Deleted related nav/menu CSS to avoid stale layout behavior.

2. **Homepage rebuild (`src/routes/+page.svelte`)**
  - Replaced the old editorial stack with a new map-led landing composition.
  - Centered India map inside a circular "map-shell" focal element.
  - Added four orbit-style landing links (About, Work, Writing, Colophon) around the map.
  - Added lightweight region interaction panel: hover/click on states reveals related project links.
  - Kept a compact featured-project strip and collaboration contact line beneath the map canvas.
  - Preserved responsive behavior: orbit cards collapse into a vertical flow on smaller screens.

**Alternatives considered:**
- *Keep navbar and also add landing links* — rejected; duplicate navigation dilutes the intended exploratory interaction.
- *Move the existing `/map` page wholesale to `/`* — rejected; too dashboard-like for the landing intent.

**Consequence / next step:** Navigation now reads as place-based exploration from first load. Next polish pass can tune card positioning and map scale after visual QA on desktop + mobile.

---

### 2026-07-23 — Bold map interaction mode + enriched project pages

**Decision:** Shift the landing from a content-forward map composition to an interaction-first map stage: no explanatory copy, no header name text, and scroll-driven zoom from close-in map view to full India context. Simultaneously replace generic project detail placeholders with structured, source-informed content blocks.

**Context:** User feedback asked for a cleaner but bolder front door where the map itself is the interface. The prior landing still contained textual framing and looked editorial. Also, individual work pages had thin placeholder prose despite strong project links and repository context.

**What changed:**

1. **Global layout (`src/routes/+layout.svelte`)**
  - Removed visible header name text and replaced it with a neutral logo placeholder mark.
  - Kept theme toggle.
  - Hid global footer on `/` so the landing remains text-minimal and map-dominant.

2. **Landing page (`src/routes/+page.svelte`)**
  - Rebuilt as a sticky full-viewport map stage with tall scroll track.
  - Added scroll-based map scale interpolation: initial zoomed-in map progressively zooms out while scrolling.
  - Retained only one static text element on landing: centered top name.
  - Added interaction-only overlays:
    - region HUD on hover/selection,
    - project/page dock links revealed only through map interaction.
  - Added placeholder adivasi-share and density metrics per region for prototype interactions.

3. **Map rendering action (`src/lib/actions/india-map.ts`)**
  - Added optional `getRegionElevation(regionId)` parameter.
  - Applied pseudo-3D relief styling per region using elevation-driven transform and drop-shadow.
  - Kept behavior backward-compatible for pages that do not pass elevation.

4. **Project details content (`src/data/project-details.ts`, `src/routes/work/[slug]/+page.svelte`)**
  - Added new data module with per-project sections:
    - overview,
    - data and sources,
    - workflow,
    - outputs,
    - editorial note.
  - Updated detail route to render these sections instead of generic placeholder paragraphs.
  - Content grounded in linked project pages/repositories (CBFC, Dadri Forecast, electoral-roll workflows, MGNREGA, name models, netCDF utilities).

**Alternatives considered:**
- *Keep explanatory text and static nav cards on landing* — rejected; conflicts with “map is the thing” requirement.
- *Wait for real population data before prototyping density interactions* — rejected; placeholder metric model now allows rapid swap-in once real data arrives.

**Consequence / next step:** Landing now behaves as an exploratory map object first and a text page second. Next step when data is available: replace placeholder adivasi/density values with real state-level datasets and tune elevation scale with a calibrated legend mode.

---

### 2026-07-23 — Live deploy QA correction pass (anindyasingh.netlify.app)

**Decision:** Refine the interaction-first landing after reviewing the actual deployed rendering. Remove prototype-looking header artifacts and adjust map framing so the zoom narrative feels intentional on real viewport constraints.

**Context:** A direct live-site check showed that the previous pass, while functionally correct, still felt visually off from intent: the placeholder mark and sticky header divider weakened the “map is the interface” statement, and the zoom focal region needed stronger compositional control.

**What changed:**
- `src/routes/+layout.svelte`
  - Added route-conditional homepage header: floating theme toggle only (no placeholder logo mark or header bar weight).
  - Preserved a compact sticky header for inner pages with a minimal home mark.
- `src/routes/+page.svelte`
  - Reworked scroll interpolation to control both map scale and map translation.
  - Updated zoom path from wide zoom-in/out only to a guided focal transition (shift + scale) for stronger cinematic entry.
  - Tuned name placement, drop-shadow, and interaction chip spacing for better readability against dark map surfaces.

**Consequence / next step:** The homepage now reads closer to a full-bleed interactive stage rather than a conventional page shell. Remaining optional pass: calibrate exact initial focal coordinates after final logo insertion and desktop/mobile visual review.

**Consequence / next step:** Build the Map page component, wire navigation, and provide clear instructions for where to place the India SVG. Once SVG is in `static/images/india-map.svg`, the page will render correctly. May need to adjust path IDs and coordinate systems based on the actual SVG structure.

---

### 2026-07-22 — Map page visual cleanup

**Decision:** Normalize the map page styling to the shared design tokens and replace the cramped ad hoc values with the global spacing, radius, surface, and shadow variables.

**Context:** The `/map` page was visually working but looked compressed because several styles referenced undefined token names such as `--space-sm`, `--space-md`, `--space-lg`, and `--color-background`. Those values collapsed to zero or failed to resolve, which removed rhythm from the layout and made the page feel like a skeleton instead of a finished interface.

**What changed:**
- Replaced map-page spacing references with the global scale (`--space-s`, `--space-m`, `--space-l`).
- Replaced `--color-background` with `--color-surface`.
- Swapped hardcoded radii for shared radius tokens.
- Swapped hardcoded shadows for shared shadow tokens.
- Tightened responsive spacing so the mobile layout keeps the same hierarchy without feeling crowded.

**Consequence / next step:** The map page now follows the same visual system as the rest of the site. Next pass is browser review for any remaining page-level polish or layout issues elsewhere in the site.

---

### 2026-07-22 — Map page section consolidation and deployment unblock

**Decision:** Collapse the lower map sections into the sidebar, remove the page-level reveal wrapper, and fix the work-page filter type mismatch so the repo can build cleanly for Netlify.

**Context:** The map page still felt too section-heavy and airy, especially on first render. Separately, the deployed site was staying stale because the repo’s type check failed in `work`, which would block a fresh production build.

**What changed:**
- Moved the “all regions” browser and collaboration CTA into the map sidebar.
- Removed the standalone region list and footer sections from the map page.
- Tightened the hero spacing and dropped the reveal wrapper to make content appear immediately.
- Fixed the `Filter`/`ProjectCategory` mismatch in the work page so `npm run check` passes again.

**Consequence / next step:** The local site is buildable again and the map page is structurally denser. The Netlify deployment should update on the next redeploy using the now-clean build.

---

### 2026-07-23 — Real SECC metrics integrated into map interactions

**Decision:** Replace placeholder map metrics with real state-level values from `static/data/secc_state_summary.json` on both the landing map (`/`) and the dedicated map page (`/map`).

**Context:** The data pipeline for large local CSVs was already in place, but the UI still used prototype values for adivasi share and density/elevation behavior. User asked to continue with deployable “real data driven things on the map.”

**What changed:**
- Updated `src/routes/+page.svelte`:
  - Loads `/data/secc_state_summary.json` in browser.
  - Maps ISO state codes used in project metadata to SECC state codes.
  - Derives per-region metrics from real data: ST share (as adivasi proxy), SC share, population, households, density index, and elevation intensity.
  - Uses these values in hover HUD and elevation styling.
- Updated `src/routes/map/+page.svelte`:
  - Loads same summary data and derives region metrics.
  - Passes `getRegionElevation` to map action for real relief effect.
  - Shows ST/SC/population details in selected and preview panels.
- Updated `docs/SECC_DEPLOYMENT.md`:
  - Added CI-safe checklist clarifying that `static/data/secc_state_summary.json` should be committed for Git-driven Netlify builds.

**Validation:**
- `npm run data:prepare` succeeds and writes summary JSON.
- Summary now contains multiple state keys (not collapsed to one).
- `npm run build` succeeds after integration.

**Consequence / next step:**
- Map interactions are now data-backed in production as long as the derived JSON is present.
- Next pass can add legends/tooltips that explicitly explain ST/SC share semantics and source timestamp (`generatedAt`).

---

### 2026-07-24 — Homepage map UX correction + MP story overlay

**Decision:** Implement the requested interaction model directly on the homepage map: full-state interactivity with hover spotlight/blur, removal of bottom bubble dock links, improved scroll zoom framing so the full map can be seen, and click-to-open Madhya Pradesh story overlay with Barwani visual and CV-grounded field details.

**Context:** User feedback identified four concrete issues: map visibility felt stuck during scroll, bottom bubble links were distracting, hover should spotlight one state while others fade, and clicking Madhya Pradesh should smoothly open a narrative panel tied to “Building Resilience through MGNREGA Assets.”

**What changed:**

1. **Map action enhancement (`src/lib/actions/india-map.ts`)**
  - Added `interactiveAll` mode so all India states can participate in hover/click interactions even if not mapped to a project.
  - Added shared focus-state renderer: hovered state stays crisp/elevated while non-focused states are dimmed/soft-blurred.
  - Extended style system with `neutral` and `dimmed` behavior so non-project states remain interactive without competing visually.
  - Kept backward compatibility for existing pages by making the new behavior opt-in.

2. **Homepage interaction and layout (`src/routes/+page.svelte`)**
  - Enabled `interactiveAll: true` for the landing map.
  - Added Madhya Pradesh (`MP`) to region naming, SECC code mapping, and fallback metrics to ensure coherent hover HUD values.
  - Removed the bottom `region-dock` bubble links entirely.
  - Revised scroll interpolation and map-stage sizing so zoom-out progression reaches full-map visibility more reliably.
  - Switched HUD driving logic from project-only active region objects to active region IDs/names, so all hovered states can display metrics.

3. **MP click narrative overlay (`src/routes/+page.svelte`)**
  - Added state-story model and MP entry with:
    - title: *Building Resilience through MGNREGA Assets*
    - source context: Inclusion Economics India Centre (under Inclusion Economics at Yale University)
    - location: Barwani, Madhya Pradesh
    - visual: `/images/states/barwani-map.svg`
    - bullets derived from the CV extraction work completed earlier in session.
  - Added animated modal/backdrop UI with close controls and responsive mobile behavior.

**Validation:**
- `get_errors` reports no errors in changed files:
  - `src/routes/+page.svelte`
  - `src/lib/actions/india-map.ts`
- `npm run build` passed successfully.
- Existing non-blocking warning remains in `src/routes/map/+page.svelte` for an unused selector (`.region-grid-section`).

**Alternatives considered:**
- Keeping project-only interactivity in map action and faking non-project hover in page CSS (rejected: brittle and inconsistent).
- Adding MP content as a separate route instead of in-map overlay (rejected for now: user asked for immediate smooth click/touch reveal on map stage).

**Consequence / next step:**
- Homepage now aligns with the requested interaction-first behavior and MP deep-dive transition.
- Natural continuation is to extend similar state-story overlays for other states as requested (“other states accordingly”) while keeping data and narrative sources explicit.

---

### 2026-07-24 — Flicker removal + full-bleed MP state scene

**Decision:** Remove per-state 3D/elevation motion effects from the India map interaction layer, adjust scroll zoom framing so the full map can be reached reliably, and replace the MP modal window with a full-background state scene plus blurred text overlay.

**Context:** User reported that the 3D state behavior flickered and did not feel stable, map visibility still felt constrained during scroll, and the MP click result should not open as a separate popup window.

**What changed:**

1. **Map action flattening (`src/lib/actions/india-map.ts`)**
  - Removed per-path transform and drop-shadow logic used for pseudo-3D elevation.
  - Kept interaction readable via fill/stroke/opacity changes only.
  - Updated transitions to color/stroke channels, reducing animation-induced flicker risk.

2. **Homepage scroll framing (`src/routes/+page.svelte`)**
  - Increased scroll interpolation range and tuned map scale/translation progression to allow a clearer full-map zoom-out state.
  - Slightly adjusted stage and shell sizing to improve map visibility across viewport sizes.

3. **MP click transition redesign (`src/routes/+page.svelte`)**
  - Replaced modal card + media split layout with a full-bleed background image scene using `barwani-map.svg`.
  - Added a translucent blurred content panel for the text narrative overlay.
  - Preserved close control and responsive behavior for smaller screens.

**Validation:**
- `get_errors` reports no errors in the changed files.
- `npm run build` passed successfully.
- Existing non-blocking warning remains in `src/routes/map/+page.svelte` for unused `.region-grid-section` selectors.

**Consequence / next step:**
- Homepage interaction now avoids 3D flicker and follows the full-background story transition pattern requested by the user.
- Next tuning pass can be purely visual (fine-grain map scale endpoints by device) if further framing adjustments are needed.

---

### 2026-07-24 — Full-map visibility bug fixed (scroll normalization)

**Decision:** Replace viewport-based scroll normalization with section-relative normalization so homepage map zoom progress always reaches completion by the end of the sticky map stage.

**Context:** User reported that the full map still could not be seen while scrolling. Root cause was progress being computed against `window.innerHeight * 2.8`, while actual max scrollable distance of the page is smaller; this capped progress below 1.0 and prevented full zoom-out.

**What changed:**
- `src/routes/+page.svelte`
  - Added `bind:this` on `.map-stage` and computed progress from:
    - section top offset,
    - section height,
    - effective scroll span (`sectionHeight - viewportHeight`).
  - Updated map scale interpolation to complete within real section scroll distance.
  - Increased mobile map shell height (`72vh` → `86vh`) to reduce visual clipping on smaller screens.

**Validation:**
- `get_errors` reports no errors in `src/routes/+page.svelte`.
- `npm run build` passed successfully.
- Existing non-blocking warning in `src/routes/map/+page.svelte` remains unchanged (unused `.region-grid-section`).

**Consequence / next step:**
- Full map frame is now reachable by scrolling through the map section.
- If needed, next pass can calibrate start/end scale per breakpoint for perfect framing on specific devices.

---

### 2026-07-24 — Map kept large during scroll (anti-miniaturization retune)

**Decision:** Reduce zoom delta and soften translation on the homepage map sequence so the map does not become too small while scrolling.

**Context:** After fixing scroll normalization, user feedback indicated the map still shrank too much and drifted visually under the viewport, even though full zoom completion was technically reachable.

**What changed (`src/routes/+page.svelte`):**
- Replaced aggressive scale endpoint with moderate interpolation:
  - `startScale = 1.72`
  - `endScale = 0.98`
- Reduced drift amplitude:
  - `mapShiftX`: `-6` to `0`
  - `mapShiftY`: `4` to `-2`
- Increased map viewport container sizing:
  - desktop shell height: `min(96vh, 58rem)`
  - mobile shell height: `90vh`

**Validation:**
- `get_errors` reports no errors for `src/routes/+page.svelte`.
- `npm run build` passed successfully.
- Existing non-blocking warnings remain in `src/routes/map/+page.svelte` (unused selectors).

**Consequence / next step:**
- Scroll behavior now preserves a large map presence with only slight edge cropping at sequence extremes, matching the requested feel.
- Next optional pass: device-specific breakpoint presets for exact visual parity across common laptop resolutions.
