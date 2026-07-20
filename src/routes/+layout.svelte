<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import '../lib/styles/global.css';

	let { children }: { children: Snippet } = $props();

	const navLinks = [
		{ href: '/', label: 'Index' },
		{ href: '/work', label: 'Work' },
		{ href: '/writing', label: 'Writing' },
		{ href: '/about', label: 'About' },
		{ href: '/colophon', label: 'Colophon' }
	];

	let scrolled = $state(false);
	let menuOpen = $state(false);

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
			<a href="/" class="site-id" onclick={() => (menuOpen = false)}>
				<span class="site-mark">◇</span>
				<span class="site-name">Anindya Singh</span>
			</a>

			<button
				class="menu-toggle"
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span></span>
				<span></span>
			</button>

			<nav class="site-nav" class:open={menuOpen}>
				{#each navLinks as link (link.href)}
					{@const current = $page.url.pathname}
					<a
						href={link.href}
						class:active={current === link.href || (link.href !== '/' && current.startsWith(link.href))}
						onclick={() => (menuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-inner">
			<div class="footer-col">
				<a class="footer-label" href="/colophon">Colophon</a>
				<p class="footer-text">
					Built with <a href="https://kit.svelte.dev" target="_blank" rel="noopener">SvelteKit</a>
					and <a href="https://github.com/chenglou/pretext" target="_blank" rel="noopener">Pretext</a>.
					Set in Inter, Newsreader &amp; JetBrains Mono.
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
		<p class="footer-copy">© {new Date().getFullYear()} Anindya Singh. All rights reserved.</p>
	</footer>
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

	/* ── Site identity ── */
	.site-id {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		text-decoration: none;
		color: var(--color-text);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: var(--step-0);
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	.site-mark {
		font-size: 1.1em;
		color: var(--color-accent);
		transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.site-id:hover .site-mark {
		transform: rotate(180deg);
	}

	/* ── Navigation ── */
	.site-nav {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.site-nav a {
		font-family: var(--font-sans);
		font-size: var(--step--1);
		font-weight: 500;
		color: var(--color-text-muted);
		text-decoration: none;
		padding: var(--space-3xs) var(--space-2xs);
		border-radius: var(--radius);
		transition: color var(--transition), background var(--transition);
		position: relative;
	}

	.site-nav a:hover {
		color: var(--color-text);
		background: var(--color-accent-soft);
	}

	.site-nav a.active {
		color: var(--color-text);
	}

	.site-nav a.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--color-accent);
	}

	/* ── Menu toggle (mobile) ── */
	.menu-toggle {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-2xs);
	}

	.menu-toggle span {
		display: block;
		width: 22px;
		height: 2px;
		background: var(--color-text);
		border-radius: 2px;
		transition: transform 250ms ease, opacity 200ms ease;
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
		.menu-toggle {
			display: flex;
		}

		.site-nav {
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			background: var(--color-bg);
			border-bottom: 1px solid var(--color-border);
			flex-direction: column;
			align-items: stretch;
			padding: var(--space-s);
			gap: var(--space-2xs);
			transform: translateY(-100%);
			opacity: 0;
			pointer-events: none;
			transition: transform 300ms ease, opacity 200ms ease;
		}

		.site-nav.open {
			transform: translateY(0);
			opacity: 1;
			pointer-events: auto;
		}

		.site-nav a {
			padding: var(--space-s);
			font-size: var(--step-1);
		}

		.site-nav a.active::after {
			display: none;
		}

		.footer-inner {
			grid-template-columns: 1fr;
			gap: var(--space-l);
		}
	}
</style>
