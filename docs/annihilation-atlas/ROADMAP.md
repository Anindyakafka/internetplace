# Annihilation Atlas: Working Roadmap

This is the implementation plan for an anti-caste observatory of land, labour, classification, segregation, resistance, and memory. The project is not a neutral caste directory. Its purpose is to expose and oppose the material and social reproduction of caste and jati while protecting the people whose lives appear in the evidence.

## The first public release

**Prototype I: What the Map Cannot Say** will be one geographically bounded investigation organized into five connected rooms:

1. **Map** — one spatial claim, with scale, uncertainty, suppressed detail, and boundary history visible.
2. **Measure** — one material relationship: land, labour, occupation, housing, education, sanitation work, or access to public resources.
3. **File** — the administrative and political history of the categories used in the evidence.
4. **Absence** — what was not collected, released, made comparable, or safe to publish.
5. **Struggle** — organizing, resistance, intellectual work, memory, and collective care in the same place.

The prototype is complete only when all five rooms exist. A chart and a map alone are not a release.

## Workstreams

### 1. Political and editorial foundation

- Maintain the public manifesto at `/annihilation-atlas`.
- Write a short positionality statement explaining the researcher's relationship to the place, sources, and communities.
- Establish a correction, objection, withdrawal, and takedown process.
- Create language rules: no graded or civilizational caste vocabulary except when quoted and critically contextualized.
- Define who reviews claims involving living or identifiable communities.

**Exit condition:** every contributor can explain what the project refuses to publish and why.

### 2. Prototype question

Choose:

- One place with a defensible boundary and a reason for beginning there.
- One material relation.
- One period or historical transition.
- The unit of analysis: state, district, sub-district, village aggregate, ward aggregate, household sample, institution, or document.
- The argument the evidence might support and the claims it cannot support.

Recommended question form:

> How did **[institution/material relation]** reproduce or contest caste power in **[place]** during **[period]**, and what does the available evidence make impossible to know?

**Exit condition:** a one-page research brief with no individual-level public output.

### 3. Source acquisition and provenance

- Preserve original downloads without renaming or editing them.
- Collect questionnaires, codebooks, sampling notes, table descriptions, licences, and access dates.
- Record the category-maker: self-identification, enumerator, state schedule, researcher coding, or historical author.
- Store public raw data locally under `research/annihilation-atlas/raw/`; this directory is excluded from Git.
- Store interviews, field notes, exact sensitive locations, and personal information only under `private/`, also excluded from Git.
- Add one row per source to `DATA_INVENTORY.csv` before analysis.

**Exit condition:** every analytical column can be traced back to an original field and documentation page.

### 4. Data audit

For every dataset:

- Identify observation unit, population universe, sample design, weights, and geographic resolution.
- Audit missing values, suppressed cells, duplicates, impossible codes, and category drift.
- Separate SC/ST/OBC or administrative social-group variables from jati/community variables.
- Check whether geographic identifiers match the boundary year.
- Document whether nonresponse or exclusion disproportionately removes migrants, unhoused people, informal settlements, women, religious minorities, or precarious workers.
- Produce a written “cannot support” list before visualization.

**Exit condition:** a reproducible audit report and an approved public aggregation level.

### 5. Geographic concordance

- Obtain boundaries appropriate to each source year.
- Preserve source geographic codes.
- Build explicit old-to-new boundary crosswalks; never join on names alone.
- Mark one-to-many and many-to-one boundary changes.
- Test small-cell and re-identification risks before producing tiles or GeoJSON.
- Generalize or suppress geometry where precision could harm people.

**Exit condition:** every map layer has a stated vintage, join rate, unmatched list, and disclosure review.

### 6. Counter-archive and library

- Begin with bibliographic metadata, not indiscriminate document uploads.
- Include anti-caste periodicals, movement pamphlets, community histories, union material, oral histories, legal interventions, speeches, poetry, art, and local-language scholarship.
- Record whether a work describes a community from outside or speaks from within a movement/community.
- Create relations such as `read_against`, `community_response`, `uses_colonial_category`, `contradicted_by`, and `extends`.
- Obtain permission before publishing copyrighted scans, recordings, or private collections.

**Exit condition:** Prototype I contains sources that contest the official archive rather than merely decorate it.

### 7. Analysis

- Start with descriptive structure and denominators before modelling.
- Keep caste, class, gender, religion, region, and occupation analytically distinct while studying their interaction.
- Apply survey weights and design variables where required.
- Avoid jati-level estimates from samples that cannot support them.
- Treat recorded atrocity rates as records of reporting and institutions, not direct measures of underlying incidence.
- Version all derived tables and scripts.

**Exit condition:** every published number has a reproducible derivation and limitation note.

### 8. Interface

- Build the five-room prototype within `/annihilation-atlas`.
- Require source, year, unit, denominator, and limitation to travel with every visualization.
- Make missingness legible: not collected, not released, incompatible, suppressed, or unsafe.
- Do not provide surname inference, individual search, jati ranking, or vulnerable-location lookup.
- Provide plain-language and methodological readings of each result.
- Make the resistance archive a primary navigation path, not a final appendix.

**Exit condition:** the interface cannot be reasonably repurposed as a caste-surveillance tool.

### 9. Review and release

- Conduct factual, methodological, political, privacy, accessibility, and security reviews separately.
- Ask relevant scholars, organizers, archivists, or community reviewers to critique the interpretation.
- Keep a public correction log.
- Attach dataset and code versions to the release.
- Publish only aggregated derived data that have passed disclosure review.

## Phases

| Phase | Deliverable | Depends on |
|---|---|---|
| 0 | Manifesto, roadmap, ethics rules, data inventory | Nothing |
| 1 | One-page question and place brief | User decisions |
| 2 | Source acquisition and provenance register | Phase 1 |
| 3 | Data and category audit | Phase 2 |
| 4 | Geographic concordance and privacy review | Phase 3 |
| 5 | Five-room prototype | Phases 3–4 |
| 6 | External review and corrections | Phase 5 |
| 7 | Public Prototype I | Phase 6 |
| 8 | Second place/question and comparative architecture | Prototype I |

## Definition of done for Prototype I

- A clear anti-caste argument rather than a neutral data tour.
- At least one material measure and its denominator.
- Category and classification history.
- Explicit absences and non-comparabilities.
- A substantive archive of resistance.
- Provenance for every claim.
- No exposed personal data or unsafe small-area output.
- Mobile, keyboard, screen-reader, and reduced-motion testing.
- External review and a visible correction process.
