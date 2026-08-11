<script lang="ts">
	import {
		prepareWithSegments,
		layoutNextLineRange,
		materializeLineRange,
		type PreparedTextWithSegments,
		type LayoutCursor,
		type LayoutLineRange
	} from '@chenglou/pretext';
	import { buildLineWidthForY, buildLeftOffsetForY, type Obstacle } from './obstacles';

	interface Props {
		/** Raw text content to lay out. */
		text: string;
		/** CSS font shorthand, e.g. '400 18px Newsreader, serif'. */
		font: string;
		/** Line height in pixels. */
		lineHeight: number;
		/** Obstacles (floated elements) that text must flow around. */
		obstacles?: Obstacle[];
		/** Extra class on the container. */
		class?: string;
		/** Optional letter-spacing to pass through to pretext. */
		letterSpacing?: number;
		/** Reflow nearby lines away from the pointer on wide, fine-pointer screens. */
		cursorAvoidance?: boolean;
	}

	let {
		text,
		font,
		lineHeight,
		obstacles = [],
		class: className = '',
		letterSpacing,
		cursorAvoidance = false
	}: Props = $props();

	let container: HTMLDivElement;

	// Layout state — updated inside $effect on resize / prop change
	let lines = $state<{ text: string; y: number; width: number; x: number }[]>([]);
	let totalHeight = $state(0);
	let cursorObstacle = $state<Obstacle | null>(null);
	let pointerFrame = 0;
	let prepared = $derived.by<PreparedTextWithSegments>(() => {
		const options = letterSpacing !== undefined ? { letterSpacing } : undefined;
		return prepareWithSegments(text, font, options);
	});

	function handlePointerMove(event: PointerEvent) {
		if (!cursorAvoidance || !matchMedia('(min-width: 800px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
		cancelAnimationFrame(pointerFrame);
		pointerFrame = requestAnimationFrame(() => {
			const rect = container.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
			const radiusX = 76;
			const radiusY = 52;
			const side = x <= rect.width / 2 ? 'left' : 'right';
			cursorObstacle = {
				y0: Math.max(0, y - radiusY),
				y1: y + radiusY,
				side,
				width: Math.min(rect.width * 0.58, side === 'left' ? x + radiusX : rect.width - x + radiusX)
			};
		});
	}

	function handlePointerLeave() {
		cancelAnimationFrame(pointerFrame);
		cursorObstacle = null;
	}

	$effect(() => {
		if (!container) return;

		// Track values we depend on so the effect re-runs when they change.
		const _lh = lineHeight;
		const _obs = obstacles;
		const _cursorObstacle = cursorObstacle;
		const _prepared = prepared;

		const doLayout = () => {
			const containerWidth = container.clientWidth;

			const activeObstacles = _cursorObstacle ? [..._obs, _cursorObstacle] : _obs;
			const lineWidthForY = buildLineWidthForY(containerWidth, activeObstacles);
			const leftOffsetForY = buildLeftOffsetForY(activeObstacles);

			const out: { text: string; y: number; width: number; x: number }[] = [];
			let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
			let y = 0;

			while (true) {
				const availWidth = lineWidthForY(y);
				if (availWidth <= 0) {
					y += _lh;
					continue;
				}

				const range: LayoutLineRange | null = layoutNextLineRange(_prepared, cursor, availWidth);
				if (range === null) break;

				const line = materializeLineRange(_prepared, range);
				const x = leftOffsetForY(y);
				out.push({ text: line.text, y, width: range.width, x });

				cursor = range.end;
				y += _lh;
			}

			lines = out;
			totalHeight = out.length > 0 ? out[out.length - 1].y + _lh : 0;
		};

		doLayout();

		// Phase 2: re-run layout on container resize (pure arithmetic, no re-measure).
		const ro = new ResizeObserver(() => doLayout());
		ro.observe(container);

		return () => ro.disconnect();
	});
</script>

<div
	bind:this={container}
	role="document"
	class="pretext-text {className}"
	class:cursor-aware={cursorAvoidance}
	style="height: {totalHeight}px; font: {font}; line-height: {lineHeight}px; letter-spacing: {letterSpacing ?? 0}px;"
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
>
	{#each lines as line (line.y)}
		<span class="pretext-line" style="top: {line.y}px; left: {line.x}px;">{line.text}</span>
	{/each}
</div>

<style>
	.pretext-text {
		position: relative;
		width: 100%;
		min-width: 0;
		overflow: visible;
	}

	.pretext-line {
		position: absolute;
		white-space: pre;
		overflow: visible;
		transition: left 110ms ease;
	}

	.cursor-aware {
		cursor: default;
	}

	@media (max-width: 799px), (pointer: coarse), (prefers-reduced-motion: reduce) {
		.pretext-line {
			transition: none;
		}
	}
</style>
