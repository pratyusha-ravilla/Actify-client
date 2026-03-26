

// client/src/pages/Faculty/profilePage.jsx

import React, { useEffect } from "react";
import { useProfileStore } from "../../store/profileStore";
import axiosClient from "../../utils/axiosClient";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProfilePage() {
  const { profile, setProfile } = useProfileStore();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // load from user if available
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "", department: user.department || "CSE", designation: user.role || "" });
    }
  }, [user]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <div className="mt-1 text-lg">{profile.name}</div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="mt-1 text-lg">{profile.email}</div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Department</label>
          <div className="mt-1 text-lg">{profile.department}</div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Designation</label>
          <div className="mt-1 text-lg">{profile.designation}</div>
        </div>
      </div>
    </div>
  );
}
