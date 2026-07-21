/**
 * Single source of truth for project metadata.
 * The Work grid and individual case-study routes both read from here.
 *
 * Slug must match the Markdown file at src/content/projects/<slug>.md (if one exists).
 * `status: "live"` projects have a case-study page; others are listed on the grid only.
 */

export type ProjectCategory =
  | "data"
  | "research"
  | "writing"
  | "art"
  | "tooling";

export interface Project {
  slug: string;
  title: string;
  year: number | string;
  blurb: string;            // one-line, grid tile
  categories: ProjectCategory[];
  status: "live" | "planned" | "external";
  repo?: string;            // GitHub URL
  liveUrl?: string;         // public site
  collaborators?: string[];
  thumbnail?: string;       // path under /images/projects/
  featured?: boolean;       // surface on home
  regions?: string[];       // geographic regions (state codes) for map
}

export const projects: Project[] = [
  {
    slug: "cbfc-watch",
    title: "CBFC Watch",
    year: 2025,
    blurb: "An interactive explorer of cuts ordered by India's Central Board of Film Certification.",
    categories: ["data", "research", "tooling"],
    status: "live",
    repo: "https://github.com/Anindyakafka/CensorBoard_records",
    liveUrl: "https://cbfc.watch/",
    featured: true,
    regions: ["DL"]
  },
  {
    slug: "dadri-forecast",
    title: "Dadri Forecast",
    year: 2024,
    blurb: "A militant-research manifesto on caste, labour, and the political ecology of Dadri.",
    categories: ["writing", "research", "art"],
    status: "external",
    liveUrl: "https://khanderartspace.netlify.app/dadri-forecast",
    featured: true,
    regions: ["UP", "RJ", "HR"]
  },
  {
    slug: "name-ethnicity-detector",
    title: "Name Ethnicity Detector",
    year: 2023,
    blurb: "PyTorch name→ethnicity classifier with nine model configurations, up to 99% accuracy on single-country splits.",
    categories: ["research", "tooling"],
    status: "external",
    repo: "https://github.com/Anindyakafka/name-ethnicity-detector",
    featured: true,
    regions: ["MH"]
  },
  {
    slug: "mgnrega-assets-bihar",
    title: "MGNREGA Assets Scraper (Bihar)",
    year: 2025,
    blurb: "A concurrent scraping + processing pipeline for MGNREGA asset records across Bihar's districts.",
    categories: ["data", "tooling"],
    status: "external",
    repo: "https://github.com/Anindyakafka/MGNREGA_assets",
    regions: ["BH"]
  },
  {
    slug: "sounding-names-religion",
    title: "Sounding Names / Religion",
    year: 2024,
    blurb: "On the sonic and religious dimensions of personal names.",
    categories: ["research", "writing"],
    status: "external",
    repo: "https://github.com/Anindyakafka/Sounding-Names_religion",
    regions: ["MH", "KA"]
  },
  {
    slug: "netcdf-manipulation-conversion",
    title: "netCDF Manipulation & Conversion",
    year: 2023,
    blurb: "Utilities for working with climate netCDF files — subsetting, conversion, restructuring.",
    categories: ["tooling", "data"],
    status: "external",
    repo: "https://github.com/Anindyakafka/netCDF_manipulation_x_conversion",
    regions: ["KA"]
  },
  {
    slug: "electoral-rolls-wb-2002",
    title: "Electoral Rolls — West Bengal, 2002",
    year: 2023,
    blurb: "Digitised and cleaned voter rolls from West Bengal's 2002 electoral register.",
    categories: ["data", "research"],
    status: "external",
    repo: "https://github.com/Anindyakafka/Electoral-Rolls-West-Bengal-2002",
    regions: ["WB"]
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectsByCategory = (cat: ProjectCategory) =>
  projects.filter((p) => p.categories.includes(cat));
