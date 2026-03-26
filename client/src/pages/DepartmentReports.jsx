//client/src/pages/DepartmentReports.jsx


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

export default function DepartmentReports() {
  const { code } = useParams();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axiosClient.get(`/activity/department/${code}`)
      .then(res => setReports(res.data))
      .catch(console.error);
  }, [code]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{code} Department Reports</h2>

      {reports.map(r => (
        <div key={r._id} className="report-card">
          <h4>{r.activityName}</h4>
          <p>Type: {r.reportType}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}
