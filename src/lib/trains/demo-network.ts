export type StationShape = 'circle' | 'square' | 'triangle' | 'diamond';

export type TrainStation = {
	code: string;
	name: string;
	lat: number;
	lng: number;
	shape: StationShape;
};

export type TrainService = {
	id: string;
	label: string;
	direction: 'northbound' | 'southbound';
	startMinutes: number;
	durationMinutes: number;
	delayMinutes: number;
	status: 'calculated' | 'scheduled';
};

export const stations: TrainStation[] = [
	{ code: 'SDAH', name: 'Sealdah', lat: 22.5677, lng: 88.3715, shape: 'square' },
	{ code: 'DDJ', name: 'Dum Dum Junction', lat: 22.6214, lng: 88.3937, shape: 'diamond' },
	{ code: 'BLH', name: 'Belgharia', lat: 22.6685, lng: 88.399, shape: 'circle' },
	{ code: 'SEP', name: 'Sodepur', lat: 22.6986, lng: 88.3914, shape: 'circle' },
	{ code: 'KDH', name: 'Khardaha', lat: 22.7194, lng: 88.3786, shape: 'circle' },
	{ code: 'BP', name: 'Barrackpore', lat: 22.7605, lng: 88.3717, shape: 'triangle' },
	{ code: 'IP', name: 'Ichhapur', lat: 22.806, lng: 88.3735, shape: 'circle' },
	{ code: 'SNR', name: 'Shyamnagar', lat: 22.8334, lng: 88.3867, shape: 'circle' },
	{ code: 'NH', name: 'Naihati Junction', lat: 22.8937, lng: 88.4201, shape: 'diamond' },
	{ code: 'HLR', name: 'Halisahar', lat: 22.9446, lng: 88.4198, shape: 'circle' },
	{ code: 'KPA', name: 'Kanchrapara', lat: 22.9584, lng: 88.4282, shape: 'circle' },
	{ code: 'KYI', name: 'Kalyani', lat: 22.9755, lng: 88.4348, shape: 'triangle' },
	{ code: 'MPJ', name: 'Madanpur', lat: 23.0056, lng: 88.4892, shape: 'circle' },
	{ code: 'SMX', name: 'Simurali', lat: 23.0294, lng: 88.5189, shape: 'circle' },
	{ code: 'CDH', name: 'Chakdaha', lat: 23.0796, lng: 88.5294, shape: 'circle' },
	{ code: 'RHA', name: 'Ranaghat Junction', lat: 23.1765, lng: 88.5669, shape: 'square' }
];

// Prototype services are intentionally not presented as official train numbers.
export const services: TrainService[] = [
	{ id: '31601', label: '31601 · Sealdah → Ranaghat', direction: 'northbound', startMinutes: 5, durationMinutes: 76, delayMinutes: 0, status: 'scheduled' },
	{ id: '31611', label: '31611 · Sealdah → Ranaghat', direction: 'northbound', startMinutes: 35, durationMinutes: 79, delayMinutes: 0, status: 'scheduled' },
	{ id: '31602', label: '31602 · Ranaghat → Sealdah', direction: 'southbound', startMinutes: 18, durationMinutes: 80, delayMinutes: 0, status: 'scheduled' },
	{ id: '31612', label: '31612 · Ranaghat → Sealdah', direction: 'southbound', startMinutes: 48, durationMinutes: 77, delayMinutes: 0, status: 'scheduled' }
];

export const routeCoordinates: [number, number][] = stations.map(({ lat, lng }) => [lat, lng]);
