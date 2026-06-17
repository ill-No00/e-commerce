const bearings = [
  { name: "BONES REDS", price: "$18", brand: "BONES", abec: "ABEC 3", lube: "GREASE", material: "STEEL" },
  { name: "BRONSON G3", price: "$22", brand: "BRONSON", abec: "ABEC 5", lube: "OIL", material: "STEEL" },
  { name: "BONES SWISS", price: "$35", brand: "BONES", abec: "ABEC 7", lube: "OIL", material: "SWISS STEEL" },
  { name: "CERAMIC SPEED ABEC 9", price: "$120", brand: "BRONSON", abec: "ABEC 9", lube: "CERAMIC", material: "SILICON NITRIDE" },
];

export default function StepBearings({ selected, onSelect }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 04</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE BEARINGS</h1>

      <div className="flex gap-2 mb-6">
        {["TYPE: ALL", "BRAND: ALL"].map((f) => (
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

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div className="flex-1">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider block mb-2">ABEC RATING GUIDE</span>
          <p className="text-[10px] text-[#888] mb-3">
            Higher ABEC ratings indicate tighter manufacturing tolerances for faster, smoother spin at high speeds.
          </p>
          <div className="flex items-center gap-1">
            {["ABEC 3", "ABEC 5", "ABEC 7", "ABEC 9", "CERAMIC"].map((r, i) => (
              <div key={r} className="flex items-center">
                <span className={`text-[9px] font-bold px-2 py-1 rounded ${i < 3 ? "bg-[#2a2a2a] text-[#888]" : i === 3 ? "bg-[#ff2d78] text-white" : "bg-[#7c3aed] text-white"}`}>
                  {r}
                </span>
                {i < 4 && <div className="w-3 h-px bg-[#444]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {bearings.map((b) => {
          const isSelected = selected === b.name;
          return (
            <div
              key={b.name}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(b.name)}
            >
              <span className="text-[8px] text-[#888] font-semibold tracking-widest uppercase">{b.brand}</span>
              <div className="w-full aspect-[4/3] bg-[#111] rounded-lg my-3 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{b.name}</div>
              <div className="flex gap-3 mt-2 text-[9px]">
                <span><span className="text-[#666]">ABEC:</span> <span className="text-white font-bold">{b.abec}</span></span>
                <span><span className="text-[#666]">Lube:</span> <span className="text-white font-bold">{b.lube}</span></span>
                <span><span className="text-[#666]">Mat:</span> <span className="text-white font-bold">{b.material}</span></span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-black text-[#ff2d78]">{b.price}</span>
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
