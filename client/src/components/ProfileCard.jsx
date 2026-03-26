// client/src/components/ProfileCard.jsx
import React from "react";
import { Paper, Typography, Avatar, Box, Stack, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

export default function ProfileCard({ user = {} }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 64, height: 64, bgcolor: "#fff", color: "#4c1d95" }}>
          { (user.name || "U").charAt(0) }
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800 }}>{user.name || "Faculty Name"}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>{user.email || "email@domain.com"}</Typography>

          <Box sx={{ mt: 1 }}>
            <Chip icon={<SchoolIcon />} label={user.department || "CSE"} size="small" sx={{ mr: 1 }} />
            <Chip label={user.role || "Faculty"} size="small" />
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
