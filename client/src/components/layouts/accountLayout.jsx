import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AccountSidebar from "../account/AccountSidebar";

export default function AccountLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 min-h-screen relative">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#ff2d78] rounded-full flex items-center justify-center shadow-lg shadow-black/40"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex gap-8">
        <div
          className={`fixed top-0 left-0 h-full z-40 lg:z-auto transition-transform duration-300 lg:relative lg:h-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AccountSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
