<script lang="ts">
	const totals = {
		visitors: 1429,
		pageviews: 3862,
		bounceRate: 42,
		avgDuration: '02:31'
	};

	const timeSeries = [
		{ label: 'Jan', value: 220 },
		{ label: 'Feb', value: 280 },
		{ label: 'Mar', value: 260 },
		{ label: 'Apr', value: 420 },
		{ label: 'May', value: 470 },
		{ label: 'Jun', value: 390 },
		{ label: 'Jul', value: 560 },
		{ label: 'Aug', value: 640 },
		{ label: 'Sep', value: 610 },
		{ label: 'Oct', value: 680 },
		{ label: 'Nov', value: 690 },
		{ label: 'Dec', value: 710 }
	];

	const pages = [
		{ path: '/', views: 945, percentage: 54 },
		{ path: '/about', views: 312, percentage: 18 },
		{ path: '/writing', views: 286, percentage: 16 },
		{ path: '/work', views: 198, percentage: 11 },
		{ path: '/tracks', views: 184, percentage: 10 },
		{ path: '/privacy', views: 90, percentage: 5 }
	];

	const channels = [
		{ label: 'Direct', value: 46 },
		{ label: 'Search', value: 31 },
		{ label: 'Referrals', value: 14 },
		{ label: 'Social', value: 9 }
	];

	const maxSeries = Math.max(...timeSeries.map((s) => s.value));
</script>

<svelte:head>
	<title>Analytics — Anindya Singh</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Private analytics dashboard for the Anindya Singh website." />
</svelte:head>

<article class="analytics-dashboard">
	<header class="dashboard-header">
		<div>
			<p class="kicker">Private dashboard · noindex</p>
			<h1>Website analytics</h1>
		</div>
		<div class="dashboard-date">
			<span>2026</span>
			<time>09 October</time>
		</div>
	</header>

	<section class="summary-grid">
		<div class="summary-card">
			<span class="label">Visitors</span>
			<span class="value">{totals.visitors}</span>
			<span class="delta positive">+12.8% vs last month</span>
		</div>
		<div class="summary-card">
			<span class="label">Pageviews</span>
			<span class="value">{totals.pageviews}</span>
			<span class="delta positive">+9.6% growth</span>
		</div>
		<div class="summary-card">
			<span class="label">Bounce rate</span>
			<span class="value">{totals.bounceRate}%</span>
			<span class="delta neutral">lower than average</span>
		</div>
		<div class="summary-card">
			<span class="label">Avg. time</span>
			<span class="value">{totals.avgDuration}</span>
			<span class="delta positive">engaged readers</span>
		</div>
	</section>

	<section class="dashboard-grid">
		<section class="panel chart-panel">
			<div class="panel-head">
				<div>
					<span class="panel-label">Traffic trend</span>
					<h2>Pageviews over time</h2>
				</div>
				<span class="panel-tag">Monthly</span>
			</div>
			<div class="bar-chart">
				{#each timeSeries as point}
					<div class="bar-wrap">
						<div class="bar-label">{point.label}</div>
						<div class="bar-shell">
							<div class="bar-fill" style={`height: ${(point.value / maxSeries) * 180}px`}></div>
						</div>
						<div class="bar-value">{point.value}</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="panel">
			<div class="panel-head">
				<div>
					<span class="panel-label">By channel</span>
					<h2>Traffic sources</h2>
				</div>
			</div>
			<div class="channel-list">
				{#each channels as channel}
					<div class="channel-row">
						<div class="channel-meta">
							<span class="channel-name">{channel.label}</span>
							<span class="channel-value">{channel.value}%</span>
						</div>
						<div class="channel-track">
							<div class="channel-bar" style={`width: ${channel.value}%`}></div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</section>

	<section class="panel table-panel">
		<div class="panel-head">
			<div>
				<span class="panel-label">Top pages</span>
				<h2>Content performance</h2>
			</div>
			<span class="panel-tag">{pages.length} pages</span>
		</div>
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Page</th>
						<th>Pageviews</th>
						<th>Share</th>
					</tr>
				</thead>
				<tbody>
					{#each pages as page}
						<tr>
							<td><a class="page-link" href={page.path}>{page.path}</a></td>
							<td>{page.views}</td>
							<td>
								<div class="mini-track">
									<div class="mini-bar" style={`width: ${page.percentage}%`}></div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</article>

<style>
	:global(body) {
		background: var(--color-bg);
		color: var(--color-text);
	}

	.analytics-dashboard {
		width: min(1100px, calc(100vw - 2rem));
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 6rem) 0;
	}

	.dashboard-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 2rem;
	}

	.kicker,
	.panel-label {
		font: 600 var(--step--1)/1 var(--font-mono);
		letter-spacing: .12em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.dashboard-header h1 {
		margin: .8rem 0 0;
		font: 500 clamp(3.2rem, 7vw, 4.8rem)/.95 var(--font-serif);
		letter-spacing: -.04em;
	}

	.dashboard-date {
		font: 600 var(--step--1)/1 var(--font-mono);
		color: var(--color-text-muted);
		text-align: right;
	}

	.dashboard-date span {
		display: block;
		margin-bottom: .4rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(150px, 1fr));
		gap: 1rem;
		margin: 1.5rem 0 1rem;
	}

	.summary-card,
	.panel {
		background: color-mix(in srgb, var(--color-panel) 95%, transparent);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		box-shadow: 0 1px 0 var(--color-border);
	}

	.summary-card {
		padding: 1rem 1.1rem;
	}

	.summary-card .label {
		display: block;
		font: 600 var(--step--1)/1 var(--font-mono);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.summary-card .value {
		display: block;
		margin-top: .9rem;
		font: 500 clamp(2.1rem, 4vw, 3rem)/1 var(--font-serif);
	}

	.summary-card .delta {
		display: block;
		font: 600 var(--step--1)/1 var(--font-mono);
		margin-top: .7rem;
	}

	.summary-card .positive { color: var(--color-success, #99cc9a); }
	.summary-card .neutral { color: var(--color-text-muted); }

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1.6fr .9fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	.panel {
		padding: 1rem 1.1rem 1.4rem;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: .9rem;
	}

	.panel-head h2 {
		font: 500 var(--step-2)/1.1 var(--font-serif);
		margin: .5rem 0 0;
	}

	.panel-tag {
		font: 600 var(--step--1)/1 var(--font-mono);
		color: var(--color-accent);
		text-transform: uppercase;
	}

	.bar-chart {
		display: flex;
		align-items: end;
		justify-content: space-between;
		min-height: 280px;
		gap: .5rem;
		padding-top: 2rem;
	}

	.bar-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		gap: .5rem;
		flex: 1;
	}

	.bar-label,
	.bar-value {
		font: 600 var(--step--1)/1 var(--font-mono);
		color: var(--color-text-muted);
	}

	.bar-shell {
		width: 34px;
		height: 180px;
		display: flex;
		align-items: end;
		border-bottom: 1px solid var(--color-border);
	}

	.bar-fill {
		display: block;
		width: 100%;
		min-height: 6px;
		background: var(--color-accent);
		border-radius: 999px 999px 0 0;
	}

	.channel-list {
		padding-top: 1.6rem;
	}

	.channel-row + .channel-row {
		margin-top: 1rem;
	}

	.channel-meta {
		display: flex;
		justify-content: space-between;
		font: 600 var(--step--1)/1 var(--font-mono);
		color: var(--color-text-muted);
	}

	.channel-name {
		color: var(--color-text);
	}

	.channel-track,
	.mini-track {
		margin-top: .65rem;
		height: 8px;
		border-radius: 99px;
		background: color-mix(in srgb, var(--color-border) 80%, transparent);
		overflow: hidden;
	}

	.channel-bar,
	.mini-bar {
		display: block;
		height: 100%;
		background: var(--color-accent);
		border-radius: inherit;
	}

	.table-panel {
		margin-top: 1rem;
	}

	.table-wrap {
		padding-top: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: .9rem .5rem;
		border-bottom: 1px solid var(--color-border);
		font: 500 var(--step--1)/1.4 var(--font-sans);
		text-align: left;
	}

	th {
		font: 600 var(--step--1)/1 var(--font-mono);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.page-link {
		color: var(--color-accent);
		text-decoration: none;
	}

	@media (max-width: 820px) {
		.dashboard-header,
		.dashboard-grid,
		.summary-grid {
			grid-template-columns: 1fr;
			flex-direction: column;
		}

		.summary-grid {
			display: grid;
		}
	}
</style>
