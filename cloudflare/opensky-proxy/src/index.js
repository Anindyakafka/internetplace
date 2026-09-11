const TOKEN_URL = 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
const STATES_URL = 'https://opensky-network.org/api/states/all';
const BBOX = { lamin: '6', lomin: '68', lamax: '37', lomax: '98' };

let tokenCache = { value: '', expiresAt: 0 };
let responseCache = { value: null, expiresAt: 0 };

function json(value, init = {}) {
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json; charset=utf-8');
	headers.set('X-Content-Type-Options', 'nosniff');
	return new Response(JSON.stringify(value), { ...init, headers });
}

async function accessToken(env) {
	if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;
	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: env.OPENSKY_CLIENT_ID,
			client_secret: env.OPENSKY_CLIENT_SECRET
		})
	});
	if (!response.ok) throw new Error(`OpenSky authentication returned HTTP ${response.status}.`);
	const payload = await response.json();
	if (!payload.access_token) throw new Error('OpenSky authentication returned no access token.');
	tokenCache = {
		value: payload.access_token,
		expiresAt: Date.now() + Math.max(60, Number(payload.expires_in ?? 1800) - 60) * 1000
	};
	return tokenCache.value;
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.pathname === '/health') return json({ ok: true, service: 'opensky-proxy' });
		if (url.pathname !== '/states') return json({ error: 'Not found.' }, { status: 404 });
		if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, { status: 405 });
		if (!env.RELAY_TOKEN || request.headers.get('X-Relay-Token') !== env.RELAY_TOKEN) {
			return json({ error: 'Unauthorized.' }, { status: 401 });
		}
		if (!env.OPENSKY_CLIENT_ID || !env.OPENSKY_CLIENT_SECRET) {
			return json({ error: 'OpenSky credentials are not configured.' }, { status: 503 });
		}
		if (responseCache.value && Date.now() < responseCache.expiresAt) {
			return json(responseCache.value, { headers: { 'Cache-Control': 'private, no-store' } });
		}

		try {
			const token = await accessToken(env);
			const upstream = await fetch(`${STATES_URL}?${new URLSearchParams(BBOX)}`, {
				headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
			});
			if (!upstream.ok) {
				return json({ error: `OpenSky states feed returned HTTP ${upstream.status}.` }, { status: upstream.status });
			}
			const payload = await upstream.json();
			responseCache = { value: payload, expiresAt: Date.now() + 90_000 };
			return json(payload, { headers: { 'Cache-Control': 'private, no-store' } });
		} catch (cause) {
			return json({ error: cause instanceof Error ? cause.message : 'OpenSky proxy failed.' }, { status: 502 });
		}
	}
};
