import { bn, bnFragments } from './bn';

export type SiteLanguage = 'en' | 'bn';
const textState = new WeakMap<Text, { source: string; rendered: string }>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ['aria-label', 'placeholder', 'title', 'alt'];

function translated(source: string): string {
	const direct = bn[source];
	if (direct) return direct;
	let value = source;
	for (const [pattern, replacement] of bnFragments) value = value.replace(pattern, replacement);
	return value;
}

function replaceText(node: Text, language: SiteLanguage) {
	const parent = node.parentElement;
	if (!parent || ['SCRIPT', 'STYLE', 'CODE'].includes(parent.tagName)) return;
	let state = textState.get(node);
	if (!state) {
		state = { source: node.data, rendered: node.data };
		textState.set(node, state);
	} else if (node.data !== state.rendered) {
		// Svelte reused this node for new live content; treat that as the new source.
		state.source = node.data;
	}
	const source = state.source;
	if (language === 'en') {
		state.rendered = source;
		if (node.data !== source) node.data = source;
		return;
	}
	const start = source.match(/^\s*/)?.[0] ?? '';
	const end = source.match(/\s*$/)?.[0] ?? '';
	const core = source.slice(start.length, source.length - end.length).replace(/\s+/g, ' ').trim();
	const result = `${start}${translated(core)}${end}`;
	state.rendered = result;
	if (node.data !== result) node.data = result;
}

function replaceAttributes(element: Element, language: SiteLanguage) {
	let originals = originalAttributes.get(element);
	if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
	for (const name of attributes) {
		const current = element.getAttribute(name);
		if (current === null) continue;
		if (!originals.has(name)) originals.set(name, current);
		const source = originals.get(name) ?? current;
		element.setAttribute(name, language === 'bn' ? translated(source) : source);
	}
}

export function translateTree(root: Node, language: SiteLanguage) {
	if (root instanceof Element) replaceAttributes(root, language);
	if (root instanceof Text) replaceText(root, language);
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
	let node: Node | null;
	while ((node = walker.nextNode())) {
		if (node instanceof Text) replaceText(node, language);
		else if (node instanceof Element) replaceAttributes(node, language);
	}
}

export function startTranslation(language: () => SiteLanguage) {
	let applying = false;
	const apply = (root: Node = document.documentElement) => {
		if (applying) return;
		applying = true;
		translateTree(root, language());
		applying = false;
	};
	apply();
	const observer = new MutationObserver((records) => {
		if (applying) return;
		for (const record of records) {
			if (record.type === 'characterData') apply(record.target);
			for (const node of record.addedNodes) apply(node);
		}
	});
	observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
	return { apply, stop: () => observer.disconnect() };
}
