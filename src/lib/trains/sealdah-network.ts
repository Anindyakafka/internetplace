export type SealdahDirection = 'from-sealdah' | 'to-sealdah';

export type SealdahService = {
	id: string;
	name: string;
	direction: SealdahDirection;
	terminal: { code: string; name: string };
	sealdahTime: string;
	dayOffset: number;
	distanceKm: number;
	runDays: string[];
};

export type SealdahCorridor = {
	code: string;
	name: string;
	representativeTrain: string;
	serviceCount: number;
	coordinates: [number, number][];
};

export type SealdahNetwork = {
	generatedAt: string;
	station: { code: string; name: string };
	counts: { services: number; fromSealdah: number; toSealdah: number; corridors: number };
	services: SealdahService[];
	corridors: SealdahCorridor[];
};

export type WestBengalTrack = {
	id: string | number;
	name: string | null;
	railway: 'rail' | 'narrow_gauge' | 'light_rail';
	service: string | null;
	usage: string | null;
	tracks?: string | null;
	coordinates: [number, number][];
};

export type WestBengalStation = {
	id: string | number;
	name: string;
	nameEn: string | null;
	nameBn: string | null;
	code: string | null;
	type: 'station' | 'halt';
	zone?: string | null;
	coordinates: [number, number];
};

export type WestBengalRailways = {
	generatedAt: string;
	source: { name: string; url: string; method: string };
	counts: { trackSegments: number; trackKm: number; stations: number; namedStations: number };
	tracks: WestBengalTrack[];
	stations: WestBengalStation[];
};
