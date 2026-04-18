import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAdmin = localStorage.getItem("admin");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    setLoading(false);
  }, []);


const login = async (email, password) => {
  try {
    const res = await api.post("/auth/admin/login", { email, password });

    console.log("LOGIN RESPONSE:", res.data);

    const { accessToken, admin } = res.data;

    localStorage.clear();

    localStorage.setItem("adminToken", accessToken);
    localStorage.setItem("admin", JSON.stringify(admin));

    setAdmin(admin);

    return admin;
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);