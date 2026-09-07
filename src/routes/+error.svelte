<script lang="ts">
	import { page } from '$app/stores';

	const isMissing = $derived($page.status === 404);
</script>

<svelte:head>
	<title>{isMissing ? 'Page not found' : 'Something went wrong'} — Anindya Singh</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error-page">
	<p class="error-code">{$page.status}</p>
	<h1>{isMissing ? 'This record is not in the archive.' : 'The archive hit an unexpected fault.'}</h1>
	<p>
		{isMissing
			? 'The address may have changed, or the page may never have existed.'
			: 'Nothing you did caused this. Try returning to the archive and beginning again.'}
	</p>
	<nav aria-label="Error page options">
		<a class="primary" href="/sections">Explore the sections</a>
		<a href="/">Return to the map</a>
	</nav>
</section>

<style>
	.error-page { width:min(100% - 2rem,70rem); min-height:68vh; margin:auto; padding:clamp(5rem,12vw,10rem) 0; box-sizing:border-box; }
	.error-code { margin:0; color:var(--color-accent); font:600 var(--step--1)/1 var(--font-mono); letter-spacing:.14em; }
	h1 { max-width:13ch; margin:var(--space-s) 0 var(--space-l); font:500 clamp(3.4rem,9vw,8rem)/.9 var(--font-serif); letter-spacing:-.045em; }
	.error-page > p:not(.error-code) { max-width:54ch; color:var(--color-text-muted); font-size:var(--step-1); line-height:1.6; }
	nav { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:var(--space-xl); }
	a { padding:.72rem 1rem; border:1px solid var(--color-border-strong); color:var(--color-text); text-decoration:none; }
	a.primary { border-color:var(--color-accent); background:var(--color-accent); color:#fff; }
</style>
