

// client/src/pages/Faculty/CreateEvent.jsx

import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();
    // ✅ ADD IT RIGHT HERE
    if (eventType === "Others" && !customEventType) {
      alert("Please specify the event type");
      return;
    }

    try {
      setLoading(true);

      await axiosClient.post("/events", {
        title,
        description,
        department,
        eventType: eventType.toLowerCase(), // match backend enum
        customEventType: eventType === "Others" ? customEventType : null,

        startDate,
        endDate,
      });

      alert("Event created successfully");
      navigate("/faculty/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
  //     <Paper sx={{ p: 3 }}>
  //       <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
  //         Create New Event
  //       </Typography>

  //       <form onSubmit={submit}>
  //         {/* TITLE */}
  //         <TextField
  //           label="Event Title"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           fullWidth
  //           required
  //           sx={{ mb: 2 }}
  //         />

  //         {/* DESCRIPTION */}
  //         <TextField
  //           label="Description"
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           fullWidth
  //           multiline
  //           rows={3}
  //           sx={{ mb: 2 }}
  //         />

  //         {/* DEPARTMENT */}
  //         <TextField
  //           label="Department"
  //           value={department}
  //           onChange={(e) => setDepartment(e.target.value)}
  //           fullWidth
  //           required
  //           sx={{ mb: 2 }}
  //         />

  //         {/* EVENT TYPE */}
  //         <TextField
  //           select
  //           label="Event Type"
  //           value={eventType}
  //           onChange={(e) => setEventType(e.target.value)}
  //           fullWidth
  //           required
  //           sx={{ mb: 2 }}
  //         >
  //           {["Workshop", "Expert Talk", "Conducted","Attended"].map((type) => (
  //             <MenuItem key={type} value={type}>
  //               {type}
  //             </MenuItem>
  //           ))}
  //         </TextField>

  //         {/* START DATE */}
  //         <TextField
  //           label="Start Date"
  //           type="date"
  //           value={startDate}
  //           onChange={(e) => setStartDate(e.target.value)}
  //           InputLabelProps={{ shrink: true }}
  //           fullWidth
  //           required
  //           sx={{ mb: 2 }}
  //         />

  //         {/* END DATE */}
  //         <TextField
  //           label="End Date"
  //           type="date"
  //           value={endDate}
  //           onChange={(e) => setEndDate(e.target.value)}
  //           InputLabelProps={{ shrink: true }}
  //           fullWidth
  //           required
  //           sx={{ mb: 3 }}
  //         />

  //         <Button
  //           type="submit"
  //           variant="contained"
  //           fullWidth
  //           disabled={loading}
  //         >
  //           {loading ? "Creating..." : "Create Event"}
  //         </Button>
  //       </form>
  //     </Paper>
  //   </Box>
  // );

  return (
    <Box className="create-event-wrapper">
      <Paper className="create-event-card">
        <Typography variant="h5" className="create-event-title">
          Create New Event
        </Typography>

        <Typography className="create-event-subtitle">
          Create and publish an event for faculty registration
        </Typography>

        <form onSubmit={submit} className="create-event-form">
          <TextField
            label="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
            required
          />

          
          <TextField
            select
            label="Event Type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            fullWidth
            required
          >
            {["Expert Talk", "Conducted", "Attended", "Others"].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {eventType === "Others" && (
            <TextField
              label="Specify Event Type"
              value={customEventType}
              onChange={(e) => setCustomEventType(e.target.value)}
              fullWidth
              required
            />
          )}

          <div className="create-event-dates">
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="create-event-submit"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
