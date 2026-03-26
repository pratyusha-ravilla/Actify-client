// client/src/components/RecentActions.jsx
import React from "react";
import { List, ListItem, ListItemText, Divider, Typography } from "@mui/material";

export default function RecentActions({ items = [] }) {
  return (
    <List>
      {items.length === 0 && <Typography variant="body2" sx={{ color: "text.secondary" }}>No recent actions</Typography>}
      {items.map((it, idx) => (
        <React.Fragment key={it.id || idx}>
          <ListItem sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 700 }}>{it.text}</Typography>}
              secondary={it.time ? new Date(it.time).toLocaleString() : ""}
            />
          </ListItem>
          {idx < items.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}
