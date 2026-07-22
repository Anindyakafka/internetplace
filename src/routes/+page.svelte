<script lang="ts">
     import { projects, featuredProjects } from '$data/projects';
     import { reveal } from '$lib/actions/reveal';
     import { indiaMap } from '$lib/actions/india-map';

     type RegionProject = {
          title: string;
          slug: string;
          year: number | string;
     };

     type Region = {
          id: string;
          name: string;
          projects: RegionProject[];
     };

     const regionNames: Record<string, string> = {
          UP: 'Uttar Pradesh',
          WB: 'West Bengal',
          BR: 'Bihar',
          DL: 'Delhi',
          MH: 'Maharashtra',
          KA: 'Karnataka',
          RJ: 'Rajasthan',
          HR: 'Haryana'
     };

     let hoveredRegionId = $state<string | null>(null);
     let selectedRegionId = $state<string | null>(null);

     let regions = $derived.by<Region[]>(() => {
          const ids = new Set<string>();
          projects.forEach((project) => project.regions?.forEach((id) => ids.add(id)));

          return Array.from(ids)
               .map((id) => ({
                    id,
                    name: regionNames[id] ?? id,
                    projects: projects
                         .filter((project) => project.regions?.includes(id))
                         .map((project) => ({ title: project.title, slug: project.slug, year: project.year }))
               }))
               .sort((a, b) => b.projects.length - a.projects.length);
     });

     let activeRegion = $derived.by<Region | null>(() => {
          if (selectedRegionId) return regions.find((region) => region.id === selectedRegionId) ?? null;
          if (hoveredRegionId) return regions.find((region) => region.id === hoveredRegionId) ?? null;
          return null;
     });

     function handleRegionClick(regionId: string) {
          selectedRegionId = selectedRegionId === regionId ? null : regionId;
     }

     function handleRegionHover(regionId: string | null) {
          hoveredRegionId = regionId;
     }
</script>

<svelte:head>
     <title>Anindya Singh — Researcher, Data Scientist, Writer</title>
     <meta
          name="description"
          content="Map-based landing for Anindya Singh's work, writing, and research across India."
     />
     <meta name="author" content="Anindya Singh" />
     <meta property="og:title" content="Anindya Singh — Researcher, Data Scientist, Writer" />
     <meta
          property="og:description"
          content="Explore projects, writing, and background through a map-centered landing page."
     />
     <meta property="og:type" content="website" />
</svelte:head>

<section class="landing" use:reveal>
     <header class="landing-header">
          <p class="kicker">Field Notes and Coordinates</p>
          <h1>
               A map-led index into research, writing, and tools.
          </h1>
          <p class="intro">
               This is not a dashboard. It is a terrain to wander: enter through regions, then drift into
               projects, essays, and background.
          </p>
     </header>

     <div class="exploration-canvas" use:reveal={{ delay: 70 }}>
          <a class="orbit-link orbit-link--about" href="/about">
               <span class="orbit-label">About</span>
               <span class="orbit-copy">who I am and where the work comes from</span>
          </a>

          <a class="orbit-link orbit-link--work" href="/work">
               <span class="orbit-label">Work</span>
               <span class="orbit-copy">all projects, pipelines, and case studies</span>
          </a>

          <a class="orbit-link orbit-link--writing" href="/writing">
               <span class="orbit-label">Writing</span>
               <span class="orbit-copy">essays, methods, and long-form notes</span>
          </a>

          <a class="orbit-link orbit-link--colophon" href="/colophon">
               <span class="orbit-label">Colophon</span>
               <span class="orbit-copy">stack, type, and design references</span>
          </a>

          <div class="map-center">
               <div class="map-shell">
                    <div
                         class="india-map"
                         role="img"
                         aria-label="India map with active regions"
                         use:indiaMap={{
                              regions,
                              svgUrl: '/assets/india.svg',
                              onRegionClick: handleRegionClick,
                              onRegionHover: handleRegionHover
                         }}
                    ></div>
               </div>
          </div>
     </div>

     <section class="region-panel" use:reveal={{ delay: 110 }}>
          {#if activeRegion}
               <p class="region-meta">{activeRegion.name} · {activeRegion.projects.length} project{activeRegion.projects.length > 1 ? 's' : ''}</p>
               <ul class="region-links" role="list">
                    {#each activeRegion.projects as project}
                         <li>
                              <a href={`/work/${project.slug}`}>{project.title} <span>{project.year}</span></a>
                         </li>
                    {/each}
               </ul>
          {:else}
               <p class="region-meta">Choose or hover a region on the map to reveal the trail.</p>
          {/if}
     </section>

     <section class="featured-strip" use:reveal={{ delay: 140 }}>
          <p class="strip-label">Featured Coordinates</p>
          <div class="strip-items">
               {#each featuredProjects.slice(0, 3) as project}
                    <a class="strip-item" href={`/work/${project.slug}`}>
                         <span class="strip-year">{project.year}</span>
                         <span class="strip-title">{project.title}</span>
                    </a>
               {/each}
          </div>
     </section>

     <p class="contact-note">
          Open to collaborations and commissions: <a href="mailto:hello@anindyasingh.dev">hello@anindyasingh.dev</a>
     </p>
</section>

<style>
     .landing {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: var(--space-3xl) var(--space-l);
     }

     .landing-header {
          max-width: 50rem;
          margin-bottom: var(--space-xl);
     }

     .kicker {
          font-family: var(--font-mono);
          font-size: var(--step--1);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: var(--space-s);
     }

     .landing-header h1 {
          font-size: clamp(2rem, 4.8vw, 3.6rem);
          line-height: 1.08;
          font-weight: 500;
          margin-bottom: var(--space-m);
     }

     .intro {
          font-family: var(--font-serif);
          font-size: var(--step-1);
          line-height: 1.55;
          color: var(--color-text-secondary);
     }

     .exploration-canvas {
          position: relative;
          min-height: 38rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background:
               radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent-soft) 36%, transparent), transparent 35%),
               radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--color-accent-soft) 28%, transparent), transparent 32%),
               var(--color-surface);
          overflow: hidden;
     }

     .map-center {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: var(--space-l);
     }

     .map-shell {
          width: min(28rem, 85vw);
          aspect-ratio: 1 / 1;
          border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
          border-radius: 50%;
          background: color-mix(in srgb, var(--color-bg) 70%, var(--color-surface));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-border) 50%, transparent);
          display: grid;
          place-items: center;
          padding: var(--space-l);
     }

     .india-map {
          width: 100%;
          max-width: 20rem;
     }

     .orbit-link {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: var(--space-s) var(--space-m);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--color-surface) 84%, transparent);
          backdrop-filter: blur(3px);
          text-decoration: none;
          max-width: 16rem;
          transition: transform var(--transition), border-color var(--transition), background var(--transition);
     }

     .orbit-link:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-strong);
          background: var(--color-surface-raised);
     }

     .orbit-label {
          font-family: var(--font-mono);
          font-size: var(--step--1);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text);
     }

     .orbit-copy {
          font-size: var(--step--1);
          line-height: 1.45;
          color: var(--color-text-muted);
     }

     .orbit-link--about { top: 8%; left: 4%; }
     .orbit-link--work { top: 10%; right: 4%; }
     .orbit-link--writing { bottom: 10%; left: 4%; }
     .orbit-link--colophon { bottom: 8%; right: 4%; }

     .region-panel {
          margin-top: var(--space-l);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-m);
          background: var(--color-surface);
     }

     .region-meta {
          font-family: var(--font-mono);
          font-size: var(--step--1);
          color: var(--color-text-muted);
     }

     .region-links {
          list-style: none;
          margin-top: var(--space-s);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          gap: var(--space-s);
     }

     .region-links a {
          display: flex;
          justify-content: space-between;
          gap: var(--space-s);
          padding: 0.7rem 0.9rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          text-decoration: none;
          font-family: var(--font-serif);
          color: var(--color-text);
     }

     .region-links a span {
          font-family: var(--font-mono);
          font-size: var(--step--2);
          color: var(--color-text-muted);
     }

     .featured-strip {
          margin-top: var(--space-l);
     }

     .strip-label {
          font-family: var(--font-mono);
          font-size: var(--step--1);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: var(--space-xs);
     }

     .strip-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: var(--space-s);
     }

     .strip-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--space-s);
          align-items: baseline;
          padding: 0.8rem 0.9rem;
          text-decoration: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          background: var(--color-surface);
     }

     .strip-year {
          font-family: var(--font-mono);
          font-size: var(--step--2);
          color: var(--color-text-muted);
     }

     .strip-title {
          font-family: var(--font-serif);
          font-size: var(--step-0);
          color: var(--color-text);
     }

     .contact-note {
          margin-top: var(--space-xl);
          font-size: var(--step-0);
          color: var(--color-text-secondary);
     }

     @media (max-width: 900px) {
          .exploration-canvas {
               min-height: auto;
               padding: var(--space-l);
               display: grid;
               grid-template-columns: 1fr;
               gap: var(--space-s);
          }

          .map-center,
          .orbit-link {
               position: static;
          }

          .map-center {
               order: -1;
               padding: 0;
          }

          .map-shell {
               margin: 0 auto var(--space-xs);
          }

          .orbit-link {
               max-width: none;
          }
     }

     @media (prefers-reduced-motion: reduce) {
          .orbit-link {
               transition: none;
          }
     }
</style>
