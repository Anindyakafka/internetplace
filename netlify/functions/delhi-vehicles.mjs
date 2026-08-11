import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

export default async () => {
	const key = process.env.DELHI_TRANSIT_API_KEY ?? process.env.DMRC_API_KEY;
	if (!key) return Response.json({ error: 'Delhi transit data is not configured.' }, { status: 503 });

	try {
		const upstream = await fetch(`https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key=${encodeURIComponent(key)}`, {
			headers: { Accept: 'application/x-google-protobuf' }
		});
		if (!upstream.ok) return Response.json({ error: `Delhi Open Transit Data returned HTTP ${upstream.status}.` }, { status: upstream.status });
		const bytes = new Uint8Array(await upstream.arrayBuffer());
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(bytes);
		const vehicles = (feed.entity ?? []).flatMap((entity) => {
			const vehicle = entity.vehicle;
			if (!vehicle?.position) return [];
			return [{
				id: entity.id ?? vehicle.vehicle?.id ?? null,
				label: vehicle.vehicle?.label ?? null,
				routeId: vehicle.trip?.routeId ?? null,
				latitude: vehicle.position.latitude ?? null,
				longitude: vehicle.position.longitude ?? null,
				bearing: vehicle.position.bearing ?? null,
				timestamp: vehicle.timestamp ? Number(vehicle.timestamp) * 1000 : null
			}];
		});

		return Response.json({ vehicles, count: vehicles.length, fetchedAt: new Date().toISOString() }, {
			headers: { 'Cache-Control': 'public, max-age=15, s-maxage=20, stale-while-revalidate=60' }
		});
	} catch {
		return Response.json({ error: 'The Delhi vehicle feed could not be decoded.' }, { status: 502 });
	}
};
