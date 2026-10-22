import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { normalizeCnic, isValidCnic } from "../../lib/cnic";

const CNIC_COLUMN_NAMES = new Set([
  "cnic",
  "cnic_no",
  "cnic_number",
  "cnicno",
  "id_card",
  "شناختی کارڈ",
]);

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "_");
}

export function prettifyLabel(header) {
  const key = String(header || "").trim();
  const normalized = normalizeHeader(key);
  if (CNIC_COLUMN_NAMES.has(normalized) || normalized === "id") return "CNIC";
  return key
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

let datasetPromise = null;

function getDatasetPath() {
  const configured = process.env.DATA_CSV_PATH;
  if (configured && configured.trim()) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured);
  }
  return path.join(process.cwd(), "data", "database.csv");
}

function loadDataset() {
  if (datasetPromise) return datasetPromise;

  const filePath = getDatasetPath();

  datasetPromise = new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Dataset file not found at ${filePath}`));
      return;
    }

    const rows = [];
    let cnicColumn = null;

    fs.createReadStream(filePath)
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => String(header).trim(),
        })
      )
      .on("headers", (headers) => {
        cnicColumn =
          headers.find((header) =>
            CNIC_COLUMN_NAMES.has(normalizeHeader(header))
          ) || null;
      })
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        if (!cnicColumn) {
          reject(new Error("Dataset has no recognised CNIC column"));
          return;
        }
        resolve({ rows, cnicColumn });
      })
      .on("error", (error) => reject(error));
  });

  datasetPromise.catch(() => {
    datasetPromise = null;
  });

  return datasetPromise;
}

function getCnicParam(req) {
  if (req.query && req.query.cnic) return req.query.cnic;
  const body = req.body;
  if (!body) return "";
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      return parsed.cnic || "";
    } catch {
      return "";
    }
  }
  return body.cnic || "";
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawCnic = getCnicParam(req);
  const cnic = normalizeCnic(rawCnic);

  if (!rawCnic || !isValidCnic(cnic)) {
    return res.status(400).json({
      error:
        "Invalid CNIC. Enter a 13 digit CNIC in the format 35202-1234567-1.",
    });
  }

  try {
    const { rows, cnicColumn } = await loadDataset();
    const match = rows.find(
      (row) => normalizeCnic(row[cnicColumn]) === cnic
    );

    if (!match) {
      return res.status(200).json({ found: false });
    }

    const record = {};
    for (const [key, value] of Object.entries(match)) {
      record[prettifyLabel(key)] = value === undefined ? "" : String(value);
    }

    return res.status(200).json({ found: true, record });
  } catch (error) {
    console.error("Dataset error:", error.message);
    return res.status(500).json({
      error: "The eligibility dataset is unavailable. Please try again later.",
    });
  }
}
