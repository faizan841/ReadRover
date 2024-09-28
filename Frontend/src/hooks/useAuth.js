import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000";
console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.get("/api/auth/user", {
          headers: { "x-auth-token": token },
        });
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        console.error("Authentication error:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      console.log("Attempting login to:", `${API_BASE_URL}/api/auth/login`);
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      await checkAuth();
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      throw err;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return { isAuthenticated, user, loading, login, logout, checkAuth };
}
