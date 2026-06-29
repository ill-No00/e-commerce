import { ShoppingCart, User, Search, LogOut } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../store/auth.jsx";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[#121212]/80 backdrop-blur-md px-8 py-4 fixed top-0 z-50">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <NavLink to="/" className="text-[#EF476F] text-xl tracking-wider font-bold">
            4WHEELS
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-[#F8F9FA] text-xs uppercase tracking-widest border-b-2 border-[#EF476F] pb-1"
                  : "text-[#F8F9FA] text-xs uppercase tracking-widest pb-1"
              }
            >
              SHOP
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-[#F8F9FA] text-xs uppercase tracking-widest border-b-2 border-[#EF476F] pb-1"
                  : "text-[#F8F9FA] text-xs uppercase tracking-widest pb-1"
              }
            >
              STORY
            </NavLink>
            {user ? (
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#F8F9FA] text-xs uppercase tracking-widest border-b-2 border-[#EF476F] pb-1"
                    : "text-[#F8F9FA] text-xs uppercase tracking-widest pb-1"
                }
              >
                ACCOUNT
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#F8F9FA] text-xs uppercase tracking-widest border-b-2 border-[#EF476F] pb-1"
                    : "text-[#F8F9FA] text-xs uppercase tracking-widest pb-1"
                }
              >
                SIGN IN
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center bg-[#282826] rounded-lg px-4 py-2 border border-neutral-800">
            <Search size={14} className="text-[#737373] mr-2" />
            <input
              type="text"
              placeholder="SEARCH GALLERY..."
              className="bg-transparent text-xs text-[#F8F9FA] placeholder:text-[#737373] outline-none w-48"
            />
          </div>
          <Link to="/cart" className="relative text-[#F8F9FA]" aria-label="Shopping cart">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2.5 bg-[#EF476F] text-white text-[9px] rounded-full px-1.5 font-bold leading-tight">
              2
            </span>
          </Link>
          {user ? (
            <button onClick={logout} className="text-[#F8F9FA]" aria-label="Logout">
              <LogOut size={18} />
            </button>
          ) : (
            <Link to="/login" className="text-[#F8F9FA]" aria-label="Sign in">
              <User size={20} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
