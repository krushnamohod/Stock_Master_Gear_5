"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

  // ----------------------------------------------------
  // Load token + user on page refresh
  // ----------------------------------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------
  // Load user profile from backend
  // ----------------------------------------------------
  const loadUser = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCurrentUser(data);
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Failed to load user", err);
    }
    setLoading(false);
  };

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Login failed" };
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  // ----------------------------------------------------
  // SIGNUP
  // ----------------------------------------------------
  const signup = async (loginId, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loginId, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
