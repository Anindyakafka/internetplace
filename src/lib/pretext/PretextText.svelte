<script lang="ts">
	import {
		prepareWithSegments,
		layoutNextLineRange,
		materializeLineRange,
		type PreparedTextWithSegments,
		type LayoutCursor,
		type LayoutLineRange,
		type LayoutLine
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
	}

	let {
		text,
		font,
		lineHeight,
		obstacles = [],
		class: className = '',
		letterSpacing
	}: Props = $props();

	let container: HTMLDivElement;

	// Layout state — updated inside $effect on resize / prop change
	let lines = $state<{ text: string; y: number; width: number; x: number }[]>([]);
	let totalHeight = $state(0);

	$effect(() => {
		if (!container) return;

		// Track values we depend on so the effect re-runs when they change.
		const _text = text;
		const _font = font;
		const _lh = lineHeight;
		const _obs = obstacles;
		const _ls = letterSpacing;

		// Phase 1: prepare (segment + measure) — call once per text/font change.
		const options = _ls !== undefined ? { letterSpacing: _ls } : undefined;
		const prepared: PreparedTextWithSegments = prepareWithSegments(_text, _font, options);

		const doLayout = () => {
			const containerWidth = container.clientWidth;

			const lineWidthForY = buildLineWidthForY(containerWidth, _obs);
			const leftOffsetForY = buildLeftOffsetForY(_obs);

			const out: { text: string; y: number; width: number; x: number }[] = [];
			let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
			let y = 0;

			while (true) {
				const availWidth = lineWidthForY(y);
				if (availWidth <= 0) {
					y += _lh;
					continue;
				}

				const range: LayoutLineRange | null = layoutNextLineRange(prepared, cursor, availWidth);
				if (range === null) break;

				const line = materializeLineRange(prepared, range);
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

<div bind:this={container} class="pretext-text {className}" style="height: {totalHeight}px;">
	{#each lines as line (line.y)}
		<span class="pretext-line" style="top: {line.y}px; left: {line.x}px;">{line.text}</span>
	{/each}
</div>

<style>
	.pretext-text {
		position: relative;
		overflow: hidden;
	}

	.pretext-line {
		position: absolute;
		white-space: pre;
		overflow: hidden;
	}
</style>
