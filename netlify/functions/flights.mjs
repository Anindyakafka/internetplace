export default async () => {
	try {
		const bbox = new URLSearchParams({
			lamin: '6.0',
			lomin: '68.0',
			lamax: '37.0',
			lomax: '98.0'
		});

		const upstream = await fetch(`https://opensky-network.org/api/states/all?${bbox.toString()}`, {
			headers: { Accept: 'application/json' }
		});

		if (!upstream.ok) {
			return Response.json({ error: `OpenSky returned HTTP ${upstream.status}.` }, { status: upstream.status });
		}

		const payload = await upstream.json();
		const states = Array.isArray(payload.states) ? payload.states : [];
		const flights = states
			.map((state) => {
				const [icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround, velocity, heading, verticalRate, sensors, geoAltitude, squawk, spi, positionSource] = state;
				if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
				return {
					icao24: icao24 ?? null,
					callsign: (callsign ?? '').trim() || null,
					originCountry: originCountry ?? null,
					timePosition: timePosition ? new Date(timePosition * 1000).toISOString() : null,
					lastContact: lastContact ? new Date(lastContact * 1000).toISOString() : null,
					latitude,
					longitude,
					baroAltitude: baroAltitude ?? null,
					onGround: Boolean(onGround),
					velocity: velocity ?? null,
					heading: heading ?? null,
					verticalRate: verticalRate ?? null,
					geoAltitude: geoAltitude ?? null,
					squawk: squawk ?? null,
					spi: Boolean(spi),
					positionSource: positionSource ?? null
				};
			})
			.filter(Boolean);

		return Response.json({
			flights,
			count: flights.length,
			fetchedAt: new Date().toISOString(),
			bbox: { minLat: 6.0, minLon: 68.0, maxLat: 37.0, maxLon: 98.0 }
		}, {
			headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60' }
		});
	} catch (cause) {
		return Response.json({ error: cause instanceof Error ? cause.message : 'OpenSky flight feed failed.' }, { status: 502 });
	}
};
