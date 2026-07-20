# Pretext integration — design note

`@chenglou/pretext` measures text without touching the DOM and lays it out line-by-line. We wrap it in one Svelte component and one helper.

## API surface we use

- `prepare(text, font, lineHeight)` → pre-measured segments (do this once per text+font combo).
- `layoutNextLineRange(prepared, startLine, endLine, lineWidthForY)` → laid-out lines, given a function that returns the available width at a y position. **This is how obstacle-aware flow works:** pass a `lineWidthForY` that narrows around floated figures.
- Resize only needs to re-run `layoutNextLineRange`, not `prepare` — segments are font-bound, not width-bound.

## Component contract

```svelte
<PretextText
  text={bodyMarkdownAsPlainText}
  font="16px/1.55 Georgia, serif"
  obstacles={[{ y0: 120, y1: 320, side: "left", width: 280 }]}
/>
```

- Renders a positioned container; each laid-out line is its own `<span>` with absolute or grid placement so obstacles can carve out vertical bands.
- `obstacles` is the public seam — used by case-study pages to float images, charts, pull quotes inside the running text.

## Obstacle model

An obstacle is a vertical band `{y0, y1, side: "left"|"right", width}`. `lineWidthForY(y)` reduces the available line width by the obstacle's width when `y0 ≤ y ≤ y1`. Multiple obstacles compose additively.

## Quality bar

Must match the Dadri-forecast pretext demo at `somnai-dreams.github.io/pretext-demos`. Anything less is a regression — see `PROJECT_LOG.md` 2026-07-20. Do not ship a CSS-float fallback.
