import { useState } from "react";
import Pagination from "../../components/admin/Pagination";
import Drawer from "../../components/admin/Drawer";

const stats = [
  { label: "TOTAL ORDERS", value: "1,284", sub: "All time" },
  { label: "PENDING", value: "23", sub: "Awaiting fulfillment", color: "text-[#f59e0b]" },
  { label: "IN TRANSIT", value: "47", sub: "Out for delivery", color: "text-[#00e5ff]" },
  { label: "COMPLETED", value: "1,192", sub: "This month", color: "text-[#ff2d78]" },
];

const orders = [
  { id: "#4W-00291", customer: "Marcus L.", email: "marcus@email.com", initials: "ML", build: "Deck + Trucks + Wheels + 3 more", date: "Mar 14, 2026", total: "$228.96", status: "PENDING" },
  { id: "#4W-00290", customer: "Sarah K.", email: "sarah@email.com", initials: "SK", build: "Tokyo Neon + Obsidian Pro + 4 more", date: "Mar 12, 2026", total: "$195.00", status: "IN TRANSIT" },
  { id: "#4W-00289", customer: "Jay T.", email: "jay@email.com", initials: "JT", build: "Concrete Ghost + Hollow Lights", date: "Mar 10, 2026", total: "$145.00", status: "COMPLETED" },
  { id: "#4W-00288", customer: "Priya R.", email: "priya@email.com", initials: "PR", build: "Shadow Maple + Neon Pivot + 2 more", date: "Mar 08, 2026", total: "$210.00", status: "COMPLETED" },
  { id: "#4W-00287", customer: "Dom W.", email: "dom@email.com", initials: "DW", build: "Night Rider + Titanium Raw + 3 more", date: "Mar 07, 2026", total: "$260.00", status: "PENDING" },
  { id: "#4W-00286", customer: "Aisha B.", email: "aisha@email.com", initials: "AB", build: "Tokyo Neon + Bones Reds + 2 more", date: "Mar 05, 2026", total: "$108.00", status: "IN TRANSIT" },
  { id: "#4W-00285", customer: "Leo M.", email: "leo@email.com", initials: "LM", build: "Concrete Ripper V2 + Bronson G3", date: "Mar 03, 2026", total: "$92.00", status: "CANCELLED" },
  { id: "#4W-00284", customer: "Zara N.", email: "zara@email.com", initials: "ZN", build: "Purple Haze + Spitfire + 4 more", date: "Feb 28, 2026", total: "$312.00", status: "COMPLETED" },
];

const statusStyles = {
  PENDING: "bg-[#f59e0b]/20 text-[#f59e0b]",
  "IN TRANSIT": "bg-[#00e5ff]/20 text-[#00e5ff]",
  COMPLETED: "bg-[#22c55e]/20 text-[#22c55e]",
  CANCELLED: "bg-[#ef4444]/20 text-[#ef4444]",
};

export default function OrdersPage() {
  const [drawerOrder, setDrawerOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = activeFilter === "ALL" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <>
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{s.label}</div>
            <div className={`text-2xl font-black mt-1 ${s.color || "text-white"}`}>{s.value}</div>
            <div className="text-[10px] text-[#888] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="SEARCH ORDERS..." className="bg-transparent text-xs text-white placeholder:text-[#888] outline-none w-48" />
          </div>
          <div className="flex gap-1 text-[10px] font-bold uppercase tracking-widest">
            {["ALL", "PENDING", "IN TRANSIT", "COMPLETED", "CANCELLED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  activeFilter === f ? "bg-[#7c3aed] text-white" : "text-[#888] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[10px] font-bold tracking-widest uppercase text-[#888] border border-[#2a2a2a] px-4 py-2 rounded-full hover:text-white hover:border-white transition-all">
            EXPORT CSV
          </button>
          <button className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#ff2d78] px-4 py-2 rounded-full hover:brightness-110 transition-all">
            NEW ORDER
          </button>
        </div>
      </div>

      <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#141414] text-[#888] text-[10px] uppercase tracking-widest font-semibold">
              <th className="text-left px-5 py-4">ORDER ID</th>
              <th className="text-left px-5 py-4">CUSTOMER</th>
              <th className="text-left px-5 py-4">BUILD SUMMARY</th>
              <th className="text-left px-5 py-4">DATE</th>
              <th className="text-left px-5 py-4">TOTAL</th>
              <th className="text-left px-5 py-4">STATUS</th>
              <th className="text-right px-5 py-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"}>
                <td className="px-5 py-4 text-xs font-mono text-[#ff2d78] font-bold">{o.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#7c3aed]/30 flex items-center justify-center text-[10px] font-bold text-white">{o.initials}</div>
                    <div>
                      <div className="text-xs font-bold text-white">{o.customer}</div>
                      <div className="text-[9px] text-[#888]">{o.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[10px] text-[#888] max-w-[180px] truncate">{o.build}</td>
                <td className="px-5 py-4 text-xs text-[#888]">{o.date}</td>
                <td className="px-5 py-4 text-xs font-bold text-white">{o.total}</td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusStyles[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => setDrawerOrder(o)} className="text-[#888] hover:text-white transition-colors mr-2" title="View">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button className="text-[#888] hover:text-white transition-colors" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={1} total={4} />

      <Drawer open={!!drawerOrder} onClose={() => setDrawerOrder(null)}>
        {drawerOrder && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black text-white uppercase tracking-tight">{drawerOrder.id}</h2>
              <button onClick={() => setDrawerOrder(null)} className="text-[#888] hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 border border-[#2a2a2a]">
              <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-2">CUSTOMER</div>
              <div className="text-xs font-bold text-white">{drawerOrder.customer}</div>
              <div className="text-[10px] text-[#888]">{drawerOrder.email}</div>
              <div className="text-[10px] text-[#888] mt-2">1234 Venice Blvd, Los Angeles, CA 90210</div>
            </div>

            <div className="mb-6">
              <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-3">COMPONENTS</div>
              <div className="flex flex-col gap-2">
                {["DECK: Tokyo Neon '24", "TRUCKS: Obsidian Pro V2", "WHEELS: Spitfire F4 52mm", "BEARINGS: Bones Reds", "HARDWARE: Allen 1\"", "GRIP TAPE: Mob Grip Black"].map((c) => (
                  <div key={c} className="flex justify-between items-center bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#2a2a2a]">
                    <span className="text-[10px] text-white font-bold">{c.split(":")[0]}</span>
                    <span className="text-[10px] text-[#888]">{c.split(":")[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] mb-6">
              <div className="flex justify-between text-[11px] py-1"><span className="text-[#888]">Subtotal</span><span className="text-white font-bold">$195.00</span></div>
              <div className="flex justify-between text-[11px] py-1"><span className="text-[#888]">Assembly Labor</span><span className="text-[#00e5ff] font-bold">COMPLIMENTARY</span></div>
              <div className="flex justify-between text-[11px] py-1"><span className="text-[#888]">Tax</span><span className="text-white font-bold">$18.96</span></div>
              <div className="flex justify-between text-[11px] py-1"><span className="text-[#888]">Shipping</span><span className="text-white font-bold">$15.00</span></div>
              <div className="border-t border-[#2a2a2a] mt-2 pt-2 flex justify-between">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">TOTAL</span>
                <span className="text-lg font-black text-[#ff2d78]">$228.96</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">UPDATE STATUS</label>
              <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-white px-3 py-2.5 outline-none">
                <option>PENDING</option>
                <option>IN TRANSIT</option>
                <option>COMPLETED</option>
                <option>CANCELLED</option>
              </select>
            </div>
            <button className="w-full bg-[#ff2d78] text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-full hover:brightness-110 transition-all mb-3">
              UPDATE STATUS
            </button>
            <button className="w-full text-[10px] font-bold tracking-widest uppercase text-[#888] border border-[#2a2a2a] py-3 rounded-full hover:text-white hover:border-white transition-all">
              PRINT SLIP
            </button>
          </>
        )}
      </Drawer>
    </>
  );
}
