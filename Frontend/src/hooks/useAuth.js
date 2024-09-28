import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get(
          "https://readrover-backend.onrender.com/api/auth/user",
          {
            headers: { "x-auth-token": token },
          }
        );
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
      const res = await axios.post(
        "https://readrover-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      await checkAuth(); // This will set isAuthenticated and user
    } catch (err) {
      console.error("Login error:", err);
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
