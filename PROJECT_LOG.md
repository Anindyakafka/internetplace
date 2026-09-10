# Project Log

2026-09-10
- Added the Umami analytics tracking script to the shared SvelteKit HTML shell: `https://cloud.umami.is/script.js` with website ID `9a9af125-4f33-4637-853c-6481cb37f7f2`.
- Created a hidden private analytics visualization route at `/analytics` with a noindex/no-follow metadata tag and a dashboard-style static UI in `src/routes/analytics/+page.svelte`.
- Updated the privacy page to mention the site’s Umami usage and the analytics dashboard route.
- Diagnosed the flight map: the OpenSky feed succeeded, but the historical National Library of Scotland tile layer threw an ORB/CORS-style browser reject path in the local route view. The flight map route now defaults to the OpenStreetMap base layer and safely degrades historical tile loading by switching the route UI state back to the modern map fallback rather than leaving the page blank or broken.
