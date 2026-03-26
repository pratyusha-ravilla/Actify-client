

// client/src/pages/Admin/AdminDashboard.jsx

import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Stack,
  IconButton,
  Button,
  Drawer,      // ✅ ADD THIS
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade
} from "@mui/material";

//new addings for styling
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { keyframes } from "@mui/system";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";


import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

import {
  Menu as MenuIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Book as BookIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";

// Import Sidebar
import AdminSidebar from "../../components/AdminSidebar";

const drawerWidth = 260;

//new addings for styling
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0px rgba(139,92,246,0.6); }
  50% { box-shadow: 0 0 25px rgba(139,92,246,0.8); }
  100% { box-shadow: 0 0 0px rgba(139,92,246,0.6); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;


const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


/* ============================================================
                       ADMIN DASHBOARD
============================================================ */

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Drawer toggle (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Main report data
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

//notifications
  const [events, setEvents] = useState([]);
const [eventsLoading, setEventsLoading] = useState(true);


  /* ============================================================
                         APPROVE / REJECT
  ============================================================ */

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/activity/${id}/approve`);
      setReports((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "approved" } : a))
      );
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.put(`/activity/${id}/reject`);
      setReports((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a))
      );
    } catch (err) {
      console.error("Reject error:", err);
    }
  };



  const handleEventApprove = async (id) => {
  try {
    await axiosClient.put(`/events/${id}/approve`);
    loadAdminEvents(); // refresh list
  } catch (err) {
    console.error("Event approve failed", err);
  }
};

const handleEventReject = async (id) => {
  try {
    await axiosClient.put(`/events/${id}/reject`);
    loadAdminEvents();
  } catch (err) {
    console.error("Event reject failed", err);
  }
};




const loadAdminEvents = async () => {
  try {
    setEventsLoading(true);
    const res = await axiosClient.get("/admin/events");
    setEvents(res.data || []);
  } catch (err) {
    console.error("Failed to load admin events", err);
    setEvents([]);
  } finally {
    setEventsLoading(false);
  }
};

useEffect(() => {
  loadAdminEvents();
}, []);

  /* ============================================================
                         LOAD REPORTS
  ============================================================ */

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/activity");
        if (mounted) setReports(res.data || []);
      } catch (err) {
        if (mounted) setReports([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);


  //new for notifications 

  useEffect(() => {
  let mounted = true;

  const loadAdminEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await axiosClient.get("/admin/events");
      if (mounted) setEvents(res.data || []);
    } catch (err) {
      if (mounted) setEvents([]);
      console.error("Failed to load admin events", err);
    } finally {
      if (mounted) setEventsLoading(false);
    }
  };

  loadAdminEvents();
  return () => (mounted = false);
}, []);



//notifications
// const [notifications, setNotifications] = useState([]);

// // useEffect(() => {
// //   axiosClient.get("/notifications").then((res) => {
// //     setNotifications(res.data || []);
// //   });
// // }, []);


// useEffect(() => {
//   axiosClient.get("/admin/notifications").then((res) => {
//     setNotifications(res.data || []);
//   });
// }, []);



// Notifications State
const [notifications, setNotifications] = useState([]);

// Load Notifications (Only Once)
useEffect(() => {
  const loadNotifications = async () => {
    try {
      const res = await axiosClient.get("/admin/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
    }
  };

  loadNotifications();
}, []);


const [selectedNotification, setSelectedNotification] = useState(null);




const markAsRead = async (id) => {
  try {
    await axiosClient.put(`/notifications/${id}/read`);

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id
          ? { ...n, isReadBy: [...(n.isReadBy || []), user._id] }
          : n
      )
    );
  } catch (err) {
    console.error("Mark as read failed", err);
  }
};


const unreadCount = notifications.filter(n => !n.read).length;
  /* ============================================================
                         STATS BOX
  ============================================================ */
  const stats = useMemo(() => {
    return {
      total: reports.length,
      conducted: reports.filter((r) => r.reportType === "conducted").length,
      attended: reports.filter((r) => r.reportType === "attended").length,
      talks: reports.filter((r) => r.reportType === "expert_talk").length,
      pending: reports.filter((r) => r.status === "pending").length,
      approved: reports.filter((r) => r.status === "approved").length,
    };
  }, [reports]);

  /* ============================================================
                       FILTERING + SORTING
  ============================================================ */

  const filtered = useMemo(() => {
    let data = [...reports];

    if (typeFilter !== "all") data = data.filter((r) => r.reportType === typeFilter);

    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (r) =>
          (r.activityName || "").toLowerCase().includes(q) ||
          (r.coordinator || "").toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      if (sortBy === "date") {
        return sortDir === "asc"
          ? new Date(a.date || 0) - new Date(b.date || 0)
          : new Date(b.date || 0) - new Date(a.date || 0);
      }
      const sa = (a.activityName || "").toLowerCase();
      const sb = (b.activityName || "").toLowerCase();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });

    return data;
  }, [reports, typeFilter, statusFilter, query, sortBy, sortDir]);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };


  /* ============================================================
                         MAIN DASHBOARD UI
  ============================================================ */

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ------------------------- TOP APPBAR ------------------------- */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "#fff",
          color: "#4c1d95",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            sx={{ display: { md: "none" }, mr: 2 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: "#ffffff70",
              backdropFilter: "blur(5px)",
            }}
          >
            <Typography variant="subtitle1">
              Welcome back, {user?.name} 👋
            </Typography>
          </Paper>
        </Toolbar>
      </AppBar>

      {/* ------------------------- SIDEBAR ------------------------- */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            position: "fixed",
            height: "100%",

            // background: "#0F172A",
            background:
              "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
          }}
        >
          <AdminSidebar />
        </Box>

      

        {/* Mobile Sidebar */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background:
                "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
              color: "white",
            },
          }}
        >
          <AdminSidebar />
        </Drawer>
      </Box>

      {/* ------------------------- MAIN CONTENT ------------------------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: "100px",
          bgcolor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        {/* --------------------------------------------------------------
                         ROW 1 — STAT CARDS
        -------------------------------------------------------------- */}
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
  xs: "1fr",
  sm: "repeat(2, 1fr)",
  md: "repeat(4, 1fr)",
},
            // gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
          }}
        >
          <StatBox
            title="Total Reports"
            value={stats.total}
            icon={<ArticleIcon />}
            color="#4c1d95"
          />
          <StatBox
            title="Conducted"
            value={stats.conducted}
            icon={<EventIcon />}
            color="#7c3aed"
          />
          <StatBox
            title="Attended"
            value={stats.attended}
            icon={<BookIcon />}
            color="#a78bfa"
          />
          <StatBox
            title="Pending"
            value={stats.pending}
            icon={<PeopleIcon />}
            color="#f59e0b"
          />
        </Box>


{/* notification feature */}



<Paper
  sx={{
    p: 4,
    mb: 4,
    borderRadius: 4,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(124,58,237,0.2)",
    boxShadow: "0 8px 30px rgba(124,58,237,0.08)",
  }}
>
  {/* Header */}
 
 <Stack direction="row" alignItems="center" spacing={1} mb={3}>
    <NotificationsActiveIcon sx={{ color: "#7C3AED" }} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: "#4C1D95" }}
    >
      Notification Center
    </Typography>
  </Stack>




 

  {/* Empty State */}
  {notifications.length === 0 && (
    <Typography sx={{ color: "#6B7280" }}>
      No new notifications
    </Typography>
  )}

  {/* Notification List */}
  <Stack spacing={2}>
    {notifications.slice(0, 5).map((n, index) => (
      <Paper
        key={n._id}
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: "linear-gradient(135deg,#F5F3FF,#EEF2FF)",
          borderLeft: "4px solid #7C3AED",
          cursor: "pointer",
          animation: `${slideFadeIn} 0.4s ease`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 20px rgba(124,58,237,0.2)",
          },
        }}
        


        onClick={() => {
  markAsRead(n._id);
  setSelectedNotification(n);
}}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          
          {/* Animated Dot */}
          <FiberManualRecordIcon
            sx={{
              fontSize: 12,
              color: "#7C3AED",
              mt: "6px",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.4 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.4 },
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#4C1D95",
              }}
            >
              {n.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#6B7280", mt: 0.5 }}
            >
              {n.message}
            </Typography>
          </Box>


{/* new addon */}

          
       </Stack>

      </Paper>




    ))}
  </Stack>
</Paper>

<Dialog
  open={Boolean(selectedNotification)}
  onClose={() => setSelectedNotification(null)}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Fade}
>
  <DialogTitle
    sx={{
      fontWeight: 800,
      color: "#4F0341",
      borderBottom: "1px solid #eee"
    }}
  >
    {selectedNotification?.title}
  </DialogTitle>

  <DialogContent sx={{ py: 3 }}>
    <Typography
      sx={{
        fontSize: "16px",
        color: "#374151",
        mb: 2,
        lineHeight: 1.6
      }}
    >
      {selectedNotification?.message}
    </Typography>

    <Typography
      variant="caption"
      sx={{ color: "#6B7280" }}
    >
      {selectedNotification?.createdAt
        ? new Date(selectedNotification.createdAt).toLocaleString()
        : ""}
    </Typography>

    {selectedNotification?.relatedEvent && (
      <Typography
        sx={{
          mt: 3,
          color: "#7C3AED",
          fontWeight: 600,
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" }
        }}
        onClick={() => {
          navigate(`/admin/report/${selectedNotification.relatedEvent?._id}`);
          setSelectedNotification(null);
        }}
      >
        View Related Event →
      </Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ pb: 2, pr: 3 }}>
    <Button
      onClick={() => {setSelectedNotification(null);

      }}
      sx={{
        background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
        color: "#ffffff",
        borderRadius: "24px",
        px: 4,
        fontWeight: 600,
        textTransform: "none",
        boxShadow: "0 6px 18px rgba(124,58,237,0.4)",
        "&:hover": {
          background: "linear-gradient(135deg,#6D28D9,#4C1D95)"
        }
        
      }}
      
    >
      Close
    </Button>
    
  </DialogActions>
</Dialog>


{/* approval feature */}


{/* {["admin", "hod", "principal"].includes(user?.role) && (
  <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
      Pending Event Approvals
    </Typography>

    <Stack spacing={2}>
      {events.filter(e => e.approvalStatus === "pending").length === 0 && (
        <Typography color="text.secondary">
          No pending event approvals
        </Typography>
      )}

      {events
        .filter(e => e.approvalStatus === "pending")
        .map((e) => (
          <Paper key={e._id} sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>
              {e.title}
            </Typography>

            <Typography variant="caption">
              {e.eventType} • {e.department} • Created by {e.createdBy?.name}
            </Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <Button
                color="success"
                variant="contained"
                onClick={() => handleEventApprove(e._id)}
              >
                Approve
              </Button>

              <Button
                color="error"
                variant="outlined"
                onClick={() => handleEventReject(e._id)}
              >
                Reject
              </Button>
            </Stack>
          </Paper>
        ))}
    </Stack>
  </Paper>
)} */}

{["admin", "hod", "principal"].includes(user?.role) && (
  <Paper
    sx={{
      p: 4,
      borderRadius: 4,
      mb: 5,
      background: "linear-gradient(135deg,#F5F3FF,#EEF2FF)",
      border: "1px solid rgba(124,58,237,0.2)",
      boxShadow: "0 10px 30px rgba(124,58,237,0.08)",
    }}
  >
    {/* Header */}
    <Typography
      variant="h6"
      sx={{
        fontWeight: 800,
        color: "#4C1D95",
        mb: 3,
      }}
    >
      📝 Pending Event Approvals
    </Typography>

    <Stack spacing={3}>
      {/* Empty State */}
      {events.filter(e => e.approvalStatus === "pending").length === 0 && (
        <Typography
          sx={{
            color: "#6B7280",
            textAlign: "center",
            py: 3,
            fontStyle: "italic",
          }}
        >
          No pending event approvals 🎉
        </Typography>
      )}

      {events
        .filter(e => e.approvalStatus === "pending")
        .map((e) => (
          <Paper
            key={e._id}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "#ffffff",
              border: "1px solid #ede9fe",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 25px rgba(124,58,237,0.2)",
              },
            }}
          >
            {/* Event Info */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                color: "#4F0341",
                mb: 0.5,
              }}
            >
              {e.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mb: 2,
              }}
            >
              {e.eventType} • {e.department} • Created by {e.createdBy?.name}
            </Typography>

            {/* Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => handleEventApprove(e._id)}
                sx={{
                  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                  color: "#ffffff",
                  borderRadius: "30px",
                  px: 3,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(139,92,246,0.35)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow: "0 12px 28px rgba(139,92,246,0.55)",
                  },
                }}
              >
                ✓ Approve
              </Button>

              <Button
                onClick={() => handleEventReject(e._id)}
                sx={{
                  background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                  color: "#ffffff",
                  borderRadius: "30px",
                  px: 3,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow: "0 12px 28px rgba(99,102,241,0.55)",
                  },
                }}
              >
                ✕ Reject
              </Button>
            </Stack>
          </Paper>
        ))}
    </Stack>
  </Paper>
)}




        {/* --------------------------------------------------------------
                     ROW 2 — UPCOMING EVENTS
        -------------------------------------------------------------- */}
        <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Upcoming Events
          </Typography>

          <Stack spacing={2}>
            {reports
              .filter((r) => r.date && new Date(r.date) >= new Date())
              .slice(0, 6)
              .map((ev) => (
                <Box
                  key={ev._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {ev.activityName}
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(ev.date)} • {ev.reportType}
                    </Typography>
                  </Box>

                  <Chip
                    label={ev.status}
                    size="small"
                    color={
                      ev.status === "approved"
                        ? "success"
                        : ev.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>
              ))}

            {!reports.some((r) => r.date && new Date(r.date) >= new Date()) && (
              <Typography sx={{ color: "text.secondary" }}>
                No upcoming events
              </Typography>
            )}
          </Stack>
        </Paper>



        {/* --------------------------------------------------------------
                 ROW 3 — REPORTS TABLE
        -------------------------------------------------------------- */}
       

        <Paper
  sx={{
    p: 3,
    mt: 4,
    borderRadius: 4,
    background: "#ffffff",
    boxShadow: "0 8px 25px rgba(79,3,65,0.08)",
    border: "1px solid #f1f5f9",
  }}
>
          {/* Filters */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <TextField
              size="small"
              placeholder="Search..."
              sx={{ width: { xs: "100%", md: "30%" } }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <TextField
              select
              label="Type"
              size="small"
              sx={{ minWidth: 160 }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="conducted">Conducted</MenuItem>
              <MenuItem value="attended">Attended</MenuItem>
              <MenuItem value="expert_talk">Expert Talks</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              size="small"
              sx={{ minWidth: 160 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="outlined"
              onClick={() => {
                setQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
            >
              Reset
            </Button>
          </Stack>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>View</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.activityName}</TableCell>
                      <TableCell>{r.reportType}</TableCell>
                      <TableCell>{formatDate(r.date)}</TableCell>
                      <TableCell>
                       

<Chip
  label={r.status}
  size="small"
  sx={{
    textTransform: "capitalize",
    fontWeight: 600,
    background:
      r.status === "approved"
        ? "rgba(79,3,65,0.08)"
        : r.status === "pending"
        ? "rgba(255,184,120,0.25)"
        : "rgba(230,84,71,0.15)",
    color:
      r.status === "approved"
        ? "#4F0341"
        : r.status === "pending"
        ? "#FF8559"
        : "#E65447",
    borderRadius: "20px",
    px: 1.5,
  }}
/>



                      </TableCell>

                      <TableCell>
                        <Link
                          to={`/admin/report/${r._id}`}
                          style={{ fontWeight: 700, color: "#4c1d95" }}
                        >
                          View
                        </Link>
                      </TableCell>

                      

                      <TableCell>


                        



<Stack direction="row" spacing={1.5}>
  {r.status === "pending" && (
    <>
    
      <Button
        onClick={() => handleApprove(r._id)}
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
          color: "#ffffff",
          textTransform: "none",
          borderRadius: "30px",
          px: 3,
          fontWeight: 700,
          letterSpacing: "0.5px",
          boxShadow: "0 8px 25px rgba(139,92,246,0.45)",
          transition: "all 0.35s ease",
          "&:hover": {
            transform: "translateY(-4px) scale(1.05)",
            boxShadow: "0 12px 35px rgba(139,92,246,0.65)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-75%",
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.3), rgba(255,255,255,0))",
            transform: "skewX(-25deg)",
            transition: "0.6s",
          },
          "&:hover::before": {
            left: "125%",
          },
        }}
      >
        Approve
      </Button>

    
      <Button
        onClick={() => handleReject(r._id)}
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg,#6366F1,#4F46E5)",
          color: "#ffffff",
          textTransform: "none",
          borderRadius: "30px",
          px: 3,
          fontWeight: 700,
          letterSpacing: "0.5px",
          boxShadow: "0 8px 25px rgba(99,102,241,0.45)",
          transition: "all 0.35s ease",
          "&:hover": {
            transform: "translateY(-4px) scale(1.05)",
            boxShadow: "0 12px 35px rgba(99,102,241,0.65)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-75%",
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.3), rgba(255,255,255,0))",
            transform: "skewX(-25deg)",
            transition: "0.6s",
          },
          "&:hover::before": {
            left: "125%",
          },
        }}
      >
        Reject
      </Button>
    </>
  )}


{/* Approved State */}
{r.status === "approved" && (
  <Button
    disabled
    sx={{
      background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
      color: "#ffffff !important",
      borderRadius: "30px",
      px: 3,
      fontWeight: 800,
      letterSpacing: "0.5px",
      textShadow: "0 0 6px rgba(255,255,255,0.6)",
      boxShadow: "0 8px 22px rgba(124,58,237,0.45)",
      opacity: 1,
      "&.Mui-disabled": {
        color: "#ffffff",
        opacity: 1,
      },
    }}
  >
    ✓ Approved
  </Button>
)}

{/* Rejected State */}
{r.status === "rejected" && (
  <Button
    disabled
    sx={{
      background: "linear-gradient(135deg,#6366F1,#4338CA)",
      color: "#ffffff !important",
      borderRadius: "30px",
      px: 3,
      fontWeight: 800,
      letterSpacing: "0.5px",
      textShadow: "0 0 6px rgba(255,255,255,0.6)",
      boxShadow: "0 8px 22px rgba(99,102,241,0.45)",
      opacity: 1,
      "&.Mui-disabled": {
        color: "#ffffff",
        opacity: 1,
      },
    }}
  >
    ✕ Rejected
  </Button>
)}
</Stack>



                      </TableCell>


                      
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) =>
              setRowsPerPage(parseInt(e.target.value, 10))
            }
          />
        </Paper>
      </Box>
    </Box>
  );
}

/* --------------------------------------------------------------
         SMALL STAT BOX COMPONENT (Local to this file)
-------------------------------------------------------------- */
function StatBox({ title, value, icon, color }) {
  return (
    
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 3,
        mb:5,
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        background: `${color}15`,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          bgcolor: color,
          color: "white",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}









