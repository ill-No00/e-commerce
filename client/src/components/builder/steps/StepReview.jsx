const lineItems = [
  { label: "Subtotal", value: "$205.00" },
  { label: "Assembly Labor", value: "COMPLIMENTARY", highlight: "text-[#00e5ff]" },
  { label: "Estimated Tax", value: "$18.96" },
  { label: "Shipping (Standard)", value: "$0.00" },
];

export default function StepReview({ selections }) {
  const items = [
    { category: "DECK", name: selections.DECK || "—", spec: "8.25\" / MEDIUM CONCAVE", price: "$65" },
    { category: "TRUCKS", name: selections.TRUCKS || "—", spec: "8.25\" AXLE / 52mm", price: "$65" },
    { category: "WHEELS", name: selections.WHEELS || "—", spec: "52mm / 99A", price: "$42" },
    { category: "BEARINGS", name: selections.BEARINGS || "—", spec: "ABEC 3 / GREASE", price: "$18" },
    { category: "HARDWARE", name: selections.HARDWARE || "—", spec: "1\" LENGTH + NO RISER", price: "$5" },
    { category: "GRIP TAPE", name: selections["GRIP TAPE"] || "—", spec: "STANDARD GRIP", price: "$10" },
  ];

  return (
    <div className="flex gap-10">
      <div className="flex-1">
        <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 06 // REVIEW</div>
        <h1 className="text-4xl font-black leading-none mb-1">
          <span className="text-white tracking-tight uppercase">THE FINAL</span>
          <br />
          <span className="text-[#ff2d78] tracking-tight uppercase">ASSEMBLY</span>
        </h1>
        <p className="text-[11px] text-[#888] mb-8">Verify every component before we lock in your build.</p>

        <div className="grid grid-cols-1 gap-3">
          {items.map((item, i) => {
            const isSmall = i >= 4;
            const Wrapper = isSmall ? "div" : "div";
            return (
              <div
                key={item.category}
                className={`bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 relative group ${isSmall ? "" : ""}`}
              >
                <div className="w-14 h-14 bg-[#111] rounded-lg shrink-0 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-[#888] font-semibold tracking-widest uppercase">{item.category}</div>
                  <div className="text-sm font-black text-white uppercase tracking-tight truncate">{item.name}</div>
                  <div className="text-[9px] text-[#666] mt-0.5">{item.spec}</div>
                  <div className="text-[11px] font-bold text-[#ff2d78] mt-1">{item.price}</div>
                </div>
                <button className="absolute top-3 right-3 text-[#888] hover:text-[#ff2d78] transition-colors opacity-0 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[300px] shrink-0">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">THE LEDGER</h2>
          </div>

          <div className="flex flex-col gap-3 pb-4 border-b border-[#2a2a2a]">
            {lineItems.map((item) => (
              <div key={item.label} className="flex justify-between items-center text-[11px]">
                <span className="text-[#888]">{item.label}</span>
                <span className={`font-bold ${item.highlight || "text-white"}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 pb-6">
            <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-1">GRAND TOTAL</div>
            <div className="text-3xl font-black text-[#ff2d78]">$228.96</div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-3 flex items-center gap-3 mb-6 border border-[#2a2a2a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <div className="text-[10px] font-bold text-white uppercase">STANDARD DEPLOYMENT</div>
              <div className="text-[8px] text-[#888]">Est. arrival: 5–8 Business Days</div>
            </div>
          </div>

          <button className="w-full bg-[#ff2d78] text-white font-black text-xs tracking-widest uppercase py-4 rounded-full hover:brightness-110 transition-all mb-3">
            PROCEED TO DEPLOYMENT →
          </button>
          <button className="w-full text-[10px] text-[#888] font-bold tracking-widest uppercase text-center hover:text-white transition-colors">
            SAVE BUILD FOR LATER
          </button>
        </div>
      </div>
    </div>
  );
}
