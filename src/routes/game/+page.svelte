<script lang="ts">
	import { onMount } from 'svelte';

	type AppId = 'welcome' | 'notepad' | 'paint' | 'games';
	type WindowState = { id: AppId; title: string; icon: string; x: number; y: number; width: number; height: number; open: boolean; minimized: boolean; z: number };

	let phase = $state<'post' | 'splash' | 'desktop'>('post');
	let now = $state(new Date());
	let startOpen = $state(false);
	let assistantOpen = $state(true);
	let sheepVisible = $state(true);
	let note = $state('Welcome to Wondows 98.\n\nThis machine belongs to Anindya.\nGames will arrive after the room is ready.');
	let drawing = false;
	let paintCanvas: HTMLCanvasElement = $state()!;
	let zCounter = 5;
	let drag: { id: AppId; offsetX: number; offsetY: number } | null = null;

	let windows = $state<WindowState[]>([
		{ id: 'welcome', title: 'Welcome to Wondows 98', icon: '💻', x: 130, y: 76, width: 500, height: 330, open: true, minimized: false, z: 2 },
		{ id: 'notepad', title: 'fieldnotes.txt - Notepad', icon: '📝', x: 230, y: 120, width: 520, height: 390, open: false, minimized: false, z: 3 },
		{ id: 'paint', title: 'Untitled - Paint', icon: '🎨', x: 300, y: 92, width: 620, height: 460, open: false, minimized: false, z: 4 },
		{ id: 'games', title: 'Games', icon: '🕹', x: 195, y: 105, width: 520, height: 350, open: false, minimized: false, z: 5 }
	]);

	onMount(() => {
		const postTimer = window.setTimeout(() => phase = 'splash', 2100);
		const desktopTimer = window.setTimeout(() => phase = 'desktop', 5000);
		const clock = window.setInterval(() => now = new Date(), 30_000);
		return () => { window.clearTimeout(postTimer); window.clearTimeout(desktopTimer); window.clearInterval(clock); };
	});

	function appWindow(id: AppId) { return windows.find((window) => window.id === id); }
	function focusWindow(id: AppId) {
		const target = appWindow(id); if (!target) return;
		target.z = ++zCounter;
	}
	function openApp(id: AppId) {
		const target = appWindow(id); if (!target) return;
		target.open = true; target.minimized = false; target.z = ++zCounter; startOpen = false;
	}
	function closeApp(id: AppId) { const target = appWindow(id); if (target) target.open = false; }
	function minimizeApp(id: AppId) { const target = appWindow(id); if (target) target.minimized = true; }
	function beginDrag(event: PointerEvent, id: AppId) {
		if ((event.target as HTMLElement).closest('button')) return;
		const target = appWindow(id); if (!target) return;
		focusWindow(id);
		drag = { id, offsetX: event.clientX - target.x, offsetY: event.clientY - target.y };
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	function moveDrag(event: PointerEvent) {
		if (!drag) return;
		const target = appWindow(drag.id); if (!target) return;
		target.x = Math.max(0, Math.min(window.innerWidth - 180, event.clientX - drag.offsetX));
		target.y = Math.max(0, Math.min(window.innerHeight - 90, event.clientY - drag.offsetY));
	}
	function endDrag() { drag = null; }
	function paintStart(event: PointerEvent) { drawing = true; paint(event); }
	function paint(event: PointerEvent) {
		if (!drawing || !paintCanvas) return;
		const rect = paintCanvas.getBoundingClientRect();
		const ctx = paintCanvas.getContext('2d'); if (!ctx) return;
		ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc((event.clientX - rect.left) * paintCanvas.width / rect.width, (event.clientY - rect.top) * paintCanvas.height / rect.height, 3, 0, Math.PI * 2); ctx.fill();
	}
	function clearPaint() { paintCanvas?.getContext('2d')?.clearRect(0, 0, paintCanvas.width, paintCanvas.height); }
</script>

<svelte:head><title>Wondows 98 — Anindya Singh</title><meta name="description" content="A small retro desktop and future home for browser games." /></svelte:head>

<main class="machine" class:desktop={phase === 'desktop'}>
	{#if phase === 'post'}
		<section class="post-screen" aria-live="polite">
			<p>ANINDYA SYSTEMS BIOS v0.98</p><p>Copyright (C) 1998–2026</p><br />
			<p>CPU: MATERIAL CONDITIONS PROCESSOR ........ OK</p><p>MEMORY TEST: 65536K ......................... OK</p><p>PRIMARY ARCHIVE: DETECTED</p><p>GAME DRIVE: EMPTY</p><br /><p>Starting Wondows 98<span class="cursor">_</span></p>
			<button onclick={() => phase = 'desktop'}>Skip boot</button>
		</section>
	{:else if phase === 'splash'}
		<section class="splash-screen" aria-live="polite">
			<div class="flag" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
			<p class="micro">Anindya Systems</p><h1>Wondows <strong>98</strong></h1><p>Second Hand Edition</p>
			<div class="loadbar"><span></span></div><button onclick={() => phase = 'desktop'}>Skip boot</button>
		</section>
	{:else}
		<section class="desktop-area" aria-label="Wondows 98 desktop">
			<div class="desktop-icons">
				<button ondblclick={() => openApp('welcome')}><span>💻</span>My Computer</button>
				<button ondblclick={() => openApp('notepad')}><span>📝</span>Field Notes</button>
				<button ondblclick={() => openApp('paint')}><span>🎨</span>Paint</button>
				<button ondblclick={() => openApp('games')}><span>🕹</span>Games</button>
				<a href="/"><span>🌐</span>Return to site</a>
			</div>

			{#each windows as window (window.id)}
				{#if window.open && !window.minimized}
					<section class="retro-window" aria-label={window.title} style={`left:${window.x}px;top:${window.y}px;width:min(${window.width}px,calc(100vw - 12px));height:min(${window.height}px,calc(100vh - 48px));z-index:${window.z}`} onpointerdown={() => focusWindow(window.id)}>
						<header class="titlebar" role="toolbar" tabindex="0" aria-label={`${window.title} window controls`} onpointerdown={(event) => beginDrag(event, window.id)} onpointermove={moveDrag} onpointerup={endDrag}>
							<strong>{window.icon} {window.title}</strong><div><button aria-label="Minimize" onclick={() => minimizeApp(window.id)}>_</button><button aria-label="Close" onclick={() => closeApp(window.id)}>×</button></div>
						</header>
						{#if window.id === 'welcome'}
							<div class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Help</div><div class="welcome-content"><div class="wondows-mark"><div class="mini-flag"><i></i><i></i><i></i><i></i></div><span>Wondows <b>98</b></span></div><h2>Welcome to the machine.</h2><p>This is a small browser desktop assembled for obsolete software, future games, sheep, notes, and other unnecessary but essential things.</p><p>Double-click an icon to begin. The Games folder is deliberately empty—for now.</p><button onclick={() => closeApp('welcome')}>Begin</button></div>
						{:else if window.id === 'notepad'}
							<div class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; Search&nbsp;&nbsp; Help</div><textarea class="notepad" bind:value={note} aria-label="Notepad document"></textarea>
						{:else if window.id === 'paint'}
							<div class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Image&nbsp;&nbsp; Help</div><div class="paint-tools"><button onclick={clearPaint}>New</button><span>✎ Pencil · black</span></div><div class="canvas-wrap"><canvas bind:this={paintCanvas} width="900" height="560" onpointerdown={paintStart} onpointermove={paint} onpointerup={() => drawing = false} onpointerleave={() => drawing = false}></canvas></div>
						{:else}
							<div class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Help</div><div class="games-empty"><span>🕹</span><h2>This folder is empty.</h2><p>The room is ready. The game is not.</p><small>0 object(s)</small></div>
						{/if}
					</section>
				{/if}
			{/each}

			{#if sheepVisible}<button class="sheep" aria-label="Hide desktop sheep" onclick={() => sheepVisible = false}><i>☁</i><b>••</b></button>{/if}
			{#if assistantOpen}<aside class="assistant"><button aria-label="Close assistant" onclick={() => assistantOpen = false}>×</button><div class="clip">〰</div><p>It looks like you're building an archive. Would you like to procrastinate?</p></aside>{/if}
		</section>

		<nav class="taskbar" aria-label="Desktop taskbar">
			<button class:pressed={startOpen} onclick={(event) => { event.stopPropagation(); startOpen = !startOpen; }}><span class="tiny-flag"><i></i><i></i><i></i><i></i></span><strong>Start</strong></button>
			<div class="tasks">{#each windows.filter((item) => item.open) as item}<button class:pressed={!item.minimized} onclick={() => item.minimized ? openApp(item.id) : minimizeApp(item.id)}>{item.icon} {item.title}</button>{/each}</div>
			<div class="tray">🔊 {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
		</nav>
		{#if startOpen}<section class="start-menu" role="menu" tabindex="0" onclick={(event) => event.stopPropagation()} onkeydown={(event) => { if (event.key === 'Escape') startOpen = false; }}><div class="start-rail">Wondows <b>98</b></div><div class="start-items"><button onclick={() => openApp('games')}>🕹 <span><b>Programs</b><small>Games and applications</small></span></button><button onclick={() => openApp('notepad')}>📝 <span><b>Documents</b><small>Open Field Notes</small></span></button><button onclick={() => assistantOpen = true}>📎 <span><b>Help</b><small>Summon the assistant</small></span></button><button onclick={() => sheepVisible = true}>🐑 <span><b>Run…</b><small>Release one sheep</small></span></button><hr /><a href="/">⏻ <span><b>Shut Down…</b><small>Return to the website</small></span></a></div></section>{/if}
	{/if}
</main>

<style>
	:global(html:has(.machine)),:global(body:has(.machine)){overflow:hidden;background:#000}.machine{position:fixed;inset:0;z-index:1000;overflow:hidden;background:#050505;color:#ddd;font-family:'MS Sans Serif',Tahoma,Geneva,sans-serif}.post-screen{height:100%;box-sizing:border-box;padding:3vw;color:#c9c9c9;font:clamp(.7rem,1.3vw,1rem)/1.35 'Courier New',monospace}.post-screen p{margin:0}.post-screen button,.splash-screen button{position:absolute;right:1rem;bottom:1rem;color:#aaa;border:1px solid #777;background:#222;font:inherit}.cursor{animation:blink .7s step-end infinite}@keyframes blink{50%{opacity:0}}.splash-screen{height:100%;display:grid;place-content:center;justify-items:center;background:#78a9d2;color:#111}.splash-screen h1{margin:0;font:italic 700 clamp(3rem,9vw,7rem)/.8 Arial,sans-serif;letter-spacing:-.08em}.splash-screen h1 strong{font-size:.65em;color:#fff;text-shadow:2px 2px #111}.splash-screen>p{margin:.55rem 0;font-weight:bold}.splash-screen .micro{justify-self:start;margin:0;font-size:.75rem}.flag,.mini-flag,.tiny-flag{display:grid;grid-template-columns:1fr 1fr;gap:2px;transform:skewY(-8deg) rotate(-5deg)}.flag{width:76px;height:58px;margin-bottom:1rem}.flag i:nth-child(1),.mini-flag i:nth-child(1),.tiny-flag i:nth-child(1){background:#ef493d}.flag i:nth-child(2),.mini-flag i:nth-child(2),.tiny-flag i:nth-child(2){background:#59a84d}.flag i:nth-child(3),.mini-flag i:nth-child(3),.tiny-flag i:nth-child(3){background:#347dcc}.flag i:nth-child(4),.mini-flag i:nth-child(4),.tiny-flag i:nth-child(4){background:#f0c443}.loadbar{width:min(66vw,360px);height:18px;margin-top:2rem;padding:2px;border:2px inset #eee;background:#eee}.loadbar span{display:block;width:34%;height:100%;background:#073a84;animation:load 1.25s steps(8) infinite}@keyframes load{to{transform:translateX(190%)}}.desktop-area{position:absolute;inset:0 0 30px;background:#008080;overflow:hidden}.desktop-icons{display:grid;gap:.55rem;width:88px;padding:.75rem}.desktop-icons button,.desktop-icons a{width:82px;display:grid;justify-items:center;gap:.15rem;padding:.25rem;color:#fff;border:1px solid transparent;background:transparent;font:11px/1.15 'MS Sans Serif',Tahoma,sans-serif;text-align:center;text-decoration:none;text-shadow:1px 1px #000}.desktop-icons button:hover,.desktop-icons button:focus,.desktop-icons a:hover{border:1px dotted #fff;background:#00008055}.desktop-icons span{font-size:30px;text-shadow:none}.retro-window{position:absolute;display:flex;flex-direction:column;min-width:180px;min-height:100px;padding:3px;box-sizing:border-box;border:2px outset #fff;background:#c0c0c0;color:#000;box-shadow:2px 2px 0 #111}.titlebar{height:25px;display:flex;align-items:center;justify-content:space-between;padding:2px 3px;background:linear-gradient(90deg,#000080,#1084d0);color:white;cursor:move;user-select:none}.titlebar strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.titlebar div{display:flex;gap:2px}.titlebar button,.paint-tools button,.welcome-content button{min-width:20px;height:19px;padding:0 4px;border:2px outset #fff;background:#c0c0c0;color:#000;font:bold 12px/1 Tahoma}.titlebar button:active,.paint-tools button:active,.welcome-content button:active{border-style:inset}.window-menu{flex:0 0 auto;padding:5px 8px;border-bottom:1px solid #888;font-size:12px}.welcome-content{flex:1;padding:1.3rem;overflow:auto;background:#fff}.welcome-content h2{font-size:1.35rem}.welcome-content p{font-size:.83rem;line-height:1.5}.wondows-mark{display:flex;align-items:center;gap:.7rem;font-size:1.4rem}.mini-flag{width:45px;height:34px}.wondows-mark b{color:#666}.notepad{flex:1;min-height:0;resize:none;padding:5px;border:2px inset #fff;background:#fff;color:#000;font:14px/1.35 'Courier New',monospace}.paint-tools{display:flex;align-items:center;gap:1rem;padding:4px;border-bottom:2px groove #fff;font-size:12px}.canvas-wrap{flex:1;min-height:0;margin:5px;overflow:auto;border:2px inset #fff;background:#888}.canvas-wrap canvas{display:block;width:100%;height:100%;background:#fff;touch-action:none;cursor:crosshair}.games-empty{flex:1;display:grid;place-content:center;justify-items:center;background:#fff}.games-empty>span{font-size:3rem}.games-empty h2{margin:.5rem 0 0;font-size:1rem}.games-empty p{font-size:.8rem}.games-empty small{position:absolute;bottom:7px;left:7px}.taskbar{position:absolute;z-index:9000;left:0;right:0;bottom:0;height:30px;display:flex;align-items:center;gap:3px;padding:2px;box-sizing:border-box;border-top:2px outset #fff;background:#c0c0c0;color:#000}.taskbar button{height:25px;display:flex;align-items:center;gap:4px;min-width:72px;max-width:190px;border:2px outset #fff;background:#c0c0c0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.taskbar button.pressed{border-style:inset;background:#ddd}.tiny-flag{width:18px;height:15px}.tasks{min-width:0;display:flex;gap:2px;flex:1;overflow:hidden}.tasks button{flex:0 1 180px}.tray{height:24px;display:flex;align-items:center;padding:0 8px;border:2px inset #fff;font-size:11px;white-space:nowrap}.start-menu{position:absolute;z-index:8999;left:2px;bottom:29px;width:270px;display:flex;border:2px outset #fff;background:#c0c0c0;color:#000;box-shadow:2px 2px #111}.start-rail{width:28px;padding:8px 4px;box-sizing:border-box;background:#777;color:#ddd;font-size:18px;font-weight:bold;letter-spacing:1px;writing-mode:vertical-rl;transform:rotate(180deg)}.start-rail b{color:#fff}.start-items{flex:1;padding:3px}.start-items button,.start-items a{width:100%;display:flex;align-items:center;gap:10px;padding:7px;border:0;background:transparent;color:#000;text-align:left;text-decoration:none}.start-items button:hover,.start-items a:hover{background:#000080;color:#fff}.start-items span{display:grid}.start-items small{font-size:10px}.start-items hr{border:0;border-top:1px solid #888;border-bottom:1px solid #fff}.assistant{position:absolute;z-index:8500;right:3rem;bottom:3.5rem;width:220px;padding:1rem;border:2px outset #fff;background:#ffffcf;color:#000;box-shadow:2px 2px #222;font-size:12px}.assistant>button{position:absolute;right:3px;top:3px;border:0;background:transparent}.assistant p{margin:.3rem 0 0;line-height:1.4}.clip{font:bold 42px/1 serif;transform:rotate(90deg);width:max-content}.sheep{position:absolute;z-index:100;left:15%;bottom:12px;border:0;background:transparent;color:#fff;animation:sheepwalk 24s linear infinite}.sheep i{font:38px/1 sans-serif;font-style:normal}.sheep b{position:absolute;left:15px;top:12px;color:#111;font-size:8px}@keyframes sheepwalk{0%{left:-5%}49%{transform:scaleX(1)}50%{left:90%;transform:scaleX(-1)}99%{transform:scaleX(-1)}100%{left:-5%}}@media(max-width:600px){.post-screen{padding-top:4rem}.retro-window{left:6px!important;top:42px!important;width:calc(100vw - 12px)!important;height:calc(100vh - 78px)!important}.assistant{right:.5rem;bottom:3rem}.desktop-icons{grid-template-columns:repeat(3,82px);width:auto}.tasks button{min-width:35px;font-size:0}.tasks button:first-letter{font-size:12px}.tray{padding-inline:3px}}
</style>
