export type VerificationState = 'official-import' | 'human-checked' | 'editorial-review';

export interface LegalDocumentLinks {
	introduced: string | null;
	passedLokSabha: string | null;
	passedRajyaSabha: string | null;
	passedBothHouses: string | null;
	errata: string | null;
	committeeReport: string | null;
	gazette: string | null;
	synopsis: string | null;
}

export interface LegalRecord {
	id: string;
	billNumber: string | null;
	title: string;
	billType: string | null;
	category: string | null;
	ministry: string | null;
	year: number | null;
	introducedInHouse: string | null;
	introducedBy: string | null;
	introducedDate: string | null;
	passedLokSabhaDate: string | null;
	passedRajyaSabhaDate: string | null;
	committeeReferralDate: string | null;
	committeeReportDate: string | null;
	actNumber: string | null;
	actYear: number | null;
	assentDate: string | null;
	status: string | null;
	documents: LegalDocumentLinks;
	verification: VerificationState;
}

export interface LegalCatalogue {
	meta: {
		title: string;
		generatedAt: string;
		sourceName: string;
		sourceUrl: string;
		sourceReportedTotal: number;
		recordCount: number;
		dateMin: number | null;
		dateMax: number | null;
		licenceNote: string;
		limitations: string[];
	};
	records: LegalRecord[];
}
