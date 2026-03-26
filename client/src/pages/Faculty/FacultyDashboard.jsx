

// // client/src/pages/Faculty/FacultyDashboard.jsx


import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";

import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Grid,
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
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button
} from "@mui/material";

import {
  Article as ArticleIcon,
  Book as BookIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from "@mui/icons-material";


import StatCard from "../../components/StatCard.jsx";
import EventItem from "../../components/EventItem.jsx";
import SummaryCard from "../../components/SummaryCard.jsx";


import { LinearProgress } from "@mui/material";
//access denied
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

//event registration
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";


const drawerWidth = 260;


const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "conducted", label: "Conducted" },
  { value: "attended", label: "Attended" },
  { value: "expert_talk", label: "Expert Talks" }
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];


export default function FacultyDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  //event registration
  const [eventsOpen, setEventsOpen] = useState(true);
   
  const [events, setEvents] = useState([]);

  //access Denied
const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);


  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await axiosClient.get("/activity/mine");
  //       setReports(res.data || []);
  //     } catch {
  //       setReports([]);
  //     }
  //     setLoading(false);
  //   };
  //   load();

 
  // }, []);


  useEffect(() => {
  const load = async () => {
    try {
      const reportsRes = await axiosClient.get("/activity/mine");
      setReports(reportsRes.data || []);

      const eventsRes = await axiosClient.get("/events/open");
      setEvents(eventsRes.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  load();
}, []);


  const stats = useMemo(() => {
    return {
      total: reports.length,
      conducted: reports.filter((r) => r.reportType === "conducted").length,
      attended: reports.filter((r) => r.reportType === "attended").length,
      talks: reports.filter((r) => r.reportType === "expert_talk").length,
      approved: reports.filter((r) => r.status === "approved").length,
      pending: reports.filter((r) => r.status === "pending").length
    };
  }, [reports]);

const upcoming = useMemo(() => {
  const now = new Date();

  return events
    .filter((ev) => new Date(ev.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6);

}, [events]);

console.log("EVENTS:", events);

  const filtered = useMemo(() => {
    let data = [...reports];

    if (typeFilter !== "all")
      data = data.filter((r) => r.reportType === typeFilter);

    if (statusFilter !== "all")
      data = data.filter((r) => r.status === statusFilter);

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
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return sortDir === "asc"
        ? a.activityName.localeCompare(b.activityName)
        : b.activityName.localeCompare(a.activityName);
    });

    return data;
  }, [reports, query, typeFilter, statusFilter, sortBy, sortDir]);


  //access denied
  const handleRestrictedClick = (e) => {
  e.preventDefault();
  setAccessDeniedOpen(true);
};

  //user profile 
  const drawerContent = (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}>

    {/* USER PROFILE SECTION */}
    <Box sx={{ px: 3, py: 4, textAlign: "left" }}>
      <Avatar sx={{ bgcolor: "#fff", color: "#4c1d95", width: 56, height: 56, mb: 1 }}>
        {(user?.name || "U").charAt(0).toUpperCase()}
      </Avatar>

      <Typography sx={{ fontWeight: 700 }}>{user?.name || "Faculty User"}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {user?.email}
      </Typography>
    </Box>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />






{/* EVENTS SECTION */}
<Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

<List>
  {/* EVENTS HEADER */}
  <ListItem
    button
    onClick={() => setEventsOpen(!eventsOpen)}
    sx={{
      color: "#e9d5ff",
      fontWeight: 700,
      "&:hover": { background: "rgba(255,255,255,0.12)" }
    }}
  >
    <ListItemIcon sx={{ color: "inherit" }}>
      <EventIcon />
    </ListItemIcon>

    <ListItemText
      primary="Events"
      primaryTypographyProps={{ fontWeight: 700 }}
    />

    <ExpandMoreIcon
      sx={{
        transform: eventsOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "0.3s"
      }}
    />
  </ListItem>

  {/* EVENT SUB MENU */}
  {eventsOpen && (
    <Box sx={{ pl: 4 }}>
      {/* Register for Event */}
      <ListItem
        component={Link}
        to="/faculty/events/register"
        sx={{
          color: "#f5f3ff",
          borderLeft: "3px solid transparent",
          transition: "all 0.3s",
          "&:hover": {
            background: "rgba(255,255,255,0.12)",
            borderLeft: "3px solid #fff"
          }
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <HowToRegIcon />
        </ListItemIcon>
        <ListItemText primary="Register for Event" />
      </ListItem>

      {/* Create Event */}
      <ListItem
        component={Link}
        to="/faculty/events/create"
        sx={{
          color: "#f5f3ff",
          borderLeft: "3px solid transparent",
          transition: "all 0.3s",
          "&:hover": {
            background: "rgba(255,255,255,0.12)",
            borderLeft: "3px solid #fff"
          }
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Create Event" />
      </ListItem>

      {/* My Registered Events */}
      <ListItem
        component={Link}
        to="/faculty/events/my"
        sx={{
          color: "#f5f3ff",
          borderLeft: "3px solid transparent",
          transition: "all 0.3s",
          "&:hover": {
            background: "rgba(255,255,255,0.12)",
            borderLeft: "3px solid #fff"
          }
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <EventAvailableIcon />
        </ListItemIcon>
        <ListItemText primary="My Registered Events" />
      </ListItem>
    </Box>
  )}
</List>




    {/* OTHER LINKS */}

  <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

<Box sx={{ px: 3, py: 2 }}>
  <Typography
    variant="subtitle2"
    sx={{
      color: "#e9d5ff",
      fontWeight: 700,
      letterSpacing: 0.5
    }}
  >
    Create Report
  </Typography>
</Box>



<List>
  {[
    { label: "FDP Attended", icon: <EventIcon />, link: "/faculty/create?type=attended" },
    { label: "FDP Conducted", icon: <PeopleIcon />, link: "/faculty/create?type=conducted" },
    { label: "Expert Talk", icon: <DescriptionIcon />, link: "/faculty/create?type=expert_talk" },
  ].map((item) => (
    <ListItem
      key={item.label}
      component={Link}
      to={item.link}
      onClick={handleRestrictedClick}
      sx={{
        color: "#f5f3ff",
        "&:hover": {
          background: "rgba(255,255,255,0.15)",
          color: "#ffffff"
        }
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>
        {item.icon}
      </ListItemIcon>

      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    </ListItem>
  ))}
</List>


    {/* FOOTER LOGOUT */}
    <Box sx={{ px: 3, py: 3, mt: "auto" }}>
      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        color="error"
        fullWidth
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Box>

  </Box>
);




  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ░░ TOP BAR ░░ */}
  


<AppBar
  position="fixed"
  sx={{
    width: { md: `calc(100% - ${drawerWidth}px)` },
    ml: { md: `${drawerWidth}px` },
    bgcolor: "#ffffff",
    color: "#4c1d95",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  }}
>
  <Toolbar>

    {/* Mobile Menu */}
    <IconButton
      color="inherit"
      sx={{ display: { md: "none" }, mr: 2 }}
      onClick={() => setMobileOpen(true)}
    >
      <MenuIcon />
    </IconButton>

    <Typography variant="h5" sx={{ fontWeight: 800, flexGrow: 1 }}>
      Faculty Dashboard
    </Typography>

    <Paper
      sx={{
        px: 2,
        py: 1,
        borderRadius: 3,
        background: "#F5F3FF",
      }}
    >
      <Typography variant="body2">
        {user?.name}
      </Typography>
    </Paper>

  </Toolbar>
</AppBar>

      {/* ░░ SIDE DRAWER ░░ */}
     <Drawer
  variant="permanent"
  sx={{
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      background: "linear-gradient(180deg, #4c1d95 0%, #743bd7ff 60%, #c084fc 100%)",
      color: "white",
      borderRight: "none",
    },
  }}
>

        {drawerContent}
      </Drawer>

    

      {/* ░░ MAIN CONTENT ░░ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: "90px",
          // bgcolor: "4f5fa#f",
          bgcolor: "#f8fafc",
          minHeight: "100vh"
        }}
      >
        <Grid container spacing={4}>

       


{/* ===== DASHBOARD HEADER ===== */}
<Grid size={12}>
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
      boxShadow: 2
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 900, color: "#4c1d95" }}>
      Welcome back, {user?.name || "Faculty"} 👋
    </Typography>

    <Typography sx={{ mt: 1, color: "#5b21b6", fontWeight: 500 }}>
      {new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })}
    </Typography>

    <Typography sx={{ mt: 1, color: "#6b7280" }}>
      Manage your FDPs, expert talks, and activity reports from one place.
    </Typography>
  </Paper>
</Grid>


{/* ===== QUICK ACTIONS ===== */}
 {/* ---------------- Row 1: Stat Cards ---------------- */}
         
<Grid size={12}>
  <Grid container spacing={3}>
    {[
      {
        title: "My FDPs",
        value: stats.conducted,
        subtitle: "View FDPs you created",
        icon: <BookIcon />,
        start: "#915ceeff",
        end: "#c084fc"
      },
      {
        title: "Conducted Events",
        value: stats.conducted,
        subtitle: "Events you organized",
        icon: <EventIcon />,
        start: "#9d64f3ff",
        end: "#a173f0"
      },
      {
        title: "Expert Talks",
        value: stats.talks,
        subtitle: "Talks conducted & attended",
        icon: <PeopleIcon />,
        start: "#9576f4ff",
        end: "#c084fc"
      },
      {
        title: "Attended",
        value: stats.attended,
        subtitle: "Programs you attended",
        icon: <DescriptionIcon />,
        start: "#8059f7ff",
        end: "#d481ed"
      }
    ].map((item) => (
      <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
        <Box
          sx={{
            height: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px) scale(1.02)",
              filter: "drop-shadow(0 16px 25px rgba(0,0,0,0.2))"
            }
          }}
        >
          <StatCard
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            colorStart={item.start}
            colorEnd={item.end}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
</Grid>

          {/* ---------------- Row 2: Upcoming Events ---------------- */}
         

  <Grid size={12}>
  <Paper
    sx={{
      p: 4,
      borderRadius: 3,
      boxShadow: 3,
      background: "linear-gradient(180deg,#ffffff,#fafafa)"
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
      Upcoming Events
    </Typography>

    <Grid container spacing={3}>
      {upcoming.length === 0 && (
        <Typography sx={{ color: "gray", ml: 2 }}>
          No upcoming events available
        </Typography>
      )}

      {upcoming.map((ev) => {

        const diff =
          Math.ceil(
            (new Date(ev.startDate) - new Date()) /
              (1000 * 60 * 60 * 24)
          );

        return (
          <Grid key={ev._id} size={{ xs: 12, md: 6, lg: 2 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #ede9fe",
                transition: "all 0.3s",
                background: "#faf5ff",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(124,58,237,0.25)"
                }
              }}
            >

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#4c1d95"
                }}
              >
                {ev.title}
              </Typography>

              <Typography sx={{ mt: 1, color: "#6b7280" }}>
                {ev.eventType} • {ev.department}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                📅 {new Date(ev.startDate).toDateString()}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: "#7c3aed"
                }}
              >
                ⏳ {diff > 0 ? `${diff} days remaining` : "Started"}
              </Typography>

              {/* <Chip
                label={ev.approvalStatus}
                size="small"
                sx={{
                  mt: 2,
                  background:
                    ev.approvalStatus === "approved"
                      ? "#dcfce7"
                      : "#fef3c7",
                  color:
                    ev.approvalStatus === "approved"
                      ? "#166534"
                      : "#92400e",
                  fontWeight: 600
                }}
              /> */}


<Button
  variant="contained"
  size="small"
  sx={{
    mt: 2,
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 1,
    mx: "auto",
    display: "block",
    px: 4,
    background:
      "linear-gradient(90deg, rgba(76,29,149,1) 0%, rgba(124,58,237,1) 100%)"
  }}
  onClick={() => navigate("/faculty/events/register")}
>
  View Event
</Button>


            </Paper>
          </Grid>
        );
      })}
    </Grid>
  </Paper>
</Grid>

          {/* ---------------- Row 3: Reports Table ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>

              {/* Search + Filters */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <TextField
                  fullWidth
                  placeholder="Search by activity or coordinator..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <TextField
                  select
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {typeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              {/* TABLE */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 1000,color:"#4c1d95" }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: 1000,color:"#4c1d95" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 1000,color:"#4c1d95"}}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 1000,color:"#4c1d95" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 1000,color:"#4c1d95" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={5}>Loading...</TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      filtered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((r) => (
                          <TableRow key={r._id} hover>
                            <TableCell>{r.activityName}</TableCell>
                            <TableCell>{r.reportType}</TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell>
                              {/* <Chip
                                label={r.status}
                                color={
                                  r.status === "approved"
                                    ? "success"
                                    : r.status === "pending"
                                    ? "warning"
                                    : "error"
                                }
                              /> */}


                              <Chip
  label={r.status}
  size="small"
  sx={{
    textTransform: "capitalize",
    fontWeight: 600,
    background:
      r.status === "approved"
        ? "rgba(34,197,94,0.15)"
        : r.status === "pending"
        ? "rgba(245,158,11,0.15)"
        : "rgba(239,68,68,0.15)",
    color:
      r.status === "approved"
        ? "#16a34a"
        : r.status === "pending"
        ? "#d97706"
        : "#dc2626",
    borderRadius: "20px",
    px: 1.5,
  }}
/>
                            </TableCell>


                           
     <TableCell>
  <Stack direction="row" spacing={1}>
    <Button
       size="medium"
  variant="outlined"
  sx={{
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 1000,
    
  }}
      onClick={() => navigate(`/faculty/report/${r._id}`)}
    >
      View
    </Button>

    {r.status === "pending" && (
      <Button
        size="medium"
  variant="contained"
  sx={{
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 1000,
    background: "linear-gradient(135deg,#7C3AED,#5B21B6)"
  }}
        onClick={() => navigate(`/faculty/report/${r._id}/edit`)}
      >
        Edit
      </Button>
    )}
  </Stack>
</TableCell>

                          </TableRow>
                        ))}

                    {!loading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No reports found
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
              />
            </Paper>
          </Grid>

       



{/* ---------------- Row 5: Faculty Guide ---------------- */}
<Grid size={12}>
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
      Faculty Guide
    </Typography>

    <ul style={{ margin: 0, paddingLeft: "20px", color: "#444", lineHeight: 1.8 }}>
      <li>Create reports for FDPs, Workshops, Conferences, and Expert Talks.</li>
      <li>Upload invitation posters, attendance sheets, photos, and feedback.</li>
      <li>Edit reports while they are in <b>Pending</b> status.</li>
      <li>Track approvals from HOD / Admin in real time.</li>
      <li>Generate official documentation instantly in <b>PDF or DOCX format</b>.</li>
      <li>Use event registration to participate in upcoming faculty activities.</li>
    </ul>
  </Paper>
</Grid>


{/* ---------------- Row 6: Activity Insights ---------------- */}
<Grid size={12}>
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
      Activity Insights
    </Typography>

    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={6}
      sx={{ mt: 2 }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
          Total Activities Submitted
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#4c1d95" }}>
          {stats.total}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
          Awaiting Approval
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#f59e0b" }}>
          {stats.pending}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
          Successfully Approved
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#16a34a" }}>
          {stats.approved}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
          Expert Talks Conducted
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#7c3aed" }}>
          {stats.talks}
        </Typography>
      </Box>
    </Stack>
  </Paper>
</Grid>

             
        </Grid>
      </Box>
      <Dialog
  open={accessDeniedOpen}
  onClose={() => setAccessDeniedOpen(false)}
>
  <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  <WarningAmberIcon color="warning" />
  Access Restricted
</DialogTitle>

  <DialogContent>
    <Typography>
      You are not allowed to create this type of report.
      Please contact the administrator if you believe this is a mistake.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setAccessDeniedOpen(false)}
      variant="contained"
      sx={{
        background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
        textTransform: "none"
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>
    </Box>

    
  );
}
