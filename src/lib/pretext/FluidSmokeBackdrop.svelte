<script lang="ts">
	import { onMount } from 'svelte';
	import { prepareWithSegments } from '@chenglou/pretext';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;
		const ctx = context;
		const font = 'italic 500 14px Newsreader, Georgia, serif';
		const glyphs = '.,:;~+*#%@abcdefghijklmnopqrstuvwxyz';
		const palette = [...glyphs].map((char) => {
			const prepared = prepareWithSegments(char, font);
			return { char, width: prepared.widths[0] ?? 8 };
		});
		const averageWidth = palette.reduce((sum, item) => sum + item.width, 0) / palette.length;
		let frame = 0;
		let lastPaint = 0;
		let width = 0;
		let height = 0;
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

		function resize() {
			const ratio = Math.min(devicePixelRatio, 1.5);
			width = innerWidth;
			height = innerHeight;
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		}

		function paint(now: number) {
			if (now - lastPaint < 70 && !reduceMotion) { frame = requestAnimationFrame(paint); return; }
			lastPaint = now;
			ctx.clearRect(0, 0, width, height);
			ctx.font = font;
			ctx.textBaseline = 'middle';
			const cellX = Math.max(10, averageWidth * 1.7);
			const cellY = 18;
			const time = now / 1800;
			for (let y = 0; y < height + cellY; y += cellY) {
				for (let x = 0; x < width + cellX; x += cellX) {
					const nx = x / width;
					const ny = y / height;
					const plume = Math.sin(nx * 8 + time + Math.sin(ny * 7 - time * .7))
						+ Math.cos(ny * 10 - time * .8 + Math.sin(nx * 9));
					const falloff = Math.sin(Math.PI * nx) * Math.sin(Math.PI * ny);
					const density = Math.max(0, (plume * .32 + .28) * falloff);
					if (density < .18) continue;
					const item = palette[Math.min(palette.length - 1, Math.floor(density * palette.length))];
					ctx.fillStyle = `rgba(137, 91, 72, ${Math.min(.32, density * .24)})`;
					ctx.fillText(item.char, x + Math.sin(y * .025 + time) * 12, y);
				}
			}
			if (!reduceMotion) frame = requestAnimationFrame(paint);
		}

		resize();
		addEventListener('resize', resize);
		if (reduceMotion) paint(0);
		else frame = requestAnimationFrame(paint);
		return () => { removeEventListener('resize', resize); cancelAnimationFrame(frame); };
	});
</script>

<canvas bind:this={canvas} class="fluid-smoke" aria-hidden="true"></canvas>

<style>
	.fluid-smoke { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .75; }
	@media (max-width: 799px) { .fluid-smoke { opacity: .42; } }
</style>
