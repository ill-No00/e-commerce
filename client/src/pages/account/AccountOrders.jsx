import { Package, Truck, RotateCcw, XCircle } from "lucide-react";

const orders = [
  {
    id: "ORDER #4W-9921",
    name: "CHROME HEARTS DECK",
    price: "$89.00",
    status: "SHIPPED",
    statusColor: "bg-[#ff2d78]",
    action: "TRACK_PACKAGE",
    actionIcon: Truck,
  },
  {
    id: "ORDER #4W-8743",
    name: "STREET GRIP WHEELS 54MM",
    price: "$45.00",
    status: "DELIVERED",
    statusColor: "bg-[#00e5ff]",
    action: "REORDER",
    actionIcon: RotateCcw,
  },
  {
    id: "ORDER #4W-7652",
    name: "GRAPHITE TRUCKS V2",
    price: "$120.00",
    status: "PROCESSING",
    statusColor: "bg-[#555]",
    action: "CANCEL_REQUEST",
    actionIcon: XCircle,
  },
];

const crewTags = ["OG_MEMBER", "STREET_CERTIFIED", "TOP_CONTRIBUTOR"];

export default function AccountOrders() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">MY_ACCOUNT</h1>
        <p className="text-[11px] text-[#888] mt-1 max-w-lg">
          Welcome back to the Concrete Gallery, Alex. Track your drops, manage your decks, and keep your street profile sharp.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="flex-[2] bg-[#141414] rounded-2xl border border-[#2a2a2a] p-6 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 text-[120px] font-black text-white/[0.03] select-none leading-none">SK8</div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#2a2a2a] ring-2 ring-[#ff2d78] shrink-0" />
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white uppercase tracking-tight">ALEX_RIDER</span>
                  <button className="text-[8px] font-bold text-[#888] border border-[#2a2a2a] rounded-full px-3 py-1 uppercase tracking-widest hover:text-white hover:border-white transition-all">
                    EDIT_PROFILE
                  </button>
                </div>
                <div className="text-[10px] font-bold text-[#ff2d78] uppercase tracking-wider mt-1">PRO_TIER MEMBER</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {[
              { label: "EMAIL", value: "alex@4wheels.com" },
              { label: "STANCE", value: "GOOFY" },
              { label: "HOME_SPOT", value: "East Side Plaza" },
              { label: "JOINED", value: "Jan 2024" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{item.label}</div>
                <div className="text-sm font-bold text-white mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#7c3aed] rounded-2xl p-6">
            <div className="text-[10px] font-black text-white uppercase tracking-widest mb-3">CREW_STATUS</div>
            <div className="flex flex-wrap gap-2">
              {crewTags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold text-white bg-white/15 rounded-full px-3 py-1 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
            <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest">GALLERY_POINTS</div>
            <div className="text-3xl font-black text-[#00e5ff] mt-1">14,250</div>
            <div className="text-[10px] font-bold text-[#22c55e] mt-1">+120 this week</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 bg-[#ff2d78] rounded-full" />
          <h2 className="text-base font-black text-white uppercase tracking-tight">RECENT_ORDERS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="relative">
                <div className="h-32 bg-[#111] flex items-center justify-center">
                  <Package size={36} className="text-[#333]" />
                </div>
                <span className={`absolute top-3 right-3 text-[8px] font-bold text-white uppercase tracking-wider px-2 py-1 rounded-full ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4">
                <div className="text-[9px] text-[#666] uppercase tracking-wider mb-1">{order.id}</div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-black text-white uppercase tracking-tight leading-tight">{order.name}</span>
                  <span className="text-xs font-black text-[#ff2d78] shrink-0 ml-2">{order.price}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-[#888] border border-[#2a2a2a] rounded-full py-2.5 uppercase tracking-widest hover:text-white hover:border-white transition-all">
                  <order.actionIcon size={13} strokeWidth={2} />
                  {order.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
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
