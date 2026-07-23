import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const repoRoot = process.cwd();
const ruralPath =
  process.env.SECC_RURAL_CSV ||
  path.join(repoRoot, 'src', 'data', 'shrug-secc-mord-rural-csv', 'secc_rural_shrid.csv');
const urbanPath =
  process.env.SECC_URBAN_CSV ||
  path.join(repoRoot, 'src', 'data', 'shrug-secc-parsed-urban-csv', 'secc_urban_shrid.csv');
const outputPath = path.join(repoRoot, 'static', 'data', 'secc_state_summary.json');

const COL_STATE = 'pc11_state_id';
const COL_SHRID = 'shrid2';
const COL_PC11_DIST = 'pc11dist_id';
const COL_PC11_SUBDIST = 'pc11_subdistrict_id';
const COL_HH = 'secc_hh';
const COL_POP = 'tot_p';
const COL_SC_M = 'sc_m';
const COL_SC_F = 'sc_f';
const COL_ST_M = 'st_m';
const COL_ST_F = 'st_f';

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function splitCsvLine(line) {
  // SHRUG numeric rows are comma-delimited without quoted comma payloads.
  return line.split(',');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function upsertState(aggregates, stateCode) {
  if (!aggregates[stateCode]) {
    aggregates[stateCode] = {
      households: 0,
      population: 0,
      scPopulation: 0,
      stPopulation: 0
    };
  }
  return aggregates[stateCode];
}

function inferStateCode(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  // Common SHRUG key shape: 11-01-001-00001-800001 (state is segment 2 => 01)
  const fromShridSeg2 = raw.match(/^\d{1,2}-(\d{1,2})-/);
  if (fromShridSeg2) return fromShridSeg2[1].padStart(2, '0');

  // Fallback when a two-segment key is present.
  const fromTwoSeg = raw.match(/^(\d{1,2})[-_](\d{1,2})/);
  if (fromTwoSeg) return fromTwoSeg[2].padStart(2, '0');

  const fromLeading = raw.match(/^(\d{1,2})[-_]/);
  if (fromLeading) return fromLeading[1].padStart(2, '0');

  // Numeric fallback: state code is first two digits when available.
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 2) return digits.slice(0, 2);
  if (digits.length === 1) return digits.padStart(2, '0');
  return '';
}

function resolveStateCode(row, index) {
  const directState = index.state >= 0 ? String(row[index.state] || '').trim() : '';
  if (directState) return directState.padStart(2, '0');

  const shridValue = index.shrid >= 0 ? row[index.shrid] : '';
  const fromShrid = inferStateCode(shridValue);
  if (fromShrid) return fromShrid;

  const distValue = index.pc11dist >= 0 ? row[index.pc11dist] : '';
  const fromDist = inferStateCode(distValue);
  if (fromDist) return fromDist;

  const subDistValue = index.pc11subdist >= 0 ? row[index.pc11subdist] : '';
  return inferStateCode(subDistValue);
}

async function aggregateCsv(filePath, aggregates) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let headers = null;
  let index = null;

  for await (const line of rl) {
    if (!headers) {
      headers = splitCsvLine(line);
      index = {
        state: headers.indexOf(COL_STATE),
        shrid: headers.indexOf(COL_SHRID),
        pc11dist: headers.indexOf(COL_PC11_DIST),
        pc11subdist: headers.indexOf(COL_PC11_SUBDIST),
        households: headers.indexOf(COL_HH),
        population: headers.indexOf(COL_POP),
        scM: headers.indexOf(COL_SC_M),
        scF: headers.indexOf(COL_SC_F),
        stM: headers.indexOf(COL_ST_M),
        stF: headers.indexOf(COL_ST_F)
      };

      const hasStateSource =
        index.state >= 0 || index.shrid >= 0 || index.pc11dist >= 0 || index.pc11subdist >= 0;

      if (!hasStateSource || index.households === -1 || index.population === -1) {
        throw new Error(`Missing required columns in ${filePath}`);
      }
      continue;
    }

    if (!line || !line.trim()) continue;

    const row = splitCsvLine(line);
    const stateCode = resolveStateCode(row, index);
    if (!stateCode) continue;

    const target = upsertState(aggregates, stateCode);
    const households = parseNumber(row[index.households]);
    const population = parseNumber(row[index.population]);
    const scPopulation = parseNumber(row[index.scM]) + parseNumber(row[index.scF]);
    const stPopulation = parseNumber(row[index.stM]) + parseNumber(row[index.stF]);

    target.households += households;
    target.population += population;
    target.scPopulation += scPopulation;
    target.stPopulation += stPopulation;
  }
}

function withShares(aggregates) {
  const sortedEntries = Object.entries(aggregates).sort(([a], [b]) => a.localeCompare(b));
  const result = {};

  for (const [stateCode, row] of sortedEntries) {
    const population = row.population || 0;
    result[stateCode] = {
      households: Math.round(row.households),
      population: Math.round(population),
      scPopulation: Math.round(row.scPopulation),
      stPopulation: Math.round(row.stPopulation),
      scShare: population > 0 ? row.scPopulation / population : 0,
      stShare: population > 0 ? row.stPopulation / population : 0
    };
  }

  return result;
}

function combineAggregates(rural, urban) {
  const combined = {};
  const keys = new Set([...Object.keys(rural), ...Object.keys(urban)]);

  for (const key of keys) {
    const r = rural[key] || { households: 0, population: 0, scPopulation: 0, stPopulation: 0 };
    const u = urban[key] || { households: 0, population: 0, scPopulation: 0, stPopulation: 0 };
    combined[key] = {
      households: r.households + u.households,
      population: r.population + u.population,
      scPopulation: r.scPopulation + u.scPopulation,
      stPopulation: r.stPopulation + u.stPopulation
    };
  }

  return combined;
}

async function main() {
  const hasRural = fs.existsSync(ruralPath);
  const hasUrban = fs.existsSync(urbanPath);

  if (!hasRural && !hasUrban) {
    console.log('[data:prepare] No SECC CSV files found, skipping summary generation.');
    return;
  }

  const ruralAgg = {};
  const urbanAgg = {};

  if (hasRural) {
    console.log(`[data:prepare] Reading rural CSV: ${ruralPath}`);
    await aggregateCsv(ruralPath, ruralAgg);
  } else {
    console.log('[data:prepare] Rural CSV not found, skipping rural aggregation.');
  }

  if (hasUrban) {
    console.log(`[data:prepare] Reading urban CSV: ${urbanPath}`);
    await aggregateCsv(urbanPath, urbanAgg);
  } else {
    console.log('[data:prepare] Urban CSV not found, skipping urban aggregation.');
  }

  const combined = combineAggregates(ruralAgg, urbanAgg);
  const payload = {
    generatedAt: new Date().toISOString(),
    source: {
      rural: hasRural ? path.relative(repoRoot, ruralPath) : null,
      urban: hasUrban ? path.relative(repoRoot, urbanPath) : null
    },
    states: {
      combined: withShares(combined),
      rural: withShares(ruralAgg),
      urban: withShares(urbanAgg)
    }
  };

  ensureDir(outputPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[data:prepare] Wrote ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error('[data:prepare] Failed:', error.message);
  process.exitCode = 1;
});
