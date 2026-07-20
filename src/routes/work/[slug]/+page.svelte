<script lang="ts">
	import { page } from '$app/stores';
	import { projects } from '$data/projects';

	let { data } = $props();

	const project = $derived(data.project);

	const currentIndex = $derived(projects.findIndex((p) => p.slug === project.slug));
	const prevProject = $derived.by(() => (currentIndex > 0 ? projects[currentIndex - 1] : null));
	const nextProject = $derived.by(
		() => (currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null)
	);

	const statusLabels: Record<string, string> = {
		live: 'Live',
		external: 'External',
		planned: 'Planned'
	};
</script>

<svelte:head>
	<title>{project.title} — Anindya Singh</title>
	<meta name="description" content={project.blurb} />
</svelte:head>

<section class="page-content">
	<a href="/work" class="back-link">← Back to Work</a>

	<article class="project-detail">
		<header class="project-header">
			<div class="project-meta">
				<span class="meta-label">Project</span>
				<span class="meta-value">{project.title}</span>
			</div>
			<div class="project-meta">
				<span class="meta-label">Year</span>
				<span class="meta-value">{project.year}</span>
			</div>
			<div class="project-meta">
				<span class="meta-label">Status</span>
				<span class="meta-value status-{project.status}">{statusLabels[project.status]}</span>
			</div>
		</header>

		<h1 class="project-title">{project.title}</h1>

		<p class="project-lede">{project.blurb}</p>

		{#if project.categories.length > 0}
			<div class="project-tags">
				{#each project.categories as category}
					<span class="tag">{category}</span>
				{/each}
			</div>
		{/if}

		<div class="project-links">
			{#if project.liveUrl}
				<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="project-link">
					<span>Visit Project</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</a>
			{/if}
			{#if project.repo}
				<a href={project.repo} target="_blank" rel="noopener noreferrer" class="project-link">
					<span>View Source</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</a>
			{/if}
		</div>

		{#if project.collaborators && project.collaborators.length > 0}
			<div class="project-collab">
				<span class="meta-label">Collaborators</span>
				<span>{project.collaborators.join(', ')}</span>
			</div>
		{/if}

		<div class="project-body">
			<h2>Overview</h2>
			<p>
				{project.title} is a project that began in {project.year}. It operates at the intersection
				of {project.categories.join(', ')}.
			</p>
			<p>
				More detailed documentation for this project will be available here as it develops. For now,
				you can explore the live project or the source code via the links above.
			</p>
		</div>
	</article>

	{#if prevProject || nextProject}
		<nav class="project-nav">
			{#if prevProject}
				<a href="/work/{prevProject.slug}" class="nav-link nav-prev">
					<span class="nav-direction">← Previous</span>
					<span class="nav-title">{prevProject.title}</span>
				</a>
			{:else}
				<span class="nav-spacer"></span>
			{/if}
			{#if nextProject}
				<a href="/work/{nextProject.slug}" class="nav-link nav-next">
					<span class="nav-direction">Next →</span>
					<span class="nav-title">{nextProject.title}</span>
				</a>
			{:else}
				<span class="nav-spacer"></span>
			{/if}
		</nav>
	{/if}
</section>

<style>
	.page-content {
		max-width: var(--max-width);
		margin-inline: auto;
		padding-block: var(--space-2xl) var(--space-3xl);
		padding-inline: var(--space-l);
		animation: fadeIn 0.6s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.back-link {
		display: inline-flex;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		text-decoration: none;
		margin-bottom: var(--space-2xl);
		transition: color var(--transition);
	}

	.back-link:hover {
		color: var(--color-accent);
	}

	.project-detail {
		max-width: var(--measure);
	}

	.project-header {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
		padding-bottom: var(--space-l);
		border-bottom: 1px solid var(--color-border);
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.meta-value {
		font-family: var(--font-mono);
		font-size: var(--step-0);
		color: var(--color-text);
	}

	.status-live { color: #22c55e; }
	.status-external { color: var(--color-accent); }
	.status-planned { color: var(--color-text-muted); }

	.project-title {
		font-family: var(--font-serif);
		font-size: var(--step-4);
		font-weight: 500;
		line-height: 1.1;
		margin-bottom: var(--space-m);
		letter-spacing: -0.02em;
	}

	.project-lede {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--color-text-muted);
		margin-bottom: var(--space-l);
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs);
		margin-bottom: var(--space-xl);
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: var(--space-3xs) var(--space-2xs);
		background: var(--color-accent-soft);
		color: var(--color-accent);
		border-radius: 3px;
		text-transform: capitalize;
	}

	.project-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-m);
		margin-bottom: var(--space-xl);
	}

	.project-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-xs) var(--space-m);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		color: var(--color-text);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		transition: all var(--transition);
	}

	.project-link:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	}

	.project-collab {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		margin-bottom: var(--space-2xl);
	}

	.project-body {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-xl);
	}

	.project-body h2 {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 500;
		margin-bottom: var(--space-m);
	}

	.project-body p {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		line-height: 1.6;
		margin-bottom: var(--space-m);
	}

	.project-nav {
		display: flex;
		justify-content: space-between;
		gap: var(--space-l);
		margin-top: var(--space-3xl);
		padding-top: var(--space-xl);
		border-top: 1px solid var(--color-border);
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		text-decoration: none;
		max-width: 45%;
		transition: transform var(--transition);
	}

	.nav-link:hover {
		transform: translateY(-2px);
	}

	.nav-prev:hover { transform: translateX(-3px); }
	.nav-next:hover { transform: translateX(3px); }

	.nav-next {
		text-align: right;
		margin-left: auto;
	}

	.nav-direction {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.nav-title {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--color-text);
	}

	.nav-link:hover .nav-title {
		color: var(--color-accent);
	}

	.nav-spacer {
		flex: 1;
	}

	@media (max-width: 768px) {
		.project-header {
			gap: var(--space-l);
		}

		.project-title {
			font-size: var(--step-3);
		}

		.project-nav {
			flex-direction: column;
			gap: var(--space-m);
		}

		.nav-link {
			max-width: 100%;
		}

		.nav-next {
			text-align: left;
			margin-left: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.page-content,
		.back-link,
		.project-link,
		.nav-link,
		.nav-prev,
		.nav-next {
			animation: none;
			transition: none;
			transform: none;
		}
	}
</style>
