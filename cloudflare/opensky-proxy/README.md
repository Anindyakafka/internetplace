# OpenSky proxy

This Worker keeps OpenSky OAuth credentials outside the browser and relays the
India bounding-box state-vector response to the Netlify flight function.

Cloudflare Worker secrets (never commit their values):

- `OPENSKY_CLIENT_ID`
- `OPENSKY_CLIENT_SECRET`
- `RELAY_TOKEN` (a long random value also stored in Netlify as `FLIGHT_PROXY_TOKEN`)

Cloudflare Builds settings:

- Root directory: `/cloudflare/opensky-proxy`
- Build command: leave empty
- Deploy command: `npx wrangler deploy`

After deployment, set these Netlify environment variables and redeploy:

- `OPENSKY_PROXY_URL=https://anindya-opensky-proxy.<your-subdomain>.workers.dev/states`
- `FLIGHT_PROXY_TOKEN=<same value as the Worker RELAY_TOKEN>`
