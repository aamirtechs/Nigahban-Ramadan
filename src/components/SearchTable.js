import React from "react";

/**
 * Renders an eligibility record as label and value rows.
 *
 * Accepts any of:
 *  - a plain record object: { CNIC: "...", Name: "..." }
 *  - an API payload: { found: true, record: { ... } }
 *  - an array of record objects (the first record is shown)
 */
function toEntries(data) {
  if (!data) return [];
  const record = Array.isArray(data) ? data[0] : data.record || data;
  if (!record || typeof record !== "object") return [];
  return Object.entries(record).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
}

const SearchTable = ({ data }) => {
  const entries = toEntries(data);
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-3">
        <h3 className="text-base font-semibold text-emerald-900">
          Eligibility record
        </h3>
      </div>
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-slate-100">
          {entries.map(([label, value]) => (
            <tr key={label} className="align-top">
              <th
                scope="row"
                className="w-2/5 bg-slate-50 px-5 py-3 font-medium text-slate-500"
              >
                {label}
              </th>
              <td className="px-5 py-3 font-medium text-slate-900">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchTable;
