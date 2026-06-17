const wheels = [
  { name: "SPITFIRE FORMULA FOUR", price: "$42", shape: "CLASSIC SHAPE", size: "52mm", durometer: "99A", terrain: "Street", badge: "PRO CHOICE", badgeColor: "bg-[#7c3aed] text-white" },
  { name: "BONES STF V5", price: "$38", shape: "LOCK-IN EDGE", size: "54mm", durometer: "99A", terrain: "Street/Park", badge: null, badgeColor: null },
  { name: "OJ ELITE HARDLINE", price: "$40", shape: "STANDARD", size: "52mm", durometer: "97A", terrain: "All-Around", badge: null, badgeColor: null },
  { name: "CONICAL FULL 54MM", price: "$35", shape: "CONICAL", size: "54mm", durometer: "99A", terrain: "Street", badge: null, badgeColor: null },
];

export default function StepWheels({ selected, onSelect }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 03</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE WHEELS</h1>

      <div className="flex gap-2 mb-6">
        {["SIZE: ALL", "DUROMETER: ALL"].map((f) => (
          <button
            key={f}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-white hover:text-white transition-all"
          >
            {f}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">HARDNESS & TERRAIN GUIDE</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#141414] rounded-lg p-3 border border-[#2a2a2a]">
            <div className="text-[12px] font-black text-[#888] uppercase">78A–87A</div>
            <div className="text-[12px] font-bold text-[#888] uppercase mb-1">SOFT</div>
            <p className="text-[9px] text-[#666]">Cruising, rough roads, maximum grip & comfort</p>
          </div>
          <div className="bg-[#141414] rounded-lg p-3 border border-[#2a2a2a]">
            <div className="text-[12px] font-black text-[#888] uppercase">88A–95A</div>
            <div className="text-[12px] font-bold text-[#888] uppercase mb-1">MEDIUM</div>
            <p className="text-[9px] text-[#666]">All-around skating, parks, and street transition</p>
          </div>
          <div className="bg-[#141414] rounded-lg p-3 border border-[#00e5ff] ring-1 ring-[#00e5ff]">
            <div className="text-[12px] font-black text-[#00e5ff] uppercase">96A–101A+</div>
            <div className="text-[12px] font-bold text-[#00e5ff] uppercase mb-1">HARD</div>
            <p className="text-[9px] text-[#00e5ff]">Street skating, slides, technical tricks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {wheels.map((w) => {
          const isSelected = selected === w.name;
          return (
            <div
              key={w.name}
              className={`rounded-xl p-4 cursor-pointer transition-all relative ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(w.name)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#ff2d78] rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              {w.badge && <span className={`${w.badgeColor} text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>{w.badge}</span>}
              <div className="w-full aspect-square bg-[#111] rounded-full mt-2 mb-3 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="text-xs font-black text-white uppercase tracking-tight truncate">{w.name}</div>
              <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">{w.shape}</div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                <span className="text-[8px] font-bold bg-[#2a2a2a] text-[#888] px-2 py-0.5 rounded-full">{w.size}</span>
                <span className="text-[8px] font-bold bg-[#2a2a2a] text-[#888] px-2 py-0.5 rounded-full">{w.durometer}</span>
                <span className="text-[8px] font-bold bg-[#2a2a2a] text-[#888] px-2 py-0.5 rounded-full">{w.terrain}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base font-black text-[#ff2d78]">{w.price}</span>
                <button
                  className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-all ${
                    isSelected
                      ? "bg-[#ff2d78] text-white"
                      : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                  }`}
                >
                  {isSelected ? "✓" : "SELECT"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
