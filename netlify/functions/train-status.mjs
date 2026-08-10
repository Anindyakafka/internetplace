const ALLOWED_TRAINS = new Set(['31601', '31602', '31611', '31612']);

export default async (request) => {
	const url = new URL(request.url);
	const number = url.searchParams.get('number') ?? '';
	const apiKey = Netlify.env.get('RAILRADAR_API_KEY');

	if (!ALLOWED_TRAINS.has(number)) {
		return Response.json({ error: 'Train is not enabled for this prototype.' }, { status: 400 });
	}

	if (!apiKey) {
		return Response.json({ error: 'Live train data is not configured.' }, { status: 503 });
	}

	try {
		const upstream = await fetch(
			`https://api.railradar.in/v1/trains/${number}/live?geometry=true&format=geojson&includeCoordinates=true`,
			{ headers: { Authorization: `Bearer ${apiKey}` } }
		);
		const payload = await upstream.json();

		return Response.json(payload, {
			status: upstream.status,
			headers: {
				'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300'
			}
		});
	} catch {
		return Response.json({ error: 'The live train source is temporarily unavailable.' }, { status: 502 });
	}
};

