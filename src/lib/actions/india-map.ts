/**
 * India Map Action
 *
 * Fetches the India SVG, inlines it into the target container, and wires up
 * per-state interactivity (hover, click, active/inactive styling).
 *
 * SVGs loaded via <img> are sandboxed — their internal DOM is inaccessible.
 * So we MUST inline the SVG for click/hover on individual state paths to work.
 *
 * The SVG (static/assets/india.svg) uses IDs like `INUP`, `INWB`, `INBR`, etc.
 * The two-letter suffix is the ISO-style state code we use throughout the app.
 */

export interface IndiaMapRegion {
	id: string; // 2-letter state code, e.g. "UP", "BR", "DL"
	name: string;
	projects: unknown[];
}

export interface IndiaMapParameters {
	regions: IndiaMapRegion[];
	svgUrl: string;
	onRegionClick: (regionId: string) => void;
	onRegionHover: (regionId: string | null) => void;
}

export function indiaMap(node: HTMLElement, params: IndiaMapParameters) {
	let currentParams = params;
	let cleanupFns: Array<() => void> = [];
	let abortController: AbortController | null = null;

	/**
	 * Extract the 2-letter state code from an SVG path ID.
	 * `INUP` -> "UP", `INBR` -> "BR", `INAN` -> "AN".
	 */
	function stateCodeFromId(rawId: string | null): string | null {
		if (!rawId) return null;
		const id = rawId.toUpperCase();
		if (!id.startsWith('IN')) return null;
		const code = id.slice(2);
		return code.length >= 2 ? code : null;
	}

	/**
	 * Inline the SVG and wire up interactivity.
	 */
	async function render() {
		// Tear down any previous render.
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
		node.innerHTML = '';

		// Defensive guard: if regions isn't ready yet (e.g. $derived not
		// evaluated on first mount), bail out — update() will re-render.
		if (!Array.isArray(currentParams.regions)) {
			return;
		}

		abortController?.abort();
		abortController = new AbortController();

		try {
			const response = await fetch(currentParams.svgUrl, {
				signal: abortController.signal
			});
			if (!response.ok) {
				console.error('[indiaMap] Failed to load SVG:', response.status, response.statusText);
				return;
			}

			const svgText = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(svgText, 'image/svg+xml');

			// Check for parse errors.
			const parseError = doc.querySelector('parsererror');
			if (parseError) {
				console.error('[indiaMap] SVG parse error:', parseError.textContent);
				return;
			}

			const svgEl = doc.documentElement;
			svgEl.removeAttribute('width');
			svgEl.removeAttribute('height');

			// The source SVG uses a lowercase `viewbox` attribute, which browsers
			// ignore (SVG attributes are case-sensitive). Fix it so the map
			// scales to fit its container instead of rendering at 1000×1000px.
			const lowerViewBox = svgEl.getAttribute('viewbox');
			if (lowerViewBox && !svgEl.getAttribute('viewBox')) {
				svgEl.setAttribute('viewBox', lowerViewBox);
				svgEl.removeAttribute('viewbox');
			}

			svgEl.style.width = '100%';
			svgEl.style.height = 'auto';
			svgEl.style.display = 'block';

			// Inline into the container.
			node.appendChild(svgEl);

			const activeIds = new Set(currentParams.regions.map((r) => r.id.toUpperCase()));

			// Style + wire every state path.
			const paths = svgEl.querySelectorAll<SVGPathElement>('path[id]');
			paths.forEach((path) => {
				const code = stateCodeFromId(path.getAttribute('id'));
				if (!code) return;

				const isActive = activeIds.has(code);
				applyStateStyle(path, isActive, false);

				if (!isActive) {
					path.style.pointerEvents = 'none';
					return;
				}

				path.style.cursor = 'pointer';
				path.setAttribute('role', 'button');
				path.setAttribute('tabindex', '0');
				path.setAttribute(
					'aria-label',
					currentParams.regions.find((r) => r.id.toUpperCase() === code)?.name ?? code
				);

				const onClick = (event: MouseEvent) => {
					event.preventDefault();
					event.stopPropagation();
					currentParams.onRegionClick(code);
				};
				const onKey = (event: KeyboardEvent) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						currentParams.onRegionClick(code);
					}
				};
				const onEnter = () => {
					applyStateStyle(path, true, true);
					currentParams.onRegionHover(code);
				};
				const onLeave = () => {
					applyStateStyle(path, true, false);
					currentParams.onRegionHover(null);
				};

				path.addEventListener('click', onClick);
				path.addEventListener('keydown', onKey);
				path.addEventListener('mouseenter', onEnter);
				path.addEventListener('mouseleave', onLeave);
				path.addEventListener('focus', onEnter);
				path.addEventListener('blur', onLeave);

				cleanupFns.push(() => {
					path.removeEventListener('click', onClick);
					path.removeEventListener('keydown', onKey);
					path.removeEventListener('mouseenter', onEnter);
					path.removeEventListener('mouseleave', onLeave);
					path.removeEventListener('focus', onEnter);
					path.removeEventListener('blur', onLeave);
				});
			});
		} catch (err) {
			if ((err as Error).name !== 'AbortError') {
				console.error('[indiaMap] Error loading SVG:', err);
			}
		}
	}

	/**
	 * Apply visual state to a path.
	 * Reads CSS custom properties so it respects the site theme.
	 */
	function applyStateStyle(path: SVGPathElement, isActive: boolean, isHovered: boolean) {
		const styles = getComputedStyle(node);
		const accent = styles.getPropertyValue('--color-accent').trim() || '#3b82f6';
		const accentSoft = styles.getPropertyValue('--color-accent-soft').trim() || 'rgba(59,130,246,0.2)';
		const border = styles.getPropertyValue('--color-border').trim() || '#e5e7eb';
		const stroke = styles.getPropertyValue('--color-text').trim() || '#1f2937';

		if (isActive) {
			path.style.fill = isHovered ? accent : accentSoft;
			path.style.fillOpacity = isHovered ? '0.85' : '0.55';
			path.style.stroke = accent;
			path.style.strokeWidth = isHovered ? '1.2' : '0.6';
		} else {
			path.style.fill = border;
			path.style.fillOpacity = '0.25';
			path.style.stroke = stroke;
			path.style.strokeWidth = '0.4';
			path.style.strokeOpacity = '0.4';
		}
		path.style.transition =
			'fill 0.18s ease, fill-opacity 0.18s ease, stroke 0.18s ease, stroke-width 0.18s ease';
	}

	render();

	return {
		update(newParams: IndiaMapParameters) {
			currentParams = newParams;
			render();
		},
		destroy() {
			abortController?.abort();
			cleanupFns.forEach((fn) => fn());
			cleanupFns = [];
			node.innerHTML = '';
		}
	};
}
