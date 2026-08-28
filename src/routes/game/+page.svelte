<script lang="ts">
	let loaded = $state(false);
</script>

<svelte:head>
	<title>EmuOS — Anindya Singh</title>
	<meta name="description" content="A Windows 98 desktop for browser games and nostalgic applications." />
</svelte:head>

<main class="emuos-room">
	{#if !loaded}<div class="loading" aria-live="polite">Loading EmuOS…</div>{/if}
	<a class="back-to-site" href="/">Back to website</a>
	<iframe
		title="EmuOS Windows 98 desktop"
		src="/emuos/index.html"
		allow="autoplay; fullscreen; clipboard-read; clipboard-write"
		onload={() => loaded = true}
	></iframe>
</main>

<style>
	:global(html:has(.emuos-room)), :global(body:has(.emuos-room)) { overflow: hidden; background: #000; }
	.emuos-room { position: fixed; inset: 0; z-index: 1000; background: #000; }
	.emuos-room iframe { display: block; width: 100%; height: 100%; border: 0; background: #000; }
	.loading { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; color: #aaa; background: #111; font: 14px 'Courier New', monospace; }
	.back-to-site { position: fixed; z-index: 4; top: 8px; right: 10px; padding: 5px 8px; border: 2px outset #fff; background: #c0c0c0; color: #000; font: 700 11px/1.1 Tahoma, sans-serif; text-decoration: none; box-shadow: 1px 1px #111; }
	.back-to-site:active { border-style: inset; }
</style>
