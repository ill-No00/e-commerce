import { formatCents } from "../../utils/format.js";

const slots = [
  { key: "DECK", label: "DECK", icon: "M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z" },
  { key: "TRUCKS", label: "TRUCKS", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" },
  { key: "WHEELS", label: "WHEELS", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "BEARINGS", label: "BEARINGS", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { key: "HARDWARE", label: "HARDWARE", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v6l-8 4m0-10l-8 4m0 0l-8-4m8 4v6" },
  { key: "GRIP TAPE", label: "GRIP TAPE", icon: "M9 3h6v18H9z" },
];

function getProductPrice(product) {
  if (!product) return undefined;
  const cents = product.base_price_cents ?? product.product_variants?.[0]?.price_cents;
  return formatCents(cents);
}

export default function LiveBuildPanel({ currentStep, selections, total }) {
  return (
    <aside className="w-[280px] flex-shrink-0 bg-[#111] border-l border-[#2a2a2a] p-6 flex flex-col min-h-screen">
      <div className="flex items-center gap-2 mb-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <h2 className="text-sm font-black text-white uppercase tracking-wider">LIVE BUILD</h2>
      </div>
      <p className="text-[10px] text-[#888] mb-6">Select components to complete your setup.</p>

      <div className="flex flex-col gap-3 flex-1">
        {slots.map((slot) => {
          const selected = selections[slot.label];
          const stepNum = slots.indexOf(slot) + 1;
          const isCurrent = stepNum === currentStep;
          const price = getProductPrice(selected);

          return (
            <div key={slot.key}>
              {isCurrent && (
                <div className="text-[8px] text-[#ff2d78] font-bold tracking-widest uppercase mb-1 ml-1">
                  CURRENT STEP
                </div>
              )}
              <div
                className={`rounded-xl p-3 ${
                  isCurrent
                    ? "border border-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.25)] bg-[#1a1a1a]"
                    : "border border-[#2a2a2a] bg-[#141414]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? "#ff2d78" : "#888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={slot.icon} />
                    </svg>
                    <span className={`text-[9px] font-semibold tracking-widest uppercase ${isCurrent ? "text-[#ff2d78]" : "text-[#888]"}`}>
                      {slot.label}
                    </span>
                  </div>
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  )}
                </div>
                {selected ? (
                  <div className="mt-1.5">
                    <div className="text-[11px] font-bold text-white">{selected.name ?? "—"}</div>
                    {price && <div className="text-[10px] text-[#ff2d78] font-bold">{price}</div>}
                  </div>
                ) : (
                  <div className="text-[10px] text-[#444] italic mt-1">— Empty Slot</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#2a2a2a] pt-4 mt-4">
        <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-2">
          TOTAL ESTIMATE
        </div>
        <div className="text-2xl font-black text-[#ff2d78]">
          {total > 0 ? `$${(total / 100).toFixed(2)}` : "—"}
        </div>
      </div>
    </aside>
  );
}
