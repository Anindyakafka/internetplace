/**
 * Obstacle model for PretextText.
 *
 * An obstacle is a vertical band the body text must flow around.
 * `lineWidthForY(y)` returns the available text width at a given vertical
 * position, subtracting any obstacle that intersects that line.
 *
 * See docs/PRETEXT.md for the design rationale.
 */

export interface Obstacle {
	/** Top of the obstacle band, in pixels relative to the text container top. */
	y0: number;
	/** Bottom of the obstacle band, in pixels. */
	y1: number;
	/** Which side the obstacle sits on. The other side keeps full width. */
	side: 'left' | 'right';
	/** How many pixels of horizontal space the obstacle consumes. */
	width: number;
}

/**
 * Build a `lineWidthForY` function from the container's full width and an
 * array of obstacles. This is what Pretext's `layoutNextLineRange` consumes.
 *
 * Composition is additive: if two obstacles on the same side overlap
 * vertically, their widths sum for the overlapping band.
 */
export function buildLineWidthForY(
	fullWidth: number,
	obstacles: Obstacle[] = []
): (y: number) => number {
	return (y: number): number => {
		let leftCut = 0;
		let rightCut = 0;

		for (const obs of obstacles) {
			if (y >= obs.y0 && y <= obs.y1) {
				if (obs.side === 'left') {
					leftCut += obs.width;
				} else {
					rightCut += obs.width;
				}
			}
		}

		return Math.max(0, fullWidth - leftCut - rightCut);
	};
}

/**
 * Convenience: build an obstacle from a floated element's bounding rect.
 * Useful when a case-study page renders an image and measures it on mount.
 */
export function obstacleFromRect(
	rect: DOMRect,
	containerLeft: number,
	side: 'left' | 'right'
): Obstacle {
	return {
		y0: rect.top - containerLeft,
		y1: rect.bottom - containerLeft,
		side,
		width: rect.width
	};
}
