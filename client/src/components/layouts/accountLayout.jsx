import { Outlet, Navigate } from "react-router-dom";
import AccountSidebar from "../account/AccountSidebar";

export default function AccountLayout() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <AccountSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
