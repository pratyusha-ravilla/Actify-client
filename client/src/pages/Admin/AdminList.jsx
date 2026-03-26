

// client/src/pages/Admin/AdminList.jsx
import React from "react";
import UsersList from "./UsersList";

export default function AdminList() {
  return <UsersList roleFilter="admin" />;
}
