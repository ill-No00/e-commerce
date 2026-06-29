import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const [adminState, setAdminState] = useState({ checking: true, isAdmin: false });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAdminState({ checking: false, isAdmin: false });
      return;
    }

    const token = localStorage.getItem("4wheels_token");
    const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

    fetch(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("not admin");
        setAdminState({ checking: false, isAdmin: true });
      })
      .catch(() => {
        setAdminState({ checking: false, isAdmin: false });
      });
  }, [user, loading]);

  if (loading || adminState.checking) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 size={24} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  if (!user || !adminState.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
