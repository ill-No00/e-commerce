import { useState } from "react";

const tabs = ["STORE INFO", "NOTIFICATIONS", "INTEGRATIONS", "BUILDER CONFIG", "DANGER ZONE"];

const notifications = {
  "ORDER ALERTS": [
    { label: "New order received", desc: "When a customer places a new order" },
    { label: "Order status changed", desc: "When an order moves to a new status" },
    { label: "Order cancellation", desc: "When a customer cancels an order" },
  ],
  "INVENTORY ALERTS": [
    { label: "Low stock warning", desc: "When stock drops below 10 units" },
    { label: "Out of stock alert", desc: "When a product runs out of stock" },
    { label: "Restock confirmation", desc: "When stock is added to a product" },
  ],
  "TEAM ALERTS": [
    { label: "New crew member joined", desc: "When a new admin is added" },
    { label: "Role changed", desc: "When a member's role is updated" },
    { label: "Member removed", desc: "When a member is removed from the team" },
  ],
};

const integrations = [
  { name: "Stripe", desc: "Payments processing", status: "CONNECTED", connected: true, color: "bg-[#7c3aed]" },
  { name: "ShipStation", desc: "Shipping & fulfillment", status: "CONNECTED", connected: true, color: "bg-[#00e5ff]" },
  { name: "Mailchimp", desc: "Email marketing", status: "NOT CONNECTED", connected: false, color: "bg-[#f59e0b]" },
  { name: "Google Analytics", desc: "Store analytics", status: "NOT CONNECTED", connected: false, color: "bg-[#22c55e]" },
  { name: "Shopify Sync", desc: "Product catalog sync", status: "NOT CONNECTED", connected: false, color: "bg-[#ef4444]" },
  { name: "Slack", desc: "Team notifications", status: "CONNECTED", connected: true, color: "bg-[#ff2d78]" },
];

const buildSteps = [
  { name: "Deck", required: true, enabled: true },
  { name: "Trucks", required: true, enabled: true },
  { name: "Wheels", required: false, enabled: true },
  { name: "Bearings", required: false, enabled: true },
  { name: "Hardware", required: false, enabled: true },
  { name: "Grip Tape", required: false, enabled: true },
];

function Toggle({ on }) {
  return (
    <div className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${on ? "bg-[#ff2d78]" : "bg-[#2a2a2a]"}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex gap-8">
      <nav className="w-[180px] shrink-0 flex flex-col gap-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`text-left text-xs font-semibold pl-3 py-2.5 rounded-r-lg transition-all ${
              i === activeTab
                ? "bg-[#ff2d78]/10 text-[#ff2d78] border-l-2 border-[#ff2d78]"
                : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="flex-1 min-w-0">
        {activeTab === 0 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-6">STORE INFORMATION</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE NAME</label><input defaultValue="4WHEELS SKATE CO." className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE HANDLE</label><input defaultValue="@4wheels" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">CONTACT EMAIL</label><input defaultValue="hello@4wheels.com" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">PHONE NUMBER</label><input defaultValue="+1 (310) 555-0199" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
            </div>
            <div className="mb-4">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE ADDRESS</label>
              <textarea defaultValue="1234 Venice Blvd, Los Angeles, CA 90210" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none h-16 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">CURRENCY</label>
                <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
              </div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">TIMEZONE</label>
                <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none"><option>America/Los_Angeles (PST)</option><option>America/New_York (EST)</option><option>Europe/London (GMT)</option></select>
              </div>
            </div>
            <div className="text-right">
              <button className="bg-[#ff2d78] text-white text-[10px] font-black tracking-widest uppercase px-6 py-3 rounded-full hover:brightness-110 transition-all">SAVE CHANGES</button>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-6">NOTIFICATION PREFERENCES</h2>
            {Object.entries(notifications).map(([group, items]) => (
              <div key={group} className="mb-6 last:mb-0">
                <div className="text-[10px] font-bold text-[#ff2d78] uppercase tracking-widest mb-3">{group}</div>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between bg-[#141414] rounded-lg px-4 py-3 border border-[#2a2a2a]">
                      <div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[9px] text-[#888] mt-0.5">{item.desc}</div>
                      </div>
                      <Toggle on={true} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {integrations.map((int) => (
              <div key={int.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${int.color} flex items-center justify-center text-white font-black text-sm`}>
                      {int.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{int.name}</div>
                      <div className="text-[10px] text-[#888]">{int.desc}</div>
                    </div>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${int.connected ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-[#2a2a2a] text-[#888]"}`}>
                    {int.status}
                  </span>
                </div>
                <button className={`text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all ${
                  int.connected ? "border border-[#2a2a2a] text-[#888] hover:text-white hover:border-white" : "bg-[#ff2d78] text-white hover:brightness-110"
                }`}>
                  {int.connected ? "CONFIGURE" : "CONNECT"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-6">BUILDER CONFIGURATION</h2>

            <div className="mb-6">
              <div className="text-[10px] font-bold text-[#ff2d78] uppercase tracking-widest mb-3">BUILD STEPS</div>
              <div className="flex flex-col gap-2">
                {buildSteps.map((step) => (
                  <div key={step.name} className="flex items-center justify-between bg-[#141414] rounded-lg px-4 py-3 border border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
                      </svg>
                      <span className="text-xs font-bold text-white">{step.name}</span>
                      {step.required && <span className="text-[8px] text-[#888] italic">(Required — cannot be disabled)</span>}
                    </div>
                    <div className="pointer-events-none" style={{ opacity: step.required ? 0.4 : 1 }}>
                      <Toggle on={step.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">SHOW PRICES DURING BUILD</span>
                  <Toggle on={true} />
                </div>
                <div className="text-[9px] text-[#888]">Display component prices in the builder</div>
              </div>
              <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">COMPATIBILITY WARNINGS</span>
                  <Toggle on={true} />
                </div>
                <div className="text-[9px] text-[#888]">Show axle match warnings during build</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">MAX BUILD SAVE SLOTS</label>
              <input defaultValue="5" className="w-24 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" />
            </div>

            <div>
              <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3">BUILDER THEME</div>
              <div className="flex gap-4">
                <div className="flex-1 bg-[#141414] border-2 border-[#ff2d78] rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#0d0d0d] border border-[#2a2a2a] mx-auto mb-2" />
                  <div className="text-xs font-bold text-white uppercase">DARK MODE</div>
                </div>
                <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-center opacity-60 relative">
                  <div className="w-8 h-8 rounded-full bg-white mx-auto mb-2" />
                  <div className="text-xs font-bold text-white uppercase">LIGHT MODE</div>
                  <span className="absolute -top-2 -right-2 bg-[#f59e0b] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">SOON</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="bg-[#1a1a1a] border border-[#ef4444]/40 rounded-xl p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-1">DANGER ZONE</h2>
            <p className="text-[10px] text-[#888] mb-6">Destructive actions — proceed with caution.</p>
            <div className="flex flex-col gap-4">
              {[
                { label: "RESET BUILDER DATA", desc: "Clears all saved builds from customers", action: "RESET", color: "border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10" },
                { label: "CLEAR INVENTORY CACHE", desc: "Forces a full re-sync of inventory data", action: "CLEAR CACHE", color: "border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10" },
                { label: "EXPORT ALL DATA", desc: "Download full store data as JSON", action: "EXPORT", color: "border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-[#141414] rounded-lg px-5 py-4 border border-[#2a2a2a]">
                  <div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[9px] text-[#888] mt-0.5">{item.desc}</div>
                  </div>
                  <button className={`text-[9px] font-bold tracking-widest uppercase border px-4 py-2 rounded-full transition-all ${item.color}`}>
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      {item.action}
                    </div>
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between bg-[#141414] rounded-lg px-5 py-4 border border-[#ef4444]/50">
                <div>
                  <div className="text-xs font-bold text-[#ef4444]">DELETE STORE</div>
                  <div className="text-[9px] text-[#888] mt-0.5">Permanently removes this store and all data. Irreversible.</div>
                </div>
                <button className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase bg-[#ef4444] text-white px-4 py-2 rounded-full hover:brightness-110 transition-all">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  DELETE STORE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
