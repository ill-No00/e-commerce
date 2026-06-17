const decks = [
  { name: "TOKYO NEON '24", price: "$65", sizes: "8.0 / 8.25 / 8.5", concave: "MEDIUM", badge: "NEW", badgeColor: "bg-[#ff2d78]" },
  { name: "CONCRETE RIPPER V2", price: "$70", sizes: "8.25 / 8.5", concave: "MEDIUM-HIGH", badge: null, badgeColor: null },
  { name: "NIGHT RIDER 8.25", price: "$65", sizes: "8.25", concave: "MEDIUM", badge: null, badgeColor: null },
  { name: "SHADOW MAPLE PRO", price: "$75", sizes: "8.0 / 8.25 / 8.5 / 8.6", concave: "HIGH", badge: "PRO", badgeColor: "bg-[#7c3aed]" },
];

export default function StepDeck({ selected, onSelect }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 01</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE YOUR DECK</h1>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="SEARCH DECKS..." className="bg-transparent text-xs text-white placeholder:text-[#888] outline-none w-full" />
        </div>
        <button className="p-2.5 border border-[#2a2a2a] rounded-full text-[#888] hover:text-white hover:border-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {["ALL DECKS", 'SIZE 8.0"', 'SIZE 8.25"', 'SIZE 8.5"', "PRO MODELS"].map((f) => (
          <button
            key={f}
            className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all ${
              f === "ALL DECKS"
                ? "bg-[#7c3aed] text-white"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-white hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {decks.map((d) => {
          const isSelected = selected === d.name;
          return (
            <div
              key={d.name}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(d.name)}
            >
              {d.badge && (
                <span className={`${d.badgeColor} text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {d.badge}
                </span>
              )}
              <div className="w-full aspect-[3/4] bg-[#111] rounded-lg mt-2 mb-4 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{d.name}</div>
              <div className="text-sm font-black text-[#ff2d78] mt-0.5">{d.price}</div>
              <div className="text-[10px] text-[#888] mt-1">{d.sizes}</div>
              <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">{d.concave} CONCAVE</div>
              <button
                className={`w-full mt-3 text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-full transition-all ${
                  isSelected
                    ? "bg-[#ff2d78] text-white"
                    : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                }`}
              >
                {isSelected ? "SELECTED ✓" : "SELECT"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
