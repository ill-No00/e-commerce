const gripTapes = [
  { name: "MOB GRIP BLACK", price: "$10", brand: "MOB", type: "STANDARD", color: "BLACK" },
  { name: "JESSUP ULTRA", price: "$9", brand: "JESSUP", type: "EXTRA GRIP", color: "BLACK" },
  { name: "GRIZZLY BEAR GRAPHIC", price: "$14", brand: "GRIZZLY", type: "GRAPHIC PRINT", color: "GRAPHIC" },
  { name: "BLACK MAGIC CLASSIC", price: "$10", brand: "BLACK MAGIC", type: "STANDARD", color: "BLACK" },
];

export default function StepGripTape({ selected, onSelect }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 06</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">GRIP TAPE</h1>

      <div className="flex gap-2 mb-8">
        {["ALL", "BLACK", "CLEAR", "GRAPHIC"].map((f) => (
          <button
            key={f}
            className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all ${
              f === "ALL"
                ? "bg-[#7c3aed] text-white"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-white hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {gripTapes.map((g) => {
          const isSelected = selected === g.name;
          return (
            <div
              key={g.name}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(g.name)}
            >
              <div className="w-full aspect-[4/3] bg-[#111] rounded-lg mb-4 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="14" x2="20" y2="14" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{g.name}</div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">{g.type}</div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-black text-[#ff2d78]">{g.price}</span>
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
