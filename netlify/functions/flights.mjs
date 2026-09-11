const TOKEN_URL = 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
const STATES_URL = 'https://opensky-network.org/api/states/all';
const BBOX = { minLat: 6, minLon: 68, maxLat: 37, maxLon: 98 };

let tokenCache = { value: '', expiresAt: 0 };
let responseCache = { payload: null, expiresAt: 0 };

async function getAccessToken(clientId, clientSecret) {
	if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;
	const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret });
	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
		body
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

export default async () => {
	const clientId = process.env.OPENSKY_CLIENT_ID;
	const clientSecret = process.env.OPENSKY_CLIENT_SECRET;
	const hasCredentials = Boolean(clientId && clientSecret);

	if (Boolean(clientId) !== Boolean(clientSecret)) {
		return Response.json(
			{ error: 'OpenSky OAuth credentials are incomplete. Set both OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET.' },
			{ status: 503 }
		);
	}
	if (responseCache.payload && Date.now() < responseCache.expiresAt) {
		return Response.json(responseCache.payload, { headers: cacheHeaders(hasCredentials) });
	}

	try {
		const bbox = new URLSearchParams({
			lamin: String(BBOX.minLat), lomin: String(BBOX.minLon),
			lamax: String(BBOX.maxLat), lomax: String(BBOX.maxLon)
		});
		const headers = { Accept: 'application/json' };
		let authenticated = false;
		let authenticationWarning = null;
		if (hasCredentials) {
			try {
				headers.Authorization = `Bearer ${await getAccessToken(clientId, clientSecret)}`;
				authenticated = true;
			} catch (cause) {
				// OpenSky's OAuth host can occasionally be unreachable from a serverless
				// region. The public states endpoint is still useful, so degrade gracefully.
				authenticationWarning = cause instanceof Error ? cause.message : 'OpenSky authentication failed.';
			}
		}
		const upstream = await fetch(`${STATES_URL}?${bbox.toString()}`, { headers });
		if (!upstream.ok) {
			const retryAfter = upstream.headers.get('x-rate-limit-retry-after-seconds');
			const detail = upstream.status === 429
				? `OpenSky rate limit reached${retryAfter ? `; retry in ${retryAfter} seconds` : ''}.`
				: `OpenSky returned HTTP ${upstream.status}.`;
			return Response.json({ error: detail }, { status: upstream.status });
		}

		const payload = await upstream.json();
		const states = Array.isArray(payload.states) ? payload.states : [];
		const flights = states.map((state) => {
			const [icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround, velocity, heading, verticalRate, sensors, geoAltitude, squawk, spi, positionSource, category] = state;
			if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
			return {
				icao24: icao24 ?? null,
				callsign: (callsign ?? '').trim() || null,
				originCountry: originCountry ?? null,
				timePosition: timePosition ? new Date(timePosition * 1000).toISOString() : null,
				lastContact: lastContact ? new Date(lastContact * 1000).toISOString() : null,
				latitude, longitude,
				baroAltitude: baroAltitude ?? null,
				onGround: Boolean(onGround),
				velocity: velocity ?? null,
				heading: heading ?? null,
				verticalRate: verticalRate ?? null,
				geoAltitude: geoAltitude ?? null,
				squawk: squawk ?? null,
				spi: Boolean(spi),
				positionSource: positionSource ?? null,
				category: category ?? null
			};
		}).filter(Boolean);

		const result = {
			flights,
			count: flights.length,
			fetchedAt: new Date().toISOString(),
			sourceTime: payload.time ? new Date(payload.time * 1000).toISOString() : null,
			authenticated,
			authenticationWarning,
			bbox: BBOX
		};
		responseCache = { payload: result, expiresAt: Date.now() + (authenticated ? 90_000 : 10 * 60_000) };
		return Response.json(result, { headers: cacheHeaders(authenticated) });
	} catch (cause) {
		return Response.json(
			{
				error: cause instanceof Error ? cause.message : 'OpenSky flight feed failed.',
				stage: 'states-feed'
			},
			{ status: 502, headers: { 'Cache-Control': 'no-store' } }
		);
	}
};

function cacheHeaders(authenticated) {
	return {
		'Cache-Control': 'public, max-age=30',
		'Netlify-CDN-Cache-Control': `public, durable, s-maxage=${authenticated ? 120 : 900}, stale-while-revalidate=300`
	};
}
