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
	getRegionElevation?: (regionId: string) => number;
	interactiveAll?: boolean;
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
			const interactiveAll = currentParams.interactiveAll === true;
			const interactiveEntries: Array<{ path: SVGPathElement; code: string; isKnown: boolean; elevation: number }> = [];

			const applyFocusState = (focusCode: string | null) => {
				const hasFocus = Boolean(focusCode);
				for (const entry of interactiveEntries) {
					applyStateStyle(entry.path, true, focusCode === entry.code, entry.elevation, {
						dimmed: hasFocus && focusCode !== entry.code,
						neutral: interactiveAll && !entry.isKnown
					});
				}
			};

			// Style + wire every state path.
			const paths = svgEl.querySelectorAll<SVGPathElement>('path[id]');
			paths.forEach((path) => {
				const code = stateCodeFromId(path.getAttribute('id'));
				if (!code) return;

				const isActive = activeIds.has(code);
				const isInteractive = interactiveAll || isActive;
				const elevation = currentParams.getRegionElevation?.(code) ?? 0;
				applyStateStyle(path, isInteractive, false, elevation, {
					neutral: interactiveAll && !isActive
				});

				if (!isInteractive) {
					path.style.pointerEvents = 'none';
					return;
				}

				interactiveEntries.push({ path, code, isKnown: isActive, elevation });

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
					applyFocusState(code);
					currentParams.onRegionHover(code);
				};
				const onLeave = () => {
					applyFocusState(null);
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

			applyFocusState(null);
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
	function applyStateStyle(
		path: SVGPathElement,
		isActive: boolean,
		isHovered: boolean,
		elevation: number,
		options?: { dimmed?: boolean; neutral?: boolean }
	) {
		const styles = getComputedStyle(node);
		const accent = styles.getPropertyValue('--color-accent').trim() || '#3b82f6';
		const accentSoft = styles.getPropertyValue('--color-accent-soft').trim() || 'rgba(59,130,246,0.2)';
		const border = styles.getPropertyValue('--color-border').trim() || '#e5e7eb';
		const stroke = styles.getPropertyValue('--color-text').trim() || '#1f2937';
		const weight = Math.max(0, Math.min(1, elevation));
		const dimmed = options?.dimmed === true;
		const neutral = options?.neutral === true;

		if (isActive) {
			path.style.fill = isHovered ? accent : neutral ? colorMix(accentSoft, border, 0.52) : accentSoft;
			path.style.fillOpacity = dimmed
				? '0.2'
				: (0.45 + weight * 0.35 + (isHovered ? 0.15 : 0)).toFixed(2);
			path.style.stroke = neutral ? colorMix(accent, stroke, 0.65) : accent;
			path.style.strokeWidth = (0.6 + weight * 0.6 + (isHovered ? 0.3 : 0)).toFixed(2);
			path.style.transformBox = 'fill-box';
			path.style.transformOrigin = 'center';
			path.style.transform = dimmed
				? 'translateY(0px) scale(0.986)'
				: `translateY(${-1 * (weight * 7 + (isHovered ? 3 : 0))}px) scale(${1 + weight * 0.04 + (isHovered ? 0.02 : 0)})`;
			path.style.filter = dimmed
				? 'blur(1.6px) saturate(0.72)'
				: `drop-shadow(0 ${2 + weight * 6}px ${4 + weight * 8}px rgba(0, 0, 0, ${0.08 + weight * 0.18}))`;
		} else {
			path.style.fill = border;
			path.style.fillOpacity = '0.25';
			path.style.stroke = stroke;
			path.style.strokeWidth = '0.4';
			path.style.strokeOpacity = '0.4';
			path.style.transform = 'none';
			path.style.filter = 'none';
		}
		path.style.willChange = 'transform, filter, fill-opacity';
		path.style.transition =
			'fill 0.18s ease, fill-opacity 0.18s ease, stroke 0.18s ease, stroke-width 0.18s ease, transform 0.22s ease, filter 0.22s ease';
	}

	function colorMix(colorA: string, colorB: string, weightA: number) {
		const a = Math.max(0, Math.min(1, weightA));
		const b = 1 - a;
		// Fallback-safe lightweight blend for hex/rgb-like strings by returning colorA when parsing is uncertain.
		if (!colorA.startsWith('#') || !colorB.startsWith('#')) return colorA;

		const parseHex = (hex: string) => {
			const clean = hex.replace('#', '').trim();
			if (clean.length !== 6) return null;
			const num = Number.parseInt(clean, 16);
			if (Number.isNaN(num)) return null;
			return {
				r: (num >> 16) & 255,
				g: (num >> 8) & 255,
				b: num & 255
			};
		};

		const va = parseHex(colorA);
		const vb = parseHex(colorB);
		if (!va || !vb) return colorA;

		const r = Math.round(va.r * a + vb.r * b);
		const g = Math.round(va.g * a + vb.g * b);
		const bl = Math.round(va.b * a + vb.b * b);
		return `rgb(${r}, ${g}, ${bl})`;
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
