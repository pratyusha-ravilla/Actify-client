// client/src/pages/Faculty/CreateReport.jsx

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const steps = [
  "Activity Details",
  "Invitation",
  "Poster",
  "Resource Person",
  "Session Report",
  "Attendance",
  "Photos",
  "Feedback",
  "Review & Submit",
];

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { eventId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    reportType: "conducted",
    academicYear: "",
    activityName: "",
    coordinator: "",
    date: "",
    duration: "",
    poPos: "",

    // resource
    resourceName: "",
    resourceDesignation: "",
    resourceInstitution: "",

    // session fields (new)
    sessionName: "",
    coordinatorsText: "", // comma-separated for UI
    googleMeetLink: "",
    intendedParticipants: "",
    categoryOfEvent: "",
    sessionDate: "",

    // summary & counts
    sessionSummary: "",
    participantsCount: "",
    facultyCount: "",

    // feedback
    feedback: "",
  });

  // Files state
  const [files, setFiles] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceFile: null, // single pdf/xlsx fallback
    attendanceImages: [], // multiple attendance images
    photos: [],
    feedbackImages: [],
  });

  // Previews (for images)
  const [previews, setPreviews] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceImages: [],
    photos: [],
    feedbackImages: [],
  });

  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosClient.get(`/events/${eventId}`);
        const event = res.data;
        setEventDetails(event);

        console.log("Event type from backend:", event.eventType);

        const displayType =
          event.eventType === "others"
            ? event.customEventType
            : event.eventType;

        setForm((prev) => ({
          ...prev,
          reportType: event.eventType,
          activityName: event.title,
          coordinator: event.createdBy?.name || "",
          date: event.startDate?.split("T")[0] || "",
        }));
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleFile = (e, key) => {
    const f = e.target.files[0];
    setFiles((p) => ({ ...p, [key]: f }));
    if (f) setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(f) }));
  };

  // multiple attendance images handler
  const handleAttendanceMultiple = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles((p) => ({ ...p, attendanceImages: arr }));
    setPreviews((p) => ({
      ...p,
      attendanceImages: arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  // other multiple photos handler
  const handleMultiple = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles((p) => ({ ...p, photos: arr }));
    setPreviews((p) => ({
      ...p,
      photos: arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  // multiple feedback images handler
  const handleFeedbackMultiple = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles((p) => ({ ...p, feedbackImages: arr }));
    setPreviews((p) => ({
      ...p,
      feedbackImages: arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  const next = () => setActiveStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setActiveStep((s) => Math.max(0, s - 1));

  // const validateStep = (stepIdx) => {
  //   if (stepIdx === 0) {
  //     if (!form.academicYear?.trim()) return "Academic Year is required";
  //     if (!form.activityName?.trim()) return "Activity Name is required";
  //   }
  //   return null;
  // };

  const validateStep = (stepIdx) => {
    if (stepIdx === 0) {
      return (
        form.academicYear?.trim() &&
        form.activityName?.trim() &&
        form.coordinator?.trim() &&
        form.date
      );
    }

    if (stepIdx === 1) {
      return !!files.invitation;
    }

    if (stepIdx === 2) {
      return !!files.poster;
    }

    if (stepIdx === 3) {
      return form.resourceName?.trim();
    }

    if (stepIdx === 4) {
      return form.sessionSummary?.trim();
    }

    if (stepIdx === 5) {
      return files.attendanceImages?.length > 0;
    }

    if (stepIdx === 6) {
      return files.photos?.length > 0;
    }

    if (stepIdx === 7) {
      return files.feedbackImages?.length > 0;
    }

    return true;
  };

  const submit = async () => {
    // const err = validateStep(0);
    // if (err) return alert(err);

    if (!validateStep(0)) {
  alert("Please fill all required Activity Details before submitting.");
  return;
}


    try {
      setSubmitting(true);

      const fd = new FormData();

      // coordinators array from comma separated text
      const coordinatorsArr = form.coordinatorsText
        ? form.coordinatorsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      // ✅ Convert "others" to valid report type
      let finalReportType = form.reportType?.toLowerCase();

      if (form.reportType === "others") {
        finalReportType = "conducted"; // treat others as conducted report
      }

      const payload = {
        ...form,
        reportType: finalReportType,
        event: eventId, // important
        academicYear: form.academicYear,
        resourcePerson: {
          name: form.resourceName,
          designation: form.resourceDesignation,
          institution: form.resourceInstitution,
        },
        sessionReport: {
          sessionName: form.sessionName,
          coordinators: coordinatorsArr,
          googleMeetLink: form.googleMeetLink,
          intendedParticipants: form.intendedParticipants,
          categoryOfEvent: form.categoryOfEvent,
          date: form.sessionDate,
          summary: form.sessionSummary,
          participantsCount: form.participantsCount,
          facultyCount: form.facultyCount,
        },
        createdBy: user?.id,
        status: "pending",
      };

      fd.append("payload", JSON.stringify(payload));

      // single files
      if (files.invitation) fd.append("invitation", files.invitation);
      if (files.poster) fd.append("poster", files.poster);
      if (files.resourcePhoto) fd.append("resourcePhoto", files.resourcePhoto);

      // ✅ attendance IMAGES (multiple)
      (files.attendanceImages || []).forEach((img) => {
        fd.append("attendanceImages", img);
      });

      // photos
      (files.photos || []).forEach((p) => {
        fd.append("photos", p);
      });

      // feedback images
      (files.feedbackImages || []).forEach((img) => {
        fd.append("feedbackImages", img);
      });

      const res = await axiosClient.post("/activity", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Saved successfully");
      // navigate(`/faculty/report/${res.data._id}`);
      navigate(`/faculty/report/${res.data._id}/preview`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Create Activity Report
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
          {steps.map((s) => (
            <Step key={s}>
              <StepLabel>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        {activeStep === 0 && (
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
                <MenuItem value="conducted">Activity Conducted Report</MenuItem>
                <MenuItem value="attended">Activity Attended Report</MenuItem>
                <MenuItem value="expert_talk">Activity Expert Talk</MenuItem>
                <MenuItem value="others">
                  {eventDetails?.customEventType || "Other Activity Report"}
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Academic Year (e.g. 2025-26) *"
                fullWidth
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Activity Name *"
                fullWidth
                value={form.activityName}
                onChange={(e) =>
                  setForm({ ...form, activityName: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Coordinator"
                fullWidth
                value={form.coordinator}
                onChange={(e) =>
                  setForm({ ...form, coordinator: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Duration"
                fullWidth
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="PO & POs"
                fullWidth
                value={form.poPos}
                onChange={(e) => setForm({ ...form, poPos: e.target.value })}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Invitation
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Invitation
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "invitation")}
              />
            </Button>

            {previews.invitation && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={previews.invitation}
                  alt="inv"
                  style={{ maxWidth: 360 }}
                />
              </Box>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Poster
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Poster
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "poster")}
              />
            </Button>

            {previews.poster && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={previews.poster}
                  alt="poster"
                  style={{ maxWidth: 360 }}
                />
              </Box>
            )}
          </Box>
        )}

        {activeStep === 3 && (
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
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                Upload Resource Photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e, "resourcePhoto")}
                />
              </Button>

              {previews.resourcePhoto && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={previews.resourcePhoto}
                    alt="rp"
                    style={{ width: 120 }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        )}

        {activeStep === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Session Report
            </Typography>

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
                  label="Co-ordinator(s) (comma separated)"
                  fullWidth
                  value={form.coordinatorsText}
                  onChange={(e) =>
                    setForm({ ...form, coordinatorsText: e.target.value })
                  }
                  helperText="Enter multiple names separated by commas"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Google Meet / Link"
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

              <Grid item xs={12} md={4}>
                <TextField
                  label="Session Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.sessionDate}
                  onChange={(e) =>
                    setForm({ ...form, sessionDate: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={5}
                  label="Summary"
                  fullWidth
                  value={form.sessionSummary}
                  onChange={(e) =>
                    setForm({ ...form, sessionSummary: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="No. of Students Present"
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
                  label="No. of Faculty Present"
                  type="number"
                  fullWidth
                  value={form.facultyCount}
                  onChange={(e) =>
                    setForm({ ...form, facultyCount: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 5 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Attendance (Upload Images)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Attendance Images (multiple)
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleAttendanceMultiple}
              />
            </Button>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              {previews.attendanceImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`attendance-${i}`}
                  style={{ width: 120, borderRadius: 6 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 6 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Photos
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Photos (multiple)
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiple}
              />
            </Button>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              {previews.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`photo-${i}`}
                  style={{ width: 120, borderRadius: 6 }}
                />
              ))}
            </Box>
          </Box>
        )}
        {activeStep === 7 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Feedback (Upload Images)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Feedback Images (multiple)
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleFeedbackMultiple}
              />
            </Button>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              {previews.feedbackImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`feedback-${i}`}
                  style={{ width: 120, borderRadius: 6 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 8 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Review & Feedback
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {form.activityName || "(No title)"}
              </Typography>
              <Typography variant="body2">
                Academic Year: {form.academicYear}
              </Typography>
              <Typography variant="body2">
                Coordinator: {form.coordinator}
              </Typography>

              <Typography sx={{ mt: 1, fontWeight: 600 }}>
                Session Summary
              </Typography>
              <Typography variant="body2">
                {form.sessionSummary || "-"}
              </Typography>
            </Paper>

            <TextField
              multiline
              rows={3}
              label="Feedback / Notes (optional)"
              fullWidth
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            />
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Box>
            <Button
              startIcon={<ArrowBack />}
              disabled={activeStep === 0}
              onClick={prev}
            >
              Previous
            </Button>
          </Box>

          <Box>
            {activeStep < steps.length - 1 ? (
              // <Button
              //   variant="contained"
              //   endIcon={<ArrowForward />}
              //   onClick={next}
              // >
              //   Next
              // </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={next}
                disabled={!validateStep(activeStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save & Finish"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
