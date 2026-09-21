export type WaterLogReport = {
	name: string;
	neighbourhood: string;
	coordinates: [number, number];
	date: string;
	source: string;
	url: string;
};

// Coordinates are approximate locality centroids, not measured inundation extents.
// Reports identify a neighbourhood or street; the linked source remains the record.
export const waterLogReports: WaterLogReport[] = [
	{ name: 'Thanthania', neighbourhood: 'North Kolkata', coordinates: [88.3683, 22.5887], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'College Street', neighbourhood: 'Central Kolkata', coordinates: [88.3630, 22.5764], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Bowbazar', neighbourhood: 'Central Kolkata', coordinates: [88.3602, 22.5682], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Behala', neighbourhood: 'South-west Kolkata', coordinates: [88.3103, 22.4989], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Garden Reach', neighbourhood: 'South-west Kolkata', coordinates: [88.2926, 22.5391], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Metiabruz', neighbourhood: 'South-west Kolkata', coordinates: [88.2548, 22.5294], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Rashbehari', neighbourhood: 'South Kolkata', coordinates: [88.3515, 22.5174], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Golf Green', neighbourhood: 'South Kolkata', coordinates: [88.3590, 22.4922], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Kasba', neighbourhood: 'South-east Kolkata', coordinates: [88.3938, 22.5195], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Ballygunge', neighbourhood: 'South Kolkata', coordinates: [88.3659, 22.5290], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Ultadanga', neighbourhood: 'North-east Kolkata', coordinates: [88.3907, 22.5948], date: '2025-07-08', source: 'The Indian Express', url: 'https://indianexpress.com/article/cities/kolkata/kolkata-submerged-heavy-rains-cripple-10113516/' },
	{ name: 'Kalighat', neighbourhood: "Tolly's Nullah", coordinates: [88.3422, 22.5205], date: '2024-09-19', source: 'The Times of India', url: 'https://timesofindia.indiatimes.com/city/kolkata/high-tide-inundates-large-parts-of-kalighat-and-chetla-areas-along-tollys-nullah/articleshow/113504929.cms' },
	{ name: 'Chetla', neighbourhood: "Tolly's Nullah", coordinates: [88.3370, 22.5172], date: '2024-09-19', source: 'The Times of India', url: 'https://timesofindia.indiatimes.com/city/kolkata/high-tide-inundates-large-parts-of-kalighat-and-chetla-areas-along-tollys-nullah/articleshow/113504929.cms' },
	{ name: 'Ruby crossing', neighbourhood: 'Eastern Metropolitan Bypass', coordinates: [88.4027, 22.5131], date: '2024-10-25', source: 'The Telegraph', url: 'https://www.telegraphindia.com/west-bengal/kolkata/cyclone-dana-sharp-spells-in-two-phases-flood-roads-in-kolkata/cid/2058423' }
];
