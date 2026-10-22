# Dataset contract

The eligibility checker reads a single CSV file on the server and returns
only the record that matches the CNIC a visitor submits. The whole dataset
is never sent to the browser.

## Privacy rule

Real beneficiary data must never be committed to this public repository.

This repository ships `data/database.csv` with clearly fake sample rows only,
so the app can be run, reviewed, and tested safely. If you operate a private
deployment with a real list, keep that file outside version control (see
below) and never push it to a public remote. Names, CNIC numbers, and any
other personal data belong in private storage only.

## Expected columns

The sample file uses this header row:

```csv
cnic,name,father_name,district,tehsil,amount,status
```

Only the CNIC column is required for a match. Every column in a matched row
is returned to the visitor as a labelled field, so extra columns are fine
and missing optional columns simply do not appear in the result.

## Recognised CNIC column names

The API detects the CNIC column case-insensitively. Any of these header
names works:

- `cnic`
- `cnic_no`
- `cnic_number`
- `cnicno`
- `id_card`
- `شناختی کارڈ`

Row values may be written with or without dashes (`35202-1234567-1` or
`3520212345671`). Both the submitted CNIC and the stored value are
normalised to plain digits before comparison.

## Using a private local dataset

Set the `DATA_CSV_PATH` environment variable to point the API at a file
outside the repository, for example:

```bash
DATA_CSV_PATH=/private/path/to/beneficiaries.csv npm run start
```

Relative paths are resolved from the project root. When `DATA_CSV_PATH` is
not set, the API falls back to `data/database.csv` (the sample file).

For local-only files kept inside the project tree, the `data/private/`
folder and any `*.local.csv` file are already covered by `.gitignore`.
