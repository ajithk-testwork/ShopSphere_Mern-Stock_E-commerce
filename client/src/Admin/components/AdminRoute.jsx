import { useAuth } from "../context/AuthContext";

import { Navigate } from "react-router-dom"; 

export default function AdminRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!admin) {
    
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}