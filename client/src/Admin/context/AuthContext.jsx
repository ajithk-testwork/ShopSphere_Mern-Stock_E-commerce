import { createContext, useContext, useState, useEffect } from "react";

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

  const login = (data, token, isAdmin = false) => {
    const key = isAdmin ? "admin" : "user";
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem("accessToken", token);
    isAdmin ? setAdmin(data) : setUser(data);
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