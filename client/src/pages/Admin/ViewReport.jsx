
//client/src/pages/Admin/ViewReport.jsx

import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Shared/Loading";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Stack
} from "@mui/material";

import { Dialog } from "@mui/material";

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewImage,setPreviewImage] = useState(null);


  const baseURL = axiosClient.defaults.baseURL.replace("/api", "");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/activity/${id}`);
        setData(res.data);
      } catch (err) {
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm("Approve this report?")) return;
    await axiosClient.put(`/activity/${id}/approve`);
    alert("Report approved");
    navigate("/admin/dashboard");
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this report?")) return;
    await axiosClient.put(`/activity/${id}/reject`);
    alert("Report rejected");
    navigate("/admin/dashboard");
  };

  if (loading) return <Loading />;
  if (!data) return <div>No data</div>;

 
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

      <Stack direction="row" spacing={3} mt={1}>
        <Chip label={data.reportType} sx={{ background: "#ede9fe" }} />
        <Chip
          label={data.status}
          color={
            data.status === "approved"
              ? "success"
              : data.status === "rejected"
              ? "error"
              : "warning"
          }
        />
        <Typography>{data.date}</Typography>
      </Stack>
    </Paper>

    

    {/* DOWNLOAD BUTTONS */}
    <Stack direction="row" spacing={2} mb={3}>
      <Button
        variant="contained"
        href={`/api/activity/${id}/pdf`}
        target="_blank"
      >
        Download PDF
      </Button>

      {/* <Button
        variant="outlined"
        href={`/api/activity/${id}/docx`}
        target="_blank"
      >
        Download DOCX
      </Button> */}
    </Stack>

    {/* COORDINATOR */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Coordinator</Typography>
      <Typography>{data.coordinator}</Typography>
    </Paper>

    {/* INVITATION */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Invitation</Typography>

      {data.invitation ? (
        <img
          src={`${baseURL}/${data.invitation}`}
          style={{ width: "100%", borderRadius: 8 }}
        />
      ) : (
        <Typography>No invitation uploaded</Typography>
      )}
    </Paper>

    {/* POSTER */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Poster</Typography>

      {data.poster ? (
        <img
          src={`${baseURL}/${data.poster}`}
          style={{ width: "100%", borderRadius: 8 }}
        />
      ) : (
        <Typography>No poster uploaded</Typography>
      )}
    </Paper>

    {/* RESOURCE PERSON */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Resource Person</Typography>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={8}>
          <Typography>
            <b>Name:</b> {data.resourcePerson?.name}
          </Typography>
          <Typography>
            <b>Designation:</b> {data.resourcePerson?.designation}
          </Typography>
          <Typography>
            <b>Institution:</b> {data.resourcePerson?.institution}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          {data.resourcePerson?.photo && (
            <img
              src={`${baseURL}/${data.resourcePerson.photo}`}
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}
        </Grid>
      </Grid>
    </Paper>

    {/* SESSION REPORT */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Session Report</Typography>

      <Typography mt={1}>{data.sessionReport?.summary}</Typography>

      <Stack direction="row" spacing={4} mt={2}>
        <Typography>
          <b>Students:</b> {data.sessionReport?.participantsCount}
        </Typography>

        <Typography>
          <b>Faculty:</b> {data.sessionReport?.facultyCount}
        </Typography>
      </Stack>
    </Paper>

    {/* ATTENDANCE */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Attendance</Typography>

      {data.attendanceFile ? (
        <Button
          variant="outlined"
          href={`${baseURL}/${data.attendanceFile}`}
          target="_blank"
        >
          Open Attendance File
        </Button>
      ) : (
        <Typography>No attendance uploaded</Typography>
      )}
    </Paper>

    {/* PHOTOS */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Photos</Typography>

      {/* <Grid container spacing={2} mt={1}>
        {data.photos?.map((p, i) => (
          <Grid key={i} item xs={12} md={4}>
            <img
              src={`${baseURL}/${p}`}
              style={{
                width: "100%",
                borderRadius: 8
              }}
            />
          </Grid>
        ))}
      </Grid> */}


      <Grid container spacing={2} mt={1}>
{data.photos?.map((p,i)=>(
<Grid key={i} item xs={12} md={4}>
<img
src={`${baseURL}/${p}`}
style={{
width:"100%",
borderRadius:8,
cursor:"pointer"
}}
onClick={()=>setPreviewImage(`${baseURL}/${p}`)}
/>
</Grid>
))}
</Grid>

    </Paper>

    {/* FEEDBACK */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6">Feedback</Typography>
      <Typography mt={1}>{data.feedback}</Typography>
    </Paper>

    {/* ACTION BUTTONS */}
    <Stack direction="row" spacing={2} mt={3}>
      {data.status === "pending" && (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
          >
            Reject
          </Button>
        </>
      )}

      <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>
        Back
      </Button>
    </Stack>

<Dialog open={Boolean(previewImage)} onClose={()=>setPreviewImage(null)} maxWidth="md">
<img src={previewImage} style={{width:"100%"}} />
</Dialog>
  </Box>
  
);



}
