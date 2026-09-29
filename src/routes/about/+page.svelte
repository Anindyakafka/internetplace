<script lang="ts">
	import { onMount } from 'svelte';

	type Language = 'en' | 'bn';
	type FormState = 'idle' | 'submitting' | 'success' | 'error';

	const copy = {
		en: {
			skip: 'Skip the file',
			progress: 'File progress',
			draft: 'Bengali draft · needs author review',
			intake: 'FILE 00 / INTAKE',
			formTitle: 'PERSONNEL RECORD',
			formSubtitle: 'A partial account, filed under “still becoming.”',
			subject: 'SUBJECT',
			occupation: 'OCCUPATION',
			location: 'LOCATION',
			status: 'STATUS',
				name: 'Anindya Singh',
				nameFirst: 'Anindya',
				nameLast: 'Singh',
				occupationValue: 'Researcher · data scientist · writer',
				locationValue: 'Delhi NCR, India',
				statusValue: 'In the field / in the margins',
			subjectFiled: 'SUBJECT / NAME AS FILED',
			recordOpen: 'RECORD STATUS: OPEN',
			evidenceKeep: 'KEEP WITH THE EVIDENCE',
				department: 'DEPARTMENT OF INCOMPLETE KNOWLEDGE',
				scrollContinue: 'SCROLL TO CONTINUE ↓',
				stamp: 'OPEN FILE',
				personal: 'I keep asking public data to explain itself; it usually requests an extension.',
				signalTitle: 'FIELDWORK / RESEARCH SIGNAL',
				signalSubtitle: 'People, places, and systems—before the dataset.',
				signalMetrics: [
					{ value: '13', label: 'person field team' },
					{ value: '02', label: 'states' },
					{ value: '04', label: 'district administrations' }
				],
			classification: 'FILE 01 / CLASSIFICATION',
			classificationTitle: 'The record has opinions.',
			classificationIntro: 'A small machine is very sure of itself. The person it describes is less impressed.',
			classifierLabel: 'MODEL OUTPUT · NOT A BIOGRAPHY',
			modelSerial: 'MODEL 04',
			classifierDisclaimer: 'INFERENCE ENGINE / CONFIDENCE NOT GUARANTEED',
			classifierFrames: [
				{ label: 'OCCUPATION', value: 'economist?', score: '91.4%' },
				{ label: 'REGION', value: 'somewhere, probably', score: '68.2%' },
				{ label: 'COMMUNITY', value: 'please do not infer', score: '99.9%' },
				{ label: 'CONFIDENCE', value: 'confidently uncertain', score: '104.0%' }
			],
			selfLabel: 'SUBJECT STATEMENT',
			selfDescription: 'I bring empirical methods into conversation with labour, identity, information, and the everyday consequences of policy.',
			classificationAside: 'Classification is a method. It is not the same thing as knowing someone.',
			classificationNote: '“Name Ethnicity Detector”: a classifier, a research project, and an essay about what such a machine cannot settle.',
			route: 'FILE 02 / THE ROUTE',
			routeTitle: 'A route, not a straight line.',
			routeIntro: 'A few places and institutions that appear in the record. No claim that a map can explain the journey.',
				routeAlt: 'A drawn route connecting Kolkata, Shiv Nadar and Dadri, and current field research in Delhi NCR.',
			routeProgress: 'Route progress',
			routeNotesLabel: 'Route field notes',
			routeMapLabel: 'ROUTE / 03 ENTRIES',
			notToScale: 'NOT TO SCALE',
				mapLabels: ['KOLKATA', 'SHIV NADAR / DADRI', 'DELHI NCR / FIELD SITES'],
			mapFoot: 'DOCUMENTED MOVEMENT / THREE STOPS',
			mapQualifier: '— NOT A COMPLETE HISTORY —',
			waypoints: [
				{ place: 'Kolkata', date: '2020 — 2023', title: 'B.Sc. Economics', text: 'Bidhannagar Government College. The first set of questions; none of the last ones.' },
				{ place: 'Shiv Nadar / Dadri', date: '2023 — 2025', title: 'M.Sc. Economics + fieldwork', text: '214 household surveys across seven villages in Dadri, alongside satellite imagery, oral histories, and land-record politics.' },
					{ place: 'Delhi NCR / field sites', date: 'SEP 2025 — PRESENT', title: 'Research Consultant', text: 'Leading field research on MGNREGA assets, with high-frequency checks and reusable data workflows across two states.' }
			],
			lenses: 'FILE 03 / THREE LENSES',
			lensesTitle: 'The questions travel together.',
			lensesIntro: 'Not separate boxes so much as three ways of noticing what the record includes, and what it leaves out.',
			lensItems: [
				{ number: '01', title: 'Labour', mark: 'WORK / VALUE / TIME', text: 'I look at work as lived time and bargaining power, not only as a row in a labour-force table.', visual: 'Dots enter the ledger. The missing hours do not.' },
				{ number: '02', title: 'Identity', mark: 'NAMES / BORDERS / BELONGING', text: 'Categories travel through institutions. I study what they make legible, and the people they misread.', visual: 'The groups sort themselves. Then decline to stay sorted.' },
				{ number: '03', title: 'Information', mark: 'RECORD / ABSENCE / EVIDENCE', text: 'Data is made, inherited, and sometimes withheld. Its gaps are part of the evidence, not a footnote.', visual: 'A table, several redactions, an uncooperative margin.' }
			],
			atlasTitle: 'A longer file: Annihilation Atlas',
			atlasText: 'An anti-caste observatory of land, labour, classification, segregation, resistance, and memory.',
			projectStatus: 'LONG-RUNNING PROJECT / IN PROGRESS',
			atlasLink: 'Visit the project',
			relatedLabel: 'SUBFILES / SELECTED WORK',
				relatedText: 'A few projects where field systems, public records, and machine-made categories meet real-world constraints.',
				relatedProjects: [
					{ category: 'FIELD SYSTEMS / MGNREGA', title: 'Building resilience through MGNREGA assets', detail: 'Led a 13-person field team across two states; daily high-frequency checks and transferable data pipelines strengthened field operations and data quality.' },
					{ category: 'CLIMATE / GOOGLE-X COLLECTORS', title: 'Planning for climate resilience', detail: 'Scoped an AI-assisted disaster-mitigation prototype with four district administrations across Shillong, Nandurbar, Chennai, and Ramanathapuram.' },
					{ category: 'PUBLIC RECORDS / WEST BENGAL', title: 'Electoral rolls, 2002 + 2026 SIR', detail: 'Built resumable pipelines to turn tens of thousands of booth-level PDFs into structured, analyzable electoral data for research and public exhibition.' },
					{ category: 'CLASSIFICATION / SOUNDING NAMES', title: 'Auditing the assumptions behind names', detail: 'Built reproducible tools to audit religion and race/ethnicity bias in datasets—not to treat a classifier as an authority on identity.' }
				],
				openProject: 'OPEN FIELD NOTE',
			relatedLink: 'Browse the work index',
			instruments: 'FILE 04 / INSTRUMENT PANEL',
			instrumentsTitle: 'Tools are not neutral. Still useful.',
			instrumentsIntro: 'A working toolkit for asking, checking, mapping, and occasionally arguing with the data.',
			toolGroups: [
					{ label: 'ANALYSIS', tools: ['Python', 'R', 'Stata', 'SPSS', 'MATLAB'] },
					{ label: 'SPATIAL / DATA', tools: ['QGIS', 'Gretl', 'GAMS'] },
					{ label: 'BUILD', tools: ['Python', 'C++', 'JavaScript', 'Git'] },
					{ label: 'PUBLISH', tools: ['LaTeX', 'Excel', 'PowerPoint'] }
			],
			experienceTitle: 'Experience & education',
			experienceHint: 'Open an index card for the field note.',
			experienceIndex: 'INDEX / EXPERIENCE',
			filed: 'FILED',
					experiences: [
					{ date: 'SEP 2025 — PRESENT', title: 'Research Consultant', org: 'Inclusion Economics India Centre · affiliated with Inclusion Economics at Yale University', detail: 'Led a 13-person field team across two states for Building Resilience through MGNREGA Assets; daily high-frequency checks and reusable data workflows supported stronger field-data quality.' },
					{ date: 'JUN 2024 — AUG 2024', title: 'Research Assistant', org: 'Centre for Sustainable Employment · Azim Premji University', detail: 'Delivered cleaned, analysis-ready electoral and NCRB datasets and supported preliminary econometric analysis for research on employment and livelihoods.' },
				{ date: '2023 — 2025', title: 'M.Sc. Economics', org: 'Shiv Nadar Institution of Eminence', detail: 'Graduate training in economics, methods, and the empirical questions that become harder—not easier—when people enter the dataset.' },
				{ date: '2020 — 2023', title: 'B.Sc. Economics (Hons)', org: 'Bidhannagar Government College, Kolkata', detail: 'Undergraduate study in economics, statistics, and the habit of checking what a clean table has left outside its frame.' }
			],
			reply: 'FILE 05 / REPLY SLIP',
			replyForm: 'REPLY / FORM 05-B',
			keepCopy: 'KEEP THIS COPY',
			replyFooter: 'THANK YOU FOR WRITING',
			receivingDesk: 'CHHIPI/42 · RECEIVING DESK',
			replyTitle: 'A note back would be welcome.',
			replyText: 'Write about a question, a shared interest, or something you think deserves a closer look. This is not a commercial services page; please write because the idea matters.',
			email: 'Email',
			linkedin: 'LinkedIn',
			github: 'GitHub',
			contactForm: 'Contact form',
			fieldName: 'Name',
			fieldEmail: 'Email address',
			fieldMessage: 'What would you like to talk about?',
			fieldMessageHint: 'No sensitive personal information, please.',
			botField: 'Leave this field empty',
			send: 'Send the reply slip',
			sending: 'Sending…',
			formError: 'The slip did not reach the desk. Please try again, or use the email link above.',
			formSuccess: 'Slip filed. Thank you — redirecting to the receipt…',
			pageEnd: 'END OF CURRENT FILE · MORE EVIDENCE MAY ARRIVE',
			helpHint: 'There is a small bureaucratic help desk hidden in this file.',
			dialogTitle: 'CHHIPI/42 · help desk',
			close: 'Close help desk',
			easterLines: ['REQUEST RECEIVED. THE FORM WAS ALREADY A FORM.', 'CLASSIFICATION: CURIOUS, WITH EVIDENCE.', 'PLEASE TAKE A NUMBER. THE NUMBER IS ALSO UNDER REVIEW.'],
			thank: 'Continue browsing'
		},
		bn: {
			skip: 'নথি এড়িয়ে মূল অংশে যান',
			progress: 'নথির অগ্রগতি',
			draft: 'বাংলা খসড়া · লেখকের পর্যালোচনা প্রয়োজন',
			intake: 'নথি ০০ / গ্রহণ',
			formTitle: 'ব্যক্তিগত নথি',
			formSubtitle: 'একটি অসম্পূর্ণ বিবরণ, “এখনও হয়ে উঠছি” ফোল্ডারে রাখা।',
			subject: 'বিষয়',
			occupation: 'পেশা',
			location: 'অবস্থান',
			status: 'অবস্থা',
				name: 'অনিন্দ্য সিং',
				nameFirst: 'অনিন্দ্য',
				nameLast: 'সিং',
				occupationValue: 'গবেষক · ডেটা সায়েন্টিস্ট · লেখক',
				locationValue: 'দিল্লি এনসিআর, ভারত',
				statusValue: 'মাঠে / প্রান্তিক টীকায়',
			subjectFiled: 'বিষয় / নথিতে লেখা নাম',
			recordOpen: 'নথির অবস্থা: খোলা',
			evidenceKeep: 'প্রমাণের সঙ্গে রাখুন',
				department: 'অসম্পূর্ণ জ্ঞানের বিভাগ',
				scrollContinue: 'চালিয়ে যেতে স্ক্রল করুন ↓',
				stamp: 'নথি খুলুন',
				personal: 'সরকারি তথ্যকে নিজের কথা বুঝিয়ে বলতে বলি; সাধারণত সে সময় বাড়ানোর আবেদন করে।',
				signalTitle: 'মাঠকাজ / গবেষণার সংকেত',
				signalSubtitle: 'তথ্যভাণ্ডারের আগে মানুষ, স্থান ও ব্যবস্থার কথা।',
				signalMetrics: [
					{ value: '১৩', label: 'সদস্যের মাঠদল' },
					{ value: '০২', label: 'রাজ্য' },
					{ value: '০৪', label: 'জেলা প্রশাসন' }
				],
			classification: 'নথি ০১ / শ্রেণিবিভাগ',
			classificationTitle: 'নথিটির নিজস্ব মতামত আছে।',
			classificationIntro: 'একটি ছোট যন্ত্র নিজের বিষয়ে খুব নিশ্চিত। যাকে সে বর্ণনা করছে, তিনি ততটা মুগ্ধ নন।',
			classifierLabel: 'মডেলের ফল · জীবনপরিচয় নয়',
			modelSerial: 'মডেল ০৪',
			classifierDisclaimer: 'অনুমান-যন্ত্র / নিশ্চয়তা নিশ্চিত নয়',
			classifierFrames: [
				{ label: 'পেশা', value: 'অর্থনীতিবিদ?', score: '৯১.৪%' },
				{ label: 'অঞ্চল', value: 'কোথাও, সম্ভবত', score: '৬৮.২%' },
				{ label: 'সম্প্রদায়', value: 'অনুমান করবেন না', score: '৯৯.৯%' },
				{ label: 'নিশ্চয়তা', value: 'নিশ্চিতভাবেই অনিশ্চিত', score: '১০৪.০%' }
			],
			selfLabel: 'বিষয়ের বক্তব্য',
			selfDescription: 'শ্রম, পরিচয়, তথ্য এবং নীতির দৈনন্দিন ফলাফলের সঙ্গে তথ্যভিত্তিক পদ্ধতির সংলাপ ঘটাই।',
			classificationAside: 'শ্রেণিবিভাগ একটি পদ্ধতি। কাউকে জানার সঙ্গে তার এক জিনিস নয়।',
			classificationNote: '“Name Ethnicity Detector”: একটি শ্রেণিবিভাগকারী, একটি গবেষণা প্রকল্প, এবং এমন একটি রচনা—যে যন্ত্রটি কী মীমাংসা করতে পারে না তা নিয়ে।',
			route: 'নথি ০২ / পথরেখা',
			routeTitle: 'একটি পথ, সরলরেখা নয়।',
			routeIntro: 'নথিতে দেখা যায় এমন কয়েকটি স্থান ও প্রতিষ্ঠান। কোনও মানচিত্রই পুরো যাত্রার ব্যাখ্যা দিতে পারে না।',
				routeAlt: 'কলকাতা, শিব নাদার ও দাদরি, এবং দিল্লি এনসিআরের বর্তমান মাঠগবেষণাকে যুক্ত করা একটি আঁকা পথ।',
			routeProgress: 'পথের অগ্রগতি',
			routeNotesLabel: 'পথের মাঠ-নোট',
			routeMapLabel: 'পথ / ০৩টি নথি',
			notToScale: 'মাপ অনুযায়ী নয়',
				mapLabels: ['কলকাতা', 'শিব নাদার / দাদরি', 'দিল্লি এনসিআর / মাঠ এলাকা'],
			mapFoot: 'নথিভুক্ত চলাচল / তিনটি থামা',
			mapQualifier: '— সম্পূর্ণ ইতিহাস নয় —',
			waypoints: [
				{ place: 'কলকাতা', date: '২০২০ — ২০২৩', title: 'অর্থনীতিতে স্নাতক', text: 'বিধাননগর সরকারি কলেজ। প্রশ্নের প্রথম দফা; শেষ দফা নয়।' },
				{ place: 'শিব নাদার / দাদরি', date: '২০২৩ — ২০২৫', title: 'স্নাতকোত্তর + মাঠকাজ', text: 'দাদরির সাতটি গ্রামে ২১৪টি পরিবারের সমীক্ষা; সঙ্গে উপগ্রহ-চিত্র, মৌখিক ইতিহাস এবং জমির নথির রাজনীতি।' },
					{ place: 'দিল্লি এনসিআর / মাঠ এলাকা', date: 'সেপ্টেম্বর ২০২৫ — বর্তমান', title: 'গবেষণা পরামর্শক', text: 'দুটি রাজ্যে MGNREGA সম্পদ নিয়ে মাঠগবেষণা, নিয়মিত উচ্চ-ফ্রিকোয়েন্সি যাচাই এবং পুনর্ব্যবহারযোগ্য তথ্যপ্রবাহ।' }
			],
			lenses: 'নথি ০৩ / তিনটি দৃষ্টিকোণ',
			lensesTitle: 'প্রশ্নগুলি একসঙ্গেই চলে।',
			lensesIntro: 'আলাদা ঘর নয়; নথি কী রাখে, আর কী বাদ দেয় তা দেখার তিনটি উপায়।',
			lensItems: [
				{ number: '০১', title: 'শ্রম', mark: 'কাজ / মূল্য / সময়', text: 'কাজকে শুধু শ্রমশক্তি-সমীক্ষার সারি হিসেবে নয়, বেঁচে থাকা সময় ও দর-কষাকষির ক্ষমতা হিসেবে দেখি।', visual: 'বিন্দুগুলি খাতায় ঢোকে। বাদ পড়া সময় ঢোকে না।' },
				{ number: '০২', title: 'পরিচয়', mark: 'নাম / সীমানা / অন্তর্ভুক্তি', text: 'প্রতিষ্ঠানের ভিতর দিয়ে পরিচয়ের শ্রেণিগুলি চলাচল করে। তারা কাকে দৃশ্যমান করে, আর কাকে ভুল পড়ে—তা দেখি।', visual: 'গোষ্ঠীগুলি সাজে। তারপর সাজানো থাকতে রাজি হয় না।' },
				{ number: '০৩', title: 'তথ্য', mark: 'নথি / অনুপস্থিতি / প্রমাণ', text: 'তথ্য তৈরি হয়, উত্তরাধিকারেও আসে, কখনও আটকে রাখা হয়। তার ফাঁকও প্রমাণের অংশ, পাদটীকা নয়।', visual: 'একটি সারণি, কয়েকটি কালিমা, আর একগুঁয়ে প্রান্তটীকা।' }
			],
			atlasTitle: 'দীর্ঘতর নথি: Annihilation Atlas',
			atlasText: 'জমি, শ্রম, শ্রেণিবিভাগ, বিচ্ছিন্নতা, প্রতিরোধ ও স্মৃতি নিয়ে একটি জাতপাত-বিরোধী পর্যবেক্ষণশালা।',
			projectStatus: 'দীর্ঘমেয়াদি প্রকল্প / কাজ চলছে',
			atlasLink: 'প্রকল্পটি দেখুন',
			relatedLabel: 'উপ-নথি / নির্বাচিত কাজ',
				relatedText: 'মাঠের ব্যবস্থা, সরকারি নথি ও যন্ত্রনির্ভর শ্রেণিবিভাগ—বাস্তব জগতের সীমাবদ্ধতার মুখোমুখি হলে কী হয়, তার কয়েকটি প্রকল্প।',
				relatedProjects: [
					{ category: 'মাঠের ব্যবস্থা / MGNREGA', title: 'Building resilience through MGNREGA assets', detail: 'দুটি রাজ্যে ১৩ জনের মাঠদল পরিচালনা; দৈনিক উচ্চ-ফ্রিকোয়েন্সি যাচাই এবং হস্তান্তরযোগ্য তথ্যপ্রবাহ মাঠকাজ ও তথ্যের গুণমানকে শক্তিশালী করেছে।' },
					{ category: 'জলবায়ু / Google-X Collectors', title: 'জলবায়ু-সহনশীলতার পরিকল্পনা', detail: 'Shillong, Nandurbar, Chennai ও Ramanathapuram-এ চারটি জেলা প্রশাসনের সঙ্গে দুর্যোগ-প্রশমন ও বিনিয়োগ পরিকল্পনার AI-সহায়ক প্রোটোটাইপ নিয়ে কাজ।' },
					{ category: 'সরকারি নথি / পশ্চিমবঙ্গ', title: 'ভোটার তালিকা, ২০০২ + ২০২৬ SIR', detail: 'দশ-হাজারের বেশি বুথ-স্তরের PDF থেকে গবেষণা ও জন-প্রদর্শনীর জন্য বিশ্লেষণযোগ্য তথ্য তৈরির পুনরারম্ভযোগ্য পাইপলাইন।' },
					{ category: 'শ্রেণিবিভাগ / Sounding Names', title: 'নামের পেছনের অনুমান যাচাই', detail: 'ধর্ম ও জাতি/বর্ণের লেবেলে ডেটাসেটের পক্ষপাত যাচাইয়ের পুনরুৎপাদনযোগ্য সরঞ্জাম—পরিচয়ের চূড়ান্ত উত্তর হিসেবে শ্রেণিবিভাগ নয়।' }
				],
				openProject: 'মাঠ-নোট খুলুন',
			relatedLink: 'কাজের সূচি দেখুন',
			instruments: 'নথি ০৪ / যন্ত্রপাতির প্যানেল',
			instrumentsTitle: 'সরঞ্জাম নিরপেক্ষ নয়। তবু কাজে লাগে।',
			instrumentsIntro: 'প্রশ্ন করা, যাচাই, মানচিত্র আঁকা এবং কখনও তথ্যের সঙ্গে তর্ক করার কাজের সরঞ্জাম।',
				toolGroups: [
					{ label: 'বিশ্লেষণ', tools: ['Python', 'R', 'Stata', 'SPSS', 'MATLAB'] },
					{ label: 'স্থানিক / তথ্য', tools: ['QGIS', 'Gretl', 'GAMS'] },
					{ label: 'নির্মাণ', tools: ['Python', 'C++', 'JavaScript', 'Git'] },
					{ label: 'প্রকাশনা', tools: ['LaTeX', 'Excel', 'PowerPoint'] }
			],
			experienceTitle: 'অভিজ্ঞতা ও শিক্ষা',
			experienceHint: 'মাঠের নোট দেখতে একটি কার্ড খুলুন।',
			experienceIndex: 'সূচি / অভিজ্ঞতা',
			filed: 'নথিভুক্ত',
				experiences: [
					{ date: 'সেপ্টেম্বর ২০২৫ — বর্তমান', title: 'গবেষণা পরামর্শক', org: 'Inclusion Economics India Centre · Inclusion Economics at Yale University-এর সঙ্গে যুক্ত', detail: 'দুটি রাজ্যে MGNREGA সম্পদ প্রকল্পে ১৩ জনের মাঠদল পরিচালনা; দৈনিক উচ্চ-ফ্রিকোয়েন্সি যাচাই ও পুনর্ব্যবহারযোগ্য তথ্যপ্রবাহ তথ্যের গুণমান বাড়াতে সহায়তা করেছে।' },
					{ date: 'জুন ২০২৪ — আগস্ট ২০২৪', title: 'গবেষণা সহকারী', org: 'Centre for Sustainable Employment · Azim Premji University', detail: 'কর্মসংস্থান ও জীবিকা গবেষণার জন্য পরিষ্কার, বিশ্লেষণ-প্রস্তুত নির্বাচনী ও NCRB ডেটাসেট তৈরি এবং প্রাথমিক অর্থমিতিক বিশ্লেষণে সহায়তা।' },
				{ date: '২০২৩ — ২০২৫', title: 'অর্থনীতিতে স্নাতকোত্তর', org: 'Shiv Nadar Institution of Eminence', detail: 'অর্থনীতি, পদ্ধতি এবং মানুষেরা তথ্যভাণ্ডারে এলে যে অভিজ্ঞতাভিত্তিক প্রশ্নগুলি আরও কঠিন হয়—সেগুলি নিয়ে পড়াশোনা।' },
				{ date: '২০২০ — ২০২৩', title: 'অর্থনীতিতে স্নাতক (সম্মান)', org: 'Bidhannagar Government College, Kolkata', detail: 'অর্থনীতি, পরিসংখ্যান, এবং একটি পরিষ্কার সারণি ফ্রেমের বাইরে কী রেখেছে তা যাচাই করার অভ্যাস।' }
			],
			reply: 'নথি ০৫ / উত্তরপত্র',
			replyForm: 'উত্তর / ফর্ম ০৫-বি',
			keepCopy: 'এই কপিটি রাখুন',
			replyFooter: 'লেখার জন্য ধন্যবাদ',
			receivingDesk: 'CHHIPI/42 · গ্রহণকক্ষ',
			replyTitle: 'উত্তরে একটি চিঠি পেলে ভালো লাগবে।',
			replyText: 'কোনও প্রশ্ন, মিলের আগ্রহ, বা আরও খুঁটিয়ে দেখার মতো বিষয় নিয়ে লিখুন। এটি বাণিজ্যিক পরিষেবার পাতা নয়—ভাবনাটি জরুরি বলেই লিখুন।',
			email: 'ইমেল',
			linkedin: 'LinkedIn',
			github: 'GitHub',
			contactForm: 'যোগাযোগের ফর্ম',
			fieldName: 'নাম',
			fieldEmail: 'ইমেল ঠিকানা',
			fieldMessage: 'কী বিষয়ে কথা বলতে চান?',
			fieldMessageHint: 'অনুগ্রহ করে সংবেদনশীল ব্যক্তিগত তথ্য পাঠাবেন না।',
			botField: 'এই ঘরটি খালি রাখুন',
			send: 'উত্তরপত্র পাঠান',
			sending: 'পাঠানো হচ্ছে…',
			formError: 'চিঠিটি ডেস্কে পৌঁছায়নি। আবার চেষ্টা করুন, অথবা উপরের ইমেল লিঙ্কটি ব্যবহার করুন।',
			formSuccess: 'চিঠিটি নথিভুক্ত হয়েছে। ধন্যবাদ — প্রাপ্তির পাতায় যাচ্ছি…',
			pageEnd: 'বর্তমান নথির শেষ · আরও প্রমাণ আসতে পারে',
			helpHint: 'এই নথিতে ছোট্ট একটি আমলাতান্ত্রিক সাহায্যকেন্দ্র লুকিয়ে আছে।',
			dialogTitle: 'CHHIPI/42 · সাহায্যকেন্দ্র',
			close: 'সাহায্যকেন্দ্র বন্ধ করুন',
			easterLines: ['অনুরোধ পেয়েছি। ফর্মটি আগে থেকেই একটি ফর্ম ছিল।', 'শ্রেণিবিভাগ: কৌতূহলী, প্রমাণসহ।', 'অনুগ্রহ করে নম্বর নিন। নম্বরটিও পর্যালোচনাধীন।'],
			thank: 'আরও ঘুরে দেখুন'
		}
	} as const;

	let language = $state<Language>('en');
	const t = $derived(copy[language]);
	let scrollProgress = $state(0);
	let routeProgress = $state(1);
	let activeScene = $state(0);
	let classifierIndex = $state(0);
	let classifierDone = $state(false);
	let motionEnabled = $state(false);
	let cursorEnabled = $state(false);
	let helpOpen = $state(false);
	let formState = $state<FormState>('idle');
	let formError = $state('');
	let routeSection: HTMLElement | null = $state(null);
	let cursorEl: HTMLDivElement | null = $state(null);

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'name': 'Anindya Singh',
		'url': 'https://anindyasingh.com/about',
		'image': 'https://anindyasingh.com/images/anindya2.png',
		'description': 'Researcher, data scientist, and writer working at the intersection of economics, data, labour, identity, information, and social impact.',
		'jobTitle': 'Research Consultant, Data Scientist, and Writer',
		'alumniOf': [
			{ '@type': 'CollegeOrUniversity', 'name': 'Shiv Nadar Institution of Eminence' },
			{ '@type': 'CollegeOrUniversity', 'name': 'Bidhannagar Government College' }
		],
		'sameAs': ['https://linkedin.com/in/anindyakafka', 'https://github.com/anindyakafka']
	};

	async function submitContact(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		if (!form.reportValidity()) return;
		event.preventDefault();
		formState = 'submitting';
		formError = '';

		const body = new URLSearchParams();
		for (const [key, value] of new FormData(form)) body.append(key, String(value));

		try {
			const response = await fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: body.toString()
			});
			if (!response.ok) throw new Error(`Submission failed (${response.status})`);
			formState = 'success';
			form.classList.add('slip-filed');
			window.setTimeout(() => window.location.assign('/thank-you'), 900);
		} catch {
			formState = 'error';
			formError = t.formError;
		}
	}

	onMount(() => {
		const syncLanguage = () => {
			language = document.documentElement.dataset.language === 'bn' ? 'bn' : 'en';
		};
		syncLanguage();
		const languageObserver = new MutationObserver(syncLanguage);
		languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		motionEnabled = !reducedMotion.matches;
		cursorEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		const onMotionChange = (event: MediaQueryListEvent) => {
			motionEnabled = !event.matches;
			if (event.matches) {
				classifierDone = true;
				routeProgress = 1;
			} else {
				updateScroll();
			}
		};
		reducedMotion.addEventListener('change', onMotionChange);

		let classifierSteps = 0;
		let classifierTimer: number | undefined;
		if (motionEnabled) {
			classifierTimer = window.setInterval(() => {
				classifierIndex = (classifierIndex + 1) % t.classifierFrames.length;
				classifierSteps += 1;
				if (classifierSteps >= 8) {
					if (classifierTimer) window.clearInterval(classifierTimer);
					classifierDone = true;
				}
			}, 430);
		} else {
			classifierDone = true;
		}

		const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-file-scene]'));
		const sceneObserver = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) activeScene = scenes.indexOf(visible.target as HTMLElement);
			},
			{ rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.7] }
			);
			scenes.forEach((scene) => sceneObserver.observe(scene));

			const animatedCards = Array.from(document.querySelectorAll<HTMLElement>('[data-animate-card]'));
			const revealObserver = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						entry.target.classList.add('has-entered');
						observer.unobserve(entry.target);
					});
				},
				{ rootMargin: '0px 0px -7% 0px', threshold: 0.12 }
			);
			animatedCards.forEach((card) => revealObserver.observe(card));

			let raf = 0;
		const updateScroll = () => {
			if (raf) return;
			raf = window.requestAnimationFrame(() => {
				raf = 0;
				const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
				scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
				if (routeSection) {
					const start = routeSection.getBoundingClientRect().top + window.scrollY;
					const distance = Math.max(1, routeSection.offsetHeight - window.innerHeight);
					routeProgress = motionEnabled ? Math.min(1, Math.max(0, (window.scrollY - start) / distance)) : 1;
				}
			});
		};
		window.addEventListener('scroll', updateScroll, { passive: true });
		window.addEventListener('resize', updateScroll, { passive: true });
		updateScroll();

		let cursorFrame = 0;
		const moveCursor = (event: PointerEvent) => {
			if (!cursorEl || event.pointerType === 'touch') return;
			cursorEl.classList.toggle('cursor-over-text', Boolean((event.target as Element | null)?.closest('h1,h2,h3,p,a,button,label,summary')));
			if (cursorFrame) return;
			const x = event.clientX;
			const y = event.clientY;
			cursorFrame = window.requestAnimationFrame(() => {
				cursorFrame = 0;
				cursorEl?.style.setProperty('--cursor-transform', `translate3d(${x}px, ${y}px, 0)`);
			});
		};
		window.addEventListener('pointermove', moveCursor, { passive: true });

		let keyBuffer = '';
		let lastKeyTime = 0;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') helpOpen = false;
			if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target as HTMLElement | null;
			if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
			const now = Date.now();
			keyBuffer = now - lastKeyTime > 1500 ? event.key.toLowerCase() : `${keyBuffer}${event.key.toLowerCase()}`.slice(-4);
			lastKeyTime = now;
			if (keyBuffer.endsWith('help')) {
				helpOpen = true;
				keyBuffer = '';
			}
		};
		window.addEventListener('keydown', onKeyDown);

			return () => {
				languageObserver.disconnect();
				sceneObserver.disconnect();
				revealObserver.disconnect();
				reducedMotion.removeEventListener('change', onMotionChange);
			if (classifierTimer) window.clearInterval(classifierTimer);
			if (raf) window.cancelAnimationFrame(raf);
			if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
			window.removeEventListener('scroll', updateScroll);
			window.removeEventListener('resize', updateScroll);
			window.removeEventListener('pointermove', moveCursor);
			window.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<svelte:head>
	<title>About — Anindya Singh</title>
		<meta name="description" content="A case file on Anindya Singh: researcher, data scientist, and writer working with economics, labour, identity, information, and public data." />
		<meta name="author" content="Anindya Singh" />
		<link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwgknk-4.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
		<script type="application/ld+json">{JSON.stringify(personSchema)}</script>
</svelte:head>

<div class="about-file" class:motion-enabled={motionEnabled} class:cursor-enabled={cursorEnabled}>
	<a class="skip-link" href="#file-content">{t.skip}</a>

	<div class="file-progress" role="progressbar" aria-label={t.progress} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(scrollProgress * 100)}>
		<div class="file-progress__bar" style={`transform: scaleX(${scrollProgress})`}></div>
		<span>{String(Math.min(6, activeScene + 1)).padStart(2, '0')} / 06</span>
	</div>

	<div id="file-content" class="file-main">
		<section id="intake" class="scene intake" data-file-scene aria-labelledby="intake-title">
			<div class="intake__topline"><span>{t.intake}</span><span>AS / 2026</span></div>
			<div class="intake__grid">
				<div class="intake__paper">
					<div class="paper-grain" aria-hidden="true"></div>
					<div class="paper-head">
						<p class="type-label">{t.formTitle}</p>
						<span class="paper-index">001—A</span>
					</div>
					<p class="paper-subtitle">{t.formSubtitle}</p>
					<dl class="intake-fields">
						<div class="intake-field"><dt>{t.subject}</dt><dd><span class="field-copy">{t.name}</span><span class="redaction" aria-hidden="true"></span></dd></div>
						<div class="intake-field"><dt>{t.occupation}</dt><dd><span class="field-copy">{t.occupationValue}</span><span class="redaction redaction--short" aria-hidden="true"></span></dd></div>
						<div class="intake-field"><dt>{t.location}</dt><dd><span class="field-copy">{t.locationValue}</span><span class="redaction redaction--mid" aria-hidden="true"></span></dd></div>
						<div class="intake-field"><dt>{t.status}</dt><dd><span class="field-copy">{t.statusValue}</span><span class="redaction redaction--short" aria-hidden="true"></span></dd></div>
					</dl>
					<div class="intake__name-block">
						<p class="type-label">{t.subjectFiled}</p>
						<h1 id="intake-title">{t.nameFirst} <em>{t.nameLast}</em></h1>
					</div>
						<div class="intake__bottom"><span>{t.recordOpen}</span><span>{t.evidenceKeep}</span></div>
						<div class="stamp stamp--open">{t.stamp}</div>
					</div>
					<aside class="intake__signal" aria-label={t.signalTitle}>
						<div class="signal-head"><span>{t.signalTitle}</span><span>FIELD / 13</span></div>
						<svg class="signal-visual" viewBox="0 0 420 210" aria-hidden="true">
							<path class="signal-orbit" d="M26 106C78 15 143 15 210 106S342 197 394 106" />
							<path class="signal-orbit signal-orbit--second" d="M26 106C78 197 143 197 210 106S342 15 394 106" />
							<path class="signal-route" d="M34 145C91 145 104 53 163 53s74 105 130 105 63-63 93-63" />
							<circle class="signal-node" cx="34" cy="145" r="6" /><circle class="signal-node" cx="163" cy="53" r="6" /><circle class="signal-node" cx="293" cy="158" r="6" /><circle class="signal-node" cx="386" cy="95" r="6" />
							<circle class="signal-core" cx="210" cy="106" r="11" /><circle class="signal-core-ring" cx="210" cy="106" r="25" />
						</svg>
						<p class="signal-subtitle">{t.signalSubtitle}</p>
						<dl class="signal-metrics">
							{#each t.signalMetrics as metric}
								<div><dt>{metric.value}</dt><dd>{metric.label}</dd></div>
							{/each}
						</dl>
						<p class="personal-line">“{t.personal}”</p>
					</aside>
				</div>
			<div class="intake__footer"><span>{t.department}</span><span>{t.scrollContinue}</span></div>
		</section>

		<section id="classification" class="scene classification" data-file-scene aria-labelledby="classification-title">
			<header class="scene-heading">
				<p class="scene-kicker">{t.classification}</p>
				<h2 id="classification-title">{t.classificationTitle}</h2>
				<p class="scene-intro">{t.classificationIntro}</p>
			</header>
			<div class="classification__grid">
				<div class="classification__subject">
					<p class="type-label">{t.subjectFiled}</p>
					<p class="classification__name">{t.nameFirst} <em>{t.nameLast}</em></p>
					<p class="classification__self-label">{t.selfLabel}</p>
					<p class="self-description" class:typed-in={classifierDone}>{t.selfDescription}</p>
					<p class="classification__aside">{t.classificationAside}</p>
				</div>
					<div class="classifier-card" aria-live="polite" aria-atomic="true" data-animate-card>
					<div class="classifier-card__head"><span class="signal-dot" aria-hidden="true"></span><span>{t.classifierLabel}</span><span class="classifier-card__serial">{t.modelSerial}</span></div>
					<div class="classifier-card__body">
						{#each t.classifierFrames as frame, index}
							<div class="classifier-row" class:struck={classifierDone || index !== classifierIndex}>
								<span>{frame.label}</span><strong>{frame.value}</strong><b>{frame.score}</b>
							</div>
						{/each}
					</div>
					<p class="classifier-note">{t.classifierDisclaimer}</p>
				</div>
			</div>
			<div class="classification__footnote"><span>↳</span><p>{t.classificationNote}</p></div>
		</section>

		<section id="route" class="scene route-section" data-file-scene aria-labelledby="route-title" bind:this={routeSection}>
			<header class="scene-heading route-heading">
				<p class="scene-kicker">{t.route}</p>
				<h2 id="route-title">{t.routeTitle}</h2>
				<p class="scene-intro">{t.routeIntro}</p>
			</header>
			<div class="route-sticky">
				<div class="route-map">
					<div class="map-stamp" aria-hidden="true">FIELD<br />COPY</div>
					<div class="map-meta"><span>{t.routeMapLabel}</span><span>{t.notToScale}</span></div>
					<svg viewBox="0 0 560 400" role="img" aria-label={t.routeAlt} class="route-svg">
						<path class="map-contour" d="M62 76c76-48 145-14 194 2s112-14 183 21M31 140c72-21 123 10 185 21s137-12 235 14M51 235c83-37 153-18 217 8s114-4 171 17M108 325c72-26 128-10 188 5s102-9 149-34" />
						<path class="route-track" d="M110 300 C145 260, 170 218, 236 198 S318 154, 348 112 S415 88, 453 66" pathLength="1" style={`stroke-dashoffset:${1 - routeProgress}`} />
						<circle class="route-node" cx="110" cy="300" r="8" /><circle class="route-node" cx="348" cy="112" r="8" /><circle class="route-node" cx="453" cy="66" r="8" />
						<text x="72" y="338">{t.mapLabels[0]}</text><text x="286" y="91">{t.mapLabels[1]}</text><text x="378" y="42">{t.mapLabels[2]}</text>
						<path class="map-gridline" d="M24 366H530M24 344H530M24 22V370M68 22V370M112 22V370M156 22V370M200 22V370M244 22V370M288 22V370M332 22V370M376 22V370M420 22V370M464 22V370M508 22V370" />
					</svg>
					<div class="map-coordinates"><span>{t.mapFoot}</span><span>{t.mapQualifier}</span></div>
				</div>
				<div class="route-notes" aria-label={t.routeNotesLabel}>
					{#each t.waypoints as point, index}
							<article class="field-note" data-animate-card style={`--card-order:${index}`} class:current={routeProgress >= index / t.waypoints.length && (index === t.waypoints.length - 1 || routeProgress < (index + 1) / t.waypoints.length)}>
							<p class="field-note__date">{point.date}<span> / 0{index + 1}</span></p>
							<h3>{point.place}</h3>
							<p class="field-note__title">{point.title}</p>
							<p class="field-note__text">{point.text}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section id="lenses" class="scene lenses" data-file-scene aria-labelledby="lenses-title">
			<header class="scene-heading">
				<p class="scene-kicker">{t.lenses}</p>
				<h2 id="lenses-title">{t.lensesTitle}</h2>
				<p class="scene-intro">{t.lensesIntro}</p>
			</header>
			<div class="lens-grid">
				{#each t.lensItems as lens, index}
						<article class="lens-card" data-animate-card style={`--lens-index:${index};--card-order:${index}`}>
						<div class={`lens-visual lens-visual--${index + 1}`} aria-hidden="true">
							{#if index === 0}
								<div class="ledger-lines"></div><div class="ledger-dots">{#each Array(18) as _, dot}<i style={`--dot:${dot}`}></i>{/each}</div><div class="ledger-bars"><i></i><i></i><i></i><i></i></div>
							{:else if index === 1}
								<div class="identity-orbit"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><b>?</b></div><span class="orbit-caption">SORT → UNSORT</span>
							{:else}
								<div class="table-visual"><span>NAME</span><span>CLASS</span><span>STATUS</span><i></i><i></i><i></i><b></b><b></b></div><span class="redaction-line"></span>
							{/if}
						</div>
						<div class="lens-card__body"><p class="lens-number">{lens.number} / {lens.mark}</p><h3>{lens.title}</h3><p>{lens.text}</p><p class="lens-caption">{lens.visual}</p></div>
					</article>
				{/each}
			</div>
				<aside class="atlas-callout" data-animate-card><div><p class="type-label">{t.projectStatus}</p><h3>{t.atlasTitle}</h3><p>{t.atlasText}</p></div><a href="/annihilation-atlas">{t.atlasLink}<span aria-hidden="true"> ↗</span></a></aside>
				<div class="related-files">
					<div class="related-files__intro"><p class="type-label">{t.relatedLabel}</p><p>{t.relatedText}</p></div>
					<div class="related-projects">
						{#each t.relatedProjects as project, index}
							<details class="project-card" data-animate-card style={`--card-order:${index}`}>
								<summary>
									<span class="project-card__serial">0{index + 1}</span>
									<span class="project-card__category">{project.category}</span>
									<h3>{project.title}</h3>
									<span class="project-card__toggle">{t.openProject}<b aria-hidden="true">+</b></span>
								</summary>
								<div class="project-card__detail"><p>{project.detail}</p></div>
							</details>
						{/each}
					</div>
					<a class="related-files__link" href="/work">{t.relatedLink}<span aria-hidden="true"> ↗</span></a>
				</div>
		</section>

		<section id="instruments" class="scene instruments" data-file-scene aria-labelledby="instruments-title">
			<header class="scene-heading">
				<p class="scene-kicker">{t.instruments}</p>
				<h2 id="instruments-title">{t.instrumentsTitle}</h2>
				<p class="scene-intro">{t.instrumentsIntro}</p>
			</header>
			<div class="instrument-row">
				{#each t.toolGroups as group, index}
						<div class="instrument" data-animate-card style={`--instrument-index:${index};--card-order:${index}`}>
						<div class="instrument__dial" aria-hidden="true"><span class="dial-mark">{String(index + 1).padStart(2, '0')}</span><i></i><b></b></div>
						<p class="type-label">{group.label}</p>
						<ul>{#each group.tools as tool}<li>{tool}</li>{/each}</ul>
					</div>
				{/each}
			</div>
			<div class="experience-head"><div><p class="type-label">{t.experienceIndex}</p><h3>{t.experienceTitle}</h3></div><p>{t.experienceHint}</p></div>
			<div class="experience-index">
				{#each t.experiences as experience, index}
						<details class="index-card" data-animate-card style={`--card-order:${index}`} open={index === 0}>
						<summary>
							<span class="index-card__serial">0{index + 1}</span>
							<span class="index-card__main"><span class="index-card__date">{experience.date}</span><strong>{experience.title}</strong><span>{experience.org}</span></span>
							<span class="index-card__toggle" aria-hidden="true">+</span>
						</summary>
						<div class="index-card__detail"><p>{experience.detail}</p><span>{t.filed} / {String(index + 1).padStart(2, '0')}</span></div>
					</details>
				{/each}
			</div>
		</section>

		<section id="reply" class="scene reply" data-file-scene aria-labelledby="reply-title">
			<header class="scene-heading">
				<p class="scene-kicker">{t.reply}</p>
				<h2 id="reply-title">{t.replyTitle}</h2>
				<p class="scene-intro">{t.replyText}</p>
			</header>
				<div class="reply-slip" data-animate-card class:slip-filed={formState === 'success'}>
				<div class="slip-perforation" aria-hidden="true"></div>
				<div class="reply-slip__head"><span>{t.replyForm}</span><span>{t.keepCopy}</span></div>
				<div class="contact-links" aria-label="Contact and profile links">
					<a href="mailto:anindya2232@gmail.com"><span>{t.email}</span><b>anindya2232@gmail.com</b><span aria-hidden="true">↗</span></a>
					<a href="https://linkedin.com/in/anindyakafka" target="_blank" rel="noreferrer noopener"><span>{t.linkedin}</span><b>linkedin.com/in/anindyakafka</b><span aria-hidden="true">↗</span></a>
					<a href="https://github.com/anindyakafka" target="_blank" rel="noreferrer noopener"><span>{t.github}</span><b>github.com/anindyakafka</b><span aria-hidden="true">↗</span></a>
				</div>
				<form class="contact-form" name="contact" method="POST" action="/thank-you" data-netlify="true" data-netlify-honeypot="bot-field" onsubmit={submitContact} aria-busy={formState === 'submitting'}>
					<input type="hidden" name="form-name" value="contact" />
					<div class="form-trap" aria-hidden="true"><label>{t.botField}<input name="bot-field" tabindex="-1" autocomplete="off" /></label></div>
					<fieldset disabled={formState === 'submitting' || formState === 'success'}>
						<legend>{t.contactForm}</legend>
						<div class="form-row">
							<label><span>{t.fieldName}</span><input name="name" autocomplete="name" required /></label>
							<label><span>{t.fieldEmail}</span><input name="email" type="email" autocomplete="email" required /></label>
						</div>
						<label><span>{t.fieldMessage}</span><textarea name="message" rows="5" required aria-describedby="message-hint"></textarea><small id="message-hint">{t.fieldMessageHint}</small></label>
						<button class="send-button" type="submit" disabled={formState === 'submitting' || formState === 'success'}>{formState === 'submitting' ? t.sending : t.send}<span aria-hidden="true"> →</span></button>
					</fieldset>
					{#if formState === 'error'}<p class="form-message form-message--error" role="alert">{formError}</p>{/if}
					{#if formState === 'success'}<p class="form-message form-message--success" role="status" aria-live="polite">{t.formSuccess}</p>{/if}
				</form>
				<div class="reply-slip__foot"><span>{t.replyFooter}</span><span>{t.receivingDesk}</span></div>
			</div>
			<div class="reply-end"><p>{t.helpHint}</p><span>{t.pageEnd}</span></div>
		</section>
	</div>

	{#if language === 'bn'}<p class="translation-review" role="note">{t.draft}</p>{/if}
	{#if helpOpen}
		<div class="help-terminal" role="dialog" aria-labelledby="help-title" aria-modal="false">
			<div class="help-terminal__head"><h2 id="help-title">{t.dialogTitle}</h2><button type="button" aria-label={t.close} onclick={() => (helpOpen = false)}>×</button></div>
			{#each t.easterLines as line, index}<p><span>0{index + 1} ›</span> {line}</p>{/each}
		</div>
	{/if}
	<div class="custom-cursor" bind:this={cursorEl} aria-hidden="true"><i></i></div>
</div>

<style>
	.about-file {
		--ink: #1a1a2e;
		--ink-soft: #28283d;
		--paper: #f0eadb;
		--paper-bright: #f7f2e6;
		--paper-shadow: #ded5c1;
		--stamp: #a33e36;
		--ochre: #9e7c3e;
		--rule: rgba(26, 26, 46, .18);
		--body-ink: #29283a;
		--muted-ink: #686578;
			position: relative;
			z-index: 1;
			color: var(--body-ink);
			font-family: var(--font-sans);
			background: var(--paper-bright);
			overflow: clip;
		}
		:global(body:has(.about-file)) { background-attachment: scroll; }
		:global(html:not([data-language='bn']) body:has(.about-file) .language-toggle) { font-family: var(--font-sans); }
		:global(body:has(.about-file))::before { animation: none; }
		:global(body:has(.about-file))::after { animation: none; filter: none; }
		.about-file :global(a) { color: inherit; }
		.about-file :global(a:focus-visible), .about-file button:focus-visible, .about-file summary:focus-visible, .about-file input:focus-visible, .about-file textarea:focus-visible { outline: 3px solid var(--stamp); outline-offset: 4px; }
		.file-main { max-width: 100%; }
		.scene { position: relative; padding: clamp(4.5rem, 9vw, 8.5rem) max(1.2rem, calc((100vw - 72rem) / 2)); }
		.scene:not(.intake) { content-visibility: auto; contain-intrinsic-size: auto 900px; }
		.scene.classification { contain-intrinsic-size: auto 863px; }
		.scene.route-section { contain-intrinsic-size: auto 1438px; }
		.scene.lenses { contain-intrinsic-size: auto 1382px; }
		.scene.instruments { contain-intrinsic-size: auto 1259px; }
		.scene.reply { contain-intrinsic-size: auto 1035px; }
		.skip-link { position: absolute; z-index: 200; top: .5rem; left: .5rem; transform: translateY(-180%); background: var(--paper); color: var(--ink); padding: .6rem 1rem; border: 2px solid var(--stamp); font: .78rem var(--font-mono); }
	.skip-link:focus { transform: translateY(0); }
	.file-progress { position: fixed; z-index: 150; right: max(1rem, calc((100vw - 90rem) / 2)); top: 50%; display: grid; grid-template-columns: 2px auto; gap: .65rem; align-items: center; color: var(--paper); font: .62rem var(--font-mono); writing-mode: vertical-rl; letter-spacing: .12em; }
	.file-progress::before { content: ''; height: 6rem; grid-column: 1; grid-row: 1; background: rgba(247, 242, 230, .24); }
	.file-progress__bar { width: 2px; height: 6rem; background: var(--stamp); grid-column: 1; grid-row: 1; transform-origin: top; }
	.file-progress span { grid-column: 2; grid-row: 1; }
	.intake { min-height: calc(100svh - 64px); padding-block: 2.2rem 1.4rem; color: var(--paper); background: var(--ink); isolation: isolate; display: flex; flex-direction: column; justify-content: center; }
	.intake::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: .14; background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.04) 4px), radial-gradient(ellipse at 12% 18%, rgba(255,255,255,.12), transparent 45%); pointer-events: none; }
	.intake__topline, .intake__footer { display: flex; justify-content: space-between; gap: 1rem; width: min(100%, 72rem); margin-inline: auto; font: .65rem var(--font-mono); letter-spacing: .14em; color: rgba(240,234,219,.68); }
	.intake__topline { margin-bottom: clamp(1.2rem, 3vw, 2rem); }
	.intake__footer { margin-top: clamp(1.2rem, 2.8vw, 2rem); }
	.intake__grid { width: min(100%, 72rem); margin-inline: auto; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(15rem, .62fr); gap: clamp(1.2rem, 4vw, 3.5rem); align-items: center; }
	.intake__paper { min-height: 31rem; position: relative; overflow: hidden; isolation: isolate; color: var(--ink); background: var(--paper); padding: clamp(1.3rem, 4vw, 3.1rem); box-shadow: 12px 14px 0 rgba(0,0,0,.15), 0 30px 65px rgba(0,0,0,.18); transform: rotate(-.35deg); }
	.paper-grain { position: absolute; z-index: -1; inset: 0; opacity: .25; pointer-events: none; background-image: repeating-linear-gradient(90deg, transparent 0 7px, rgba(70,50,30,.025) 8px), radial-gradient(circle at 80% 20%, rgba(125,95,42,.12), transparent 46%); }
	.paper-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: .8rem; border-bottom: 1px solid var(--rule); }
	.type-label { margin: 0; color: var(--muted-ink); font: .62rem/1.4 var(--font-mono); letter-spacing: .13em; text-transform: uppercase; }
			.paper-index { margin-right: clamp(7rem, 9vw, 8rem); color: var(--stamp); font: .64rem var(--font-mono); }
	.paper-subtitle { max-width: none; margin: .8rem 0 1.5rem; color: var(--muted-ink); font: italic 1rem/1.45 var(--font-serif); }
	.intake-fields { display: grid; gap: .63rem; }
	.intake-field { display: grid; grid-template-columns: 8rem minmax(0,1fr); gap: .8rem; align-items: center; border-bottom: 1px dotted rgba(26,26,46,.23); padding-bottom: .45rem; }
	.intake-field dt { color: var(--muted-ink); font: .62rem var(--font-mono); letter-spacing: .1em; }
	.intake-field dd { position: relative; min-height: 1.3rem; margin: 0; font: .85rem var(--font-mono); }
	.field-copy { display: inline-block; }
	.redaction { position: absolute; inset: .05rem auto .05rem 0; width: 100%; background: var(--ink); transform: scaleX(0); transform-origin: right; }
	.motion-enabled .redaction { transform: scaleX(1); animation: peel 700ms cubic-bezier(.7,0,.2,1) forwards; animation-delay: 600ms; }
	.motion-enabled .redaction--short { width: 57%; animation-delay: 900ms; }
	.motion-enabled .redaction--mid { width: 76%; animation-delay: 750ms; }
	.intake__name-block { margin-top: clamp(1.6rem, 4vw, 3rem); padding-top: 1rem; border-top: 1px solid var(--rule); }
	.intake__name-block h1 { margin: .25rem 0 0; color: var(--ink); font: 500 clamp(3.3rem, 8.4vw, 7rem)/.91 var(--font-serif); letter-spacing: -.065em; }
	.intake__name-block h1 em, .classification__name em { color: var(--stamp); font-weight: 400; }
	.intake__bottom { display: flex; justify-content: space-between; gap: .75rem; margin-top: 1.3rem; color: var(--muted-ink); font: .54rem var(--font-mono); letter-spacing: .08em; }
	.stamp { position: absolute; padding: .48rem .8rem; border: 2px solid var(--stamp); color: var(--stamp); font: 700 .72rem var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
	.stamp--open { top: 1.4rem; right: 1.35rem; transform: rotate(8deg); }
		.motion-enabled .stamp--open { animation: stamp-in 480ms cubic-bezier(.16,1,.3,1) 1s both; }
		.personal-line { max-width: 30ch; margin: 1.3rem 0 0; color: var(--paper); font: italic clamp(1rem,1.7vw,1.25rem)/1.4 var(--font-serif); }
	.scene-heading { max-width: 57rem; margin: 0 auto clamp(2rem, 5vw, 3.4rem); }
	.scene-kicker { margin: 0 0 .8rem; color: var(--stamp); font: .68rem var(--font-mono); letter-spacing: .15em; text-transform: uppercase; }
	.scene-heading h2 { margin: 0; color: var(--ink); font: 500 clamp(2.25rem, 5.8vw, 5rem)/.98 var(--font-serif); letter-spacing: -.05em; }
	.scene-intro { max-width: 48ch; margin: 1.1rem 0 0; color: var(--muted-ink); font-size: clamp(.97rem, 1.25vw, 1.13rem); line-height: 1.65; }
	.classification { background: var(--paper-bright); }
	.classification__grid { max-width: 72rem; margin: auto; display: grid; grid-template-columns: .92fr 1.08fr; gap: clamp(2rem, 7vw, 6rem); align-items: center; }
	.classification__subject { padding: clamp(1rem, 3vw, 2rem) 0; }
	.classification__name { margin: .5rem 0 2rem; color: var(--ink); font: 500 clamp(2.8rem,6.5vw,5.5rem)/.95 var(--font-serif); letter-spacing: -.06em; }
	.classification__self-label { margin: 0 0 .45rem; color: var(--stamp); font: .64rem var(--font-mono); letter-spacing: .13em; }
	.self-description { max-width: 40ch; margin: 0; color: var(--ink); font: clamp(1.35rem, 2.4vw, 2rem)/1.28 var(--font-serif); }
	.motion-enabled .self-description:not(.typed-in) { animation: ink-write 850ms steps(34, end) 250ms both; }
	.classification__aside { max-width: 35ch; margin: 1.5rem 0 0; color: var(--muted-ink); font: italic 1rem/1.5 var(--font-serif); }
	.classifier-card { position: relative; border: 1px solid var(--rule); background: #e8e0ce; padding: clamp(1rem,2.5vw,1.65rem); box-shadow: 7px 8px 0 rgba(26,26,46,.08); transform: rotate(.65deg); }
	.classifier-card__head { display: flex; align-items: center; gap: .6rem; padding-bottom: .8rem; border-bottom: 1px solid var(--rule); color: var(--muted-ink); font: .59rem var(--font-mono); letter-spacing: .1em; }
	.signal-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--stamp); box-shadow: 0 0 0 3px rgba(163,62,54,.13); }
	.classifier-card__serial { margin-left: auto; color: var(--stamp); }
	.classifier-card__body { display: grid; gap: .25rem; padding-block: .8rem; }
	.classifier-row { position: relative; display: grid; grid-template-columns: .8fr 1.4fr auto; gap: .5rem; align-items: center; min-height: 2.7rem; padding: .4rem .2rem; color: var(--ink); font: .66rem var(--font-mono); }
	.classifier-row > span { color: var(--muted-ink); font-size: .56rem; letter-spacing: .06em; }
	.classifier-row strong { font-weight: 500; }
	.classifier-row b { color: var(--stamp); font-weight: 500; }
	.classifier-row.struck::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--stamp); transform: scaleX(1); transform-origin: left; }
	.classifier-note { margin: 0; padding-top: .7rem; border-top: 1px solid var(--rule); color: var(--muted-ink); font: .53rem var(--font-mono); letter-spacing: .08em; }
	.classification__footnote { max-width: 72rem; margin: 3rem auto 0; display: flex; gap: .9rem; align-items: flex-start; color: var(--muted-ink); font: italic 1.05rem/1.5 var(--font-serif); }
	.classification__footnote span { color: var(--stamp); font: 1.25rem var(--font-mono); }
	.classification__footnote p { max-width: 43ch; margin: 0; }
	.route-section { min-height: 190svh; padding-top: clamp(4rem,8vw,7rem); padding-bottom: 2rem; background: #e8e0ce; }
	.route-heading { margin-bottom: 1.3rem; }
	.route-sticky { position: sticky; top: 70px; max-width: 72rem; min-height: calc(100svh - 72px); margin: auto; display: grid; grid-template-columns: 1.12fr .88fr; gap: clamp(1.5rem,5vw,4rem); align-items: center; }
	.route-map { position: relative; min-height: 23rem; border: 1px solid rgba(26,26,46,.23); background-color: #e2d9c5; background-image: radial-gradient(circle at 18% 20%, rgba(255,255,255,.45), transparent 39%), repeating-linear-gradient(0deg, transparent 0 27px, rgba(26,26,46,.035) 28px); padding: 2.8rem 1rem 2rem; overflow: hidden; }
	.map-stamp { position: absolute; z-index: 1; top: 1rem; right: 1rem; padding: .36rem .5rem; border: 1px solid rgba(163,62,54,.65); color: var(--stamp); font: .6rem/.95 var(--font-mono); letter-spacing: .1em; transform: rotate(7deg); }
	.map-meta,.map-coordinates { position: absolute; left: 1rem; right: 1rem; display: flex; justify-content: space-between; gap: .7rem; color: var(--muted-ink); font: .51rem var(--font-mono); letter-spacing: .08em; }
	.map-meta { top: 1rem; }.map-coordinates { bottom: .8rem; font-size: .47rem; }
	.route-svg { width: 100%; height: auto; max-height: 25rem; overflow: visible; }
	.route-svg text { fill: var(--ink); font: 9px var(--font-mono); letter-spacing: .08em; }
	.map-contour { fill: none; stroke: rgba(26,26,46,.13); stroke-width: 1.2; }
	.map-gridline { fill: none; stroke: rgba(26,26,46,.08); stroke-width: .6; }
	.route-track { fill: none; stroke: var(--stamp); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; transition: stroke-dashoffset 80ms linear; }
	.route-node { fill: var(--paper-bright); stroke: var(--stamp); stroke-width: 3; }
	.route-notes { display: grid; gap: .8rem; }
	.field-note { position: relative; padding: 1rem 1.1rem 1rem 1.3rem; border: 1px solid rgba(26,26,46,.16); border-left: 3px solid transparent; color: var(--muted-ink); background: rgba(247,242,230,.62); transition: border-color 450ms, transform 450ms cubic-bezier(.22,1,.36,1), background-color 450ms; }
	.field-note.current { border-left-color: var(--stamp); background: var(--paper-bright); transform: translateX(-.35rem); }
	.field-note__date { margin: 0 0 .4rem; color: var(--stamp); font: .59rem var(--font-mono); letter-spacing: .08em; }
	.field-note__date span { color: var(--muted-ink); }
	.field-note h3 { margin: 0; color: var(--ink); font: 500 1.5rem/1.1 var(--font-serif); }
	.field-note__title { margin: .35rem 0; color: var(--ink); font-size: .83rem; font-weight: 600; }
	.field-note__text { max-width: 42ch; margin: 0; font-size: .79rem; line-height: 1.55; }
	.lenses { background: var(--paper-bright); }
	.lens-grid { max-width: 72rem; margin: auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 1rem; }
	.lens-card { min-width: 0; background: var(--paper); border: 1px solid rgba(26,26,46,.13); transition: transform 600ms cubic-bezier(.22,1,.36,1), box-shadow 600ms; }
	.lens-card:hover,.lens-card:focus-within { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(26,26,46,.1); }
	.lens-visual { position: relative; height: clamp(10rem,17vw,14rem); overflow: hidden; background: #ddd3bd; border-bottom: 1px solid var(--rule); }
	.ledger-lines { position: absolute; inset: 15% 10%; background: repeating-linear-gradient(0deg, transparent 0 22px, rgba(26,26,46,.13) 23px 24px); }
	.ledger-dots { position: absolute; inset: 18% 13%; display: grid; grid-template-columns: repeat(6,1fr); grid-template-rows: repeat(3,1fr); align-items: center; justify-items: center; }
	.ledger-dots i { width: 5px; height: 5px; border-radius: 50%; background: var(--stamp); opacity: .82; transform: translateY(2px); transition: transform 650ms cubic-bezier(.22,1,.36,1); }
	.lens-card:hover .ledger-dots i:nth-child(odd) { transform: translateY(-4px) translateX(4px); }
	.lens-card:hover .ledger-dots i:nth-child(even) { transform: translateY(4px) translateX(-4px); }
	.ledger-bars { position: absolute; inset: 28% 22% 16% auto; width: 38%; display: flex; gap: 7%; align-items: end; }
	.ledger-bars i { display: block; width: 18%; height: 75%; border: 1px solid var(--ink); background: rgba(26,26,46,.13); transform: scaleY(.27); transform-origin: bottom; transition: transform 600ms cubic-bezier(.22,1,.36,1); }
	.ledger-bars i:nth-child(2) { transform: scaleY(.64); }.ledger-bars i:nth-child(3) { transform: scaleY(.45); }.ledger-bars i:nth-child(4) { transform: scaleY(.92); }
	.lens-card:hover .ledger-bars i:nth-child(1) { transform: scaleY(.48); }.lens-card:hover .ledger-bars i:nth-child(2) { transform: scaleY(.86); }.lens-card:hover .ledger-bars i:nth-child(3) { transform: scaleY(.7); }
	.identity-orbit { position: absolute; width: 9rem; height: 9rem; top: 50%; left: 50%; transform: translate(-50%,-50%); border: 1px dashed rgba(26,26,46,.35); border-radius: 50%; }
	.identity-orbit::before,.identity-orbit::after { content: ''; position: absolute; inset: 1.5rem; border: 1px solid rgba(26,26,46,.2); border-radius: 50%; }
	.identity-orbit::after { inset: 3rem; border-style: dashed; }
	.identity-orbit i { position: absolute; width: 8px; height: 8px; border: 1px solid var(--stamp); border-radius: 50%; background: var(--paper); transition: transform 700ms cubic-bezier(.22,1,.36,1); }
	.identity-orbit i:nth-child(1) { top: 8%; left: 47%; }.identity-orbit i:nth-child(2) { top: 22%; right: 12%; }.identity-orbit i:nth-child(3) { top: 48%; right: 3%; }.identity-orbit i:nth-child(4) { bottom: 14%; right: 17%; }.identity-orbit i:nth-child(5) { bottom: 5%; left: 47%; }.identity-orbit i:nth-child(6) { bottom: 22%; left: 10%; }.identity-orbit i:nth-child(7) { top: 38%; left: 5%; }.identity-orbit i:nth-child(8) { top: 12%; left: 18%; }
	.lens-card:hover .identity-orbit i:nth-child(odd) { transform: translate(11px,-6px); }.lens-card:hover .identity-orbit i:nth-child(even) { transform: translate(-8px,9px); }
	.identity-orbit b { position: absolute; top: 50%; left: 50%; color: var(--stamp); font: 1.8rem var(--font-serif); transform: translate(-50%,-55%); }
	.orbit-caption { position: absolute; bottom: -1.5rem; left: 50%; width: max-content; color: var(--muted-ink); font: .48rem var(--font-mono); letter-spacing: .12em; transform: translateX(-50%); }
	.table-visual { position: absolute; inset: 22% 11%; display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: 1.3rem repeat(3,1fr); gap: 1px; padding: .5rem; border: 1px solid rgba(26,26,46,.3); background: rgba(247,242,230,.45); }
	.table-visual span { color: var(--muted-ink); font: .46rem var(--font-mono); letter-spacing: .04em; }
	.table-visual i,.table-visual b { border-top: 1px solid rgba(26,26,46,.16); }
	.table-visual b { background: linear-gradient(90deg,var(--ink) 80%,transparent 80%); opacity: .86; }
	.redaction-line { position: absolute; width: 73%; height: .45rem; top: 55%; left: 13%; background: var(--stamp); opacity: .85; transform: rotate(-3deg); transition: width 550ms cubic-bezier(.22,1,.36,1); }
	.lens-card:hover .redaction-line { width: 39%; }
	.lens-card__body { padding: 1.2rem; }
	.lens-number { margin: 0 0 .7rem; color: var(--stamp); font: .54rem var(--font-mono); letter-spacing: .12em; }
	.lens-card__body h3 { margin: 0 0 .65rem; color: var(--ink); font: 500 clamp(1.7rem,3vw,2.4rem)/1 var(--font-serif); }
	.lens-card__body > p:not(.lens-number) { margin: 0; color: var(--muted-ink); font-size: .88rem; line-height: 1.6; }
	.lens-caption { padding-top: 1rem; color: var(--stamp) !important; font: italic .82rem/1.45 var(--font-serif) !important; }
	.atlas-callout { max-width: 72rem; margin: clamp(2rem,5vw,4rem) auto 0; padding: 1.3rem clamp(1.1rem,3vw,2rem); display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
	.atlas-callout h3 { margin: .35rem 0; color: var(--ink); font: 500 clamp(1.35rem,2.5vw,2rem) var(--font-serif); }
	.atlas-callout p:not(.type-label) { max-width: 52ch; margin: 0; color: var(--muted-ink); font-size: .85rem; line-height: 1.5; }
	.atlas-callout a { flex: 0 0 auto; padding: .65rem .9rem; border: 1px solid var(--ink); color: var(--ink); font: .71rem var(--font-mono); text-decoration: none; transition: background-color 250ms,color 250ms; }
	.atlas-callout a:hover { color: var(--paper); background: var(--ink); }
	.related-files { max-width: 72rem; margin: 1.4rem auto 0; padding: 1.1rem 0; display: grid; grid-template-columns: minmax(12rem,.8fr) minmax(0,1.7fr) auto; gap: 1.2rem; align-items: center; border-bottom: 1px solid var(--rule); }
	.related-files__intro > p:last-child { max-width: 32ch; margin: .4rem 0 0; color: var(--muted-ink); font: .83rem/1.5 var(--font-serif); }
	.instruments { color: var(--paper); background: var(--ink); }
	.instruments .scene-kicker { color: #d17968; }.instruments .scene-heading h2 { color: var(--paper); }.instruments .scene-intro { color: rgba(240,234,219,.65); }
	.instrument-row { max-width: 72rem; margin: 0 auto clamp(4rem,8vw,6.5rem); display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); border-top: 1px solid rgba(240,234,219,.23); border-bottom: 1px solid rgba(240,234,219,.23); }
	.instrument { position: relative; min-height: 13rem; padding: 1.3rem 1.2rem; border-right: 1px solid rgba(240,234,219,.18); }
	.instrument:last-child { border-right: 0; }
	.instrument__dial { position: relative; width: 4.2rem; height: 4.2rem; margin-bottom: 1rem; border: 1px solid rgba(240,234,219,.52); border-radius: 50%; background: repeating-conic-gradient(from -130deg, rgba(240,234,219,.4) 0 1deg, transparent 1deg 16deg); }
	.instrument__dial::after { content: ''; position: absolute; inset: .43rem; border: 1px solid rgba(240,234,219,.21); border-radius: 50%; }
	.instrument__dial i { position: absolute; z-index: 1; left: 50%; top: 50%; width: 1px; height: 1.3rem; background: #d17968; transform: translate(-50%,-100%) rotate(calc(-40deg + var(--instrument-index) * 28deg)); transform-origin: bottom; }
	.instrument__dial b { position: absolute; z-index: 2; top: 50%; left: 50%; width: .35rem; height: .35rem; border-radius: 50%; background: var(--paper); transform: translate(-50%,-50%); }
	.dial-mark { position: absolute; inset: auto 0 .95rem; text-align: center; color: rgba(240,234,219,.65); font: .5rem var(--font-mono); }
	.instrument .type-label { color: rgba(240,234,219,.55); }
	.instrument ul { display: flex; flex-wrap: wrap; gap: .34rem; margin: .65rem 0 0; padding: 0; list-style: none; }
	.instrument li { padding: .28rem .42rem; border: 1px solid rgba(240,234,219,.23); color: var(--paper); font: .65rem var(--font-mono); }
	.experience-head { max-width: 72rem; margin: 0 auto 1.2rem; display: flex; justify-content: space-between; align-items: end; gap: 1.5rem; }
	.experience-head h3 { margin: .4rem 0 0; color: var(--paper); font: 500 clamp(1.8rem,3.5vw,2.8rem)/1 var(--font-serif); }
	.experience-head > p { margin: 0; color: rgba(240,234,219,.58); font: .61rem var(--font-mono); }
	.experience-index { max-width: 72rem; margin: auto; border-top: 1px solid rgba(240,234,219,.29); }
	.index-card { position: relative; border-bottom: 1px solid rgba(240,234,219,.24); background: transparent; }
	.index-card summary { display: grid; grid-template-columns: 3.5rem 1fr 2rem; gap: 1rem; align-items: center; padding: 1.1rem .3rem; cursor: pointer; list-style: none; }
	.index-card summary::-webkit-details-marker { display: none; }
	.index-card__serial { align-self: start; color: #d17968; font: .7rem var(--font-mono); }
	.index-card__main { display: grid; gap: .2rem; }
	.index-card__date { color: rgba(240,234,219,.54); font: .56rem var(--font-mono); letter-spacing: .08em; text-transform: uppercase; }
	.index-card__main strong { color: var(--paper); font: 500 clamp(1.2rem,2vw,1.55rem) var(--font-serif); }
	.index-card__main > span:last-child { color: rgba(240,234,219,.66); font-size: .79rem; }
	.index-card__toggle { color: #d17968; font: 1.4rem var(--font-mono); transition: transform 350ms; }
	.index-card[open] .index-card__toggle { transform: rotate(45deg); }
	.index-card__detail { padding: 0 3rem 1.3rem 4.5rem; display: flex; justify-content: space-between; align-items: end; gap: 1rem; animation: card-reveal 360ms cubic-bezier(.22,1,.36,1) both; }
	.index-card__detail p { max-width: 50ch; margin: 0; color: rgba(240,234,219,.73); font: .9rem/1.6 var(--font-serif); }
	.index-card__detail span { color: rgba(240,234,219,.42); font: .54rem var(--font-mono); white-space: nowrap; }
	.reply { background: #e8e0ce; padding-bottom: 4.5rem; }
	.reply .scene-heading h2 { max-width: 15ch; }
	.reply-slip { position: relative; max-width: 61rem; margin: auto; padding: clamp(1.4rem,4vw,3rem); border: 1px solid rgba(26,26,46,.2); background: var(--paper); box-shadow: 9px 11px 0 rgba(26,26,46,.08); transition: transform 650ms cubic-bezier(.22,1,.36,1), clip-path 650ms; }
	.reply-slip::before,.reply-slip::after { content: ''; position: absolute; top: 0; bottom: 0; width: .8rem; background: radial-gradient(circle at center, #e8e0ce 0 3px, transparent 3.4px) center / 10px 12px repeat-y; }
	.reply-slip::before { left: -.4rem; }.reply-slip::after { right: -.4rem; }
	.reply-slip.slip-filed { transform: translateY(8px) rotate(-.7deg); clip-path: polygon(0 0,100% 0,100% 98%,96% 96%,92% 99%,87% 96%,82% 99%,77% 96%,72% 99%,67% 96%,62% 99%,57% 96%,52% 99%,47% 96%,42% 99%,37% 96%,32% 99%,27% 96%,22% 99%,17% 96%,12% 99%,7% 96%,0 99%); }
	.slip-perforation { position: absolute; top: 0; left: 1rem; right: 1rem; border-top: 1px dashed rgba(26,26,46,.24); }
	.reply-slip__head,.reply-slip__foot { display: flex; justify-content: space-between; gap: 1rem; color: var(--muted-ink); font: .57rem var(--font-mono); letter-spacing: .1em; }
	.reply-slip__head { padding-bottom: 1rem; border-bottom: 1px solid var(--rule); }
	.contact-links { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .7rem; padding-block: 1.2rem; border-bottom: 1px solid var(--rule); }
	.contact-links a { min-width: 0; display: grid; grid-template-columns: 1fr auto; gap: .2rem .3rem; padding: .7rem; border: 1px solid rgba(26,26,46,.17); color: var(--ink); text-decoration: none; transition: border-color 250ms,background-color 250ms; }
	.contact-links a:hover { border-color: var(--stamp); background: rgba(163,62,54,.04); }
	.contact-links a span:first-child { grid-column: 1 / -1; color: var(--muted-ink); font: .55rem var(--font-mono); text-transform: uppercase; }
	.contact-links a b { overflow-wrap: anywhere; font: 600 .68rem var(--font-mono); }
	.contact-links a span:last-child { grid-column: 2; grid-row: 2; color: var(--stamp); }
	.contact-form { margin-top: 1.3rem; }
	.contact-form fieldset { display: grid; gap: 1rem; margin: 0; padding: 0; border: 0; }
	.contact-form legend { margin-bottom: .9rem; color: var(--ink); font: 500 1.4rem var(--font-serif); }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.contact-form label { display: grid; gap: .4rem; color: var(--ink); font: .69rem var(--font-mono); }
	.contact-form input,.contact-form textarea { width: 100%; min-width: 0; border: 1px solid rgba(26,26,46,.26); border-radius: 0; padding: .72rem .75rem; color: var(--ink); background: rgba(255,255,255,.32); font: .9rem var(--font-sans); }
	.contact-form textarea { min-height: 8rem; resize: vertical; }
	.contact-form small { color: var(--muted-ink); font: .65rem/1.5 var(--font-sans); }
	.send-button { justify-self: start; display: inline-flex; gap: .6rem; align-items: center; border: 1px solid var(--ink); padding: .78rem 1rem; color: var(--paper); background: var(--ink); cursor: pointer; font: .7rem var(--font-mono); transition: background-color 250ms,color 250ms,transform 250ms; }
	.send-button:hover:not(:disabled) { color: var(--ink); background: transparent; transform: translateY(-2px); }
	.send-button:disabled { opacity: .68; cursor: wait; }
	.form-trap { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
	.form-message { margin: 1rem 0 0; padding: .8rem; font: .8rem/1.5 var(--font-mono); }
	.form-message--error { color: #7d241f; background: #f4ddd8; border-left: 3px solid #a33e36; }
	.form-message--success { color: #31513a; background: #e2eadb; border-left: 3px solid #497450; }
	.reply-slip__foot { margin-top: 1.3rem; padding-top: .8rem; border-top: 1px solid var(--rule); }
	.reply-end { max-width: 61rem; margin: 2rem auto 0; display: flex; justify-content: space-between; gap: 1rem; align-items: center; color: var(--muted-ink); }
	.reply-end p { margin: 0; color: var(--stamp); font: italic .95rem var(--font-serif); }
	.reply-end span { font: .52rem var(--font-mono); letter-spacing: .08em; text-align: right; }
	.translation-review { position: fixed; z-index: 180; right: .7rem; bottom: .7rem; max-width: 15rem; margin: 0; padding: .45rem .6rem; border: 1px solid var(--stamp); color: var(--paper); background: var(--ink); font: .62rem/1.35 var(--font-mono); }
	.help-terminal { position: fixed; z-index: 190; right: 1rem; bottom: 1rem; width: min(25rem,calc(100vw - 2rem)); padding: 1rem; border: 1px solid #73bb72; color: #b0eea1; background: #09140c; box-shadow: 0 10px 50px rgba(0,0,0,.3); font-family: var(--font-mono); }
	.help-terminal__head { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding-bottom: .6rem; border-bottom: 1px solid rgba(115,187,114,.35); }
	.help-terminal h2 { margin: 0; color: #b0eea1; font: .72rem var(--font-mono); letter-spacing: .08em; }
	.help-terminal button { border: 0; color: inherit; background: transparent; font: 1.3rem var(--font-mono); cursor: pointer; }
	.help-terminal > p { margin: .65rem 0 0; font: .66rem/1.45 var(--font-mono); }
	.help-terminal > p span { color: #73bb72; }
	.custom-cursor { display: none; }
	@media (hover:hover) and (pointer:fine) { .cursor-enabled .custom-cursor { position: fixed; z-index: 170; top: 0; left: 0; display: block; width: .38rem; height: .38rem; pointer-events: none; transform: var(--cursor-transform,translate3d(-10px,-10px,0)); border-radius: 50%; background: var(--stamp); transition: width 180ms,height 180ms,border-radius 180ms; } .custom-cursor i { display: block; width: 100%; height: 100%; } .custom-cursor.cursor-over-text { width: 1rem; height: .22rem; border-radius: 0; } }
		.motion-enabled .scene-heading { animation: arrive 700ms cubic-bezier(.22,1,.36,1) both; animation-timeline: view(); animation-range: entry 0% entry 28%; }
	@keyframes peel { 0% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
	@keyframes stamp-in { 0% { opacity: 0; transform: scale(1.5) rotate(18deg); } 65% { opacity: 1; transform: scale(.96) rotate(-5deg); } 100% { opacity: 1; transform: scale(1) rotate(8deg); } }
	@keyframes ink-write { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
		@keyframes card-reveal { from { transform: translateY(-4px); } to { transform: translateY(0); } }
		@keyframes arrive { from { transform: translateY(15px); } to { transform: translateY(0); } }
		@media (max-width: 900px) {
			.file-progress { right: .4rem; }
			.scene.classification { contain-intrinsic-size: auto 626px; }
			.scene.route-section { contain-intrinsic-size: auto 1566px; }
			.scene.lenses { contain-intrinsic-size: auto 1178px; }
			.scene.instruments { contain-intrinsic-size: auto 1041px; }
			.scene.reply { contain-intrinsic-size: auto 903px; }
			.intake__grid { grid-template-columns: minmax(0,1fr) minmax(12rem,.55fr); gap: 1.2rem; }
		.intake__paper { min-height: 29rem; padding: 1.5rem; }
			.route-sticky { gap: 1rem; }
		.route-map { min-height: 20rem; }
		.lens-grid { gap: .65rem; }
		.lens-card__body { padding: .95rem; }
	}
		@media (max-width: 640px) {
			.scene { padding-inline: 1rem; padding-block: 4.2rem; }
			.scene.classification { contain-intrinsic-size: auto 950px; }
			.scene.route-section { contain-intrinsic-size: auto 1100px; }
			.scene.lenses { contain-intrinsic-size: auto 1822px; }
			.scene.instruments { contain-intrinsic-size: auto 1421px; }
			.scene.reply { contain-intrinsic-size: auto 1111px; }
			.intake { min-height: auto; padding-top: 2rem; padding-bottom: 1.2rem; }
		.intake__topline,.intake__footer { font-size: .52rem; }
		.intake__grid { grid-template-columns: 1fr; }
		.intake__paper { min-height: 31.75rem; padding: 1.2rem; }
		.intake-field { grid-template-columns: 6.2rem minmax(0,1fr); gap: .4rem; }
		.intake-field dd { font-size: .7rem; }
		.intake__name-block h1 { font-size: clamp(3.4rem,16vw,5.7rem); }
		.stamp { padding: .35rem .5rem; font-size: .56rem; }
		.stamp--open { top: 1.1rem; right: 1rem; }
			.intake__bottom { font-size: .43rem; }
		.intake__portrait { width: min(78%,18rem); justify-self: end; margin-top: .5rem; }
		.personal-line { margin-top: 1rem; }
		.scene-heading { margin-bottom: 1.7rem; }
		.scene-heading h2 { font-size: clamp(2.4rem,12vw,3.8rem); }
		.classification__grid { grid-template-columns: 1fr; gap: 1.2rem; }
		.classification__name { font-size: 3.6rem; margin-bottom: 1.2rem; }
		.classification__aside { margin-top: .9rem; }
		.classification__footnote { margin-top: 1.5rem; }
		.route-section { min-height: auto; padding-bottom: 4rem; }
		.route-sticky { position: relative; top: auto; min-height: 0; grid-template-columns: 1fr; }
		.route-map { min-height: 17rem; padding-inline: .35rem; }
		.map-coordinates { font-size: .4rem; }
		.route-notes { gap: .55rem; }
		.field-note.current { transform: translateX(.2rem); }
		.lens-grid { grid-template-columns: 1fr; gap: .85rem; }
		.lens-card { display: grid; grid-template-columns: minmax(7rem,.72fr) 1fr; }
		.lens-visual { height: 100%; min-height: 12rem; border-bottom: 0; border-right: 1px solid var(--rule); }
		.lens-card__body { padding: .9rem; }
		.lens-card__body h3 { font-size: 1.9rem; }
		.lens-card__body > p:not(.lens-number) { font-size: .8rem; }
		.atlas-callout { align-items: flex-start; flex-direction: column; gap: .9rem; }
		.related-files { grid-template-columns: 1fr; gap: .8rem; }
		.instrument-row { grid-template-columns: repeat(2,minmax(0,1fr)); }
		.instrument { min-height: 11.5rem; padding: 1rem; border-bottom: 1px solid rgba(240,234,219,.18); }
		.instrument:nth-child(2) { border-right: 0; }
		.instrument:nth-child(3),.instrument:nth-child(4) { border-bottom: 0; }
		.experience-head { align-items: flex-start; flex-direction: column; gap: .55rem; }
		.index-card summary { grid-template-columns: 2rem minmax(0,1fr) 1.5rem; gap: .5rem; }
		.index-card__main > span:last-child { font-size: .7rem; }
		.index-card__detail { padding: 0 .3rem 1rem 2.5rem; flex-direction: column; align-items: flex-start; }
		.reply { padding-bottom: 3rem; }
		.reply-slip { padding: 1.1rem; }
		.reply-slip__head,.reply-slip__foot { font-size: .45rem; }
		.contact-links { grid-template-columns: 1fr; }
		.contact-links a { grid-template-columns: 5rem minmax(0,1fr) auto; align-items: center; }
		.contact-links a span:first-child { grid-column: 1; grid-row: 1; }
		.contact-links a b { grid-column: 2; grid-row: 1; font-size: .62rem; }
		.contact-links a span:last-child { grid-column: 3; grid-row: 1; }
		.form-row { grid-template-columns: 1fr; }
		.reply-end { align-items: flex-start; flex-direction: column; }
		.reply-end span { text-align: left; }
		.file-progress { top: auto; right: .5rem; bottom: .5rem; grid-template-columns: 3.4rem 2px; writing-mode: horizontal-tb; font-size: .55rem; gap: .45rem; }
		.file-progress::before { width: 3.4rem; height: 2px; grid-column: 1; grid-row: 1; }
		.file-progress__bar { width: 3.4rem; height: 2px; grid-column: 1; grid-row: 1; transform-origin: left; }
		.file-progress span { grid-column: 2; grid-row: 1; writing-mode: vertical-rl; }
		.translation-review { right: auto; left: .5rem; bottom: .5rem; max-width: 12rem; font-size: .54rem; }
	}
	@media (prefers-reduced-motion: reduce) {
		.about-file *, .about-file *::before, .about-file *::after { animation-duration: .01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
		.motion-enabled .redaction { transform: scaleX(0); }
		.self-description { clip-path: none !important; }
		.custom-cursor { display: none !important; }
	}
		@media (max-width: 380px) {
			.intake__paper { min-height: 32.25rem; }
			.intake-field { grid-template-columns: 5.3rem minmax(0,1fr); }
			.intake-field dt { font-size: .53rem; }
			.intake-field dd { font-size: .65rem; }
			.lens-card { grid-template-columns: 6.1rem minmax(0,1fr); }
			.lens-visual { min-height: 13rem; }
				.lens-card__body { padding: .75rem; }
				.lens-card__body h3 { font-size: 1.65rem; }
			}
		@media (max-width: 340px) {
			.intake__paper { min-height: 33rem; }
		}

		/* Shared internetplace palette: the About narrative now follows both site themes. */
		.about-file {
			--ink: var(--color-text);
			--about-readable-muted: color-mix(in srgb, var(--color-text) 80%, var(--color-surface) 20%);
			--about-readable-accent: color-mix(in srgb, var(--color-accent) 40%, var(--color-text) 60%);
			--about-readable-highlight: color-mix(in srgb, var(--color-highlight) 30%, var(--color-text) 70%);
			--ink-soft: var(--about-readable-muted);
			--paper: var(--color-surface);
			--paper-bright: var(--color-bg);
			--paper-shadow: var(--color-border);
			--stamp: var(--color-accent);
			--ochre: var(--color-highlight);
			--rule: color-mix(in srgb, var(--color-border) 84%, transparent);
			--body-ink: var(--color-text);
			--muted-ink: var(--about-readable-muted);
			color: var(--color-text);
			background: var(--color-bg);
		}
		.about-file .intake,
		.about-file .lenses,
		.about-file .reply { color: var(--color-text); background: var(--color-bg); }
		.about-file .classification,
		.about-file .instruments { color: var(--color-text); background: var(--color-surface); }
		.about-file .route-section { background: color-mix(in srgb, var(--color-highlight) 8%, var(--color-bg)); }
		.about-file .intake::before {
			opacity: .5;
			background-image: linear-gradient(color-mix(in srgb, var(--color-border) 28%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-border) 28%, transparent) 1px, transparent 1px), radial-gradient(ellipse at 82% 18%, color-mix(in srgb, var(--color-highlight) 20%, transparent), transparent 42%);
			background-size: 34px 34px, 34px 34px, auto;
		}
		.file-progress { color: var(--about-readable-muted); }
		.scene-kicker, .instruments .scene-kicker { color: var(--about-readable-accent); }
		.file-progress::before { background: color-mix(in srgb, var(--color-text) 16%, transparent); }
		.file-progress__bar { background: var(--color-highlight); }
		.intake__topline, .intake__footer { color: var(--color-text-muted); }
		.intake__paper { border: 1px solid var(--color-border); background: var(--color-surface); box-shadow: 10px 12px 0 color-mix(in srgb, var(--color-text) 8%, transparent), 0 1.5rem 3rem color-mix(in srgb, var(--color-text) 7%, transparent); transform: rotate(-.2deg); }
		.paper-grain { opacity: .12; background-image: repeating-linear-gradient(90deg, transparent 0 7px, color-mix(in srgb, var(--color-text) 3%, transparent) 8px), radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--color-highlight) 13%, transparent), transparent 46%); }
		.intake-field { border-bottom-color: color-mix(in srgb, var(--color-border-strong) 70%, transparent); }
		.intake-field dd { color: var(--color-text); }
		.stamp { border-color: var(--color-highlight); color: var(--color-accent); }
		.intake__signal {
			position: relative;
			width: min(100%, 25rem);
			justify-self: center;
			overflow: hidden;
			padding: clamp(1.1rem, 2.6vw, 1.6rem);
			border: 1px solid var(--color-border);
			border-top: 3px solid var(--color-highlight);
			border-radius: var(--radius-lg);
			background: color-mix(in srgb, var(--color-surface) 94%, var(--color-highlight));
			box-shadow: var(--shadow-md);
		}
		.signal-head { display: flex; justify-content: space-between; gap: .5rem; color: var(--color-text-muted); font: .55rem var(--font-mono); letter-spacing: .08em; }
		.signal-visual { display: block; width: 100%; height: auto; margin: .8rem auto .2rem; overflow: visible; }
		.signal-orbit { fill: none; stroke: color-mix(in srgb, var(--color-accent) 28%, transparent); stroke-width: 1; stroke-dasharray: 3 6; }
		.signal-orbit--second { opacity: .6; }
		.signal-route { fill: none; stroke: var(--color-highlight); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 420; stroke-dashoffset: 0; }
		.motion-enabled .signal-route { animation: signal-draw 1.5s cubic-bezier(.22,1,.36,1) .15s both; }
		.signal-node { fill: var(--color-surface-raised); stroke: var(--color-accent); stroke-width: 2; }
		.signal-core { fill: var(--color-highlight); }
		.signal-core-ring { fill: none; stroke: var(--color-highlight); stroke-width: 1; opacity: .42; transform-box: fill-box; transform-origin: center; }
		.motion-enabled .signal-core-ring { animation: signal-pulse 2.4s ease-in-out .4s infinite; }
		.signal-subtitle { margin: 0 0 .85rem; color: var(--color-text-secondary); font: italic .9rem/1.45 var(--font-serif); }
		.signal-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--color-border); }
		.signal-metrics > div { min-width: 0; padding: .7rem .45rem .68rem; }
		.signal-metrics > div + div { border-left: 1px solid var(--color-border); }
		.signal-metrics dt { color: var(--color-accent); font: 500 1.3rem/1 var(--font-serif); }
		.signal-metrics dd { margin: .35rem 0 0; color: var(--color-text-muted); font: .48rem/1.4 var(--font-mono); text-transform: uppercase; }
		.personal-line { max-width: 32ch; margin: .9rem 0 0; color: var(--color-text-secondary); font: italic .9rem/1.5 var(--font-serif); }
		.classifier-card { border-color: var(--color-border); background: var(--color-surface); box-shadow: var(--shadow-md); }
		.signal-dot { background: var(--color-highlight); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-highlight) 24%, transparent); }
		.route-map { border-color: var(--color-border-strong); border-radius: var(--radius-lg); background-color: var(--color-surface); background-image: linear-gradient(color-mix(in srgb, var(--color-border) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-border) 40%, transparent) 1px, transparent 1px), radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--color-highlight) 16%, transparent), transparent 45%); background-size: 28px 28px, 28px 28px, auto; box-shadow: var(--shadow-sm); }
		.map-stamp { border-color: color-mix(in srgb, var(--color-highlight) 72%, var(--color-border-strong)); color: var(--color-accent); }
		.map-contour { stroke: color-mix(in srgb, var(--color-text) 16%, transparent); }
		.map-gridline { stroke: color-mix(in srgb, var(--color-text) 9%, transparent); }
		.field-note { border-color: var(--color-border); border-left-color: transparent; border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow-sm); }
		.field-note.current { border-left-color: var(--color-highlight); background: var(--color-surface-raised); }
		.lens-card { overflow: hidden; border-color: var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
		.lens-card:hover, .lens-card:focus-within { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); }
		.lens-visual { background: color-mix(in srgb, var(--color-highlight) 8%, var(--color-surface)); }
		.ledger-lines { background: repeating-linear-gradient(0deg, transparent 0 22px, color-mix(in srgb, var(--color-text) 14%, transparent) 23px 24px); }
		.ledger-bars i { border-color: var(--color-border-strong); background: color-mix(in srgb, var(--color-accent) 13%, transparent); }
		.identity-orbit { border-color: color-mix(in srgb, var(--color-text) 36%, transparent); }
		.identity-orbit::before { border-color: color-mix(in srgb, var(--color-text) 23%, transparent); }
		.identity-orbit i { background: var(--color-surface); }
		.table-visual { border-color: var(--color-border-strong); background: color-mix(in srgb, var(--color-surface-raised) 82%, transparent); }
		.table-visual i, .table-visual b { border-top-color: var(--color-border); }
		.atlas-callout { border-left: 3px solid var(--color-highlight); background: color-mix(in srgb, var(--color-surface) 75%, transparent); padding-left: clamp(1.1rem, 3vw, 2rem); }
		.related-files { display: grid; grid-template-columns: 1fr; gap: 1rem; align-items: stretch; padding: 1.8rem 0 .5rem; border-bottom: 0; }
		.related-files__intro { max-width: 48rem; }
		.related-projects { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
		.project-card { min-width: 0; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-sm); transition: border-color 250ms ease, box-shadow 250ms ease; }
		.project-card:hover, .project-card:focus-within, .project-card[open] { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); }
		.project-card summary { position: relative; display: grid; grid-template-columns: auto 1fr; gap: .45rem .75rem; align-items: start; padding: 1rem 1.1rem; cursor: pointer; list-style: none; }
		.project-card summary::-webkit-details-marker { display: none; }
		.project-card__serial { grid-row: span 2; color: var(--about-readable-highlight); font: .66rem var(--font-mono); }
		.project-card__category { color: var(--about-readable-muted); font: .53rem/1.4 var(--font-mono); letter-spacing: .08em; }
		.project-card summary h3 { margin: 0; color: var(--color-text); font: 500 clamp(1.15rem, 1.7vw, 1.45rem)/1.18 var(--font-serif); }
		.project-card__toggle { grid-column: 2; display: flex; justify-content: space-between; gap: .4rem; align-items: center; margin-top: .25rem; color: var(--color-accent); font: .5rem var(--font-mono); letter-spacing: .06em; }
		.project-card__toggle b { color: var(--color-highlight); font: 1rem var(--font-mono); transition: transform 250ms ease; }
		.project-card[open] .project-card__toggle b { transform: rotate(45deg); }
		.project-card__detail { padding: 0 1.1rem 1rem 2.6rem; animation: card-reveal 320ms cubic-bezier(.22,1,.36,1) both; }
		.project-card__detail p { margin: 0; color: var(--color-text-secondary); font-size: .82rem; line-height: 1.55; }
		.related-files__link { display: inline-flex; min-height: 2.5rem; align-items: center; justify-self: start; padding: .4rem .65rem; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-accent); font: .67rem var(--font-mono); text-decoration: underline; text-underline-offset: .22rem; }
		.instruments .scene-kicker { color: var(--about-readable-accent); }
		.instruments .scene-heading h2, .experience-head h3 { color: var(--color-text); }
		.instruments .scene-intro, .experience-head > p { color: var(--about-readable-muted); }
		.instrument-row { gap: .7rem; border: 0; }
		.instrument { min-width: 0; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg); box-shadow: var(--shadow-sm); transition: border-color 250ms ease, box-shadow 250ms ease; }
		.instrument:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); }
		.instrument__dial { border-color: var(--color-border-strong); background: repeating-conic-gradient(from -130deg, color-mix(in srgb, var(--color-text) 28%, transparent) 0 1deg, transparent 1deg 16deg); }
		.instrument__dial::after { border-color: var(--color-border); }
		.instrument__dial i { background: var(--color-highlight); }
		.instrument__dial b { background: var(--color-surface); }
		.dial-mark, .instrument .type-label { color: var(--about-readable-muted); }
		.instrument li { border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface); }
		.experience-index { display: grid; gap: .65rem; border-top: 0; }
		.index-card { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg); box-shadow: var(--shadow-sm); transition: border-color 250ms ease, box-shadow 250ms ease; }
		.index-card:hover, .index-card:focus-within, .index-card[open] { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); }
		.index-card summary { padding-inline: 1rem; }
		.index-card__serial, .index-card__toggle { color: var(--about-readable-highlight); }
		.index-card__date, .index-card__detail span { color: var(--about-readable-muted); }
		.index-card__main strong, .index-card__detail p { color: var(--color-text); }
		.index-card__main > span:last-child { color: var(--about-readable-muted); }
		.reply-slip { border-color: var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: 0 10px 0 color-mix(in srgb, var(--color-text) 5%, transparent), var(--shadow-md); }
		.reply-slip::before, .reply-slip::after { background: radial-gradient(circle at center, var(--color-bg) 0 3px, transparent 3.4px) center / 10px 12px repeat-y; }
		.slip-perforation { border-top-color: var(--color-border); }
		.contact-links a { border-color: var(--color-border); border-radius: var(--radius); background: var(--color-bg); }
		.contact-links a:hover { border-color: var(--color-highlight); background: color-mix(in srgb, var(--color-highlight) 8%, var(--color-surface)); }
		.contact-form input, .contact-form textarea { border-color: var(--color-border-strong); border-radius: var(--radius); background: var(--color-bg); }
		.contact-form input:focus, .contact-form textarea:focus { border-color: var(--color-highlight); }
		.form-message--error, .form-message--success { color: var(--color-text); background: color-mix(in srgb, var(--color-highlight) 12%, var(--color-surface)); border-left-color: var(--color-highlight); }
		.translation-review { color: var(--color-text); background: var(--color-surface); }
		.help-terminal { border-color: var(--color-border-strong); border-radius: var(--radius-lg); color: var(--color-text); background: var(--color-surface); box-shadow: 0 1rem 3rem color-mix(in srgb, var(--color-text) 18%, transparent); }
		.help-terminal__head { border-bottom-color: var(--color-border); }
		.help-terminal h2, .help-terminal > p span { color: var(--color-accent); }
		.motion-enabled [data-animate-card] { transform: translate3d(0, 1.1rem, 0); transition: transform 560ms cubic-bezier(.22,1,.36,1), border-color 250ms ease, box-shadow 250ms ease; transition-delay: calc(var(--card-order, 0) * 55ms); }
		.motion-enabled :global([data-animate-card].has-entered) { transform: translate3d(0, 0, 0); }
		.motion-enabled :global([data-animate-card].has-entered:is(:hover, :focus-within)) { transform: translate3d(0, -.25rem, 0); box-shadow: var(--shadow-md); }
		.motion-enabled :global(.field-note[data-animate-card].has-entered.current) { transform: translate3d(-.35rem, 0, 0); }
		@keyframes signal-draw { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
		@keyframes signal-pulse { 0%, 100% { opacity: .32; transform: scale(.88); } 50% { opacity: .75; transform: scale(1.12); } }
		@media (max-width: 640px) {
			.intake__signal { width: 100%; max-width: none; }
			.related-projects { grid-template-columns: 1fr; }
			.project-card summary { padding: .9rem; }
			.project-card__detail { padding-inline: 2.35rem .9rem; }
			.motion-enabled :global(.field-note[data-animate-card].has-entered.current) { transform: translate3d(.2rem, 0, 0); }
		}
		@media (prefers-reduced-motion: reduce) {
			.motion-enabled [data-animate-card], .motion-enabled :global([data-animate-card].has-entered) { opacity: 1 !important; transform: none !important; }
			.signal-route, .signal-core-ring { animation: none !important; }
		}
	</style>
