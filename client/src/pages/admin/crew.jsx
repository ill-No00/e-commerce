import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { adminApi } from "../../api/admin.js";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";

const roleStats = [
  { label: "ADMIN", count: 2, desc: "Full access", color: "text-[#ff2d78]" },
  { label: "FULFILLMENT", count: 3, desc: "Orders & inventory", color: "text-[#a78bfa]" },
  { label: "VIEWER", count: 2, desc: "Read-only access", color: "text-[#888]" },
];

const members = [
  { name: "Alex K.", username: "@alexk", initials: "AK", color: "bg-[#7c3aed]", email: "alex@4wheels.com", role: "ADMIN", joined: "Jan 12, 2024", lastActive: "2 hours ago", active: true },
  { name: "Maria G.", username: "@mariag", initials: "MG", color: "bg-[#ff2d78]", email: "maria@4wheels.com", role: "ADMIN", joined: "Mar 05, 2024", lastActive: "30 min ago", active: true },
  { name: "Jamal R.", username: "@jamalr", initials: "JR", color: "bg-[#00e5ff]", email: "jamal@4wheels.com", role: "FULFILLMENT", joined: "Jun 18, 2024", lastActive: "1 hour ago", active: true },
  { name: "Tina W.", username: "@tinaw", initials: "TW", color: "bg-[#f59e0b]", email: "tina@4wheels.com", role: "FULFILLMENT", joined: "Aug 22, 2024", lastActive: "Yesterday", active: true },
  { name: "Omar S.", username: "@omars", initials: "OS", color: "bg-[#22c55e]", email: "omar@4wheels.com", role: "FULFILLMENT", joined: "Sep 09, 2024", lastActive: "3 days ago", active: false },
  { name: "Lisa C.", username: "@lisac", initials: "LC", color: "bg-[#ef4444]", email: "lisa@4wheels.com", role: "VIEWER", joined: "Nov 01, 2024", lastActive: "5 days ago", active: true },
  { name: "Dave P.", username: "@davep", initials: "DP", color: "bg-[#a78bfa]", email: "dave@4wheels.com", role: "VIEWER", joined: "Dec 14, 2024", lastActive: "2 weeks ago", active: false },
];

const roleStyles = {
  ADMIN: "bg-[#ff2d78]/20 text-[#ff2d78]",
  FULFILLMENT: "bg-[#7c3aed]/20 text-[#a78bfa]",
  VIEWER: "bg-[#2a2a2a] text-[#888]",
};

export default function CrewPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [apiStaff, setApiStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);

  useEffect(() => {
    adminApi
      .staff()
      .then((res) => setApiStaff(res.data))
      .catch(() => {})
      .finally(() => setLoadingStaff(false));
  }, []);

  const staffList = apiStaff ?? members;
  const activeStaff = staffList.filter((s) => s.active !== false);
  const roleStats = [
    { label: "ADMIN", count: activeStaff.filter((s) => s.role === "ADMIN").length, desc: "Full access", color: "text-[#ff2d78]" },
    { label: "FULFILLMENT", count: activeStaff.filter((s) => s.role === "FULFILLMENT").length, desc: "Orders & inventory", color: "text-[#a78bfa]" },
    { label: "VIEWER", count: activeStaff.filter((s) => s.role === "VIEWER").length, desc: "Read-only access", color: "text-[#888]" },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">CREW MEMBERS</h1>
          <p className="text-[11px] text-[#888] mt-1">Manage your team&apos;s access and roles</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-[#ff2d78] text-white text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full hover:brightness-110 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          INVITE MEMBER
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {roleStats.map((r) => (
          <div key={r.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{r.label}</div>
            <div className={`text-2xl font-black mt-1 ${r.color}`}>{r.count}</div>
            <div className="text-[10px] text-[#888] mt-1">{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#141414] text-[#888] text-[10px] uppercase tracking-widest font-semibold">
              <th className="text-left px-5 py-4">MEMBER</th>
              <th className="text-left px-5 py-4">EMAIL</th>
              <th className="text-left px-5 py-4">ROLE</th>
              <th className="text-left px-5 py-4">JOINED</th>
              <th className="text-left px-5 py-4">LAST ACTIVE</th>
              <th className="text-left px-5 py-4">STATUS</th>
              <th className="text-right px-5 py-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((m, i) => (
              <tr key={m.username} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                      {m.initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[9px] text-[#888]">{m.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[10px] text-[#888]">{m.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleStyles[m.role]}`}>
                    {m.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-[#888]">{m.joined}</td>
                <td className="px-5 py-4 text-xs text-[#888]">{m.lastActive}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.active ? "bg-[#22c55e]" : "bg-[#444]"}`} />
                    <span className="text-[10px] text-[#888]">{m.active ? "ACTIVE" : "INACTIVE"}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[9px] font-bold text-[#888] border border-[#2a2a2a] px-2.5 py-1 rounded-full hover:text-white hover:border-white transition-all mr-2">
                    EDIT ROLE
                  </button>
                  <button className="text-[#888] hover:text-[#ef4444] transition-colors" title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={1} total={2} />

      <Modal open={showInvite} onClose={() => setShowInvite(false)}>
        <h2 className="text-sm font-black text-white uppercase tracking-tight mb-4">INVITE MEMBER</h2>
        <div className="mb-4">
          <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">EMAIL ADDRESS</label>
          <input type="email" placeholder="crew@4wheels.com" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white placeholder:text-[#888] px-4 py-3 outline-none" />
        </div>
        <div className="mb-4">
          <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">ASSIGN ROLE</label>
          <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none">
            <option>ADMIN</option>
            <option>FULFILLMENT</option>
            <option>VIEWER</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">PERSONAL NOTE (OPTIONAL)</label>
          <textarea placeholder="Add a welcome message..." className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white placeholder:text-[#888] px-4 py-3 outline-none h-20 resize-none" />
        </div>
        <button className="w-full bg-[#ff2d78] text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-full hover:brightness-110 transition-all mb-3">
          SEND INVITE
        </button>
        <button onClick={() => setShowInvite(false)} className="w-full text-[10px] font-bold tracking-widest uppercase text-[#888] py-2 hover:text-white transition-colors mb-6">
          CANCEL
        </button>

        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-3">PENDING INVITES</div>
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
            <div>
              <div className="text-[11px] text-white font-bold">charlie@email.com</div>
              <span className="text-[8px] font-bold text-[#00e5ff] bg-[#00e5ff]/20 px-2 py-0.5 rounded-full uppercase">INVITE SENT</span>
            </div>
            <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider">
              <button className="text-[#888] hover:text-white transition-colors">RESEND</button>
              <button className="text-[#ef4444] hover:brightness-110 transition-colors">CANCEL</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
