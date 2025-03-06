import fs from "fs";
import path from "path";
import csv from "csv-parser";

// Define paths
const statsFilePath = path.join(process.cwd(), "data", "stats.json");
const csvFilePath = path.join(process.cwd(), "data", "database.csv");

// Function to read and update stats
export default function handler(req, res) {
  // Ensure stats.json exists
  if (!fs.existsSync(statsFilePath)) {
    fs.writeFileSync(statsFilePath, JSON.stringify({ totalSearches: 0, totalEntries: 0, liveVisitors: 100 }, null, 2));
  }

  let stats = JSON.parse(fs.readFileSync(statsFilePath, "utf8"));

  if (req.method === "POST") {
    // Increase totalSearches when a search happens
    stats.totalSearches++;

    // Save updated stats
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));

    return res.status(200).json(stats);
  }

  if (req.method === "GET") {
    // Count total entries from CSV
    let totalEntries = 0;
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", () => totalEntries++)
      .on("end", () => {
        stats.totalEntries = totalEntries;

        // Increase liveVisitors on each visit
        stats.liveVisitors++;

        // Save updated stats
        fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));

        res.status(200).json(stats);
      });
  }
}
