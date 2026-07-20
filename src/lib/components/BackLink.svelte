<script lang="ts">
	interface Props {
		href: string;
		children: import('svelte').Snippet;
	}

	let { href, children }: Props = $props();
</script>

<a class="back-link" {href}>
	{@render children()}
</a>

<style>
	.back-link {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--text-muted);
		text-decoration: none;
		padding: var(--space-3xs) 0;
		margin-bottom: var(--space-m);
		border-bottom: 1px solid transparent;
		transition: all var(--transition);
	}

	.back-link:hover {
		color: var(--text);
		border-bottom-color: var(--accent);
	}
</style>
