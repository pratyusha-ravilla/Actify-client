

// client/src/pages/Faculty/ViewMyReport.jsx

import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./ViewMyReport.css";
import { 
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Stack
} from "@mui/material";


export default function ViewMyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

 
const backend = axiosClient.defaults.baseURL.replace("/api", "");


const getImageUrl = (path) => {
  if (!path) return "";

  const cleanPath = path.replace(/\\/g, "/");

  // if uploads already exists
  if (cleanPath.startsWith("uploads")) {
    return `${backend}/${cleanPath}`;
  }

  return `${backend}/uploads/${cleanPath}`;
};



  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/activity/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (!data) return <Box sx={{ p: 4 }}>Report not found</Box>;

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
      a.download = `${data.activityName}.${type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  const ImageGrid = ({ images = [] }) => (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
      {images.length === 0
        ? <Typography color="text.secondary">No images uploaded</Typography>
        : images.map((img, i) => (
            <img
              key={i}
             
              src={`${backend}/${img?.replace(/\\/g, "/")}`}
              alt={`img-${i}`}
              style={{ width: 150, borderRadius: 6 }}
            />
          ))
      }
    </Box>
    
  );

  


return (
  <Box
    sx={{
      maxWidth: 1100,
      margin: "30px auto",
      px: 3
    }}
  >

    {/* HEADER */}
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 3,
        background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
        color: "#fff"
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {data.activityName}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        {data.reportType} • {data.academicYear}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Status: <b>{data.status}</b>
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2, background: "#fff", color: "#5b21b6" }}
          onClick={() => downloadFile("pdf")}
        >
          Download PDF
        </Button>

        {/* <Button
          variant="outlined"
          sx={{ mr: 2, borderColor: "#fff", color: "#fff" }}
          onClick={() => downloadFile("docx")}
        >
          Download DOCX
        </Button> */}

        {data.status === "pending" && (
          <Link to={`/faculty/report/${id}/edit`}>
            <Button variant="contained" sx={{ background: "#16a34a" }}>
              Edit
            </Button>
          </Link>
        )}

        <Button
          variant="text"
          sx={{ ml: 2, color: "#fff" }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Paper>

    {/* ACTIVITY DETAILS */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Activity Details</Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Typography><b>Coordinator:</b> {data.coordinator || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography><b>Date:</b> {data.date || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography><b>Duration:</b> {data.duration || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography><b>PO & POs:</b> {data.poPos || "-"}</Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* INVITATION */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Invitation</Typography>

      {data.invitation ? (
        <img
          src={getImageUrl(data.invitation)}
          style={{ width: "70%", borderRadius: 8, marginTop: 10 }}
        />

  
      ) : (
        <Typography color="text.secondary">
          No invitation uploaded
        </Typography>
      )}
    </Paper>

    {/* POSTER */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Poster</Typography>

      {data.poster ? (
        <img
         src={getImageUrl(data.poster)}
          style={{ width: "70%", borderRadius: 8, marginTop: 10 }}
        />

    
      ) : (
        <Typography color="text.secondary">
          No poster uploaded
        </Typography>
      )}
    </Paper>

    {/* RESOURCE PERSON */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Resource Person</Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Typography><b>Name:</b> {data.resourcePerson?.name || "-"}</Typography>
          <Typography><b>Designation:</b> {data.resourcePerson?.designation || "-"}</Typography>
          <Typography><b>Institution:</b> {data.resourcePerson?.institution || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          {data.resourcePerson?.photo && (
            <img
              src={getImageUrl(data.resourcePerson?.photo)}
              style={{ width: "70%", borderRadius: 8 }}
            />
          )}
        </Grid>
      </Grid>
    </Paper>

    {/* SESSION REPORT */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Session Report</Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Session Name:</b> {data.sessionReport?.sessionName || "-"}
      </Typography>

      <Typography>
        <b>Coordinators:</b>{" "}
        {(data.sessionReport?.coordinators || []).join(", ")}
      </Typography>

      <Typography>
        <b>Category:</b> {data.sessionReport?.categoryOfEvent || "-"}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        {data.sessionReport?.summary || "-"}
      </Typography>

      <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
        <Typography>
          <b>Students:</b> {data.sessionReport?.participantsCount || 0}
        </Typography>

        <Typography>
          <b>Faculty:</b> {data.sessionReport?.facultyCount || 0}
        </Typography>
      </Stack>
    </Paper>

    {/* ATTENDANCE */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Attendance Images</Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {(data.attendanceImages || []).length === 0 ? (
          <Typography>No attendance images uploaded</Typography>
        ) : (
          data.attendanceImages.map((img, i) => (
            <Grid item xs={12} md={4} key={i}>
              <img
                src={getImageUrl(img)}
                style={{ width: "70%", borderRadius: 8 }}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Paper>

    {/* EVENT PHOTOS */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Event Photos</Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {(data.photos || []).length === 0 ? (
          <Typography>No photos uploaded</Typography>
        ) : (
          data.photos.map((img, i) => (
            <Grid item xs={12} md={4} key={i}>
              <img
                src={getImageUrl(img)}
                style={{ width: "70%", borderRadius: 8 }}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Paper>

    {/* FEEDBACK */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Feedback</Typography>

      <Typography sx={{ mt: 1 }}>
        {data.feedback || "No feedback provided"}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {(data.feedbackImages || []).length === 0 ? (
          <Typography>No feedback images</Typography>
        ) : (
          data.feedbackImages.map((img, i) => (
            <Grid item xs={12} md={4} key={i}>
              <img
                src={getImageUrl(img)}
                style={{ width: "70%", borderRadius: 8 }}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Paper>

  </Box>
);

}
