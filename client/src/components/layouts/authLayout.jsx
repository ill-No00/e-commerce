import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../store/auth.jsx";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
