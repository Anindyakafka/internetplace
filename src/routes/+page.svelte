<script lang="ts">
import { featuredProjects } from '$data/projects';
import { reveal } from '$lib/actions/reveal';

let year = new Date().getFullYear();
</script>

<svelte:head>
<title>Anindya Singh — Researcher, Data Scientist, Writer</title>
<meta
name="description"
content="Portfolio of Anindya Singh — researcher, data scientist, and writer. Data projects, research, and essays on caste, labour, names, and political ecology."
/>
<meta name="author" content="Anindya Singh" />
<meta property="og:title" content="Anindya Singh — Researcher, Data Scientist, Writer" />
<meta
property="og:description"
content="Data projects, research, and essays on caste, labour, names, and political ecology."
/>
<meta property="og:type" content="website" />
</svelte:head>

<!-- ═══════════════════════════════════════════════
     HERO
     ═══════════════════════════════════════════════ -->
<section class="hero" use:reveal>
<div class="hero-inner">
<p class="hero-overline">
<span class="status-dot" aria-hidden="true"></span>
Available for research collaborations &middot; {year}
</p>

<h1 class="hero-title">
Anindya Singh is a researcher, data scientist, and writer working at the intersection of
<em>economics</em>, <em>data</em>, and <em>social impact</em>.
</h1>

<p class="hero-tagline">
Building tools and writing about caste, labour, names, and the political ecology of
South Asia. Currently based in India.
</p>
</div>
</section>

<!-- ═══════════════════════════════════════════════
     SELECTED WORK
     ═══════════════════════════════════════════════ -->
<section class="selected" use:reveal={ { delay: 60 } }>
<div class="section-label">
<span>Selected Work</span>
<a href="/work" class="see-all">All projects →</a>
</div>

<ul class="work-rows" role="list">
{#each featuredProjects as project}
<li class="work-row">
<a
class="work-link"
href={project.liveUrl ?? project.repo ?? '#'}
target={project.liveUrl || project.repo ? '_blank' : undefined}
rel={project.liveUrl || project.repo ? 'noopener noreferrer' : undefined}
>
<span class="work-year">{project.year}</span>
<span class="work-title">{project.title}</span>
<span class="work-tags">
{#each project.categories as cat}
<span class="work-tag">{cat}</span>
{/each}
</span>
<span class="work-arrow" aria-hidden="true">↗</span>
</a>
</li>
{/each}
</ul>
</section>

<!-- ═══════════════════════════════════════════════
     WRITING NOTE
     ═══════════════════════════════════════════════ -->
<section class="writing-note" use:reveal={ { delay: 60 } }>
<div class="section-label">
<span>Writing</span>
<a href="/writing" class="see-all">Archive →</a>
</div>
<p>
Essays and manifestos on caste, labour, and the politics of data — published through art
spaces and independent venues.
</p>
</section>

<!-- ═══════════════════════════════════════════════
     FOOTER LINK
     ═══════════════════════════════════════════════ -->
<section class="home-footer" use:reveal>
<p>
Want to work together? <a href="mailto:hello@anindyasingh.dev">hello@anindyasingh.dev</a>
</p>
</section>

<style>
/* ═══ HERO ═══ */
.hero {
padding: var(--space-4xl) 0 var(--space-3xl);
min-height: 55vh;
display: flex;
align-items: center;
}

.hero-inner {
max-width: var(--measure-wide);
}

.hero-overline {
display: inline-flex;
align-items: center;
gap: var(--space-2xs);
font-size: var(--step--1);
color: var(--color-text-muted);
font-family: var(--font-mono);
margin-bottom: var(--space-xl);
letter-spacing: 0.01em;
}

.status-dot {
width: 7px;
height: 7px;
border-radius: 50%;
background: #22c55e;
animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}

.hero-title {
font-family: var(--font-serif);
font-size: clamp(1.75rem, 4.5vw, 3rem);
line-height: 1.2;
letter-spacing: -0.02em;
font-weight: 400;
margin-bottom: var(--space-lg);
color: var(--color-text);
}

.hero-title em {
font-style: italic;
color: var(--color-accent);
}

.hero-tagline {
font-size: var(--step-1);
line-height: 1.6;
color: var(--color-text-muted);
max-width: 34rem;
}

/* ═══ SECTION LABELS ═══ */
.section-label {
display: flex;
justify-content: space-between;
align-items: baseline;
margin-bottom: var(--space-lg);
font-family: var(--font-mono);
font-size: var(--step--1);
color: var(--color-text-muted);
letter-spacing: 0.04em;
text-transform: uppercase;
}

.see-all {
color: var(--color-text-muted);
text-decoration: none;
transition: color var(--transition);
}

.see-all:hover {
color: var(--color-accent);
}

/* ═══ SELECTED WORK ROWS ═══ */
.selected {
padding: var(--space-2xl) 0;
border-top: 1px solid var(--color-border);
}

.work-rows {
list-style: none;
padding: 0;
margin: 0;
}

.work-row {
border-bottom: 1px solid var(--color-border);
}

.work-link {
display: grid;
grid-template-columns: 3.5rem 1fr auto auto;
align-items: baseline;
gap: var(--space-md);
padding: var(--space-md) 0;
text-decoration: none;
color: inherit;
transition: padding-left var(--transition);
}

.work-link:hover {
padding-left: var(--space-sm);
}

.work-link:hover .work-title {
color: var(--color-accent);
}

.work-link:hover .work-arrow {
opacity: 1;
transform: translate(2px, -2px);
}

.work-year {
font-family: var(--font-mono);
font-size: var(--step--1);
color: var(--color-text-muted);
white-space: nowrap;
}

.work-title {
font-family: var(--font-serif);
font-size: var(--step-1);
font-weight: 400;
color: var(--color-text);
transition: color var(--transition);
}

.work-tags {
display: flex;
gap: var(--space-2xs);
flex-wrap: wrap;
}

.work-tag {
font-family: var(--font-mono);
font-size: 0.625rem;
text-transform: uppercase;
letter-spacing: 0.04em;
color: var(--color-text-muted);
opacity: 0.7;
}

.work-arrow {
font-size: var(--step-0);
color: var(--color-accent);
opacity: 0;
transition: opacity var(--transition), transform var(--transition);
}

/* ═══ WRITING NOTE ═══ */
.writing-note {
padding: var(--space-2xl) 0;
border-top: 1px solid var(--color-border);
}

.writing-note p {
font-family: var(--font-serif);
font-size: var(--step-1);
line-height: 1.6;
color: var(--color-text-muted);
max-width: var(--measure);
}

/* ═══ HOME FOOTER ═══ */
.home-footer {
padding: var(--space-2xl) 0 var(--space-3xl);
border-top: 1px solid var(--color-border);
}

.home-footer p {
font-size: var(--step-0);
color: var(--color-text-muted);
}

.home-footer a {
color: var(--color-accent);
text-decoration: none;
border-bottom: 1px solid var(--color-accent-soft);
transition: color var(--transition);
}

.home-footer a:hover {
color: var(--color-accent-hover);
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 640px) {
.hero {
min-height: 45vh;
padding: var(--space-3xl) 0 var(--space-2xl);
}

.work-link {
grid-template-columns: 3rem 1fr auto;
gap: var(--space-sm);
}

.work-tags {
display: none;
}

.section-label {
flex-direction: column;
gap: var(--space-2xs);
}
}

/* ═══ REDUCED MOTION ═══ */
@media (prefers-reduced-motion: reduce) {
.status-dot {
animation: none;
}
}
</style>
