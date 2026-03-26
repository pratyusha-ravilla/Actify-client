// client/src/pages/Admin/ApprovedReports.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  MenuItem,
  Chip,
  TablePagination,
  Stack
} from "@mui/material";

import axiosClient from "../../utils/axiosClient";

export default function ApprovedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "conducted", label: "Conducted" },
    { value: "attended", label: "Attended" },
    { value: "expert_talk", label: "Expert Talks" }
  ];

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/activity");
      setReports(res.data.filter((r) => r.status === "approved"));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    let data = [...reports];
    if (typeFilter !== "all") data = data.filter((r) => r.reportType === typeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((r) => r.activityName.toLowerCase().includes(q));
    }
    return data;
  }, [reports, typeFilter, query]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "#22c55e" }}>
        Approved Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1 }}
          />

          <TextField
            select
            sx={{ width: 200 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {typeOptions.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                  .map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.activityName}</TableCell>
                      <TableCell>{r.reportType}</TableCell>
                      <TableCell>{formatDate(r.date)}</TableCell>
                      <TableCell>
                        <Chip label="approved" color="success" />
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No approved reports found
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
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>
    </Box>
  );
}
