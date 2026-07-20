# Decision: SvelteKit + Pretext

Locked on **2026-07-20**. See `PROJECT_LOG.md` for the full rationale and alternatives considered.

## TL;DR

- **Framework:** SvelteKit (static adapter).
- **Long-form text:** `@chenglou/pretext` wrapped in a Svelte action/component, used **only** for body prose on essay and case-study pages.
- **Content:** Markdown under `src/content/`, build-time loaded.
- **Why not Next / Astro / Hugo:** owner is fluent in Svelte; one inspiration (aman.bh) is itself SvelteKit; pretext is vanilla TS so framework-agnostic.

## Where pretext plugs in

```
src/lib/pretext/
  PretextText.svelte   // <PretextText text={...} font={...} obstacles={...} />
  obstacles.ts         // build line-width functions for floated images/figures
```

Used on:
- `/writing/[slug]` — essays
- `/work/[slug]` — project case-study body
- `/about` — long bio prose

**Not** used on: home, work grid, nav, footer, contact. Those are ordinary Svelte + CSS.
