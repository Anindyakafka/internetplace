/**
 * India Map Action
 * 
 * Loads and enhances an India SVG with interactive functionality:
 * - Clickable state/region paths
 * - Hover states and tooltips
 * - Visual distinction between active and inactive regions
 * - Smooth transitions and accessibility support
 * 
 * @param node - The HTMLImageElement containing the India SVG
 * @param params - Configuration parameters
 */
export function indiaMap(
	node: HTMLImageElement,
	params: {
		regions: Array<{ id: string; name: string; projects: any[] }>;
		onRegionClick: (regionId: string) => void;
		onRegionHover: (regionId: string) => void;
		onRegionLeave: () => void;
	}
) {
	const { regions, onRegionClick, onRegionHover, onRegionLeave } = params;
	let svgDocument: Document | null = null;
	let regionElements: Map<string, SVGPathElement> = new Map();

	// Extract state IDs from SVG paths
	const STATE_IDS = [
		'JK', 'JH', 'KA', 'MH', 'MP', 'UP', 'WB', 'BH', 'OR', 'GJ', 'RJ', 'DL', 'HR', 'PB', 
		'UK', 'HP', 'AS', 'AR', 'NL', 'MN', 'MZ', 'TR', 'ML', 'SK', 'TG', 'AP', 'KA', 'KL',
		'TN', 'GA', 'CH', 'PY', 'AN', 'DN', 'DD', 'LD'
	];

	// Get active region IDs
	const activeRegionIds = new Set(regions.map(r => r.id));

	/**
	 * Initialize the map after SVG loads
	 */
	async function initializeMap() {
		try {
			// Fetch SVG as text
			const response = await fetch(node.src);
			if (!response.ok) {
				console.error('Failed to load India SVG:', response.statusText);
				return;
			}

			const svgText = await response.text();
			const parser = new DOMParser();
			svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
			const svgElement = svgDocument.querySelector('svg');

			if (!svgElement) {
				console.error('No SVG element found in document');
				return;
			}

			// Process all path elements
			const paths = svgElement.querySelectorAll('path');
			paths.forEach(path => {
				const pathId = path.id || path.getAttribute('data-id');
				if (!pathId) return;

				// Try to match with known state IDs
				const stateId = STATE_IDS.find(id => 
					pathId.toUpperCase().includes(id) || 
					pathId.toLowerCase().includes(id.toLowerCase())
				);

				if (stateId) {
					enhancePath(path, stateId);
				}
			});

			// Create a blob URL for the modified SVG
			const svgString = new XMLSerializer().serializeToString(svgElement);
			const blob = new Blob([svgString], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);
			
			// Update the image source
			node.src = url;

			// Clean up when image is done loading
			node.onload = () => {
				URL.revokeObjectURL(url);
			};
		} catch (error) {
			console.error('Error initializing India map:', error);
		}
	}

	/**
	 * Enhance a path element with interactivity
	 */
	function enhancePath(path: SVGPathElement, stateId: string) {
		const isActive = activeRegionIds.has(stateId);

		// Set initial fill based on activity
		if (isActive) {
			path.style.fill = 'var(--color-accent, #3b82f6)';
			path.style.fillOpacity = '0.3';
		} else {
			path.style.fill = 'var(--color-border, #e5e7eb)';
			path.style.fillOpacity = '0.1';
		}

		path.style.stroke = 'var(--color-text, #1f2937)';
		path.style.strokeWidth = '0.5';
		path.style.transition = 'fill 0.2s ease, fill-opacity 0.2s ease, stroke-width 0.2s ease';

		// Add click handler
		path.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isActive) {
				onRegionClick(stateId);
			}
		});

		// Add hover handlers
		path.addEventListener('mouseenter', () => {
			if (isActive) {
				path.style.fillOpacity = '0.6';
				path.style.strokeWidth = '1';
			}
			onRegionHover(stateId);
		});

		path.addEventListener('mouseleave', () => {
			if (isActive) {
				path.style.fillOpacity = '0.3';
				path.style.strokeWidth = '0.5';
			}
			onRegionLeave();
		});

		// Store reference
		regionElements.set(stateId, path);
	}

	/**
	 * Update map when regions change
	 */
	function updateMap() {
		regionElements.forEach((path, stateId) => {
			const isActive = activeRegionIds.has(stateId);
			
			if (isActive) {
				path.style.fill = 'var(--color-accent, #3b82f6)';
				path.style.fillOpacity = '0.3';
			} else {
				path.style.fill = 'var(--color-border, #e5e7eb)';
				path.style.fillOpacity = '0.1';
			}
		});
	}

	// Initialize on load
	if (node.complete) {
		initializeMap();
	} else {
		node.addEventListener('load', initializeMap);
	}

	// Cleanup
	return {
		destroy() {
			regionElements.forEach((path, stateId) => {
				path.removeEventListener('click', () => {});
				path.removeEventListener('mouseenter', () => {});
				path.removeEventListener('mouseleave', () => {});
			});
			regionElements.clear();
		},
		update(newParams: typeof params) {
			// Update regions if they change
			if (newParams.regions !== params.regions) {
				params.regions = newParams.regions;
				updateMap();
			}
		}
	};
}

export type IndiaMapParameters = Parameters<typeof indiaMap>[1];