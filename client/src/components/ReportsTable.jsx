
//client/src/components/ReportTable.jsx

import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ReportsTable({
  reports,
  page,
  pageSize,
  total,
  onSort,
  sortBy,
  sortDir,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Activity Name</th>
            <th className="p-2">Type</th>
            <th className="p-2 cursor-pointer" onClick={() => onSort("date")}>
              Date {sortBy === "date" ? (sortDir === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />) : null}
            </th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{r.activityName}</td>
              <td className="p-2 capitalize">{r.reportType}</td>
              <td className="p-2">{r.date || "-"}</td>
              <td className="p-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="p-2">
                <Link to={`/faculty/report/${r._id}`} className="text-purple-700 font-semibold hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onPageChange(Math.max(1, page - 1))} className="px-3 py-1 bg-gray-100 rounded">
            Prev
          </button>
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="px-3 py-1 bg-indigo-600 text-white rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
