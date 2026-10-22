# Changelog

All notable changes to this project are documented here.

## 2.0.0, 2026-10-21

Professional rebuild of the checker.

- Rebuilt the home page as a CNIC eligibility checker with a clean Tailwind layout, an auto-formatting CNIC input (`#####-#######-#`), inline validation errors, and a loading state on the search button.
- Added shared CNIC helpers in `src/lib/cnic.js` for normalising, validating (13 digits, first digit 1 to 7, no single repeated digit), and formatting CNIC numbers.
- Rewrote the `/api/search` route: CNIC based lookup over GET or POST, server side validation with clean JSON errors, a cached CSV reader, case-insensitive CNIC column detection, exact matching on normalised digits, and only the matched record is ever returned.
- Privacy: the real beneficiary dataset was removed from the repository tree and replaced with clearly fake sample data in `data/database.csv`. The dataset contract and the rule that real data must never be committed are documented in `data/README.md`, and `.gitignore` now covers `data/private/` and `*.local.csv`.
- Added clear guidance for the official check (SMS your CNIC to 8070) and a disclaimer that this is an unofficial community tool, in the page, the footer, and the README.
- Rewrote the README with purpose, features, how it works, quick start, dataset rules, project structure, tech stack, and deployment notes.
- Modernised the Button, InputField, and SearchTable components to match the new interface.
- Renamed the package to `nigahban-ramadan`, set the version to 2.0.0, and added an MIT license.

## 1.0.0, 2025

- Original release: a Next.js checker for the Nigahban Ramadan Package 2025, built for Tehsil Shujabad, District Multan.
