# Legal Explorer

The independent Legal Explorer is a public catalogue of Indian parliamentary bills. Its first data release is generated from Digital Sansad and keeps links to the official document versions supplied by that source.

## Refresh

Run:

```sh
npm run data:legal
```

This fetches every page currently reported by the public Digital Sansad bills endpoint and writes a normalised catalogue to `static/data/legal-explorer.json`. The generated file is committed so the deployed explorer remains usable when the upstream service is slow or changes.

## Verification states

- `official-import`: imported from an official source but not manually checked.
- `human-checked`: bibliographic fields and document links checked against official records.
- `editorial-review`: interpretive description or classification has undergone editorial review.

The first release contains only `official-import` records. It does not automatically infer political themes or affected communities.

## Source hierarchy

1. Gazette document for authoritative enacted text and commencement notifications.
2. Digital Sansad for bill history and parliamentary documents.
3. India Code for Acts, sections, and subordinate legislation.
4. Committee reports and parliamentary debates.
5. PRS and scholarship as secondary research aids, not substitutes for official text.

## Known boundary

The first importer covers parliamentary bills. Acts, subordinate legislation, policies, ordinances, state legislation, debates, judgments, and a human-reviewed thematic layer are later datasets connected through stable relationships rather than collapsed into the bill table.
