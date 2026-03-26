

// client/src/pages/faculty/PreviewReport.jsx

import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import ViewMyReport from "./ViewMyReport";

export default function PreviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const downloadFile = async (type) => {
    try {
      const res = await axiosClient.get(
        `/activity/${id}/${type}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `activity-report.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Toolbar */}
      {/* <Box
        sx={{
          p: 1.5,
          display: "flex",
          gap: 1,
          borderBottom: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <Button variant="contained" onClick={() => downloadFile("pdf")}>
          Download PDF
        </Button>

        <Button variant="contained" onClick={() => downloadFile("docx")}>
          Download DOCX
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate(`/faculty/report/${id}/edit`)}
        >
          Edit Report
        </Button>

        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box> */}

      {/* React Preview (NO iframe) */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <ViewMyReport />
      </Box>
    </Box>
  );
}
