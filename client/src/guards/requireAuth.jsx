import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { Loader2 } from "lucide-react";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 size={24} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
