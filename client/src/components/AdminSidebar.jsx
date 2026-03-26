

//client/src/components/AdminSidebar.jsx

import React, { useState, useContext } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Description as DescriptionIcon,
  PendingActions as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Groups as GroupsIcon,
  WorkspacePremium as HodIcon,
  School as PrincipalIcon,
  AdminPanelSettings as AdminIcon,
  ListAlt as AllReportsIcon
} from "@mui/icons-material";

import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminSidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [openReports, setOpenReports] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Box sx={{ height: "100%", color: "white", px: 2, py: 3 }}>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: "#ffffff", color: "#4c1d95" }}>
          {(user?.name || "A").charAt(0)}
        </Avatar>

        <Box>
          <Typography sx={{ fontWeight: 700 }}>{user?.name || "Admin"}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>{user?.email}</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

      <Typography sx={{ fontSize: "12px", opacity: 0.8, mb: 1 }}>
        MAIN MENU
      </Typography>

      <List>

        {/* DASHBOARD */}
        <ListItemButton
          component={Link}
          to="/admin/dashboard"
          sx={{
            borderRadius: 1,
            mb: 1,
            bgcolor: isActive("/admin/dashboard")
              ? "rgba(255,255,255,0.18)"
              : "transparent",
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* ---------------- Reports Menu ---------------- */}
        <ListItemButton
          onClick={() => setOpenReports(!openReports)}
          sx={{
            borderRadius: 1,
            mb: 1,
            bgcolor: openReports ? "rgba(255,255,255,0.1)" : "transparent"
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
          {openReports ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openReports}>
          <List sx={{ pl: 4 }}>

            <ListItemButton
              component={Link}
              to="/admin/reports/all"
              sx={{
                bgcolor: isActive("/admin/reports/all")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AllReportsIcon />
              </ListItemIcon>
              <ListItemText primary="All Reports" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/reports/pending"
              sx={{
                bgcolor: isActive("/admin/reports/pending")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#facc15" }}>
                <PendingIcon />
              </ListItemIcon>
              <ListItemText primary="Pending" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/reports/approved"
              sx={{
                bgcolor: isActive("/admin/reports/approved")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#4ade80" }}>
                <ApprovedIcon />
              </ListItemIcon>
              <ListItemText primary="Approved" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/reports/rejected"
              sx={{
                bgcolor: isActive("/admin/reports/rejected")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#ef4444" }}>
                <RejectedIcon />
              </ListItemIcon>
              <ListItemText primary="Rejected" />
            </ListItemButton>

          </List>
        </Collapse>

        {/* ---------------- Manage Users Menu ---------------- */}
        <ListItemButton
          onClick={() => setOpenUsers(!openUsers)}
          sx={{
            borderRadius: 1,
            mb: 1,
            bgcolor: openUsers ? "rgba(255,255,255,0.1)" : "transparent"
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openUsers}>
          <List sx={{ pl: 4 }}>

            <ListItemButton
              component={Link}
              to="/admin/users/faculty"
              sx={{
                bgcolor: isActive("/admin/users/faculty")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Faculty List" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/users/hod"
              sx={{
                bgcolor: isActive("/admin/users/hod")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <HodIcon />
              </ListItemIcon>
              <ListItemText primary="HOD List" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/users/principal"
              sx={{
                bgcolor: isActive("/admin/users/principal")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <PrincipalIcon />
              </ListItemIcon>
              <ListItemText primary="Principal List" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/admin/users/admins"
              sx={{
                bgcolor: isActive("/admin/users/admins")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary="Admin List" />
            </ListItemButton>

          </List>
        </Collapse>

      </List>
    </Box>
  );
}
