// client/src/pages/Admin/AddUser.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Select, MenuItem, Button, Stack } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (k) => (e) => setPayload((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payload.name || !payload.email || !payload.password) {
      alert("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await axiosClient.post("/auth/users/add", payload);
      alert("User added");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Add user failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 3, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(6px)" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Add New User
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Full name" value={payload.name} onChange={handleChange("name")} fullWidth required />
            <TextField label="Email" value={payload.email} onChange={handleChange("email")} type="email" fullWidth required />
            <TextField label="Password" value={payload.password} onChange={handleChange("password")} type="password" fullWidth required />
            <Select value={payload.role} onChange={handleChange("role")}>
              <MenuItem value="faculty">Faculty</MenuItem>
              <MenuItem value="hod">HOD</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="principal">Principal</MenuItem>
            </Select>

            <Stack direction="row" spacing={2}>
              <Button variant="contained" type="submit" disabled={submitting} sx={{ textTransform: "none" }}>
                Create
              </Button>
              <Button variant="outlined" onClick={() => navigate("/admin/users")} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
