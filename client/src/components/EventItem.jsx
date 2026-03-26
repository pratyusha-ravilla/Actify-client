

// client/src/components/EventItem.jsx
import React from "react";
import { Paper, Box, Typography, Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

export default function EventItem({ title, date, type, status }) {
  const color = status === "approved" ? "success" : status === "pending" ? "warning" : "error";
  return (
    <Paper className="event-item-hover fade-in"
    variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {date} • {type}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <EventIcon color="disabled" />
          <Chip label={status} size="small" color={color} />
        </Box>
      </Box>
    </Paper>
  );
}
