<script lang="ts">
	import { browser } from '$app/environment';

	let terminalInput = $state('');
	let terminalLogEl: HTMLDivElement | null = $state(null);
	let operatorOnline = $state(false);
	let istTimeLabel = $state('LOADING IST...');
	let weatherLabel = $state('SIGNAL PENDING');
	let terminalLines = $state([
		'CHHIPI/42 collective boot sequence initialized...',
		'Checking bourgeoisie influence... [TOO HIGH, AS EXPECTED]',
		'Loading comrades protocol... [FUNCTIONAL]',
		'Private property detector... [UNFORTUNATELY ACTIVE]',
		'',
		'Do not panic. Organize.',
		"Type 'help'. I will reply with disciplined sarcasm.",
		''
	]);

	const terminalPrompt = 'heart-of-gold@chhipi:~ %';
	const routes: Record<string, string> = {
		home: '/', about: '/about', work: '/work', writing: '/writing', colophon: '/colophon',
		sections: '/sections', map: '/map', tracks: '/tracks', trains: '/trains', vehicles: '/vehicles',
		notes: '/writing', 'blog-roll': '/work', blog: '/writing', contact: '/about#contact', '/': '/'
	};

	$effect(() => {
		if (!browser) return;
		const updatePresence = () => {
			const now = new Date();
			const hour = Number(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }).format(now));
			istTimeLabel = `${new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(now)} IST`;
			operatorOnline = document.visibilityState === 'visible' && hour >= 9 && hour < 23;
		};
		const refreshWeather = async () => {
			try {
				const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,weather_code&timezone=Asia%2FKolkata');
				if (!response.ok) throw new Error();
				const payload = await response.json();
				const labels: Record<number, string> = { 0: 'CLEAR', 1: 'MOSTLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'OVERCAST', 45: 'FOGGY', 51: 'LIGHT DRIZZLE', 61: 'LIGHT RAIN', 63: 'RAIN', 65: 'HEAVY RAIN', 80: 'SHOWERS', 95: 'THUNDERSTORM' };
				weatherLabel = `${Math.round(payload.current.temperature_2m)}°C, ${labels[payload.current.weather_code] ?? 'ATMOSPHERIC DRAMA'}`;
			} catch { weatherLabel = 'API HAVING FEELINGS'; }
		};
		updatePresence();
		void refreshWeather();
		const clock = window.setInterval(updatePresence, 60_000);
		const weather = window.setInterval(refreshWeather, 30 * 60_000);
		document.addEventListener('visibilitychange', updatePresence);
		return () => { window.clearInterval(clock); window.clearInterval(weather); document.removeEventListener('visibilitychange', updatePresence); };
	});

	$effect(() => {
		if (!browser || !terminalLogEl) return;
		terminalLines;
		requestAnimationFrame(() => { if (terminalLogEl) terminalLogEl.scrollTop = terminalLogEl.scrollHeight; });
	});

	function add(...lines: string[]) { terminalLines = [...terminalLines, ...lines]; }
	function submit() {
		const command = terminalInput.trim();
		terminalInput = '';
		if (!command) return;
		add(`${terminalPrompt} ${command}`);
		const [base, ...rest] = command.toLowerCase().split(/\s+/);
		const argument = rest.join(' ');
		if (base === 'help') add('Available commands for the computational proletariat:', '- help · ls · cd <route> · status · socials · weather · about · ping · clear');
		else if (base === 'ls') add('about work writing colophon sections map tracks trains vehicles contact');
		else if (base === 'cd') {
			const target = routes[argument] ?? routes[argument.replace(/^\//, '')];
			if (target && browser) window.location.href = target;
			else add(`No such route: ${argument}`);
		} else if (base === 'status') add(`CURRENTLY: ${operatorOnline ? 'ONLINE' : 'OFFLINE'}`, `LOCALTIME: ${istTimeLabel}`, `WEATHER: ${weatherLabel}`);
		else if (base === 'socials') add('LinkedIn: linkedin.com/in/anindyakafka', 'GitHub: github.com/anindyakafka', 'Instagram: instagram.com/anindya.hajabarala', 'Twitter: x.com/Kafkanindya7');
		else if (base === 'weather') add(`KOLKATA WEATHER: ${weatherLabel}`);
		else if (base === 'about') add('CHHIPI v3.0: a sarcastic shell for maps, memory, and organized dissent.');
		else if (base === 'ping') add('pong. Infrastructure still resists privatization.');
		else if (base === 'clear' || base === 'clean') terminalLines = [];
		else add(`Unknown command: ${command}`, "Type 'help', bourgeoisie.");
	}
</script>

<footer class="home-footer" aria-label="Site footer">
	<div class="footer-strip">
		<section class="footer-link-block" aria-labelledby="global-socials-heading">
			<h2 id="global-socials-heading">Socials</h2>
			<ul>
				<li><a href="https://linkedin.com/in/anindyakafka" target="_blank" rel="noreferrer noopener">LinkedIn</a></li>
				<li><a href="mailto:anindya2232@gmail.com">Email</a></li>
				<li><a href="https://www.instagram.com/anindya.hajabarala/" target="_blank" rel="noreferrer noopener">Instagram</a></li>
				<li><a href="https://x.com/Kafkanindya7" target="_blank" rel="noreferrer noopener">Twitter</a></li>
				<li><a href="https://github.com/anindyakafka" target="_blank" rel="noreferrer noopener">GitHub</a></li>
			</ul>
		</section>
		<section class="footer-link-block" aria-labelledby="global-misc-heading">
			<h2 id="global-misc-heading">Miscellaneous</h2>
			<ul>
				<li><a href="/colophon">Colophon</a></li><li><a href="/writing">Notes</a></li><li><a href="/work">Blog Roll</a></li>
				<li><a href="https://github.com/Anindyakafka/internetplace" target="_blank" rel="noreferrer noopener">Source code</a></li>
			</ul>
		</section>
		<section class="status-panel" aria-label="Operator status panel">
			<p class="status-currently">Currently <strong>{operatorOnline ? 'ONLINE' : 'OFFLINE'}</strong></p>
			<div class="status-grid"><p><span>OPERATOR:</span> ANINDYA</p><p><span>STATUS:</span> {operatorOnline ? 'SCRIBBLING' : 'DEAD'}</p><p><span>MODE:</span> {operatorOnline ? 'MARGIN NOTES IN PROGRESS' : 'OFFLINE'}</p><p><span>LOCALTIME:</span> {istTimeLabel}</p><p><span>WEATHER:</span> {weatherLabel}</p></div>
		</section>
		<section class="chhipi-terminal" aria-label="Interactive terminal">
			<div class="terminal-shell" role="region" aria-live="polite" aria-label="Terminal output">
				<div class="terminal-log" role="log" bind:this={terminalLogEl}>{#each terminalLines as line, index (index)}<p>{line}</p>{/each}</div>
				<div class="terminal-input-row"><span>{terminalPrompt}</span><input type="text" placeholder="Enter command" bind:value={terminalInput} onkeydown={(event) => { if (event.key === 'Enter') submit(); }} /></div>
			</div>
		</section>
	</div>
	<section class="footer-video-reel" aria-label="Footer reel">
		<video class="footer-video" autoplay muted loop playsinline preload="auto" onended={(event) => { const video = event.currentTarget; video.currentTime = 0; void video.play(); }}>
			<source src="/videos/intro.web.mp4" media="(min-width: 1200px)" type="video/mp4" /><source src="/videos/intro.web.720.mp4" type="video/mp4" />
		</video>
	</section>
</footer>

<style>
	.home-footer { position:relative; margin-top:var(--space-3xl); padding:clamp(.82rem,1.6vw,1.06rem) clamp(.75rem,1.8vw,1.3rem) clamp(1.05rem,2.1vw,1.5rem); border-top:1px solid color-mix(in srgb,var(--color-border) 78%,transparent); background:linear-gradient(180deg,color-mix(in srgb,var(--color-surface) 96%,transparent),color-mix(in srgb,var(--color-surface) 92%,transparent)); }
	.footer-strip { min-width:0; max-width:min(74rem,96vw); margin:0 auto; display:grid; grid-template-columns:minmax(8.8rem,1fr) minmax(8.8rem,1fr) minmax(10rem,1fr) minmax(19rem,25rem); gap:clamp(.42rem,.9vw,.62rem); align-items:start; }
	.footer-link-block h2 { margin:0 0 .24rem; font: .61rem var(--font-mono); letter-spacing:.08em; text-transform:uppercase; color:var(--color-text-muted); }
	.footer-link-block ul { list-style:none; margin:0; padding:0; display:grid; gap:.12rem; }
	.footer-link-block a { font:.74rem var(--font-sans); line-height:1.15; text-decoration:none; color:var(--color-text); border-bottom:1px solid transparent; }
	.footer-link-block a:hover { border-bottom-color:var(--color-accent); }
	.status-panel { margin:0; padding:.34rem .4rem; border:1px solid color-mix(in srgb,var(--color-border-strong) 82%,transparent); background:color-mix(in srgb,var(--color-surface) 90%,transparent); }
	.status-currently { margin:0 0 .22rem; font:.62rem var(--font-mono); letter-spacing:.09em; text-transform:uppercase; }
	.status-grid { display:grid; gap:.08rem; }
	.status-grid p { margin:0; font:.61rem/1.14 var(--font-mono); }
	.status-grid span { color:var(--color-text-muted); }
	.chhipi-terminal { min-width:0; width:100%; max-width:25rem; justify-self:end; }
	.terminal-shell { min-width:0; max-width:100%; overflow:hidden; box-sizing:border-box; min-height:10.5rem; display:flex; flex-direction:column; border:1px solid rgba(98,155,94,.62); background:linear-gradient(180deg,#081109,#060b06); padding:.36rem; box-shadow:inset 0 0 0 1px rgba(65,111,67,.45); }
	.terminal-log { width:100%; min-width:0; box-sizing:border-box; height:8.75rem; overflow:auto; display:grid; gap:.06rem; scrollbar-width:thin; scrollbar-color:rgba(142,204,136,.55) transparent; }
	.terminal-log p { min-width:0; max-width:100%; margin:0; font:.64rem/1.16 'Courier New','JetBrains Mono',monospace; color:#9ce889; white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; }
	.terminal-input-row { min-width:0; margin-top:.28rem; padding-top:.22rem; border-top:1px solid rgba(98,155,94,.35); display:grid; grid-template-columns:auto minmax(0,1fr); align-items:center; gap:.24rem; }
	.terminal-input-row span { font:.59rem 'Courier New','JetBrains Mono',monospace; color:#6de65d; }
	.terminal-input-row input { min-width:0; width:100%; box-sizing:border-box; border:1px solid rgba(75,131,76,.72); background:#050905; padding:.24rem .3rem; font:.63rem 'Courier New','JetBrains Mono',monospace; color:#b2ff9f; }
	.footer-video-reel { max-width:min(74rem,96vw); height:clamp(13rem,28vw,22rem); margin:clamp(.55rem,1.2vw,.8rem) auto 0; border:1px solid color-mix(in srgb,var(--color-border-strong) 72%,transparent); background:#060b06; overflow:hidden; }
	.footer-video { display:block; width:100%; height:100%; object-fit:cover; object-position:center 64%; filter:saturate(.96) contrast(1.03) brightness(.88); }
	@media (max-width:640px) { .home-footer{padding-inline:.6rem}.footer-strip{grid-template-columns:1fr;gap:.42rem}.chhipi-terminal{max-width:none;justify-self:stretch}.terminal-shell{min-height:12rem}.terminal-log{height:9.75rem}.terminal-input-row{grid-template-columns:1fr;gap:.35rem}.footer-video-reel{height:clamp(9.5rem,38vw,14rem)} }
</style>
