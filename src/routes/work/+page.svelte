<script lang="ts">
	import { projects, type ProjectCategory } from "$data/projects";

	type Filter = "all" | ProjectCategory;

	const categories: { key: Filter; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "data", label: "Data" },
		{ key: "research", label: "Research" },
		{ key: "tooling", label: "Tooling" },
		{ key: "writing", label: "Writing" },
		{ key: "art", label: "Art" },
	];

	let activeFilter = $state<Filter>("all");

	let filtered = $derived(
		activeFilter === "all"
			? projects
			: projects.filter((p) => p.categories.includes(activeFilter))
	);

	const statusLabel = (status: string) => {
		switch (status) {
			case "live": return "Live";
			case "external": return "Repo";
			case "planned": return "Planned";
			default: return "";
		}
	};

	let year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Work — Anindya Singh</title>
	<meta name="description" content="Data projects, research, and professional work by Anindya Singh — CBFC Watch, MGNREGA pipelines, name classifiers, and more." />
	<meta property="og:title" content="Work — Anindya Singh" />
	<meta property="og:description" content="Data projects, research, and professional work by Anindya Singh." />
	<meta property="og:type" content="website" />
</svelte:head>

<section class="page-content">
	<header class="work-header">
		<div class="work-header-inner">
			<span class="section-index">◇ Index</span>
			<h1 class="work-title">Work</h1>
			<p class="work-intro">
				A selection of data projects, research pipelines, and tools. Most are open-source —
				follow the links to explore the code, read the research, or try things out.
			</p>
			<div class="work-stats">
				<span class="stat">{projects.length} projects</span>
				<span class="stat-sep">·</span>
				<span class="stat">{new Set(projects.flatMap(p => p.categories)).size} categories</span>
				<span class="stat-sep">·</span>
				<span class="stat">2023—{year}</span>
			</div>
		</div>
	</header>

	<nav class="filter-bar" aria-label="Filter projects by category">
		{#each categories as cat (cat.key)}
			<button
				class="filter-btn"
				class:filter-btn--active={activeFilter === cat.key}
				onclick={() => (activeFilter = cat.key)}
			>
				{cat.label}
			</button>
		{/each}
	</nav>

	<div class="project-grid">
		{#each filtered as project, i (project.slug)}
			<article
				class="project-card"
				style="--delay: {i * 70}ms"
			>
				<a
					class="project-card-link"
					href={project.liveUrl ?? project.repo ?? "#"}
					target={project.liveUrl ?? project.repo ? "_blank" : undefined}
					rel={project.liveUrl ?? project.repo ? "noopener noreferrer" : undefined}
				>
					<div class="project-card-head">
						<span class="project-num">{String(i + 1).padStart(2, "0")}</span>
						<span
							class="project-status project-status--{project.status}"
							title={statusLabel(project.status)}
						></span>
					</div>

					<div class="project-card-body">
						<h3 class="project-title">{project.title}</h3>
						<p class="project-blurb">{project.blurb}</p>
						<div class="project-tags">
							{#each project.categories as cat (cat)}
								<span class="tag">{cat}</span>
							{/each}
						</div>
					</div>

					<div class="project-card-foot">
						<span class="project-year">{project.year}</span>
						<span class="project-links">
							{#if project.liveUrl}
								<span class="link-badge">Live ↗</span>
							{/if}
							{#if project.repo}
								<span class="link-badge">Code ↗</span>
							{/if}
							{#if !project.liveUrl && !project.repo}
								<span class="link-badge link-badge--muted">Coming soon</span>
							{/if}
						</span>
					</div>
				</a>
			</article>
		{:else}
			<p class="empty-state">No projects in this category yet.</p>
		{/each}
	</div>

	<section class="work-collab">
		<h2 class="collab-title">Open to collaboration</h2>
		<p class="collab-text">
			Working on something at the intersection of data, research, and civic tech?
			<a href="mailto:hello@anindyasingh.dev" class="text-link">Get in touch.</a>
		</p>
	</section>
</section>

<style>
	.page-content {
		max-width: var(--max-width);
		margin: 0 auto;
		padding-inline: var(--space-l);
	}

	/* ---- Header ---- */

	.work-header {
		padding-top: var(--space-3xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid var(--color-border);
	}

	.work-header-inner {
		max-width: var(--measure);
	}

	.section-index {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-accent);
		letter-spacing: 0.05em;
	}

	.work-title {
		font-family: var(--font-serif);
		font-size: var(--step-5);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-top: var(--space-s);
	}

	.work-intro {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--color-text-muted);
		line-height: 1.55;
		max-width: 34rem;
		margin-top: var(--space-m);
	}

	.work-stats {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		margin-top: var(--space-l);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.stat-sep {
		color: var(--color-border);
	}

	/* ---- Filter bar ---- */

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
		padding-block: var(--space-l);
	}

	.filter-btn {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: 0.4rem 0.9rem;
		cursor: pointer;
		transition: border-color var(--transition), color var(--transition),
			background var(--transition);
	}

	.filter-btn:hover {
		color: var(--color-text);
		border-color: var(--color-accent);
	}

	.filter-btn--active {
		color: var(--color-accent);
		border-color: var(--color-accent);
		background: var(--color-accent-soft);
	}

	/* ---- Project grid ---- */

	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: var(--space-l);
		padding-bottom: var(--space-2xl);
	}

	.project-card {
		opacity: 0;
		transform: translateY(12px);
		animation: cardIn 0.5s ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes cardIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.project-card-link {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--space-l);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		transition: border-color var(--transition), transform var(--transition),
			box-shadow var(--transition);
	}

	.project-card-link:hover {
		border-color: var(--color-accent);
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
	}

	.project-card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-s);
	}

	.project-num {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.project-status {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.project-status--live {
		background: #22c55e;
	}

	.project-status--external {
		background: var(--color-accent);
	}

	.project-status--planned {
		background: var(--color-text-muted);
	}

	.project-card-body {
		flex: 1;
	}

	.project-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	.project-blurb {
		font-size: var(--step-0);
		color: var(--color-text-muted);
		line-height: 1.5;
		margin-top: var(--space-xs);
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs);
		margin-top: var(--space-s);
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		background: var(--color-accent-soft);
		color: var(--color-accent);
		border-radius: 3px;
		padding: 0.2rem 0.5rem;
		text-transform: capitalize;
	}

	.project-card-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-l);
		padding-top: var(--space-s);
		border-top: 1px solid var(--color-border);
	}

	.project-year {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.project-links {
		display: flex;
		gap: var(--space-xs);
	}

	.link-badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-accent);
	}

	.link-badge--muted {
		color: var(--color-text-muted);
	}

	/* ---- Empty state ---- */

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--color-text-muted);
		padding-block: var(--space-2xl);
	}

	/* ---- Collab section ---- */

	.work-collab {
		padding-block: var(--space-3xl);
		border-top: 1px solid var(--color-border);
	}

	.collab-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		font-weight: 500;
	}

	.collab-text {
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--color-text-muted);
		margin-top: var(--space-s);
		max-width: var(--measure);
	}

	.text-link {
		color: var(--color-accent);
		text-decoration: none;
	}

	.text-link:hover {
		color: var(--color-accent-hover);
	}

	/* ---- Responsive ---- */

	@media (max-width: 768px) {
		.work-header {
			padding-top: var(--space-2xl);
		}

		.project-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.project-card {
			opacity: 1;
			transform: none;
			animation: none;
		}

		.project-card-link {
			transition: none;
		}
	}
</style>
