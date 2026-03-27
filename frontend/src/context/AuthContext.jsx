import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const token = localStorage.getItem("interviewiq_token");  // return token if it exists else null
    const savedUser = localStorage.getItem("interviewiq_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem("interviewiq_token", token);
    localStorage.setItem("interviewiq_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    const { token, ...userData } = res.data;
    localStorage.setItem("interviewiq_token", token);
    localStorage.setItem("interviewiq_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const quickRegister = async (name) => {
    const res = await api.post("/auth/quick-register", { name });
    const { token, ...userData } = res.data;
    localStorage.setItem("interviewiq_token", token);
    localStorage.setItem("interviewiq_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (idToken, role) => {
    const res = await api.post("/auth/google", { idToken, role });
    const { token, ...userData } = res.data;
    localStorage.setItem("interviewiq_token", token);
    localStorage.setItem("interviewiq_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("interviewiq_token");
    localStorage.removeItem("interviewiq_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, quickRegister, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
