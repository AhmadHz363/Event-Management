// src/contexts/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
const [admin, setAdmin] = useState(() => {
  const storedAdmin = localStorage.getItem("admin");
  try {
    return storedAdmin && storedAdmin !== "undefined"
      ? JSON.parse(storedAdmin)
      : null;
  } catch (e) {
    console.error("Failed to parse admin from localStorage", e);
    return null;
  }
});


  const setAuthData = (newToken, newAdmin) => {
    if (newToken && newAdmin) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("admin", JSON.stringify(newAdmin));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    }
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = (navigate) => {
    setAuthData(null, null);
    navigate ("/");
  };

  return (
    <AuthContext.Provider value={{ token, admin, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
