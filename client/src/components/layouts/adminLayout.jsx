import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="w-full min-h-screen flex text-[#F8F9FA] bg-[#0C0C0C]">
      <AdminSidebar />
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
