import { useLocation } from "react-router-dom";

const titles = {
  "/admin": "DASHBOARD",
  "/admin/orders": "ORDERS",
  "/admin/inventory": "INVENTORY",
  "/admin/crew": "CREW MEMBERS",
  "/admin/settings": "SETTINGS",
};

export default function AdminTopBar() {
  const location = useLocation();
  const title = titles[location.pathname] || "ADMIN";

  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-[#111] border-b border-[#2a2a2a]">
      <h1 className="text-sm font-black text-white uppercase tracking-wider">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-[#888] hover:text-white transition-colors" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2d78] rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-[10px] font-bold text-white">AK</div>
      </div>
    </header>
  );
}
