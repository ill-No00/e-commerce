import { useState, useEffect } from "react";
import { Package, Truck, RotateCcw, XCircle, Loader2 } from "lucide-react";
import { ordersApi } from "../../api/orders.js";
import { profileApi } from "../../api/profile.js";

export default function AccountOrders() {
  const [profile, setProfile] = useState(undefined);
  const [orderList, setOrderList] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.get().catch(() => undefined),
      ordersApi.list().catch(() => undefined),
    ])
      .then(([profileRes, ordersRes]) => {
        setProfile(profileRes?.data);
        setOrderList(ordersRes?.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile?.display_name;
  const email = profile?.email;
  const stance = profile?.stance;
  const homeSpot = profile?.home_spot;
  const joined = profile?.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : undefined;
  const tier = profile?.tier;
  const galleryPoints = profile?.gallery_points;
  const crewTags = profile?.badges;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 size={20} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  const statusConfig = {
    SHIPPED: { color: "bg-[#ff2d78]", icon: Truck, action: "TRACK_PACKAGE" },
    DELIVERED: { color: "bg-[#00e5ff]", icon: RotateCcw, action: "REORDER" },
    PROCESSING: { color: "bg-[#666]", icon: XCircle, action: "CANCEL_REQUEST" },
    CANCELLED: { color: "bg-[#ef4444]", icon: XCircle, action: "VIEW_DETAILS" },
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">MY_ACCOUNT</h1>
        <p className="text-[11px] text-[#888] mt-1 max-w-lg">
          Welcome back to the Concrete Gallery{displayName ? `, ${displayName}` : ""}. Track your drops, manage your decks, and keep your street profile sharp.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="flex-[2] bg-[#141414] rounded-2xl border border-[#2a2a2a] p-4 md:p-6 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 text-[80px] md:text-[120px] font-black text-white/[0.03] select-none leading-none">SK8</div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#2a2a2a] ring-2 ring-[#ff2d78] shrink-0" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="text-sm md:text-base font-black text-white uppercase tracking-tight">{displayName ? displayName.toUpperCase().replace(/\s+/g, "_") : "—"}</span>
                  <button className="text-[8px] font-bold text-[#888] border border-[#2a2a2a] rounded-full px-2.5 md:px-3 py-1 uppercase tracking-widest hover:text-white hover:border-white transition-all">
                    EDIT_PROFILE
                  </button>
                </div>
                <div className="text-[10px] font-bold text-[#ff2d78] uppercase tracking-wider mt-1">{tier ? `${tier}_TIER MEMBER` : "—"}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-4 gap-x-6 md:gap-x-8">
            {[
              { label: "EMAIL", value: email },
              { label: "STANCE", value: stance },
              { label: "HOME_SPOT", value: homeSpot },
              { label: "JOINED", value: joined },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{item.label}</div>
                <div className="text-xs md:text-sm font-bold text-white mt-0.5 break-words">{item.value ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#7c3aed] rounded-2xl p-5 md:p-6">
            <div className="text-[10px] font-black text-white uppercase tracking-widest mb-3">CREW_STATUS</div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {crewTags?.length ? crewTags.map((tag) => (
                <span key={tag} className="text-[8px] md:text-[9px] font-bold text-white bg-white/15 rounded-full px-2.5 md:px-3 py-1 uppercase tracking-wider">
                  {tag}
                </span>
              )) : (
                <span className="text-[9px] text-[#888]">No crew badges</span>
              )}
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-5 md:p-6">
            <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest">GALLERY_POINTS</div>
            <div className="text-2xl md:text-3xl font-black text-[#00e5ff] mt-1">{galleryPoints != null ? galleryPoints.toLocaleString() : "—"}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-1 h-5 bg-[#ff2d78] rounded-full shrink-0" />
          <h2 className="text-sm md:text-base font-black text-white uppercase tracking-tight">RECENT_ORDERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {!orderList?.length && !loading && (
            <p className="text-xs text-[#888] uppercase tracking-widest col-span-full">No orders yet</p>
          )}
          {(orderList || []).map((order) => {
            const cfg = statusConfig[order.status] || { color: "bg-[#666]", icon: Package, action: "VIEW" };
            const ActionIcon = cfg.icon;
            const label = order.order_number || order.id;
            const firstItem = order.order_items?.[0];
            const itemName = firstItem?.product_name || "Order";
            const price = order.total_cents != null ? `$${(order.total_cents / 100).toFixed(2)}` : "$0.00";
            return (
              <div key={order.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <div className="relative">
                  <div className="h-28 md:h-32 bg-[#111] flex items-center justify-center">
                    <Package size={28} className="md:hidden text-[#333]" />
                    <Package size={36} className="hidden md:block text-[#333]" />
                  </div>
                  <span className={`absolute top-2 md:top-3 right-2 md:right-3 text-[8px] font-bold text-white uppercase tracking-wider px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${cfg.color}`}>
                    {order.status}
                  </span>
                </div>
                <div className="p-3 md:p-4">
                  <div className="text-[9px] text-[#666] uppercase tracking-wider mb-1">{label}</div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-tight leading-tight">{itemName}</span>
                    <span className="text-[10px] md:text-xs font-black text-[#ff2d78] shrink-0 ml-2">{price}</span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-[#888] border border-[#2a2a2a] rounded-full py-2 md:py-2.5 uppercase tracking-widest hover:text-white hover:border-white transition-all">
                    <ActionIcon size={12} className="md:hidden" strokeWidth={2} />
                    <ActionIcon size={13} className="hidden md:block" strokeWidth={2} />
                    {cfg.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 md:mt-6 text-center">
          <button className="text-[11px] font-bold text-[#888] uppercase tracking-widest hover:text-[#ff2d78] transition-colors inline-flex items-center gap-1">
            VIEW_ALL_ORDERS
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
