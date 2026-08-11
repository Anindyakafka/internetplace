<script lang="ts">
	import {
		prepareWithSegments,
		layoutNextLineRange,
		materializeLineRange,
		type PreparedTextWithSegments,
		type LayoutCursor,
		type LayoutLineRange
	} from '@chenglou/pretext';
	import type { Obstacle } from './obstacles';

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
	let cursorObstacle = $state<{ x: number; y: number; radius: number } | null>(null);
	let pointerFrame = 0;
	let prepared = $derived.by<PreparedTextWithSegments>(() => {
		const options = letterSpacing !== undefined
			? { letterSpacing, whiteSpace: 'pre-wrap' as const }
			: { whiteSpace: 'pre-wrap' as const };
		return prepareWithSegments(text, font, options);
	});

	function handlePointerMove(event: PointerEvent) {
		if (!cursorAvoidance || event.pointerType === 'touch' || !matchMedia('(min-width: 800px)').matches) return;
		cancelAnimationFrame(pointerFrame);
		pointerFrame = requestAnimationFrame(() => {
			const rect = container.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
			cursorObstacle = { x, y, radius: 68 };
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

			const out: { text: string; y: number; width: number; x: number }[] = [];
			let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
			let y = 0;
			let finished = false;

			while (!finished) {
				let left = 0;
				let right = containerWidth;
				for (const obstacle of _obs) {
					if (y > obstacle.y1 || y + _lh < obstacle.y0) continue;
					if (obstacle.side === 'left') left += obstacle.width;
					else right -= obstacle.width;
				}
				let slots = [{ left, right }];
				if (_cursorObstacle) {
					const bandCenter = y + _lh / 2;
					const dy = Math.abs(bandCenter - _cursorObstacle.y);
					if (dy < _cursorObstacle.radius) {
						const dx = Math.sqrt(_cursorObstacle.radius ** 2 - dy ** 2) + 16;
						const blockedLeft = _cursorObstacle.x - dx;
						const blockedRight = _cursorObstacle.x + dx;
						slots = slots.flatMap((slot) => {
							if (blockedRight <= slot.left || blockedLeft >= slot.right) return [slot];
							return [
								{ left: slot.left, right: Math.min(slot.right, blockedLeft) },
								{ left: Math.max(slot.left, blockedRight), right: slot.right }
							].filter((part) => part.right - part.left >= 72);
						});
					}
				}

				for (const slot of slots) {
					const range: LayoutLineRange | null = layoutNextLineRange(_prepared, cursor, slot.right - slot.left);
					if (range === null) { finished = true; break; }
					const line = materializeLineRange(_prepared, range);
					out.push({ text: line.text, y, width: range.width, x: slot.left });
					cursor = range.end;
				}
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
