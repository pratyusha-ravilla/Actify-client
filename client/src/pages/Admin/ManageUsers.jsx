// client/src/pages/Admin/ManageUsers.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  IconButton,
  Stack,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

import axiosClient from "../../utils/axiosClient";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("");

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "faculty", label: "Faculty" },
    { value: "hod", label: "HOD" },
    { value: "admin", label: "Admin" },
    { value: "principal", label: "Principal" },
  ];

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/auth/users"); // You must create this endpoint
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    setLoading(false);
  };

  // Filter + search
  const filtered = useMemo(() => {
    let data = [...users];

    if (roleFilter !== "all") data = data.filter((u) => u.role === roleFilter);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    return data;
  }, [users, roleFilter, query]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalOpen(true);
  };

  const handleUpdateRole = async () => {
    try {
      await axiosClient.put(`/auth/users/${selectedUser._id}/role`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Role update failed:", err);
    }
    setModalOpen(false);
  };

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#4c1d95" }}>
        Manage Users
      </Typography>

      <Typography sx={{ mb: 3, color: "gray" }}>
        Add, update roles, and manage faculty/admin accounts.
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1 }}
          />

          <TextField
            select
            label="Role"
            sx={{ width: 200 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roleOptions.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow key={u._id} hover>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          color={
                            u.role === "admin"
                              ? "secondary"
                              : u.role === "hod"
                              ? "info"
                              : u.role === "principal"
                              ? "warning"
                              : "primary"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {/* Edit role */}
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenModal(u)}
                          >
                            <EditIcon />
                          </IconButton>

                          {/* Delete */}
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(u._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {/* Modal - Update Role */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Name: <b>{selectedUser?.name}</b>
          </Typography>

          <TextField
            select
            fullWidth
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            {roleOptions
              .filter((r) => r.value !== "all")
              .map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleUpdateRole}
            sx={{
              background: "#4c1d95",
              "&:hover": { background: "#3b0f7b" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
