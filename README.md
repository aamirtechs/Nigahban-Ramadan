# Nigahban Ramadan Package: CNIC Eligibility Checker

A small Next.js web app for checking whether a CNIC appears on an eligibility list for the Punjab Nigahban Ramadan Package.

This public repository ships with sample data only. It is an unofficial community tool and is not affiliated with the Government of Punjab.

## Screenshot

A screenshot of the checker will be added here once the v2 interface is captured. Until then, run the app locally with the quick start below to see it.

## Features

- CNIC input with automatic formatting as `#####-#######-#` while typing
- Client side and server side CNIC validation: 13 digits, first digit 1 to 7, no repeated single digit numbers
- Server side lookup against a local CSV file; only the matched record is returned to the browser
- Clear result states: eligible record card, not found guidance, and error notice
- Guidance for the official check: SMS your CNIC to 8070
- Privacy first dataset handling: sample data in the repo, real data kept private and outside version control

## How it works

1. The visitor enters a CNIC on the home page.
2. The browser validates and formats the number, then sends it to `GET /api/search?cnic=...` (a `POST` with a JSON body `{ "cnic": "..." }` also works).
3. The API route validates the CNIC again with `src/lib/cnic.js`, loads the CSV through a cached reader, and compares normalised digits against the CNIC column.
4. On a match, the API returns `{ "found": true, "record": { ... } }` with every column of that single row as labelled fields. On no match it returns `{ "found": false }`. Invalid input gets a `400` JSON error.

The CNIC column is detected case-insensitively among the header names listed in [data/README.md](data/README.md).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and try a sample CNIC from `data/database.csv`, for example `35202-0000000-1`.

Production build:

```bash
npm run build
npm run start
```

## Dataset

See [data/README.md](data/README.md) for the full dataset contract.

In short:

- `data/database.csv` in this repository contains clearly fake sample rows only.
- Real beneficiary data must never be committed to this public repository.
- To run against a private list, set `DATA_CSV_PATH` to a file outside the repo:

```bash
DATA_CSV_PATH=/private/path/to/beneficiaries.csv npm run start
```

## Project structure

```text
data/
  database.csv        Sample data only
  README.md           Dataset contract and privacy rule
public/
  bg.svg              Background artwork
  logo.svg            Programme logo used in the header
src/
  components/
    Button.js         Primary action button with loading state
    InputField.js     Labelled CNIC input with inline errors
    SearchTable.js    Eligibility record as label and value rows
  lib/
    cnic.js           CNIC normalise, validate, and format helpers
  pages/
    _app.js           App shell and document title
    index.js          Checker page
    api/
      search.js       CNIC lookup API route
globals.css           Tailwind styles
next.config.mjs
package.json
tailwind.config.js
```

## Tech stack

- Next.js 15 (pages router) and React 19
- Tailwind CSS 4 for styling
- csv-parser for server side CSV reading
- lucide-react for icons

## Deployment

The app deploys cleanly to Vercel as a standard Next.js project. Import the repository, keep the default build settings, and set `DATA_CSV_PATH` only if your deployment reads its dataset from a private location available to the server. Do not upload a real beneficiary list to a public deployment of this code without your own privacy review.

## Disclaimer

This is an unofficial community tool. It is not affiliated with, endorsed by, or operated by the Government of Punjab. Eligibility results shown here come from whatever list the operator configured and may be partial or out of date. The official result is the one issued through the Punjab government channel: SMS your CNIC to 8070.

## License

MIT. Copyright 2025-2026 Amir Hussain. See [LICENSE](LICENSE).
