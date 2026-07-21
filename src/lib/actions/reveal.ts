/**
 * use:reveal — IntersectionObserver-based fade/slide-up transition.
 *
 * Usage:
 *   <section use:reveal>...</section>
 *   <section use:reveal={{ delay: 100 }}>...</section>
 *
 * The element starts with opacity:0 and a slight translateY. When it
 * enters the viewport the `.is-visible` class is added, triggering the
 * CSS transition defined in global.css.
 */

interface RevealOptions {
	delay?: number;
	threshold?: number;
	once?: boolean;
}

export function reveal(
	node: HTMLElement,
	options: RevealOptions = {}
): { destroy: () => void } {
	const { delay = 0, threshold = 0.12, once = true } = options;

	// Respect reduced-motion: skip entirely
	if (
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		node.classList.add('is-visible');
		return { destroy: () => {} };
	}

	node.classList.add('reveal');
	if (delay) {
		node.style.transitionDelay = `${delay}ms`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('is-visible');
				}
			});
		},
		{ threshold, rootMargin: '0px 0px -40px 0px' }
	);

	// Defer to next tick so initial state paints first
	requestAnimationFrame(() => observer.observe(node));

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
