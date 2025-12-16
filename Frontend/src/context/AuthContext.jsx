import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      api.get("/users/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem("authToken", jwt);
  };
  const logout = () => {
    setToken("");
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}