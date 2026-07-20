# References

Living notes on each external inspiration. Pull from here when designing tiles, case studies, and the home feed.

## aman.bh — personal "mishmash" model
- SvelteKit (`_app/immutable/assets` URLs are the giveaway).
- Sections: tl;dr hero, Notes feed, newsletter promo, "Heard And Seen" (work pickups), Notebook bookmarks, In The News logos, "Just For Fun", Misc Engagements (talks/teaching), interactive terminal, footer.
- Strong voice: short, slightly self-deprecating, dense. "clicky-click stuff", "map-alicious eye-candy stuff".
- IndieWeb signalling: microformats, RSS link, "I dream in HTML" badge, colophon page, blogroll.
- Lots of small avif images, fast despite density.
- Takes to lift: a **Notes/Bookmarks microfeed**, a **Colophon** page, an **In The News** logo wall if/when relevant.

## wholeearth.info — catalog index model
- Page-flip browser of scanned Whole Earth Catalog pages with format toggles (`?format=grid`).
- Strength is the **item-per-tile density**: every tile is a discrete "thing" with metadata, browsable.
- "Functions as an evaluation and access device. With it, the user should know better what is worth getting and where and how to do the getting." — use this as the design brief for the `/work` index.
- Takes to lift: a filterable **grid of project tiles** with category facets; treat each project as a "catalog item" with year + category + blurb.

## forensic-architecture.org — case-study layout model
- Dense, dark, investigative. Each investigation is a long page with image evidence, maps, timelines.
- Heavy use of **full-bleed media + captioned figure blocks** that the body text wraps around or references.
- Strong typographic hierarchy; the case study reads like a report.
- Takes to lift: the **case-study page template** for `/work/[slug]` — image-led, body-text-wrap via Pretext, captioned figures as obstacles.

## pretext demos (chenglou) — quality bar
- `somnai-dreams.github.io/pretext-demos` (incl. Dadri) and the chenglou pretext demo pages.
- The Dadri-forecast demo is the explicit reference for body-text reflow quality.
- The fluid-smoke demo (`fluid-smoke.html`) is noted as a future visual interest — not for v1.
- Take to lift: **the Pretext reader component must reproduce Dadri-quality reflow** — not CSS float hacks. See `PROJECT_LOG.md` 2026-07-20.

## Existing work already on the internet

| Project | URL / repo | What it is |
| --- | --- | --- |
| Personal older site | https://anindya.super.site/ | scattered earlier writing/research |
| CBFC Watch | https://cbfc.watch/ | live interactive explorer |
| Dadri Forecast | https://khanderartspace.netlify.app/dadri-forecast | militant-research manifesto |
| CensorBoard records | https://github.com/Anindyakafka/CensorBoard_records | the CBFC dataset (Python, MIT) |
| Name ethnicity detector | https://github.com/Anindyakafka/name-ethnicity-detector | PyTorch classifier (AGPL) |
| MGNREGA assets (Bihar) | https://github.com/Anindyakafka/MGNREGA_assets | scraping pipeline |
| Sounding Names / Religion | https://github.com/Anindyakafka/Sounding-Names_religion | research repo |
| netCDF manipulation | https://github.com/Anindyakafka/netCDF_manipulation_x_conversion | climate data tooling |
| Electoral Rolls WB 2002 | https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002 | digitised voter rolls |
