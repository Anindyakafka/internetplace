<svelte:head>
	<title>Message received — Anindya Singh</title>
	<meta name="description" content="Confirmation that your message was sent to Anindya Singh." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="confirmation">
	<p class="kicker">Transmission complete</p>
	<h1>Your message arrived.</h1>
	<p>Thank you for writing. I’ll read it and respond when I can.</p>
	<div class="actions">
		<a class="primary" href="/">Return home</a>
		<a href="/sections">Keep exploring</a>
	</div>
</section>

<style>
	.confirmation { width:min(100% - 2rem,62rem); min-height:65vh; margin:auto; padding:clamp(5rem,12vw,10rem) 0; box-sizing:border-box; }
	.kicker { margin:0; color:var(--color-accent); font:600 var(--step--1)/1 var(--font-mono); letter-spacing:.12em; text-transform:uppercase; }
	h1 { max-width:12ch; margin:var(--space-s) 0 var(--space-l); font:500 clamp(3.2rem,8vw,7rem)/.9 var(--font-serif); letter-spacing:-.045em; }
	.confirmation > p:not(.kicker) { max-width:48ch; color:var(--color-text-muted); font-size:var(--step-1); line-height:1.6; }
	.actions { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:var(--space-xl); }
	a { padding:.72rem 1rem; border:1px solid var(--color-border-strong); color:var(--color-text); text-decoration:none; }
	a.primary { border-color:var(--color-accent); background:var(--color-accent); color:#fff; }
</style>
