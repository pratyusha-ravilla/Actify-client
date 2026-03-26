

//client/src/pages/Auth/Register.jsx
import React, { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    // ✅ STEP 2 — Email Validation (Add Here)
    if (!form.email.endsWith("@atria.edu.in")) {
      alert("Only Atria college emails are allowed (xxxx@atria.edu.in)");
      return;
    }
    try {
      setLoading(true);
      await axiosClient.post("/auth/register", form);
      alert("Registration successful. Login now.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Activity Report Management System</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <input
              placeholder=" "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <label>Full Name</label>
          </div>

          <div className="form-group">
           
            <input
              type="email"
              placeholder=" "
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              pattern="^[a-zA-Z0-9._%+-]+@atria\.edu$"
              title="Email must be in the format xxxx@atria.edu"
              required
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder=" "
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <label>Password</label>
          </div>

          <div className="form-group">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="faculty">Faculty</option>
              <option value="hod">HOD</option>
              <option value="admin">Admin</option>
              <option value="principal">Principal</option>
            </select>
            <label>Role</label>
          </div>

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          Already registered? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
