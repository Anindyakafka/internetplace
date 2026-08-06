<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import '../lib/styles/global.css';

	let { children }: { children: Snippet } = $props();

	let scrolled = $state(false);

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
	{#if $page.url.pathname === '/'}
		<header class="home-header"></header>
	{:else}
		<header class="site-header" class:scrolled>
			<div class="header-inner">
				<a class="site-mark" href="/" aria-label="Home"></a>
			</div>
		</header>
	{/if}

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
	.home-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 160;
		height: 1px;
		pointer-events: none;
	}

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
		justify-content: flex-start;
		gap: var(--space-l);
	}

	.site-mark {
		width: 36px;
		height: 36px;
		border: 1px dashed var(--color-border-strong);
		border-radius: 999px;
		opacity: 0.7;
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
		.footer-inner {
			grid-template-columns: 1fr;
			gap: var(--space-l);
		}
	}
</style>
