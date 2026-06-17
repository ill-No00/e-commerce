const trucks = [
  { name: "OBSIDIAN PRO V2", price: "$65", brand: "CONCRETE EXCLUSIVE", badge: "PERFECT MATCH", badgeColor: "bg-[#00e5ff] text-black", axle: "8.25", height: "52mm", weight: "380g" },
  { name: "NEON PIVOT V3", price: "$58", brand: "STREET SYNDICATE", badge: "PRO CHOICE", badgeColor: "bg-[#7c3aed] text-white", axle: "8.0", height: "50mm", weight: "365g" },
  { name: "HOLLOW LIGHTS 149", price: "$55", brand: "CONCRETE EXCLUSIVE", badge: "MATCH", badgeColor: "bg-[#00e5ff] text-black", axle: "8.25", height: "53mm", weight: "340g" },
  { name: "TITANIUM RAW 149", price: "$80", brand: "STREET SYNDICATE", badge: null, badgeColor: null, axle: "8.25", height: "52mm", weight: "355g" },
];

export default function StepTrucks({ selected, onSelect }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 02</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">SELECT TRUCKS</h1>

      <div className="bg-[#1a1a1a] border-l-4 border-[#7c3aed] rounded-r-xl p-4 mb-6 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <div>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">AXLE WIDTH MATCH</span>
          <p className="text-[11px] text-[#888] mt-1">
            Your selected deck recommends an axle width of{" "}
            <span className="text-[#00e5ff] font-bold">8.25&Prime;</span>. The
            optimal range is{" "}
            <span className="text-[#00e5ff] font-bold">8.0&Prime;–8.25&Prime;</span>{" "}
            for balanced turning and stability.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {["SORT: PRO", "FILTER"].map((f) => (
          <button
            key={f}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-white hover:text-white transition-all"
          >
            {f === "FILTER" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
              </svg>
            )}
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {trucks.map((t) => {
          const isSelected = selected === t.name;
          return (
            <div
              key={t.name}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(t.name)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] text-[#888] font-semibold tracking-widest uppercase">{t.brand}</span>
                {t.badge && <span className={`${t.badgeColor} text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>{t.badge}</span>}
              </div>
              <div className="w-full aspect-[4/3] bg-[#111] rounded-lg mb-4 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="12" x2="22" y2="12" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" />
                  <rect x="8" y="8" width="8" height="8" rx="1" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{t.name}</div>
              <div className="flex gap-4 mt-2 text-[10px]">
                <div><span className="text-[#666]">Axle:</span> <span className="text-white font-bold">{t.axle}"</span></div>
                <div><span className="text-[#666]">Ht:</span> <span className="text-white font-bold">{t.height}</span></div>
                <div><span className="text-[#666]">Wt:</span> <span className="text-white font-bold">{t.weight}</span></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-black text-[#ff2d78]">{t.price}</span>
                <button
                  className={`text-[10px] font-bold tracking-widest uppercase px-5 py-2 rounded-full transition-all ${
                    isSelected
                      ? "bg-[#ff2d78] text-white"
                      : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                  }`}
                >
                  {isSelected ? "SELECTED ✓" : "SELECT"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
