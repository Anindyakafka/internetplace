export type WaterLogReport = {
	name: string;
	neighbourhood: string;
	coordinates: [number, number];
	date: string;
	source: string;
	url: string;
	headline?: string;
	language?: 'en' | 'bn';
};

export type WaterLogPlace = {
	name: string;
	neighbourhood: string;
	coordinates: [number, number];
	reports: WaterLogReport[];
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
	{ name: 'Ruby crossing', neighbourhood: 'Eastern Metropolitan Bypass', coordinates: [88.4027, 22.5131], date: '2024-10-25', source: 'The Telegraph', url: 'https://www.telegraphindia.com/west-bengal/kolkata/cyclone-dana-sharp-spells-in-two-phases-flood-roads-in-kolkata/cid/2058423' },
	{ name: 'Thanthania', neighbourhood: 'North Kolkata', coordinates: [88.3683, 22.5887], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'রাতভর বৃষ্টিতে জল থৈ থৈ কলকাতায়! কোথায় কোথায় জলমগ্ন, যানজট কোন কোন রাস্তায়', url: 'https://www.anandabazar.com/app/west-bengal/kolkata/water-logging-and-traffic-update-in-kolkata-due-to-heavy-rain-dgtl/cid/1635250' },
	{ name: 'Central Avenue', neighbourhood: 'Central Kolkata', coordinates: [88.3565, 22.5770], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'রাতভর বৃষ্টিতে জল থৈ থৈ কলকাতায়! কোথায় কোথায় জলমগ্ন, যানজট কোন কোন রাস্তায়', url: 'https://www.anandabazar.com/app/west-bengal/kolkata/water-logging-and-traffic-update-in-kolkata-due-to-heavy-rain-dgtl/cid/1635250' },
	{ name: 'M.G. Road', neighbourhood: 'Central Kolkata', coordinates: [88.3602, 22.5800], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'রাতভর বৃষ্টিতে জল থৈ থৈ কলকাতায়! কোথায় কোথায় জলমগ্ন, যানজট কোন কোন রাস্তায়', url: 'https://www.anandabazar.com/app/west-bengal/kolkata/water-logging-and-traffic-update-in-kolkata-due-to-heavy-rain-dgtl/cid/1635250' },
	{ name: 'Kankurgachi', neighbourhood: 'North-east Kolkata', coordinates: [88.3900, 22.5780], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'রাতভর বৃষ্টিতে জল থৈ থৈ কলকাতায়! কোথায় কোথায় জলমগ্ন, যানজট কোন কোন রাস্তায়', url: 'https://www.anandabazar.com/app/west-bengal/kolkata/water-logging-and-traffic-update-in-kolkata-due-to-heavy-rain-dgtl/cid/1635250' },
	{ name: 'Gariahat', neighbourhood: 'South Kolkata', coordinates: [88.3660, 22.5193], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'রাতভর বৃষ্টিতে জল থৈ থৈ কলকাতায়! কোথায় কোথায় জলমগ্ন, যানজট কোন কোন রাস্তায়', url: 'https://www.anandabazar.com/app/west-bengal/kolkata/water-logging-and-traffic-update-in-kolkata-due-to-heavy-rain-dgtl/cid/1635250' },
	{ name: 'Park Circus', neighbourhood: 'Central Kolkata', coordinates: [88.3650, 22.5430], date: '2025-09-24', source: 'Anandabazar Patrika', language: 'bn', headline: '২৪ ঘণ্টা পরেও জলযন্ত্রণা থেকে সম্পূর্ণ নিস্তার পেল না কলকাতা!', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-parts-of-kolkata-are-still-waterlogged-even-after-24-hours-of-heavy-rain-in-the-city-dgtl/cid/1635432' },
	{ name: 'Patuli', neighbourhood: 'South-east Kolkata', coordinates: [88.3840, 22.4720], date: '2025-09-24', source: 'Anandabazar Patrika', language: 'bn', headline: '২৪ ঘণ্টা পরেও জলযন্ত্রণা থেকে সম্পূর্ণ নিস্তার পেল না কলকাতা!', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-parts-of-kolkata-are-still-waterlogged-even-after-24-hours-of-heavy-rain-in-the-city-dgtl/cid/1635432' },
	{ name: 'Santoshpur', neighbourhood: 'South-east Kolkata', coordinates: [88.3900, 22.4970], date: '2025-09-24', source: 'Anandabazar Patrika', language: 'bn', headline: '২৪ ঘণ্টা পরেও জলযন্ত্রণা থেকে সম্পূর্ণ নিস্তার পেল না কলকাতা!', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-parts-of-kolkata-are-still-waterlogged-even-after-24-hours-of-heavy-rain-in-the-city-dgtl/cid/1635432' },
	{ name: 'Topsia', neighbourhood: 'East Kolkata', coordinates: [88.3860, 22.5410], date: '2025-09-24', source: 'Anandabazar Patrika', language: 'bn', headline: '২৪ ঘণ্টা পরেও জলযন্ত্রণা থেকে সম্পূর্ণ নিস্তার পেল না কলকাতা!', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-parts-of-kolkata-are-still-waterlogged-even-after-24-hours-of-heavy-rain-in-the-city-dgtl/cid/1635432' },
	{ name: 'Amherst Street', neighbourhood: 'North-central Kolkata', coordinates: [88.3670, 22.5790], date: '2025-09-24', source: 'Anandabazar Patrika', language: 'bn', headline: '২৪ ঘণ্টা পরেও জলযন্ত্রণা থেকে সম্পূর্ণ নিস্তার পেল না কলকাতা!', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-parts-of-kolkata-are-still-waterlogged-even-after-24-hours-of-heavy-rain-in-the-city-dgtl/cid/1635432' },
	{ name: 'Joka', neighbourhood: 'South-west Kolkata', coordinates: [88.3050, 22.4530], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'জলে ডুবেছে বেহালা থেকে জোকা, বিপর্যস্ত পুজোমণ্ডপ', url: 'https://www.anandabazar.com/west-bengal/kolkata/situation-of-famous-durga-puja-pandals-amid-heavy-rain-in-kolkata-dgtl/cid/1635251' },
	{ name: 'Barisha', neighbourhood: 'South-west Kolkata', coordinates: [88.3050, 22.4810], date: '2025-09-23', source: 'Anandabazar Patrika', language: 'bn', headline: 'জলে ডুবেছে বেহালা থেকে জোকা, বিপর্যস্ত পুজোমণ্ডপ', url: 'https://www.anandabazar.com/west-bengal/kolkata/situation-of-famous-durga-puja-pandals-amid-heavy-rain-in-kolkata-dgtl/cid/1635251' },
	{ name: 'College Street', neighbourhood: 'Central Kolkata', coordinates: [88.3630, 22.5764], date: '2025-07-25', source: 'TV9 Bangla', language: 'bn', headline: 'দুর্যোগে দুর্ভোগ, জল ঠেঙিয়ে যাত্রার যন্ত্রণা কমবে কবে?', url: 'https://tv9bangla.com/kolkata/waterlogging-in-major-parts-of-kolkata-due-to-heavy-rains-1224740.html' },
	{ name: 'Gariahat', neighbourhood: 'South Kolkata', coordinates: [88.3660, 22.5193], date: '2025-07-25', source: 'TV9 Bangla', language: 'bn', headline: 'দুর্যোগে দুর্ভোগ, জল ঠেঙিয়ে যাত্রার যন্ত্রণা কমবে কবে?', url: 'https://tv9bangla.com/kolkata/waterlogging-in-major-parts-of-kolkata-due-to-heavy-rains-1224740.html' },
	{ name: 'Hazra', neighbourhood: 'South Kolkata', coordinates: [88.3468, 22.5234], date: '2025-07-25', source: 'TV9 Bangla', language: 'bn', headline: 'দুর্যোগে দুর্ভোগ, জল ঠেঙিয়ে যাত্রার যন্ত্রণা কমবে কবে?', url: 'https://tv9bangla.com/kolkata/waterlogging-in-major-parts-of-kolkata-due-to-heavy-rains-1224740.html' },
	{ name: 'Dhakuria', neighbourhood: 'South Kolkata', coordinates: [88.3730, 22.5075], date: '2025-07-08', source: 'TV9 Bangla', language: 'bn', headline: 'যোধপুরে ২০০ মিমি, কালীঘাট-বালিগঞ্জ-উল্টোডাঙা, কোথায় কত বৃষ্টি হল', url: 'https://tv9bangla.com/kolkata/rain-update-of-kolkata-waterlogging-inmany-places-1218174.html' },
	{ name: 'Jadavpur', neighbourhood: 'South Kolkata', coordinates: [88.3697, 22.4990], date: '2025-07-08', source: 'TV9 Bangla', language: 'bn', headline: 'যোধপুরে ২০০ মিমি, কালীঘাট-বালিগঞ্জ-উল্টোডাঙা, কোথায় কত বৃষ্টি হল', url: 'https://tv9bangla.com/kolkata/rain-update-of-kolkata-waterlogging-inmany-places-1218174.html' },
	{ name: 'Thanthania', neighbourhood: 'North Kolkata', coordinates: [88.3683, 22.5887], date: '2024-05-07', source: 'Anandabazar Patrika', language: 'bn', headline: 'মরসুমের প্রথম বৃষ্টিতেই জলমগ্ন শহরের বহু রাস্তা', url: 'https://www.anandabazar.com/west-bengal/kolkata/several-areas-of-kolkata-were-under-water-after-seasons-first-rain-dgtl/cid/1515088' }
];

export const waterLogPlaces: WaterLogPlace[] = Array.from(
	waterLogReports.reduce((places, report) => {
		const existing = places.get(report.name);
		if (existing) existing.reports.push(report);
		else places.set(report.name, { name: report.name, neighbourhood: report.neighbourhood, coordinates: report.coordinates, reports: [report] });
		return places;
	}, new Map<string, WaterLogPlace>()).values()
).map((place) => ({ ...place, reports: place.reports.sort((a, b) => b.date.localeCompare(a.date)) }));
