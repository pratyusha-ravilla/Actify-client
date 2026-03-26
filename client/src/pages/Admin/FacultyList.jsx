// import React, { useEffect, useState } from "react";
// import {
//   Box, Paper, Typography, Table, TableHead,
//   TableRow, TableCell, TableBody, TableContainer,
//   TextField
// } from "@mui/material";
// import axiosClient from "../../utils/axiosClient";

// export default function FacultyList() {
//   const [faculty, setFaculty] = useState([]);
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const res = await axiosClient.get("/auth/users");
//     setFaculty(res.data.filter((u) => u.role === "faculty"));
//   };

//   const filtered = faculty.filter((u) =>
//     u.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
//         Faculty Users
//       </Typography>

//       <TextField
//         placeholder="Search faculty..."
//         size="small"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         sx={{ mb: 3, width: "40%" }}
//       />

//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Name</b></TableCell>
//                 <TableCell><b>Email</b></TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filtered.map((u) => (
//                 <TableRow key={u._id}>
//                   <TableCell>{u.name}</TableCell>
//                   <TableCell>{u.email}</TableCell>
//                 </TableRow>
//               ))}

//               {filtered.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={2} align="center">
//                     No faculty found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }




// client/src/pages/Admin/FacultyList.jsx
import React from "react";
import UsersList from "./UsersList";

export default function FacultyList() {
  return <UsersList roleFilter="faculty" />;
}
