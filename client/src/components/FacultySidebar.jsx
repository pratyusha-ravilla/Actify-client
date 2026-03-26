

// // client/src/components/FacultySidebar.jsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Typography,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import PeopleIcon from "@mui/icons-material/People";
// import DescriptionIcon from "@mui/icons-material/Description";

// export const drawerWidth = 260;

// export default function FacultySidebar({ open = true }) {
//   const theme = useTheme();
//   const location = useLocation();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const items = [
//     { label: "Dashboard", icon: <DashboardIcon />, to: "/faculty/dashboard" },
//     { label: "FDP Attended", icon: <EventAvailableIcon />, to: "/faculty/fdps/attended" },
//     { label: "FDP Conducted", icon: <EventNoteIcon />, to: "/faculty/fdps/conducted" },
//     { label: "Expert Talks", icon: <PeopleIcon />, to: "/faculty/talks" },
//     { label: "Templates", icon: <DescriptionIcon />, to: "/faculty/templates" },
//   ];

//   return (
//     <Drawer
//       variant={isMobile ? "temporary" : "permanent"}
//       open={open}
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//           background: `linear-gradient(180deg, ${theme.palette.primary.light || "#7c3aed"} 0%, rgba(255,255,255,0.05) 100%)`,
//           color: "#fff",
//           borderRight: 0,
//         },
//       }}
//     >
//       <Box sx={{ p: 3, pb: 1 }}>
//         <Box display="flex" alignItems="center" gap={2}>
//           <Avatar sx={{ bgcolor: "white", width: 46, height: 46 }} src="/logo-small.png" />
//           <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
//             ActiRepo
//           </Typography>
//         </Box>
//       </Box>

//       <List sx={{ mt: 2 }}>
//         {items.map((it) => {
//           const active = location.pathname.startsWith(it.to);
//           return (
//             <ListItemButton
//               key={it.label}
//               component={Link}
//               to={it.to}
//               sx={{
//                 color: active ? theme.palette.primary.contrastText : "rgba(255,255,255,0.9)",
//                 bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
//                 my: 0.5,
//                 px: 3,
//               }}
//             >
//               <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{it.icon}</ListItemIcon>
//               <ListItemText primary={it.label} />
//             </ListItemButton>
//           );
//         })}
//       </List>

//       <Box sx={{ flex: 1 }} />

//       <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
//         <Avatar sx={{ bgcolor: "white" }}>N</Avatar>
//         <Box>
//           <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
//             Neha
//           </Typography>
//           <Typography variant="caption" sx={{ color: "#fff" }}>
//             neha@gmail.com
//           </Typography>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// }

