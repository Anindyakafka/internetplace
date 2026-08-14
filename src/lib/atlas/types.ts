export type EvidenceAccess = 'public' | 'controlled' | 'private' | 'prohibited';
export type ClassificationMethod = 'self-described' | 'administrative' | 'researcher-coded' | 'historically-attributed' | 'not-applicable';
export type PublicUseStatus = 'candidate' | 'audit-required' | 'approved-aggregate-only' | 'approved' | 'withheld';

export type EvidenceSource = {
	id: string;
	title: string;
	producer: string;
	period: { start: string; end?: string };
	sourceUrl?: string;
	access: EvidenceAccess;
	classificationMethod: ClassificationMethod;
	licenceOrTerms: string;
	downloadedAt?: string;
	limitations: string[];
	publicUseStatus: PublicUseStatus;
};

export type EvidenceRecord = {
	id: string;
	sourceId: EvidenceSource['id'];
	subject: string;
	place: { name: string; code?: string; level: string; boundaryYear?: number };
	period: { start: string; end?: string };
	value?: number;
	unit?: string;
	denominator?: number;
	category?: string;
	classificationMethod: ClassificationMethod;
	uncertainty?: string;
	absences: string[];
	limitations: string[];
	contestedBy: string[];
	publicUseStatus: PublicUseStatus;
};
