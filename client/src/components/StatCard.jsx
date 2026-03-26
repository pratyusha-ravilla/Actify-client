// client/src/components/StatCard.jsx
import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, subtitle, icon, colorStart = "#7c3aed", colorEnd = "#c084fc" }) {
  return (
    <Paper
  className="stat-card-hover fade-in"
  sx={{
    p: 2,
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
    height: "100%",
    display: "flex",
    gap: 2,
    alignItems: "center",
    background: `linear-gradient(90deg, ${colorStart}12 0%, ${colorEnd}08 100%)`,
    transition: "0.3s"
  }}
>

      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
          boxShadow: "0 10px 30px rgba(48,24,104,0.12)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}
