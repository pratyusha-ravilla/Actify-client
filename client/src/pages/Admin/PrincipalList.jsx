// client/src/pages/Admin/PrincipalList.jsx
import React from "react";
import UsersList from "./UsersList";

export default function PrincipalList() {
  return <UsersList roleFilter="principal" />;
}
