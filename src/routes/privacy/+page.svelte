<svelte:head>
	<title>Privacy — Anindya Singh</title>
	<meta name="description" content="How anindyasingh.com handles contact messages, local preferences, and third-party content." />
</svelte:head>

<article class="privacy-page">
	<header>
		<p class="kicker">Site note · 7 September 2026</p>
		<h1>Privacy, plainly.</h1>
		<p class="lede">This is a personal archive, not an advertising operation. I do not sell personal information or install behavioural analytics.</p>
	</header>

	<section>
		<h2>Messages</h2>
		<p>The contact form asks for your name, email address, and message so I can read and reply to it. Netlify processes and stores form submissions on this site’s behalf. Please do not send sensitive personal information through the form.</p>
		<p>You may ask me to delete a message by using the <a href="/about#contact">contact form</a> or the email link on the site.</p>
	</section>

	<section>
		<h2>Local preferences</h2>
		<p>The site stores your light or dark theme choice in your browser. The Windows 98 room may also store desktop preferences locally. These settings remain on your device and are not used to profile you.</p>
	</section>

	<section>
		<h2>Maps and external material</h2>
		<p>Some pages request map tiles, fonts, live transport information, or other material from external providers. The Windows 98 room also opens independently hosted games and applications only after you choose them. Those providers may receive ordinary connection information such as your IP address and browser details, and their own privacy terms apply.</p>
	</section>

	<section>
		<h2>Analytics and cookies</h2>
		<p>No first-party analytics or advertising trackers are installed. This site does not currently set a tracking cookie, which is why it does not display a cookie-consent banner. If that changes, this notice and the consent approach will be reviewed first.</p>
	</section>

	<section>
		<h2>Changes</h2>
		<p>This note will be updated when the site’s data practices materially change.</p>
	</section>
</article>

<style>
	.privacy-page { width:min(100% - 2rem,72rem); margin:auto; padding:clamp(4rem,9vw,8rem) 0; box-sizing:border-box; }
	header { max-width:62rem; padding-bottom:var(--space-2xl); border-bottom:1px solid var(--color-border); }
	.kicker { margin:0; color:var(--color-accent); font:600 var(--step--1)/1 var(--font-mono); letter-spacing:.1em; text-transform:uppercase; }
	h1 { margin:var(--space-s) 0 var(--space-l); font:500 clamp(3.5rem,9vw,7.5rem)/.9 var(--font-serif); letter-spacing:-.05em; }
	.lede { max-width:50ch; margin:0; color:var(--color-text-muted); font-size:var(--step-1); line-height:1.55; }
	section { display:grid; grid-template-columns:minmax(10rem,.55fr) minmax(0,1fr); gap:clamp(1rem,5vw,5rem); padding:var(--space-xl) 0; border-bottom:1px solid var(--color-border); }
	h2 { margin:0; font:500 var(--step-2)/1.1 var(--font-serif); }
	section p { grid-column:2; max-width:68ch; margin:0; color:var(--color-text-muted); line-height:1.7; }
	section p + p { margin-top:var(--space-s); }
	a { color:var(--color-accent); }
	@media (max-width:640px) { section { grid-template-columns:1fr; } section p { grid-column:1; } }
</style>
