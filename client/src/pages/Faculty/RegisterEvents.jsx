

// client/src/pages/Faculty/RegisterEvents.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import "./RegisterEvents.css";


import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";



export default function RegisterEvents() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");




  const getCountdown = (date) => {
  const diff = new Date(date) - new Date();

  if (diff <= 0) return "Started";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";

  return `${days} days left`;
};
  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await axiosClient.get("/events/open");
        setEvents(res.data || []);
      } catch {
        alert("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  /* ================= REGISTER ================= */
  const register = async (id) => {
    try {
      setRegisteringId(id);
      await axiosClient.post(`/events/${id}/register`);
      alert("Registered successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await axiosClient.delete(`/events/${id}`);

      setEvents((prev) => prev.filter((e) => e._id !== id));
      alert("Event deleted successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
    console.log("AUTH USER:", user);
console.log("EVENT CREATED BY:", events[0]?.createdBy);

  };


return (
  <Box sx={{
    width: "100%",
    px: { xs: 2, md: 5 },
    py: 4,
    minHeight: "100vh",
    background:
      "linear-gradient(180deg,#faf5ff 0%, #ffffff 60%)"
  }}>

    {/* ================= HEADER ================= */}
    <Paper
      sx={{
    p: 3,
    borderRadius: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid #ede9fe",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.35s ease",

    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 18px 40px rgba(124,58,237,0.25)"
    }
  }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#4c1d95" }}>
        Event Registration 🎓
      </Typography>

      <Typography sx={{ mt: 1, color: "#6b7280" }}>
        Register for FDPs, workshops, expert talks and conferences
      </Typography>
    </Paper>



    {/* ================= STATS ================= */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      
    </Grid>

<TextField
  placeholder="Search events..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{
    mb: 4,
    width: 350,
    background: "#fff",
    borderRadius: 2
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
    
  }
}
  
/>

<Stack direction="row" spacing={2} sx={{ mb: 3 }}>

  {["all","expert talk","conducted","attended","others"].map((type) => (
    <Button
      key={type}
      variant={filterType === type ? "contained" : "outlined"}
      onClick={() => setFilterType(type)}
      sx={{
        textTransform: "capitalize",
        borderRadius: 20
      }}
    >
      {type}
    </Button>
  ))}

</Stack>

    {/* ================= EVENTS ================= */}
    {loading && (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Loading events...
      </Typography>
    )}

    <Grid container spacing={3}>
      {!loading && events.length === 0 && (
        <Typography sx={{ color: "gray" }}>
          No open events available right now
        </Typography>
      )}

      {events
  .filter((ev) =>
    ev.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((ev) =>
    filterType === "all" ? true : ev.eventType === filterType
  )
 .map((ev) => {

  const isRegistered = ev.registrations?.some(
    (r) => String(r.faculty) === String(user?.id)
  );

  return (
        <Grid key={ev._id} item xs={12} md={6} lg={4}>
          
      
<Paper
  sx={{
    p: 3,
    borderRadius: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    background: "#ffffff",
    border: "1px solid #f1eaff",

    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 18px 35px rgba(124,58,237,0.18)"
    }
  }}
>

  {/* ===== EVENT TITLE ===== */}
  <Box>

    <Typography
      sx={{
        fontWeight: 800,
        fontSize: 18,
        color: "#4c1d95"
      }}
    >
      {ev.title}
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 14,
        color: "#6b7280"
      }}
    >
      {ev.description || "No description provided"}
    </Typography>

    {/* ===== EVENT INFO CHIPS ===== */}
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      sx={{ mt: 2 }}
    >
      <Chip
        icon={<CategoryIcon />}
        label={ev.eventType}
        size="small"
        sx={{
          background: "#f3e8ff",
          color: "#6d28d9",
          fontWeight: 600
        }}
      />

      <Chip
        icon={<BusinessIcon />}
        label={ev.department}
        size="small"
        variant="outlined"
      />

      <Chip
        icon={<EventAvailableIcon />}
        label={new Date(ev.startDate).toDateString()}
        size="small"
      />
    </Stack>

    {/* ===== COUNTDOWN ===== */}
    <Typography
      sx={{
        mt: 1.5,
        fontSize: 13,
        fontWeight: 700,
        color: "#7c3aed"
      }}
    >
      ⏳ {getCountdown(ev.startDate)}
    </Typography>

  </Box>

  {/* ===== ACTION BUTTON ===== */}
  <Box sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2, // spacing between buttons
    mt: 2,
    flexWrap: "wrap"
  }}>

<Button
  startIcon={<HowToRegIcon />}
  disabled={
    ev.approvalStatus !== "approved" ||
    registeringId === ev._id ||
    isRegistered
  }
  onClick={() => register(ev._id)}
  sx={{
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "24px",
    px: 4,
    color: "#fff",

    background:
      isRegistered
        ? "#16a34a"
        : ev.approvalStatus !== "approved"
        ? "#f59e0b"
        : "linear-gradient(135deg,#7c3aed,#5b21b6)",

    boxShadow:
      isRegistered
        ? "0 6px 18px rgba(22,163,74,0.4)"
        : ev.approvalStatus !== "approved"
        ? "0 6px 18px rgba(245,158,11,0.4)"
        : "0 8px 20px rgba(124,58,237,0.35)",

    "&:hover": {
      background:
        isRegistered
          ? "#15803d"
          : ev.approvalStatus !== "approved"
          ? "#d97706"
          : "linear-gradient(135deg,#6d28d9,#4c1d95)"
    },

    "&.Mui-disabled": {
      opacity: 1,
      color: "#fff"
    }
  }}
>
  {isRegistered
    ? "Registered"
    : ev.approvalStatus !== "approved"
    ? "Awaiting Approval"
    : "Register"}
</Button>



{user &&
  ev.createdBy &&
  String(user.id) === String(ev.createdBy._id) && (
    <Button
      startIcon={<DeleteOutlineIcon />}
      onClick={() => deleteEvent(ev._id)}
      disabled={deletingId === ev._id}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: "24px",
        px: 3,
        color: "#fff",

        background:
          deletingId === ev._id
            ? "#dc2626"
            : "linear-gradient(135deg,#ef4444,#b91c1c)",

        boxShadow:
          deletingId === ev._id
            ? "0 6px 18px rgba(220,38,38,0.4)"
            : "0 8px 20px rgba(239,68,68,0.35)",

        transition: "all 0.3s ease",

        "&:hover": {
          background: "linear-gradient(135deg,#dc2626,#991b1b)",
          transform: "scale(1.05)"
        },

        "&:active": {
          transform: "scale(0.97)"
        },

        "&.Mui-disabled": {
          opacity: 1,
          color: "#fff",
          background: "#ef4444"
        }
      }}
    >
      {deletingId === ev._id ? "Deleting..." : "Delete"}
    </Button>
)}
  </Box>
  

</Paper>

        </Grid>

        
      );})
    
    }
    </Grid>
  </Box>
  
);

}

