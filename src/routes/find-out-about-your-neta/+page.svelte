<script lang="ts">
	let loaded = $state(false);
	const appUrl = 'https://diagramchasing.fun/2024/who-is-my-neta';
</script>

<svelte:head>
	<title>Find out about your neta — Anindya Singh</title>
	<meta name="description" content="Explore Lok Sabha constituencies, representatives, declared assets, criminal cases, attendance, education, and parliamentary activity." />
</svelte:head>

<main class="neta-page">
	<header>
		<div>
			<p class="eyebrow">Election affidavits · Parliamentary activity</p>
			<h1>Find out about your neta.</h1>
		</div>
		<div class="intro">
			<p>Choose a Lok Sabha constituency to inspect its representative, declared assets, criminal cases, attendance, education, and questions asked in Parliament.</p>
			<p class="archive-note">The records describe the 17th Lok Sabha and the 2019–2024 election datasets. They are a historical public-data archive, not a claim about a representative’s current status.</p>
		</div>
	</header>

	<section class="app-shell" aria-label="Find out about your neta interactive explorer">
		{#if !loaded}<div class="loading"><span></span>Opening the constituency archive…</div>{/if}
		<iframe
			src={appUrl}
			title="Who is my neta constituency and representative explorer"
			allow="geolocation"
			loading="eager"
			referrerpolicy="strict-origin-when-cross-origin"
			onload={() => loaded = true}
		></iframe>
	</section>

	<footer class="project-note">
		<p>Built from election affidavits published by MyNeta and legislative activity from PRS India. The records cover the 2019 and 2024 election cycles and the 17th Lok Sabha.</p>
		<div><a href={appUrl} target="_blank" rel="noreferrer">Open full-screen ↗</a><a href="https://github.com/thedivtagguy/whoismyneta" target="_blank" rel="noreferrer">Source and methodology ↗</a></div>
	</footer>
</main>

<style>
	.neta-page{width:min(100%,100rem);margin:auto;padding:clamp(2rem,5vw,5rem) clamp(1rem,3vw,2.5rem) 5rem;box-sizing:border-box}header{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(18rem,.85fr);gap:clamp(2rem,6vw,7rem);align-items:end;margin-bottom:clamp(2rem,5vw,4rem)}.eyebrow{margin:0 0 .7rem;color:var(--color-accent);font:600 var(--step--1)/1.2 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}h1{max-width:11ch;margin:0;font:500 clamp(3.7rem,9vw,8.5rem)/.82 var(--font-serif);letter-spacing:-.055em}.intro{color:var(--color-text-muted);font-size:var(--step-0);line-height:1.6}.intro p{margin:.7rem 0}.archive-note{padding-left:1rem;border-left:3px solid var(--color-accent);font-size:var(--step--1)}.app-shell{position:relative;min-height:78vh;overflow:hidden;border:1px solid var(--color-border-strong);border-radius:var(--radius-lg);background:#fff;box-shadow:0 1.2rem 3rem color-mix(in srgb,var(--color-text) 12%,transparent)}iframe{display:block;width:100%;height:max(78vh,52rem);border:0;background:#fff}.loading{position:absolute;z-index:1;inset:0;display:grid;place-content:center;justify-items:center;gap:.8rem;color:#58606d;font:600 .75rem var(--font-mono);text-transform:uppercase;background:#f7f7f7}.loading span{width:1.8rem;height:1.8rem;border:2px solid #d6d9dd;border-top-color:#4d80e6;border-radius:50%;animation:spin .8s linear infinite}.project-note{display:flex;justify-content:space-between;gap:2rem;padding:1.2rem 0;color:var(--color-text-muted);font-size:var(--step--1);line-height:1.5}.project-note p{max-width:72ch;margin:0}.project-note div{display:flex;flex-wrap:wrap;align-content:start;justify-content:flex-end;gap:.8rem}.project-note a{color:var(--color-accent);font-family:var(--font-mono);white-space:nowrap}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:760px){header{grid-template-columns:1fr}.app-shell{margin-inline:-1rem;border-inline:0;border-radius:0}iframe{height:82vh}.project-note{flex-direction:column}.project-note div{justify-content:flex-start}}@media(prefers-reduced-motion:reduce){.loading span{animation:none}}
</style>
