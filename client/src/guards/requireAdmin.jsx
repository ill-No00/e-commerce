import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/admin.js";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const [adminState, setAdminState] = useState({ checking: true, isAdmin: false });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log("User is not logged in, redirecting to login.");
      setAdminState({ checking: false, isAdmin: false });
      return;
    }

    adminApi
      .dashboard()
      .then(() => {
        console.log("User is an admin.");
        setAdminState({ checking: false, isAdmin: true });
      })
      .catch((e) => {
        console.error("Error fetching dashboard data:", e);
        setAdminState({ checking: false, isAdmin: true });
      });
  }, [user, loading]);

  if (loading || adminState.checking) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 size={24} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  }
  console.log("Admin state:", adminState);

  if (!adminState.isAdmin) {
    console.log("User is not an admin, redirecting to home.");
    return <Navigate to="/" replace />;
  }

  return children;
}
