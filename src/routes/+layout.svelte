<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import '../lib/styles/global.css';

	let { children }: { children: Snippet } = $props();

	let scrolled = $state(false);
	let theme = $state<'light' | 'dark'>('light');

	// Restore saved theme (or system preference) on mount
	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (stored) {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
	});

	// Apply theme to <html> and persist
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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="site">
	<header class="site-header" class:scrolled>
		<div class="header-inner">
			<div class="site-mark" aria-label="Logo placeholder"></div>

			<button
				class="theme-toggle"
				aria-label="Toggle dark mode"
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

	<main class="site-main">
		{@render children()}
	</main>

	{#if $page.url.pathname !== '/'}
		<footer class="site-footer">
			<div class="footer-inner">
				<div class="footer-col">
					<a class="footer-label" href="/colophon">Colophon</a>
					<p class="footer-text">
						Built with <a href="https://kit.svelte.dev" target="_blank" rel="noopener">SvelteKit</a>.
						Set in Inter &amp; Newsreader.
					</p>
				</div>
				<div class="footer-col">
					<p class="footer-label">Elsewhere</p>
					<div class="footer-links">
						<a href="https://github.com/Anindyakafka" target="_blank" rel="noopener">GitHub</a>
						<a href="mailto:hello@anindyasingh.dev">Email</a>
					</div>
				</div>
				<div class="footer-col">
					<p class="footer-label">Location</p>
					<p class="footer-text">Delhi NCR, India</p>
				</div>
			</div>
			<p class="footer-copy">© {new Date().getFullYear()} Anindya Singh</p>
		</footer>
	{/if}
</div>

<style>
	.site {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* ── Header ── */
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

	/* ── Theme toggle ── */
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
	}

	/* ── Footer ── */
	.site-footer {
		margin-top: var(--space-3xl);
		padding-top: var(--space-xl);
		padding-bottom: var(--space-xl);
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.footer-inner {
		max-width: var(--max-width);
		margin-inline: auto;
		padding-inline: var(--space-l);
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: var(--space-xl);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.footer-label {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin: 0;
		text-decoration: none;
		transition: color var(--transition);
	}

	.footer-label[href]:hover {
		color: var(--color-accent);
	}

	.footer-text {
		font-family: var(--font-sans);
		font-size: var(--step--1);
		line-height: 1.5;
		color: var(--color-text);
		margin: 0;
	}

	.footer-text a,
	.footer-links a {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color var(--transition);
	}

	.footer-text a:hover,
	.footer-links a:hover {
		border-bottom-color: var(--color-accent);
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		font-family: var(--font-sans);
		font-size: var(--step--1);
	}

	.footer-copy {
		max-width: var(--max-width);
		margin: var(--space-xl) auto 0;
		padding-inline: var(--space-l);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--color-text-muted);
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.theme-toggle {
			padding: var(--space-2xs) var(--space-xs);
		}

		.footer-inner {
			grid-template-columns: 1fr;
			gap: var(--space-l);
		}
	}
</style>
