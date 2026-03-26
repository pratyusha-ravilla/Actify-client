


//client/src/context/AuthContext.jsx

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 NEW

  useEffect(() => {
    const stored = localStorage.getItem("actirepo_user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false); // 👈 IMPORTANT
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("actirepo_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("actirepo_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}