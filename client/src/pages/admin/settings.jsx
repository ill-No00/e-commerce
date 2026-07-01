import { useState, useEffect } from "react";
import { adminApi } from "../../api/admin.js";

const tabs = ["STORE INFO", "NOTIFICATIONS", "INTEGRATIONS", "BUILDER CONFIG", "DANGER ZONE"];

function Toggle({ on }) {
  return (
    <div className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${on ? "bg-[#ff2d78]" : "bg-[#2a2a2a]"}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [storeInfo, setStoreInfo] = useState(undefined);
  const [notifPrefs, setNotifPrefs] = useState(undefined);
  const [integrationList, setIntegrationList] = useState(undefined);
  const [builderCfg, setBuilderCfg] = useState(undefined);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.storeSettings().catch(() => undefined),
      adminApi.notifications().catch(() => undefined),
      adminApi.integrations().catch(() => undefined),
      adminApi.builderConfig().catch(() => undefined),
    ])
      .then(([store, notif, integrations, builder]) => {
        setStoreInfo(store?.data);
        setNotifPrefs(notif?.data);
        setIntegrationList(integrations?.data);
        setBuilderCfg(builder?.data);
      })
      .finally(() => setLoadingSettings(false));
  }, []);

  const buildSteps = builderCfg?.steps;
  const builderSettings = builderCfg?.settings;

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
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE NAME</label><input defaultValue={storeInfo?.store_name} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE HANDLE</label><input defaultValue={storeInfo?.store_handle} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">CONTACT EMAIL</label><input defaultValue={storeInfo?.contact_email} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">PHONE NUMBER</label><input defaultValue={storeInfo?.phone} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" /></div>
            </div>
            <div className="mb-4">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">STORE ADDRESS</label>
              <textarea defaultValue={storeInfo?.address} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none h-16 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">CURRENCY</label>
                <select defaultValue={storeInfo?.currency} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div><label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">TIMEZONE</label>
                <select defaultValue={storeInfo?.timezone} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none">
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
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
            {!notifPrefs && !loadingSettings && (
              <p className="text-xs text-[#888]">No notification preferences available.</p>
            )}
            {notifPrefs && Object.entries(notifPrefs).map(([key, value]) => (
              typeof value === "boolean" && (
                <div key={key} className="flex items-center justify-between bg-[#141414] rounded-lg px-4 py-3 border border-[#2a2a2a] mb-3">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{key.replace(/_/g, " ")}</div>
                  </div>
                  <Toggle on={value} />
                </div>
              )
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {!integrationList?.length && !loadingSettings && (
              <p className="text-xs text-[#888] col-span-2">No integrations available.</p>
            )}
            {(integrationList || []).map((int) => (
              <div key={int.id || int.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center text-white font-black text-sm">
                      {(int.name || "?")[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{int.name ?? "—"}</div>
                      <div className="text-[10px] text-[#888]">{int.description ?? "—"}</div>
                    </div>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${int.is_connected ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-[#2a2a2a] text-[#888]"}`}>
                    {int.is_connected ? "CONNECTED" : "NOT CONNECTED"}
                  </span>
                </div>
                <button className={`text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all ${
                  int.is_connected ? "border border-[#2a2a2a] text-[#888] hover:text-white hover:border-white" : "bg-[#ff2d78] text-white hover:brightness-110"
                }`}>
                  {int.is_connected ? "CONFIGURE" : "CONNECT"}
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
                {!buildSteps?.length && !loadingSettings && (
                  <p className="text-xs text-[#888]">No builder steps configured.</p>
                )}
                {(buildSteps || []).map((step) => (
                  <div key={step.id || step.name} className="flex items-center justify-between bg-[#141414] rounded-lg px-4 py-3 border border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white">{step.name ?? step.step_name ?? "—"}</span>
                      {step.is_required && <span className="text-[8px] text-[#888] italic">(Required — cannot be disabled)</span>}
                    </div>
                    <div className="pointer-events-none" style={{ opacity: step.is_required ? 0.4 : 1 }}>
                      <Toggle on={step.is_enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">SHOW PRICES DURING BUILD</span>
                  <Toggle on={builderSettings?.show_prices} />
                </div>
                <div className="text-[9px] text-[#888]">Display component prices in the builder</div>
              </div>
              <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">COMPATIBILITY WARNINGS</span>
                  <Toggle on={builderSettings?.compatibility_warnings} />
                </div>
                <div className="text-[9px] text-[#888]">Show axle match warnings during build</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">MAX BUILD SAVE SLOTS</label>
              <input defaultValue={builderSettings?.max_save_slots} className="w-24 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white px-4 py-3 outline-none" />
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
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
