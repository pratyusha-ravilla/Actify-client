// client/src/components/SummaryCard.jsx
import React from "react";
import { Paper, Typography, Stack, Button, Divider } from "@mui/material";

export default function SummaryCard({ stats = {}, onCreate }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Quick Summary
      </Typography>

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>All Reports</Typography>
          <Typography sx={{ fontWeight: 700 }}>{stats.total}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Conducted</Typography>
          <Typography sx={{ fontWeight: 700 }}>{stats.conducted}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Attended</Typography>
          <Typography sx={{ fontWeight: 700 }}>{stats.attended}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Approved</Typography>
          <Typography sx={{ fontWeight: 700 }}>{stats.approved}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Pending</Typography>
          <Typography sx={{ fontWeight: 700 }}>{stats.pending}</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="contained"
        fullWidth
        onClick={onCreate}
        sx={{
          background: "linear-gradient(90deg, rgba(76,29,149,1) 0%, rgba(124,58,237,1) 100%)",
          color: "#fff",
          textTransform: "none",
        }}
      >
        Create New Report
      </Button>
    </Paper>
  );
}
