

// client/src/pages/Admin/UsersList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import axiosClient from "../../utils/axiosClient";

export default function UsersList({ roleFilter }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    load();
  }, []);

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosClient.delete(`/auth/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {roleFilter ? `${roleFilter.toUpperCase()} Users` : "All Users"}
      </Typography>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Stack spacing={3}>
          {filteredUsers.length === 0 && (
            <Typography>No users found.</Typography>
          )}

          {filteredUsers.map((user) => (
            <Paper
              key={user._id}
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#7c3aed" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.7 }}>{user.email}</Typography>
                </Box>
              </Stack>

              {/* ROLE DISPLAY – NOT EDITABLE */}
              <Tooltip title="Role cannot be changed" arrow>
                <Box
                  sx={{
                    px: 2,
                    py: 0.7,
                    borderRadius: 2,
                    bgcolor: "#ede9fe",
                    color: "#4c1d95",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {user.role}
                </Box>
              </Tooltip>

              {/* DELETE BUTTON */}
              <IconButton color="error" onClick={() => handleDelete(user._id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
