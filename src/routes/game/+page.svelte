<script lang="ts">
	let loaded = $state(false);
</script>

<svelte:head>
	<title>EmuOS — Anindya Singh</title>
	<meta name="description" content="A Windows 98 desktop for browser games and nostalgic applications." />
</svelte:head>

<main class="emuos-room">
	{#if !loaded}<div class="loading" aria-live="polite">Loading EmuOS…</div>{/if}
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
</style>
