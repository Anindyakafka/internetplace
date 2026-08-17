# Local Research Workspace

This directory separates research acquisition from public website assets.

```text
research/annihilation-atlas/
├── DATA_INVENTORY.csv       # tracked provenance register
├── README.md                # tracked instructions
├── raw/                     # ignored: untouched source downloads
│   ├── census/
│   ├── labour/
│   ├── land/
│   ├── institutions/
│   ├── boundaries/
│   └── archive/
├── working/                 # ignored: intermediate analysis files
└── private/                 # ignored: field notes and sensitive material
```

Only reviewed, aggregated, disclosure-safe derived data should eventually enter `static/data/annihilation-atlas/`. Never place licensed microdata, personal information, exact sensitive locations, interviews, or unreviewed field notes under `static/`.

Add an inventory row before analysing a source. Use one stable `source_id` across scripts, notes, and public citations.
