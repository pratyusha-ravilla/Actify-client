


// client/src/pages/Faculty/MyCreatedEvents.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  Chip
} from "@mui/material";
import axiosClient from "../../utils/axiosClient";

export default function MyCreatedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/events/mine");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE EVENT ================= */
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axiosClient.delete(`/events/${id}`);

      // ✅ Optimistic update (better UX)
      setEvents((prev) => prev.filter((e) => e._id !== id));

      alert("Event deleted successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Created Events
      </Typography>

      {loading && <Typography>Loading events...</Typography>}

      {!loading && events.length === 0 && (
        <Typography>No events created yet</Typography>
      )}

      <Grid container spacing={3}>
        {events.map((ev) => (
          <Grid item xs={12} md={4} key={ev._id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800 }}>
                  {ev.title}
                </Typography>

                <Typography sx={{ color: "gray", mt: 1 }}>
                  {ev.eventType} • {ev.department}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  📅 {new Date(ev.startDate).toDateString()}
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <Chip
                    label={`Approval: ${ev.approvalStatus}`}
                    color={
                      ev.approvalStatus === "approved"
                        ? "success"
                        : ev.approvalStatus === "rejected"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </Stack>
              </Box>

              {/* ================= ACTIONS ================= */}
              <Stack spacing={1} mt={3}>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={ev.approvalStatus === "approved"} // 🔒 safety
                  onClick={() => handleDelete(ev._id)}
                >
                  {ev.approvalStatus === "approved"
                    ? "Approved (Cannot Delete)"
                    : "Delete Event"}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
