const bolts = [
  { label: '7/8"', spec: '7/8" LENGTH', color: "NEON PINK", price: "$5", name: "ALLEN 1\" NEON" },
  { label: '1"', spec: '1" LENGTH', color: "SILVER", price: "$4", name: 'PHILLIPS 7/8"' },
  { label: '1.25"', spec: '1.25" LENGTH', color: "BLACK OXIDE", price: "$6", name: 'INDEPENDENT 1"' },
];

const risers = [
  { label: "NO RISER", desc: "Direct mount", price: "$0" },
  { label: '1/8" RISER', desc: "Shock absorption", price: "$4" },
  { label: '1/4" RISER', desc: "Max wheel clearance", price: "$5" },
];

export default function StepHardware({ selectedBolt, selectedRiser, onSelectBolt, onSelectRiser }) {
  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 05</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">HARDWARE</h1>
      <p className="text-xs text-[#888] mb-6">Choose the bolt length that matches your riser setup.</p>

      <div className="mb-8">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-4">BOLTS</span>
        <div className="grid grid-cols-3 gap-4">
          {bolts.map((b) => {
            const isSelected = selectedBolt === b.label;
            return (
              <div
                key={b.label}
                className={`rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-2 border-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.3)] bg-[#1a1a1a]"
                    : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
                }`}
                onClick={() => onSelectBolt(b.label)}
              >
                <div className="text-xl font-black text-white text-center mb-2">{b.label}</div>
                <div className="text-[9px] text-[#888] text-center">{b.spec}</div>
                <div className="text-[9px] text-[#666] text-center uppercase mt-1">{b.color}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-black text-[#ff2d78]">{b.price}</span>
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

      <div>
        <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-1">RISERS (OPTIONAL)</span>
        <p className="text-[9px] text-[#666] mb-4">Risers help prevent wheel bite when using larger wheels.</p>
        <div className="flex gap-4">
          {risers.map((r) => {
            const isSelected = selectedRiser === r.label;
            return (
              <div
                key={r.label}
                className={`flex-1 rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-2 border-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.3)] bg-[#1a1a1a]"
                    : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
                }`}
                onClick={() => onSelectRiser(r.label)}
              >
                <div className="text-sm font-black text-white text-center">{r.label}</div>
                <div className="text-[9px] text-[#888] text-center mt-1">{r.desc}</div>
                <div className="text-center mt-2">
                  <span className="text-base font-black text-[#ff2d78]">{r.price}</span>
                </div>
                <div className="flex justify-center mt-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#ff2d78]" : "border-[#444]"}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#ff2d78]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
