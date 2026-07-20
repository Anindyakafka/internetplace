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
