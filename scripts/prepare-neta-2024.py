"""Build the 18th Lok Sabha explorer dataset from public ADR and PRS data.

ADR/MyNeta supplies 2024 winner affidavit fields. PRS supplies parliamentary
activity for the 18th Lok Sabha. Records are joined by constituency and a
normalised candidate name; activity is never copied by constituency alone.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import unicodedata
import urllib.request
from difflib import SequenceMatcher
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
MYNETA_URL = "https://www.myneta.info/LokSabha2024/index.php?action=show_winners&sort=default"
PRS_URL = "https://prsindia.org/mptrack/download?file_path=files%2Fmptrack%2F18-lok-sabha%2FMp-Track%2F18%20LS%20MP%20Track.csv"


def fetch_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "internetplace-data-builder/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8-sig", errors="replace")


def normalise(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "").encode("ascii", "ignore").decode()
    value = re.sub(r"\([^)]*\)", " ", value.lower())
    value = re.sub(r"\b(dr|prof|adv|shri|smt|md|mohd|mohammad|mohammed)\b", " ", value)
    return re.sub(r"[^a-z0-9]+", "", value)


def seat_key(value: str) -> str:
    return normalise(re.sub(r"\s+\((sc|st)\)\s*$", "", value or "", flags=re.I))


def number(value: str, multiplier: float = 1) -> float | int | None:
    if not value or value.strip().upper() in {"NA", "N/A", "-"}:
        return None
    try:
        result = float(value) * multiplier
        return int(result) if result.is_integer() else round(result, 2)
    except ValueError:
        return None


def rupees(value: str) -> int | None:
    first_line = (value or "").splitlines()[0]
    if first_line.strip().lower() in {"nil", "none", "image", ""}:
        return 0 if first_line.strip().lower() == "nil" else None
    digits = re.sub(r"\D", "", first_line)
    return int(digits) if digits else None


def parse_myneta(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    winners: dict[int, dict] = {}
    for row in soup.select("tr"):
        cells = row.find_all("td", recursive=False)
        link = row.select_one("a[href*='candidate_id=']")
        if len(cells) != 8 or not link:
            continue
        match = re.search(r"candidate_id=(\d+)", link.get("href", ""))
        if not match:
            continue
        candidate_id = int(match.group(1))
        winners[candidate_id] = {
            "candidate": link.get_text(" ", strip=True),
            "ls_seat_name": cells[2].get_text(" ", strip=True),
            "party_x": cells[3].get_text(" ", strip=True),
            "criminal_cases": number(cells[4].get_text(" ", strip=True)),
            "education_x": cells[5].get_text(" ", strip=True) or "Not reported",
            "total_assets": rupees(cells[6].get_text("\n", strip=True)),
            "liabilities": rupees(cells[7].get_text("\n", strip=True)),
            "candidate_id": candidate_id,
        }
    return list(winners.values())


def parse_prs(text: str) -> list[dict]:
    # PRS retains former members for the historical record. The explorer's
    # headline record is the current member, so superseded rows stay out.
    return [
        row for row in csv.DictReader(io.StringIO(text))
        if row["term_end_date"].strip().lower() == "in office"
    ]


def build(myneta_html: str, prs_csv: str) -> tuple[list[dict], dict]:
    winners = parse_myneta(myneta_html)
    prs_rows = parse_prs(prs_csv)
    winners_by_seat: dict[str, list[dict]] = {}
    for winner in winners:
        winners_by_seat.setdefault(seat_key(winner["ls_seat_name"]), []).append(winner)

    matched = 0
    records = []
    for prs in prs_rows:
        possibilities = winners_by_seat.get(seat_key(prs["pc_name"]), [])
        winner = None
        if possibilities:
            ranked = sorted(
                possibilities,
                key=lambda row: SequenceMatcher(None, normalise(prs["mp_name"]), normalise(row["candidate"])).ratio(),
                reverse=True,
            )
            score = SequenceMatcher(None, normalise(prs["mp_name"]), normalise(ranked[0]["candidate"])).ratio()
            if score >= 0.58:
                winner = ranked[0]
                matched += 1

        records.append({
            "candidate": prs["mp_name"],
            "state_ut_name": prs["state"],
            "ls_seat_name": prs["pc_name"],
            "party_x": prs["mp_political_party"],
            "criminal_cases": winner["criminal_cases"] if winner else None,
            "education_x": winner["education_x"] if winner else prs["educational_qualification"],
            "total_assets": winner["total_assets"] if winner else None,
            "liabilities": winner["liabilities"] if winner else None,
            "candidate_id": winner["candidate_id"] if winner else None,
            "attendance": number(prs["attendance"], 100),
            "questions": number(prs["questions"]),
            "debates": number(prs["debates"]),
            "private_member_bills": number(prs["private_member_bills"]),
            "age_y": number(prs["mp_age"]),
            "gender": prs["mp_gender"],
            "prs_member_id": number(prs["mp_election_index"]),
            "activity_note": prs["mp_note"].strip(),
        })

    records.sort(key=lambda row: (row["state_ut_name"], row["ls_seat_name"]))
    return records, {"myneta_winners_parsed": len(winners), "prs_members": len(prs_rows), "affidavit_matches": matched}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--myneta-html", type=Path)
    parser.add_argument("--prs-csv", type=Path)
    parser.add_argument("--output", type=Path, default=ROOT / "static/data/neta/representatives-2024.json")
    args = parser.parse_args()

    myneta_html = args.myneta_html.read_text(encoding="utf-8") if args.myneta_html else fetch_text(MYNETA_URL)
    prs_csv = args.prs_csv.read_text(encoding="utf-8-sig") if args.prs_csv else fetch_text(PRS_URL)
    records, report = build(myneta_html, prs_csv)
    if report["myneta_winners_parsed"] < 450 or report["prs_members"] < 530:
        raise SystemExit("Source parsing returned too few records; refusing to publish.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
