// client/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Notifications from "./components/Notifications";
import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
//contact
import ContactPage from "./pages/ContactPage";


// Faculty
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import CreateReport from "./pages/Faculty/CreateReport";
import EditReport from "./pages/Faculty/EditReport";
import ViewMyReport from "./pages/Faculty/ViewMyReport";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ViewReport from "./pages/Admin/ViewReport";
import PendingReports from "./pages/Admin/PendingReports.jsx";
import ApprovedReports from "./pages/Admin/ApprovedReports.jsx";
import RejectedReports from "./pages/Admin/RejectedReports.jsx";

// Users lists (role-specific)
import AdminList from "./pages/Admin/AdminList.jsx";
import HodList from "./pages/Admin/HodList.jsx";
import PrincipalList from "./pages/Admin/PrincipalList.jsx";
import FacultyList from "./pages/Admin/FacultyList.jsx";
import UsersList from "./pages/Admin/UsersList.jsx"; // generic list (if needed)
import AddUser from "./pages/Admin/AddUser.jsx"; // optional: create page to add users
// //preview page
import ReportPreview from "./pages/Faculty/PreviewReport.jsx";

//new add-on
import DepartmentReports from "./pages/DepartmentReports.jsx";
import RegisterEvents from "./pages/Faculty/RegisterEvents";
import CreateEvent from "./pages/Faculty/CreateEvent.jsx";
import MyRegisteredEvents from "./pages/Faculty/MyRegisteredEvents.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Notifications />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* new add-on*/}
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/department/:code" element={<DepartmentReports />} />
      
        {/* //event registration */}

        <Route path="/faculty/events/register" element={<RegisterEvents />} />
        <Route path="/faculty/events/create" element={<CreateEvent />} />
        <Route path="/faculty/events/my" element={<MyRegisteredEvents />} />

        {/* Faculty routes (faculty role only) */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/create"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/create-report/:eventId"
          element={<CreateReport />}
        />

        <Route
          path="/faculty/report/:id"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <ViewMyReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/report/:id/edit"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <EditReport />
            </ProtectedRoute>
          }
        />

        <Route path="/faculty/report/:id/preview" element={<ReportPreview />} />

        {/* Admin/HOD/Principal routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/report/:id"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <ViewReport />
            </ProtectedRoute>
          }
        />

        {/* Reports sub-pages (admin/hod/principal can view) */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <PendingReports />{" "}
              {/* default listing can be Pending or All depending on your UI */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/all"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <PendingReports />{" "}
              {/* or dedicated AllReports page if you have one */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/pending"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <PendingReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/approved"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <ApprovedReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/rejected"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <RejectedReports />
            </ProtectedRoute>
          }
        />

        {/* User management pages
            NOTE: per your policy, only admin should be able to add/delete users.
        */}
        <Route
          path="/admin/users/faculty"
          element={
            <ProtectedRoute roles={["admin"]}>
              <FacultyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/hod"
          element={
            <ProtectedRoute roles={["admin"]}>
              <HodList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/principal"
          element={
            <ProtectedRoute roles={["admin"]}>
              <PrincipalList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/admins"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminList />
            </ProtectedRoute>
          }
        />

        {/* Add user (admin only) - if AddUser.jsx doesn't exist, create it or route to a generic page */}
        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute roles={["admin"]}>
              {AddUser ? <AddUser /> : <UsersList />}
            </ProtectedRoute>
          }
        />

        {/* Fallbacks: keep these if your app uses them elsewhere */}
        <Route
          path="/admin/reports/pending/:id"
          element={
            <ProtectedRoute roles={["admin", "hod", "principal"]}>
              <ViewReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
