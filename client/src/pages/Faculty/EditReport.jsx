
// client/src/pages/Faculty/EditReport.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button
} from "@mui/material";

import axiosClient from "../../utils/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./EditReport.css";




export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    reportType: "conducted",
    academicYear: "",
    activityName: "",
    coordinator: "",
    date: "",
    duration: "",
    poPos: "",

    resourceName: "",
    resourceDesignation: "",
    resourceInstitution: "",

    sessionName: "",
    coordinatorsText: "",
    googleMeetLink: "",
    intendedParticipants: "",
    categoryOfEvent: "",
    sessionDate: "",
    sessionSummary: "",
    participantsCount: "",
    facultyCount: "",
    feedback: "",
  });

  /* ================= FILE PREVIEWS ================= */
  const [previews, setPreviews] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceImages: [],
    photos: [],
    feedbackImages: [],
  });

  const [existing, setExisting] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceImages: [],
    photos: [],
    feedbackImages: [],
  });


//new update
const [deletedImages, setDeletedImages] = useState({
  attendanceImages: [],
  photos: [],
  feedbackImages: [],
});


const [previewImage, setPreviewImage] = useState(null);



  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/activity/${id}`);
        const d = res.data;
        const sr = d.sessionReport || {};
      
        setForm({
          reportType: d.reportType,
          academicYear: d.academicYear,
          activityName: d.activityName,
          coordinator: d.coordinator,
          date: d.date,
          duration: d.duration,
          poPos: d.poPos,

          resourceName: d.resourcePerson?.name || "",
          resourceDesignation: d.resourcePerson?.designation || "",
          resourceInstitution: d.resourcePerson?.institution || "",

          sessionName: sr.sessionName || "",
          coordinatorsText: (sr.coordinators || []).join(", "),
          googleMeetLink: sr.googleMeetLink || "",
          intendedParticipants: sr.intendedParticipants || "",
          categoryOfEvent: sr.categoryOfEvent || "",
          sessionDate: sr.date || "",
          sessionSummary: sr.summary || "",
          participantsCount: sr.participantsCount || "",
          facultyCount: sr.facultyCount || "",
          feedback: d.feedback || "",
        });

       
const baseURL = axiosClient.defaults.baseURL
  .replace("/api", "")
  .replace(/\/$/, "");

setExisting({
  invitation: d.invitation
    ? `${baseURL}/${d.invitation}`
    : null,

  poster: d.poster
    ? `${baseURL}/${d.poster}`
    : null,

  resourcePhoto: d.resourcePerson?.photo
    ? `${baseURL}/${d.resourcePerson.photo}`
    : null,

  attendanceImages: (d.attendanceImages || []).map(
    img => `${baseURL}/${img}`
  ),

  photos: (d.photos || []).map(
    img => `${baseURL}/${img}`
  ),

  feedbackImages: (d.feedbackImages || []).map(
    img => `${baseURL}/${img}`
  )
}

);


console.log("EDIT IMAGES CHECK:", {
  attendance: d.attendanceImages,
  resolved: (d.attendanceImages || []).map(img => `${baseURL}/${img}`)
});
console.log("FEEDBACK RAW:", d.feedbackImages);
        
      } catch (err) {
  console.log("LOAD ERROR:", err);
}finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);



  /* ================= HELPERS ================= */
  const previewSingle = (e, key) => {
    const f = e.target.files[0];
    if (f) setPreviews(p => ({ ...p, [key]: URL.createObjectURL(f) }));
  };

  const previewMultiple = (e, key) => {
    const arr = Array.from(e.target.files || []);
    setPreviews(p => ({
      ...p,
      [key]: arr.map(f => URL.createObjectURL(f)),
    }));
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();

    
      fd.append(
  "payload",
  JSON.stringify({
    ...form,
    deletedImages,   // 👈 ADD THIS
    updatedBy: user?.id,
    resourcePerson: {
      name: form.resourceName,
      designation: form.resourceDesignation,
      institution: form.resourceInstitution,
    },
    sessionReport: {
      sessionName: form.sessionName,
      coordinators: form.coordinatorsText.split(",").map(s => s.trim()),
      googleMeetLink: form.googleMeetLink,
      intendedParticipants: form.intendedParticipants,
      categoryOfEvent: form.categoryOfEvent,
      date: form.sessionDate,
      summary: form.sessionSummary,
      participantsCount: form.participantsCount,
      facultyCount: form.facultyCount,
    },
  })
);


      ["invitation", "poster", "resourcePhoto"].forEach(k => {
        if (e.target[k]?.files?.[0]) fd.append(k, e.target[k].files[0]);
      });

      ["attendanceImages", "photos", "feedbackImages"].forEach(k => {
        Array.from(e.target[k]?.files || []).forEach(f => fd.append(k, f));
      });

      await axiosClient.put(`/activity/${id}`, fd);
      alert("Report updated");
      navigate(`/faculty/report/${id}`);
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  console.log("FORM DATA:", form);



  //new update

  const removeImage = (type, index) => {
  setDeletedImages((prev) => ({
    ...prev,
    [type]: [...prev[type], index],
  }));
};

  /* ================= UI ================= */
  return (
    <Box className="edit-wrapper">
      <Paper className="edit-paper">
        <Typography variant="h5" className="edit-title">
          Edit Activity Report
        </Typography>

        <form onSubmit={handleUpdate}>
 
          
          {/* ACTIVITY DETAILS */}
          {/* ================= ACTIVITY DETAILS ================= */}
<div className="edit-section">
  <h3>Activity Details</h3>

  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <TextField
        select
        label="Report Type"
        fullWidth
        value={form.reportType}
        onChange={(e) =>
          setForm({ ...form, reportType: e.target.value })
        }
      >
        <MenuItem value="conducted">Conducted</MenuItem>
        <MenuItem value="attended">Attended</MenuItem>
        <MenuItem value="expert_talk">Expert Talk</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        label="Academic Year"
        fullWidth
        value={form.academicYear}
        onChange={(e) =>
          setForm({ ...form, academicYear: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Activity Name"
        fullWidth
        value={form.activityName}
        onChange={(e) =>
          setForm({ ...form, activityName: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Coordinator"
        fullWidth
        value={form.coordinator}
        onChange={(e) =>
          setForm({ ...form, coordinator: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField
        label="Duration"
        fullWidth
        value={form.duration}
        onChange={(e) =>
          setForm({ ...form, duration: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField
        label="PO & POs"
        fullWidth
        value={form.poPos}
        onChange={(e) =>
          setForm({ ...form, poPos: e.target.value })
        }
      />
    </Grid>
  </Grid>
</div>


          {/* INVITATION */}
          <ImageSection
            title="Invitation"
            name="invitation"
            preview={previews.invitation}
            existing={existing.invitation}
            onChange={previewSingle}
          />

          {/* POSTER */}
          <ImageSection
            title="Poster"
            name="poster"
            preview={previews.poster}
            existing={existing.poster}
            onChange={previewSingle}
          />

          {/* RESOURCE PERSON */}
         {/* ================= RESOURCE PERSON ================= */}
<div className="edit-section">
  <h3>Resource Person Details</h3>

  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <TextField
        label="Resource Name"
        fullWidth
        value={form.resourceName}
        onChange={(e) =>
          setForm({ ...form, resourceName: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="Designation"
        fullWidth
        value={form.resourceDesignation}
        onChange={(e) =>
          setForm({ ...form, resourceDesignation: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="Institution"
        fullWidth
        value={form.resourceInstitution}
        onChange={(e) =>
          setForm({ ...form, resourceInstitution: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12}>
      <input
        type="file"
        name="resourcePhoto"
       onChange={(e) => previewSingle(e, "resourcePhoto")}
      />

      {previews.resourcePhoto ? (
        <img src={previews.resourcePhoto} width={120} />
      ) : existing.resourcePhoto ? (
        <img src={existing.resourcePhoto} width={120} />
      ) : null}
    </Grid>
  </Grid>
</div>


          
         {/* SESSION REPORT */}
<div className="edit-section">
  <h3>Session Report</h3>

  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        label="Session Name"
        fullWidth
        value={form.sessionName}
        onChange={(e) =>
          setForm({ ...form, sessionName: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Co-ordinator(s)"
        helperText="Comma separated"
        fullWidth
        value={form.coordinatorsText}
        onChange={(e) =>
          setForm({ ...form, coordinatorsText: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        label="Google Meet Link"
        fullWidth
        value={form.googleMeetLink}
        onChange={(e) =>
          setForm({ ...form, googleMeetLink: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="Intended Participants"
        fullWidth
        value={form.intendedParticipants}
        onChange={(e) =>
          setForm({ ...form, intendedParticipants: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="Category of Event"
        fullWidth
        value={form.categoryOfEvent}
        onChange={(e) =>
          setForm({ ...form, categoryOfEvent: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Summary"
        multiline
        rows={4}
        fullWidth
        value={form.sessionSummary}
        onChange={(e) =>
          setForm({ ...form, sessionSummary: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        label="Students Present"
        type="number"
        fullWidth
        value={form.participantsCount}
        onChange={(e) =>
          setForm({ ...form, participantsCount: e.target.value })
        }
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        label="Faculty Present"
        type="number"
        fullWidth
        value={form.facultyCount}
        onChange={(e) =>
          setForm({ ...form, facultyCount: e.target.value })
        }
      />
    </Grid>
  </Grid>
</div>


<MultiImageSection
  title="Attendance Images"
  name="attendanceImages"
  preview={previews.attendanceImages}
  existing={existing.attendanceImages}
  deleted={deletedImages.attendanceImages}
  onChange={previewMultiple}
  onDelete={removeImage}
  setPreviewImage={setPreviewImage}
/>

<MultiImageSection
  title="Event Photos"
  name="photos"
  preview={previews.photos}
  existing={existing.photos}
  deleted={deletedImages.photos}
  onChange={previewMultiple}
  onDelete={removeImage}
  setPreviewImage={setPreviewImage}
/>

<MultiImageSection
  title="Feedback Images"
  name="feedbackImages"
  preview={previews.feedbackImages}
  existing={existing.feedbackImages}
  deleted={deletedImages.feedbackImages}
  onChange={previewMultiple}
  onDelete={removeImage}
  setPreviewImage={setPreviewImage}
/>

          <div className="edit-actions">
            <Button variant="contained" type="submit" disabled={saving}>
              Update Report
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Paper>


      {/* //new update  */}

      {previewImage && (
  <div
    className="image-preview-overlay"
    onClick={() => setPreviewImage(null)}
  >
    <span className="close-preview">×</span>

    <img
      src={previewImage}
      alt="Preview"
      className="image-preview-full"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}

    </Box>
  );
}

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }) => (
  <div className="edit-section">
    <h3>{title}</h3>
    {children}
  </div>
);

const ImageSection = ({ title, name, preview, existing, onChange }) => (
  <Section title={title}>
    <input type="file" name={name} onChange={e => onChange(e, name)} />
    <div className="image-grid">
      {(preview || existing) && <img src={preview || existing} alt={title} />}
    </div>
  </Section>
);



const MultiImageSection = ({
  title,
  name,
  preview = [],
  existing = [],
  onChange,
  deleted = [],
  onDelete,
  setPreviewImage, // ✅ only setter is used
}) => {
  const imagesToShow = preview.length > 0 ? preview : existing;

  return (
    <div className="edit-section">
      <h3>{title}</h3>

      <input
        type="file"
        name={name}
        multiple
        accept="image/*"
        onChange={(e) => onChange(e, name)}
      />

      <div className="image-grid">
        {imagesToShow.map((src, i) => {
          if (deleted.includes(i)) return null;

          return (
            <div key={i} className="image-item">
              <img
                src={src}
                alt={title}
                className="clickable-image"
                onClick={() => setPreviewImage(src)} // 🔍 only setter
              />

              <button
                type="button"
                className="delete-btn"
                onClick={() => onDelete(name, i)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

