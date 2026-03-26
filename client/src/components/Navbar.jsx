import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      background: "#1976d2",
      padding: "10px 20px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>ActiRepo</Link>
      </div>

      <div>
        {!user && (
          <>
            <Link to="/register" style={{ color:"white", marginRight: 20 }}>Register</Link>
            <Link to="/login" style={{ color:"white" }}>Login</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "faculty" && (
              <Link to="/faculty/dashboard" style={{ color:"white", marginRight: 20 }}>Dashboard</Link>
            )}

            {["hod","admin","principal"].includes(user.role) && (
              <Link to="/admin/dashboard" style={{ color:"white", marginRight: 20 }}>Admin Panel</Link>
            )}

            <button 
              onClick={logout} 
              style={{ 
                background: "#ff4d4d",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
