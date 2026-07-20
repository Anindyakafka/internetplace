<svelte:head>
	<title>Colophon — Anindya Singh</title>
	<meta name="description" content="Technical and design notes for anindya.dev — built with SvelteKit and Pretext, set in Inter, Newsreader, and JetBrains Mono." />
	<meta property="og:title" content="Colophon — Anindya Singh" />
	<meta property="og:description" content="Technical and design notes for anindya.dev." />
	<meta property="og:type" content="website" />
	<meta name="author" content="Anindya Singh" />
</svelte:head>

<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
</script>

<BackLink href="/">Index</BackLink>

<section class="page-content">

	<!-- ═══════════════════════════════════════════
	     00 — INTRODUCTION
	     ═══════════════════════════════════════════ -->
	<header class="colophon-hero">
		<span class="section-index">00</span>
		<h1 class="colophon-title">Colophon</h1>
		<p class="colophon-lede">
			A note on how this site is made — the tools, the type, the colour system, and the
			ideas that shaped its structure. Everything here is deliberate.
		</p>
	</header>

	<!-- ═══════════════════════════════════════════
	     01 — TECHNOLOGY
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">01</span>
			<h2 class="section-title">Technology</h2>
		</header>
		<div class="tech-grid">
			<article class="tech-card">
				<div class="tech-card-header">
					<span class="tech-card-dot"></span>
					<span class="tech-card-label">Framework</span>
				</div>
				<h3 class="tech-card-title">SvelteKit</h3>
				<p class="tech-card-body">
					Built with <strong>SvelteKit</strong> in static-prerender mode — every page is
					compiled to plain HTML, CSS, and a thin layer of JavaScript at build time.
					No server runtime, no hydration overhead for content pages. The site ships
					as a bundle of static files deployable anywhere.
				</p>
				<div class="tag-row">
					<span class="tag">adapter-static</span>
					<span class="tag">prerender</span>
					<span class="tag">Svelte 5</span>
				</div>
			</article>

			<article class="tech-card">
				<div class="tech-card-header">
					<span class="tech-card-dot"></span>
					<span class="tech-card-label">Text Layout</span>
				</div>
				<h3 class="tech-card-title">@chenglou/pretext</h3>
				<p class="tech-card-body">
					Long-form essays and articles use <strong>Pretext</strong> (v0.0.8), a
					true obstacle-aware text reflow engine. Unlike CSS floats, Pretext
					measures each line individually and computes exact offsets so text wraps
					tightly around figures — no gaps, no overlaps, no manual break points.
				</p>
				<div class="tag-row">
					<span class="tag">line-measurement</span>
					<span class="tag">obstacle-aware</span>
					<span class="tag">canvas-based</span>
				</div>
			</article>

			<article class="tech-card">
				<div class="tech-card-header">
					<span class="tech-card-dot"></span>
					<span class="tech-card-label">Styling</span>
				</div>
				<h3 class="tech-card-title">Hand-written CSS</h3>
				<p class="tech-card-body">
					No utility framework, no CSS-in-JS. The entire visual system is defined
					in a single set of CSS custom properties and scoped component styles.
					Design tokens for type, spacing, and colour are declared once and
					referenced everywhere — easy to audit, easy to change.
				</p>
				<div class="tag-row">
					<span class="tag">custom properties</span>
					<span class="tag">scoped styles</span>
					<span class="tag">zero runtime</span>
				</div>
			</article>

			<article class="tech-card">
				<div class="tech-card-header">
					<span class="tech-card-dot"></span>
					<span class="tech-card-label">Hosting</span>
				</div>
				<h3 class="tech-card-title">Static Deployment</h3>
				<p class="tech-card-body">
					The prerendered output is served as static files. No databases, no API
					calls, no tracking scripts. The entire site loads in a single request
					per route, with fonts loaded asynchronously via Google Fonts.
				</p>
				<div class="tag-row">
					<span class="tag">CDN</span>
					<span class="tag">edge-cached</span>
					<span class="tag">carbon-light</span>
				</div>
			</article>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     02 — TYPOGRAPHY
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">02</span>
			<h2 class="section-title">Typography</h2>
		</header>

		<div class="typography-stack">
			<article class="type-specimen">
				<div class="type-specimen-display" style="font-family: var(--font-sans); font-weight: 600;">
					Aa
				</div>
				<div class="type-specimen-info">
					<h3 class="type-specimen-name">Inter</h3>
					<p class="type-specimen-role">Interface &rarr; Headings, navigation, UI labels</p>
					<p class="type-specimen-note">
						Designed by Rasmus Andersson. A neutral grotesque with an open aperture
						and tall x-height — engineered for screen legibility at every size.
						Loaded at weights 400, 500, 600, and 700.
					</p>
					<p class="type-sample" style="font-family: var(--font-sans); font-size: var(--step-1);">
						The quick brown fox jumps over the lazy dog.
					</p>
				</div>
			</article>

			<article class="type-specimen">
				<div class="type-specimen-display" style="font-family: var(--font-serif); font-weight: 500; font-style: italic;">
					Aa
				</div>
				<div class="type-specimen-info">
					<h3 class="type-specimen-name">Newsreader</h3>
					<p class="type-specimen-role">Reading &rarr; Body text, essays, prose</p>
					<p class="type-specimen-note">
						Designed by Production Type. A contemporary serif calibrated for
						long-form reading on screens. Its optical sizing axis adjusts stroke
						contrast at different sizes. Loaded with italic variants for emphasis.
					</p>
					<p class="type-sample" style="font-family: var(--font-serif); font-size: var(--step-1);">
						The quick brown fox jumps over the lazy dog.
					</p>
				</div>
			</article>

			<article class="type-specimen">
				<div class="type-specimen-display" style="font-family: var(--font-mono); font-weight: 500;">
					Aa
				</div>
				<div class="type-specimen-info">
					<h3 class="type-specimen-name">JetBrains Mono</h3>
					<p class="type-specimen-role">Detail &rarr; Code, metadata, tags, labels</p>
					<p class="type-specimen-note">
						Designed by Philipp Nurullin for JetBrains. A monospaced typeface with
						increased x-height for better code readability. Used for technical
						annotations, timestamps, and small-caps-style labels throughout.
					</p>
					<p class="type-sample" style="font-family: var(--font-mono); font-size: var(--step--1);">
						The quick brown fox jumps over the lazy dog.
					</p>
				</div>
			</article>
		</div>

		<div class="type-scale-block">
			<h3 class="scale-block-title">Type Scale</h3>
			<p class="scale-block-desc">
				A modular scale based on the <strong>1.250 (Major Third)</strong> ratio.
				Each step uses <code>clamp()</code> for fluid responsiveness between mobile
				and desktop without media-query breakpoints.
			</p>
			<div class="scale-table">
				<div class="scale-row">
					<code class="scale-token">--step-5</code>
					<span class="scale-sample" style="font-size: var(--step-5); font-family: var(--font-serif);">Heading 1</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step-4</code>
					<span class="scale-sample" style="font-size: var(--step-4); font-family: var(--font-serif);">Heading 2</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step-3</code>
					<span class="scale-sample" style="font-size: var(--step-3); font-family: var(--font-serif);">Heading 3</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step-2</code>
					<span class="scale-sample" style="font-size: var(--step-2); font-family: var(--font-serif);">Heading 4</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step-1</code>
					<span class="scale-sample" style="font-size: var(--step-1); font-family: var(--font-serif);">Lead paragraph</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step-0</code>
					<span class="scale-sample" style="font-size: var(--step-0); font-family: var(--font-sans);">Body text</span>
				</div>
				<div class="scale-row">
					<code class="scale-token">--step--1</code>
					<span class="scale-sample" style="font-size: var(--step--1); font-family: var(--font-mono);">Caption / code</span>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     03 — COLOUR
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">03</span>
			<h2 class="section-title">Colour</h2>
		</header>
		<p class="section-intro">
			The palette is intentionally restrained — warm neutrals for structure, a single
			accent of cobalt blue for interaction. Both light and dark themes are defined
			via CSS custom properties and switch automatically based on the visitor's
			operating-system preference.
		</p>
		<div class="colour-grid">
			<div class="colour-group">
				<h3 class="colour-group-label">Light Theme</h3>
				<div class="swatch-row">
					<div class="swatch" style="--sw: var(--color-bg);">
						<span class="swatch-name">Background</span>
						<span class="swatch-hex">#fafaf7</span>
					</div>
					<div class="swatch" style="--sw: var(--color-surface);">
						<span class="swatch-name">Surface</span>
						<span class="swatch-hex">#ffffff</span>
					</div>
					<div class="swatch" style="--sw: var(--color-text); color: var(--color-bg);">
						<span class="swatch-name">Text</span>
						<span class="swatch-hex">#1a1a1a</span>
					</div>
					<div class="swatch" style="--sw: var(--color-accent); color: #fff;">
						<span class="swatch-name">Accent</span>
						<span class="swatch-hex">#2b5acf</span>
					</div>
				</div>
			</div>
			<div class="colour-group">
				<h3 class="colour-group-label">Dark Theme</h3>
				<div class="swatch-row">
					<div class="swatch dark-swatch" style="--sw: #0e0e10;">
						<span class="swatch-name">Background</span>
						<span class="swatch-hex">#0e0e10</span>
					</div>
					<div class="swatch dark-swatch" style="--sw: #18181b;">
						<span class="swatch-name">Surface</span>
						<span class="swatch-hex">#18181b</span>
					</div>
					<div class="swatch dark-swatch" style="--sw: #e8e8e3; color: #0e0e10;">
						<span class="swatch-name">Text</span>
						<span class="swatch-hex">#e8e8e3</span>
					</div>
					<div class="swatch dark-swatch" style="--sw: #6b9bff; color: #0e0e10;">
						<span class="swatch-name">Accent</span>
						<span class="swatch-hex">#6b9bff</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     04 — SPACING & RHYTHM
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">04</span>
			<h2 class="section-title">Spacing &amp; Rhythm</h2>
		</header>
		<p class="section-intro">
			Vertical rhythm is governed by a fixed spacing scale — nine tokens from
			<code>--space-3xs</code> to <code>--space-4xl</code>. This ensures consistent
			breathing room between every element without ad-hoc pixel values.
		</p>
		<div class="spacing-table">
			<div class="spacing-row">
				<code class="spacing-token">--space-3xs</code>
				<div class="spacing-bar" style="width: 0.25rem;"></div>
				<span class="spacing-value">0.25rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-2xs</code>
				<div class="spacing-bar" style="width: 0.5rem;"></div>
				<span class="spacing-value">0.5rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-xs</code>
				<div class="spacing-bar" style="width: 0.75rem;"></div>
				<span class="spacing-value">0.75rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-s</code>
				<div class="spacing-bar" style="width: 1rem;"></div>
				<span class="spacing-value">1rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-m</code>
				<div class="spacing-bar" style="width: 1.5rem;"></div>
				<span class="spacing-value">1.5rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-l</code>
				<div class="spacing-bar" style="width: 2rem;"></div>
				<span class="spacing-value">2rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-xl</code>
				<div class="spacing-bar" style="width: 3rem;"></div>
				<span class="spacing-value">3rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-2xl</code>
				<div class="spacing-bar" style="width: 4rem;"></div>
				<span class="spacing-value">4rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-3xl</code>
				<div class="spacing-bar" style="width: 6rem;"></div>
				<span class="spacing-value">6rem</span>
			</div>
			<div class="spacing-row">
				<code class="spacing-token">--space-4xl</code>
				<div class="spacing-bar" style="width: 8rem;"></div>
				<span class="spacing-value">8rem</span>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     05 — INSPIRATIONS
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">05</span>
			<h2 class="section-title">Inspirations</h2>
		</header>
		<div class="inspiration-list">
			<article class="inspiration-item">
				<div class="inspiration-marker">
					<span class="inspiration-arrow">&rarr;</span>
				</div>
				<div class="inspiration-content">
					<h3 class="inspiration-title">aman.bh</h3>
					<p class="inspiration-desc">
						A reference for editorial restraint — confident typography, generous
						whitespace, and a structure that lets content breathe without
						decoration.
					</p>
				</div>
			</article>
			<article class="inspiration-item">
				<div class="inspiration-marker">
					<span class="inspiration-arrow">&rarr;</span>
				</div>
				<div class="inspiration-content">
					<h3 class="inspiration-title">wholeearth.info</h3>
					<p class="inspiration-desc">
						An inspiration for the intersection of archive and design — the idea
						that a personal site can be both a portfolio and a living library.
					</p>
				</div>
			</article>
			<article class="inspiration-item">
				<div class="inspiration-marker">
					<span class="inspiration-arrow">&rarr;</span>
				</div>
				<div class="inspiration-content">
					<h3 class="inspiration-title">forensic-architecture.org</h3>
					<p class="inspiration-desc">
						A model for how research and spatial thinking can be communicated on
						the web — rigorous, visually precise, and unafraid of complexity.
					</p>
				</div>
			</article>
			<article class="inspiration-item">
				<div class="inspiration-marker">
					<span class="inspiration-arrow">&rarr;</span>
				</div>
				<div class="inspiration-content">
					<h3 class="inspiration-title">@chenglou/pretext</h3>
					<p class="inspiration-desc">
						The text-layout engine itself, and its demo at
						<code>pretext-demos</code> — proof that the web can do better than
						CSS floats for long-form reading.
					</p>
				</div>
			</article>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     06 — STANDARDS & ACCESSIBILITY
	     ═══════════════════════════════════════════ -->
	<div class="colophon-section">
		<header class="section-header">
			<span class="section-index">06</span>
			<h2 class="section-title">Standards &amp; Accessibility</h2>
		</header>
		<div class="standards-grid">
			<div class="standard-item">
				<h3 class="standard-title">Semantic HTML</h3>
				<p class="standard-desc">
					Pages use proper landmark elements (<code>header</code>,
					<code>nav</code>, <code>main</code>, <code>footer</code>) and heading
					hierarchies are kept strictly ordered for screen-reader navigation.
				</p>
			</div>
			<div class="standard-item">
				<h3 class="standard-title">Reduced Motion</h3>
				<p class="standard-desc">
					All animations and transitions respect the
					<code>prefers-reduced-motion</code> media query — visitors who disable
					motion see a static experience with no loss of information.
				</p>
			</div>
			<div class="standard-item">
				<h3 class="standard-title">Focus Visibility</h3>
				<p class="standard-desc">
					Keyboard navigation is supported with a visible focus ring
					(<code>:focus-visible</code>) using a 2-pixel accent outline at
					2-pixel offset.
				</p>
			</div>
			<div class="standard-item">
				<h3 class="standard-title">Colour Contrast</h3>
				<p class="standard-desc">
					Text and background combinations are tested for WCAG AA compliance in
					both light and dark themes. The accent colour is never used as the sole
					indicator of state.
				</p>
			</div>
			<div class="standard-item">
				<h3 class="standard-title">Fluid Layout</h3>
				<p class="standard-desc">
					No fixed pixel widths. Typography and spacing scale fluidly using
					<code>clamp()</code> and viewport-relative units. The layout adapts
					from 320px mobile to ultrawide displays without breakpoints.
				</p>
			</div>
			<div class="standard-item">
				<h3 class="standard-title">Open Source</h3>
				<p class="standard-desc">
					The codebase is open. SvelteKit and Pretext are both MIT-licensed.
					Fonts are licensed via Google Fonts (SIL OFL). No proprietary
					dependencies.
				</p>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     COLOPHON FOOTER
	     ═══════════════════════════════════════════ -->
	<footer class="colophon-footer">
		<div class="colophon-footer-inner">
			<p class="footer-quote">
				"A colophon is a statement about how a thing was made — and an implicit
				promise that the making mattered."
			</p>
			<p class="footer-meta">
				Built by Anindya Singh &middot; <a href="/">Return to index</a>
			</p>
		</div>
	</footer>

</section>

<style>
	/* ── Page Content Shell ── */
	.page-content {
		max-width: var(--max-width);
		margin-inline: auto;
		padding-inline: var(--space-l);
		padding-bottom: var(--space-4xl);
	}

	/* ── Hero / Introduction ── */
	.colophon-hero {
		padding-block: var(--space-3xl) var(--space-2xl);
		max-width: var(--measure);
	}

	.colophon-hero .section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		letter-spacing: 0.03em;
	}

	.colophon-title {
		font-family: var(--font-serif);
		font-size: var(--step-5);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-top: var(--space-2xs);
	}

	.colophon-lede {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-top: var(--space-s);
	}

	/* ── Section Structure ── */
	.colophon-section {
		padding-block: var(--space-3xl);
	}

	.section-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-s);
		margin-bottom: var(--space-xl);
	}

	.section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		letter-spacing: 0.03em;
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.section-intro {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.6;
		color: var(--color-text-muted);
		max-width: 52ch;
		margin-bottom: var(--space-xl);
	}

	/* ── Technology Grid ── */
	.tech-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-l);
	}

	.tech-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
		transition: border-color var(--transition), transform var(--transition);
	}

	.tech-card:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
	}

	.tech-card-header {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		margin-bottom: var(--space-s);
	}

	.tech-card-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent);
	}

	.tech-card-label {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		letter-spacing: 0.05em;
	}

	.tech-card-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-s);
	}

	.tech-card-body {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-bottom: var(--space-s);
	}

	/* ── Tags ── */
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}

	.tag {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: 0.25em 0.6em;
		background: var(--color-accent-soft);
		color: var(--color-accent);
		border-radius: 3px;
	}

	/* ── Typography Specimens ── */
	.typography-stack {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.type-specimen {
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: var(--space-l);
		align-items: start;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
	}

	.type-specimen-display {
		font-size: 3.5rem;
		line-height: 1;
		text-align: center;
		color: var(--color-text);
	}

	.type-specimen-name {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.type-specimen-role {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		margin-top: var(--space-3xs);
		letter-spacing: 0.03em;
	}

	.type-specimen-note {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-top: var(--space-2xs);
		max-width: 60ch;
	}

	.type-sample {
		margin-top: var(--space-s);
		color: var(--color-text);
		opacity: 0.85;
	}

	/* ── Type Scale Table ── */
	.type-scale-block {
		margin-top: var(--space-2xl);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
	}

	.scale-block-title {
		font-family: var(--font-mono);
		font-size: var(--step-0);
		font-weight: 500;
		margin-bottom: var(--space-2xs);
	}

	.scale-block-desc {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-bottom: var(--space-l);
	}

	.scale-table {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.scale-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-l);
	}

	.scale-token {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		width: 5.5rem;
		flex-shrink: 0;
	}

	.scale-sample {
		color: var(--color-text);
		line-height: 1.2;
	}

	/* ── Colour Grid ── */
	.colour-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.colour-group-label {
		font-family: var(--font-mono);
		font-size: var(--step-0);
		font-weight: 500;
		margin-bottom: var(--space-m);
		color: var(--color-text-muted);
	}

	.swatch-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: var(--space-s);
	}

	.swatch {
		background: var(--sw);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-s);
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		min-height: 80px;
	}

	.swatch.dark-swatch {
		border-color: #333;
	}

	.swatch-name {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		font-weight: 500;
	}

	.swatch-hex {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		opacity: 0.7;
	}

	/* ── Spacing Table ── */
	.spacing-table {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
	}

	.spacing-row {
		display: flex;
		align-items: center;
		gap: var(--space-l);
	}

	.spacing-token {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		width: 6rem;
		flex-shrink: 0;
	}

	.spacing-bar {
		height: 12px;
		background: var(--color-accent-soft);
		border: 1px solid var(--color-accent);
		border-radius: 2px;
		flex-shrink: 0;
	}

	.spacing-value {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	/* ── Inspirations ── */
	.inspiration-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.inspiration-item {
		display: flex;
		gap: var(--space-m);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
		transition: border-color var(--transition), transform var(--transition);
	}

	.inspiration-item:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
	}

	.inspiration-marker {
		font-size: var(--step-2);
		color: var(--color-accent);
		line-height: 1;
		padding-top: 0.15em;
	}

	.inspiration-title {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.inspiration-desc {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-top: var(--space-2xs);
		max-width: 60ch;
	}

	/* ── Standards Grid ── */
	.standards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: var(--space-l);
	}

	.standard-item {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-l);
	}

	.standard-title {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-2xs);
	}

	.standard-desc {
		font-size: var(--step-0);
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	/* ── Colophon Footer ── */
	.colophon-footer {
		padding-block: var(--space-4xl) var(--space-2xl);
		text-align: center;
	}

	.colophon-footer-inner {
		max-width: 42rem;
		margin-inline: auto;
	}

	.footer-quote {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-style: italic;
		font-weight: 500;
		line-height: 1.4;
		color: var(--color-text);
		letter-spacing: -0.01em;
	}

	.footer-meta {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		margin-top: var(--space-l);
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.type-specimen {
			grid-template-columns: 60px 1fr;
			gap: var(--space-m);
		}

		.type-specimen-display {
			font-size: 2.5rem;
		}

		.spacing-row {
			flex-wrap: wrap;
		}

		.scale-row {
			flex-wrap: wrap;
		}
	}
</style>
