import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE = 'https://sansad.in/api_rs/legislation/getBills';
const OUTPUT = path.resolve('static/data/legal-explorer.json');
const PAGE_SIZE = 5000;

const clean = (value) => {
	if (value === null || value === undefined) return null;
	const text = String(value).replace(/\s+/g, ' ').trim();
	return text || null;
};

const dateOnly = (value) => {
	const text = clean(value);
	if (!text) return null;
	const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
	return match ? match[1] : text;
};

const safeUrl = (value) => {
	const text = clean(value);
	if (!text) return null;
	try {
		const url = new URL(text, 'https://sansad.in');
		return url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
};

function stableId(row) {
	const identity = [row.billNumber, row.billName, row.billYear, row.billIntroducedDate, row.billIntroducedInHouse]
		.map((part) => clean(part) ?? '')
		.join('|');
	return `bill-${createHash('sha1').update(identity).digest('hex').slice(0, 14)}`;
}

function normalize(row) {
	const year = Number(row.billYear);
	const actYear = Number(row.actYear);
	return {
		id: stableId(row),
		billNumber: clean(row.billNumber),
		title: clean(row.billName) ?? 'Untitled bill record',
		billType: clean(row.billType),
		category: clean(row.billCategory),
		ministry: clean(row.ministryName),
		year: Number.isFinite(year) && year > 0 ? year : null,
		introducedInHouse: clean(row.billIntroducedInHouse),
		introducedBy: clean(row.billIntroducedBy),
		introducedDate: dateOnly(row.billIntroducedDate),
		passedLokSabhaDate: dateOnly(row.billPassedInLSDate),
		passedRajyaSabhaDate: dateOnly(row.billPassedInRSDate),
		committeeReferralDate: dateOnly(row.referredToCommitteeDate),
		committeeReportDate: dateOnly(row.reportPresentedDate),
		actNumber: clean(row.actNo),
		actYear: Number.isFinite(actYear) && actYear > 0 ? actYear : null,
		assentDate: dateOnly(row.billAssentedDate),
		status: clean(row.status),
		documents: {
			introduced: safeUrl(row.billIntroducedFile),
			passedLokSabha: safeUrl(row.billPassedInLSFile),
			passedRajyaSabha: safeUrl(row.billPassedInRSFile),
			passedBothHouses: safeUrl(row.billPassedInBothHousesFile),
			errata: safeUrl(row.errataFile),
			committeeReport: safeUrl(row.reportFile),
			gazette: safeUrl(row.billGazettedFile),
			synopsis: safeUrl(row.billSynopsisFile)
		},
		verification: 'official-import'
	};
}

function endpoint(page, size = PAGE_SIZE) {
	const params = new URLSearchParams({
		loksabha: '', sessionNo: '', billName: '', house: '', ministryName: '', billType: '',
		billCategory: '', billStatus: '', introductionDateFrom: '', introductionDateTo: '',
		passedInLsDateFrom: '', passedInLsDateTo: '', passedInRsDateFrom: '', passedInRsDateTo: '',
		page: String(page), size: String(size), locale: 'en', sortOn: 'billIntroducedDate', sortBy: 'desc'
	});
	return `${SOURCE}?${params}`;
}

async function getPage(page) {
	const response = await fetch(endpoint(page), { headers: { accept: 'application/json' } });
	if (!response.ok) throw new Error(`Digital Sansad page ${page} failed: ${response.status}`);
	const payload = await response.json();
	if (!Array.isArray(payload.records) || !payload._metadata) throw new Error(`Unexpected response on page ${page}`);
	return payload;
}

const first = await getPage(1);
const totalPages = Number(first._metadata.totalPages);
const pages = [first];
for (let page = 2; page <= totalPages; page += 1) pages.push(await getPage(page));

const imported = pages.flatMap((page) => page.records).map(normalize);
const recordsById = new Map(imported.map((record) => [record.id, record]));
const records = [...recordsById.values()].sort((a, b) =>
	(b.introducedDate ?? `${b.year ?? 0}`).localeCompare(a.introducedDate ?? `${a.year ?? 0}`) || a.title.localeCompare(b.title)
);
const years = records.map((record) => record.year).filter(Number.isFinite);

const catalogue = {
	meta: {
		title: 'Indian Parliamentary Bills Explorer',
		generatedAt: new Date().toISOString(),
		sourceName: 'Digital Sansad, Parliament of India',
		sourceUrl: 'https://sansad.in/ls/legislation/bills',
		sourceReportedTotal: Number(first._metadata.totalElements),
		recordCount: records.length,
		dateMin: years.length ? Math.min(...years) : null,
		dateMax: years.length ? Math.max(...years) : null,
		licenceNote: 'Official public records. Refer to the linked Gazette and parliamentary documents for authoritative text.',
		limitations: [
			'Digital Sansad warns that Gazette copies are the authoritative versions.',
			'An official import is not the same as human verification; source records may contain omissions, duplicates, or inconsistent labels.',
			'This catalogue covers parliamentary bills returned by the source endpoint, not every Act, rule, regulation, policy, ordinance, state law, or judgment in India.',
			'Document availability varies by record and period.'
		]
	},
	records
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(catalogue)}\n`, 'utf8');
console.log(`Wrote ${records.length} records (source reported ${first._metadata.totalElements}) to ${OUTPUT}`);
