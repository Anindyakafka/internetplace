export default async (request) => {
	const url = new URL(request.url);
	const number = url.searchParams.get('number') ?? '';
	const apiKey = process.env.RAILRADAR_API_KEY;

	if (!/^3\d{4}$/.test(number)) {
		return Response.json({ error: 'Enter a valid five-digit suburban train number.' }, { status: 400 });
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

