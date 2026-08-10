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
