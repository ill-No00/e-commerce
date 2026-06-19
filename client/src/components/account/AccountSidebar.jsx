import { NavLink } from "react-router-dom";
import { Receipt, Users, Settings, Heart, LogOut } from "lucide-react";

const navItems = [
  { to: "/account/orders", label: "ORDERS", icon: Receipt },
  { to: "/account/crew", label: "STREET_CREW", icon: Users },
  { to: "/account/settings", label: "SETTINGS", icon: Settings },
  { to: "/account/wishlist", label: "WISHLIST", icon: Heart },
];

export default function AccountSidebar() {
  return (
    <aside className="w-[200px] shrink-0 flex flex-col gap-1">
      <div className="mb-6">
        <div className="text-[11px] font-black text-[#ff2d78] uppercase tracking-widest">DASHBOARD</div>
        <div className="text-[8px] text-[#666] uppercase tracking-widest font-medium mt-0.5">STREET_LEVEL</div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
              }`
            }
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-[#2a2a2a]">
        <NavLink
          to="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
        >
          <LogOut size={16} strokeWidth={2} />
          LOGOUT
        </NavLink>
      </div>
    </aside>
  );
}
