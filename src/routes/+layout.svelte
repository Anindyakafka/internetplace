<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import '../lib/styles/global.css';

	let { children }: { children: Snippet } = $props();

	let scrolled = $state(false);
	let theme = $state<'light' | 'dark'>('light');

	const socialMetaByPath: Record<string, { title: string; description: string }> = {
		'/': { title: 'Anindya Singh — research, maps, and public data', description: 'An interactive archive of research, writing, maps, public data, and field records.' },
		'/sections': { title: 'Explore the archive — Anindya Singh', description: 'Live data maps, research projects, writing, methods, field tracks, and Annihilation Atlas.' },
		'/about': { title: 'About — Anindya Singh', description: 'Research background, biography, working principles, and ways to get in touch.' },
		'/writing': { title: 'Writing — Anindya Singh', description: 'Essays, methodology notes, and experiments in long-form argument.' },
		'/work': { title: 'Work — Anindya Singh', description: 'Research projects, collaborations, data tools, and public-interest investigations.' },
		'/tracks': { title: 'Tracks & Loiterings — Anindya Singh', description: 'GPS traces, photographs, journeys, and observations recorded along the way.' },
		'/trains': { title: 'West Bengal Local Lines — Anindya Singh', description: 'West Bengal railway tracks, stations, and calculated local-train positions on a historical map.' },
		'/vehicles': { title: 'Delhi Vehicles — Anindya Singh', description: 'Live Delhi public-transport vehicle positions visualised over a historical map.' },
		'/legal-explorer': { title: 'Indian Parliamentary Bills Explorer — Anindya Singh', description: 'Search and connect parliamentary bills and official documents from 1952 onward.' },
		'/map': { title: 'Data Atlas — Anindya Singh', description: 'An interactive state-by-state view of public data, research records, and field stories.' },
		'/annihilation-atlas': { title: 'Annihilation Atlas — Anindya Singh', description: 'An anti-caste observatory of land, labour, classification, segregation, resistance, and memory.' },
		'/colophon': { title: 'Colophon — Anindya Singh', description: 'Technical and design notes for anindyasingh.netlify.app.' }
	};
	socialMetaByPath['/game'] = { title: 'Wondows 98 — Anindya Singh', description: 'A small retro desktop and future home for browser games.' };

	function socialMeta(pathname: string) {
		const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
		if (socialMetaByPath[path]) return socialMetaByPath[path];
		if (path.startsWith('/writing/')) return { title: 'Writing — Anindya Singh', description: 'An essay from Anindya Singh’s writing archive.' };
		if (path.startsWith('/work/')) return { title: 'Project — Anindya Singh', description: 'A project from Anindya Singh’s research and data archive.' };
		return socialMetaByPath['/'];
	}

	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (stored) {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
	});

	$effect(() => {
		if (!browser) return;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:head>
	<meta property="og:site_name" content="Anindya Singh" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={socialMeta($page.url.pathname).title} />
	<meta property="og:description" content={socialMeta($page.url.pathname).description} />
	<meta property="og:url" content={`https://anindyasingh.netlify.app${$page.url.pathname}`} />
	<link rel="canonical" href={`https://anindyasingh.netlify.app${$page.url.pathname}`} />
	<meta property="og:image" content="https://anindyasingh.netlify.app/images/sections/local-lines.jpg" />
	<meta property="og:image:alt" content="An archival map of Bengal overlaid with a branching railway network" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialMeta($page.url.pathname).title} />
	<meta name="twitter:description" content={socialMeta($page.url.pathname).description} />
	<meta name="twitter:image" content="https://anindyasingh.netlify.app/images/sections/local-lines.jpg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="site">
	{#if $page.url.pathname === '/'}
		<header class="home-header">
			<a class="game-launcher" href="/game" aria-label="Open Wondows 98">
				<span class="retro-flag" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
				<strong>Wondows 98</strong>
			</a>
			<button
				class="theme-toggle home-theme-toggle"
				aria-label="Toggle dark mode"
				aria-pressed={theme === 'dark'}
				onclick={toggleTheme}
			>
				{#if theme === 'light'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" y1="1" x2="12" y2="3"></line>
						<line x1="12" y1="21" x2="12" y2="23"></line>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
						<line x1="1" y1="12" x2="3" y2="12"></line>
						<line x1="21" y1="12" x2="23" y2="12"></line>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
					</svg>
				{/if}
			</button>
		</header>
	{:else if !$page.url.pathname.startsWith('/game')}
		<header class="site-header" class:scrolled>
			<div class="header-inner">
				<a class="site-mark" href="/" aria-label="Home"></a>

				<button
					class="theme-toggle"
					aria-label="Toggle dark mode"
					aria-pressed={theme === 'dark'}
					onclick={toggleTheme}
				>
					{#if theme === 'light'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="5"></circle>
							<line x1="12" y1="1" x2="12" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="23"></line>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
							<line x1="1" y1="12" x2="3" y2="12"></line>
							<line x1="21" y1="12" x2="23" y2="12"></line>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
						</svg>
					{/if}
				</button>
			</div>
		</header>
	{/if}

	<main class="site-main identity-{$page.url.pathname.split('/').filter(Boolean)[0] ?? 'home'}">
		{@render children()}
	</main>

	{#if $page.url.pathname !== '/' && !$page.url.pathname.startsWith('/game')}
		<SiteFooter />
	{/if}
</div>

<style>
	.site {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 0;
		min-height: 100vh;
		overflow-x: clip;
	}

	/* ── Header ── */
	.home-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 160;
		height: 64px;
		pointer-events: none;
	}

	.home-theme-toggle {
		position: absolute;
		top: 14px;
		right: var(--space-l);
		pointer-events: auto;
	}

	.game-launcher {
		position: absolute;
		top: 11px;
		left: var(--space-l);
		display: flex;
		align-items: center;
		gap: .5rem;
		padding: .35rem .55rem;
		border: 2px outset #fff;
		background: #c0c0c0;
		color: #111;
		font: 700 11px/1 Tahoma, sans-serif;
		text-decoration: none;
		pointer-events: auto;
		box-shadow: 1px 1px #111;
	}

	.game-launcher:active { border-style: inset; }
	.retro-flag { width: 20px; height: 17px; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; transform: skewY(-7deg); }
	.retro-flag i:nth-child(1) { background: #ef493d; }
	.retro-flag i:nth-child(2) { background: #59a84d; }
	.retro-flag i:nth-child(3) { background: #347dcc; }
	.retro-flag i:nth-child(4) { background: #f0c443; }

	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--color-bg);
		transition: border-bottom-color var(--transition), background var(--transition),
			backdrop-filter var(--transition);
		border-bottom: 1px solid transparent;
	}

	.site-header.scrolled {
		border-bottom-color: var(--color-border);
		background: color-mix(in srgb, var(--color-bg) 85%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.header-inner {
		max-width: var(--max-width);
		margin-inline: auto;
		padding-inline: var(--space-l);
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-l);
	}

	.site-mark {
		width: 36px;
		height: 36px;
		border: 1px dashed var(--color-border-strong);
		border-radius: 999px;
		opacity: 0.7;
	}

	.theme-toggle {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-3xs) var(--space-2xs);
		border-radius: var(--radius);
		transition: color var(--transition), background var(--transition);
	}

	.theme-toggle:hover {
		color: var(--color-text);
		background: var(--color-accent-soft);
	}

	.theme-toggle svg {
		width: 18px;
		height: 18px;
	}

	/* ── Main ── */
	.site-main {
		flex: 1;
		position: relative;
		isolation: isolate;
		width: 100%;
		min-width: 0;
	}

	/* Each section is framed as a different working object. */
	.site-main:global(.identity-writing) {
		background-image: repeating-linear-gradient(0deg, transparent 0 31px, color-mix(in srgb, var(--color-border) 38%, transparent) 31px 32px);
	}
	.site-main:global(.identity-writing) :global(.writing-header) {
		max-width: 56rem;
		margin-left: clamp(0rem, 8vw, 8rem);
		transform: rotate(-.35deg);
	}
	.site-main:global(.identity-writing) :global(.entry-card:nth-child(even)) { transform: translateY(2rem) rotate(.25deg); }
	.site-main:global(.identity-writing) :global(.entry-card:nth-child(odd)) { transform: rotate(-.2deg); }

	.site-main:global(.identity-work) {
		background-image: linear-gradient(color-mix(in srgb, var(--color-accent) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 6%, transparent) 1px, transparent 1px);
		background-size: 24px 24px;
	}
	.site-main:global(.identity-work) :global(.work-header) { border-left: .7rem solid var(--color-accent); padding-left: clamp(1rem, 4vw, 3rem); }
	.site-main:global(.identity-work) :global(.project-card) { border-radius: 0; border-top-width: 3px; }
	.site-main:global(.identity-work) :global(.project-card:nth-child(3n + 2)) { transform: translateY(1.5rem); }

	.site-main:global(.identity-tracks) {
		background-image: radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--color-accent) 9%, transparent) 0 2px, transparent 3px), radial-gradient(circle at 78% 62%, color-mix(in srgb, var(--color-text) 7%, transparent) 0 1px, transparent 2px);
		background-size: 7rem 7rem, 4rem 4rem;
	}
	.site-main:global(.identity-tracks) :global(.tracks-hero) { max-width: 48rem; margin-left: clamp(0rem, 10vw, 10rem); transform: rotate(.3deg); }
	.site-main:global(.identity-tracks) :global(.method-note) { border-style: dashed; transform: rotate(-.35deg); }
	.site-main:global(.identity-tracks) :global(.tracks-feed > :nth-child(even)) { margin-left: clamp(0rem, 7vw, 7rem); }

	.site-main:global(.identity-trains) { overflow-x: clip; background: linear-gradient(180deg, color-mix(in srgb, #152018 8%, var(--color-bg)), var(--color-bg) 38rem); }
	.site-main:global(.identity-trains) :global(.train-page) { min-width: 0; overflow: hidden; }
	.site-main:global(.identity-trains) :global(.page-intro) { min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box; border: 1px solid var(--color-border-strong); border-radius: 999px 999px 0 0; padding: clamp(1.2rem, 4vw, 3rem); background: var(--color-surface); }
	.site-main:global(.identity-trains) :global(.totals) { border-top: 2px solid var(--color-text); border-bottom: 2px solid var(--color-text); }
	.site-main:global(.identity-trains) :global(.network-layout) { box-shadow: 0 1.2rem 0 color-mix(in srgb, var(--color-text) 12%, transparent); }

	.site-main:global(.identity-vehicles) {
		background-image: radial-gradient(circle, color-mix(in srgb, var(--color-border-strong) 58%, transparent) 1.2px, transparent 1.5px);
		background-size: 1.2rem 1.2rem;
		background-position: -.6rem -.6rem;
	}
	.site-main:global(.identity-vehicles) :global(.vehicle-page) { background: color-mix(in srgb, #d7b64a 10%, var(--color-bg)); border-inline: 1px dashed var(--color-border-strong); }
	.site-main:global(.identity-vehicles) :global(.vehicle-page > header) { display: grid; grid-template-columns: minmax(12rem, .75fr) minmax(18rem, 1.25fr); gap: 1rem 4rem; align-items: end; }
	.site-main:global(.identity-vehicles) :global(.vehicle-page > header h1) { grid-row: span 3; font-size: clamp(3rem, 9vw, 8rem); line-height: .82; }
	.site-main:global(.identity-vehicles) :global(.map-shell) { border-style: dashed; }

	.site-main:global(.identity-legal-explorer) { background: color-mix(in srgb, #201b17 8%, var(--color-bg)); }
	.site-main:global(.identity-legal-explorer) :global(.hero) { transform: rotate(-.25deg); box-shadow: .8rem .8rem 0 color-mix(in srgb, var(--color-text) 12%, transparent); background: var(--color-surface); padding: clamp(1rem, 4vw, 3rem); }
	.site-main:global(.identity-legal-explorer) :global(.desk) { border-radius: 0; border-top: .5rem solid #701f28; }
	.site-main:global(.identity-legal-explorer) :global(.record) { border-left: 3px solid transparent; }
	.site-main:global(.identity-legal-explorer) :global(.record:hover),
	.site-main:global(.identity-legal-explorer) :global(.record.selected) { border-left-color: #701f28; }

	.site-main:global(.identity-about) {
		background-image: linear-gradient(90deg, transparent 0 7%, color-mix(in srgb, var(--color-accent) 18%, transparent) 7% calc(7% + 1px), transparent calc(7% + 1px));
	}
	.site-main:global(.identity-about) :global(.bio-grid) { align-items: stretch; }
	.site-main:global(.identity-about) :global(.bio-text) { padding: clamp(1rem, 4vw, 3rem); border: 1px solid var(--color-border); transform: rotate(-.25deg); background: var(--color-surface); }
	.site-main:global(.identity-about) :global(.bio-card) { border-radius: 50% 50% 1rem 1rem / 3rem 3rem 1rem 1rem; transform: rotate(.5deg); }
	.site-main:global(.identity-about) :global(.timeline-section:nth-of-type(even)) { margin-left: clamp(0rem, 8vw, 8rem); }

	.site-main:global(.identity-colophon) {
		background-image: linear-gradient(90deg, color-mix(in srgb, var(--color-border) 35%, transparent) 1px, transparent 1px), linear-gradient(color-mix(in srgb, var(--color-border) 35%, transparent) 1px, transparent 1px);
		background-size: 1.5rem 1.5rem;
	}
	.site-main:global(.identity-colophon)::before { content: '✚'; position: absolute; top: 2rem; left: 2rem; font: 2rem var(--font-mono); color: var(--color-accent); }
	.site-main:global(.identity-colophon) :global(.colophon-hero) { border: 2px solid var(--color-text); padding: clamp(1rem, 4vw, 3rem); background: var(--color-bg); }
	.site-main:global(.identity-colophon) :global(.tech-card) { border-radius: 0; }
	.site-main:global(.identity-colophon) :global(.tech-card:nth-child(even)) { transform: translateY(1.5rem); }

	.site-main:global(.identity-map) { background: color-mix(in srgb, #c7b98c 8%, var(--color-bg)); }
	.site-main:global(.identity-map) :global(.map-hero) { border-bottom: .35rem double var(--color-border-strong); }
	.site-main:global(.identity-map) :global(.map-container) { transform: rotate(-.15deg); box-shadow: .8rem .8rem 0 color-mix(in srgb, var(--color-text) 10%, transparent); }

	.site-main:global(.identity-annihilation-atlas) { background: linear-gradient(90deg, #741f26 0 clamp(.35rem, 1vw, .8rem), var(--color-bg) clamp(.35rem, 1vw, .8rem)); }
	.site-main:global(.identity-annihilation-atlas) :global(.atlas-hero) { border-top: .8rem solid #741f26; }
	.site-main:global(.identity-annihilation-atlas) :global(.ruled) { border-color: #741f26; }
	.site-main:global(.identity-annihilation-atlas) :global(.source-grid article:nth-child(odd)) { transform: rotate(-.2deg); }
	.site-main:global(.identity-annihilation-atlas) :global(.source-grid article:nth-child(even)) { transform: rotate(.2deg); }

	@media (max-width: 700px) {
		.site-main:global(.identity-writing) :global(.entry-card),
		.site-main:global(.identity-work) :global(.project-card),
		.site-main:global(.identity-tracks) :global(.tracks-feed > *),
		.site-main:global(.identity-legal-explorer) :global(.hero),
		.site-main:global(.identity-about) :global(.bio-text),
		.site-main:global(.identity-colophon) :global(.tech-card) { transform: none; margin-left: 0; }
		.site-main:global(.identity-vehicles) :global(.vehicle-page > header) { grid-template-columns: 1fr; }
		.site-main:global(.identity-vehicles) :global(.vehicle-page > header h1) { grid-row: auto; font-size: clamp(3rem, 18vw, 6rem); }
		.site-main:global(.identity-trains) :global(.page-intro) { width: calc(100vw - 3rem); max-width: calc(100vw - 3rem); border-radius: 8rem 8rem 0 0; padding: 7rem 1.25rem 1.25rem; }
		.site-main:global(.identity-trains) :global(.train-page) { width: 100vw; max-width: 100vw; box-sizing: border-box; }
		.site-main:global(.identity-trains) :global(.page-intro h1) { max-width: 100%; font-size: clamp(2.7rem, 13vw, 4rem); overflow-wrap: anywhere; }
		.site-main:global(.identity-trains) :global(.page-intro .eyebrow),
		.site-main:global(.identity-trains) :global(.page-intro .lede) { width: 100%; max-width: 100%; white-space: normal; overflow-wrap: anywhere; }
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.theme-toggle {
			padding: var(--space-2xs) var(--space-xs);
		}
	}
</style>
