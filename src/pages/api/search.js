import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export default function handler(req, res) {
  const { mobileNo } = req.query;
  if (!mobileNo) return res.status(400).json({ error: "Missing mobileNo parameter" });

  const filePath = path.join(process.cwd(), 'public', 'data.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV file NOT found at: ${filePath}`);
    return res.status(500).json({ error: "CSV file not found" });
  }

  let foundRecord = null;
  const searchNumber = mobileNo.replace(/\D/g, '').trim(); // Normalize input

  fs.createReadStream(filePath)
    .pipe(
      csvParser({
        mapHeaders: ({ header }) => header.trim().replace(/\./g, ''), // Normalize column names
        skipLines: 0,
      })
    )
    .on('data', (row) => {

      const csvMobileNumber = String(row["MobileNo"] || "").trim().replace(/\D/g, '');

      if (csvMobileNumber === searchNumber) {
        foundRecord = row;
      }
    })
    .on('end', () => {
      if (foundRecord) {
        return res.status(200).json(foundRecord);
      } else {
        console.log(`❌ No match found for ${searchNumber}`);
        return res.status(404).json({ error: "No match found" });
      }
    })
    .on('error', (error) => {
      console.error(`❌ CSV Parsing Error:`, error);
      return res.status(500).json({ error: error.message });
    });
}
