const steps = [
  { num: 1, name: "DECK", label: "DECK" },
  { num: 2, name: "TRUCKS", label: "TRUCKS" },
  { num: 3, name: "WHEELS", label: "WHEELS" },
  { num: 4, name: "BEARINGS", label: "BEARINGS" },
  { num: 5, name: "HARDWARE", label: "HARDWARE" },
  { num: 6, name: "GRIP TAPE", label: "GRIP TAPE" },
  { num: 7, name: "REVIEW", label: "REVIEW" },
];

const progressPercent = {
  1: "0%",
  2: "15%",
  3: "30%",
  4: "50%",
  5: "65%",
  6: "80%",
  7: "100%",
};

export default function BuilderSidebar({ currentStep, selections, onStepClick }) {
  const getStepState = (num) => {
    if (num < currentStep) return "complete";
    if (num === currentStep) return "current";
    return "upcoming";
  };

  const progressWidth = progressPercent[currentStep];

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#111] border-r border-[#2a2a2a] flex flex-col justify-between min-h-screen p-6">
      <div>
        <div className="text-[#ff2d78] text-xl font-black italic tracking-wider mb-8">
          4WHEELS
        </div>

        <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-1">
          BUILDER PROGRESS
        </div>
        <div className="text-2xl font-black text-[#ff2d78]">{progressWidth}</div>
        <div className="w-full h-[3px] bg-[#2a2a2a] rounded-full mt-2 mb-8">
          <div
            className="h-full bg-[#ff2d78] rounded-full transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>

        <nav className="flex flex-col gap-5">
          {steps.map((s) => {
            const state = getStepState(s.num);
            const canClick = state === "complete" || state === "current";
            return (
              <div
                key={s.num}
                className={`flex items-start gap-3 ${canClick ? "cursor-pointer" : ""}`}
                onClick={() => canClick && onStepClick && onStepClick(s.num)}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    state === "complete"
                      ? "bg-[#ff2d78] text-white"
                      : state === "current"
                        ? "border-2 border-[#ff2d78] text-[#ff2d78]"
                        : "border-2 border-[#444] text-[#444]"
                  }`}
                >
                  {state === "complete" ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <div>
                  <div
                    className={`text-[10px] font-semibold tracking-widest uppercase ${
                      state === "complete" || state === "current"
                        ? "text-white"
                        : "text-[#444]"
                    }`}
                  >
                    {s.name}
                  </div>
                  <div className="text-[8px] text-[#888] mt-0.5 tracking-wider">
                    {state === "complete" && selections[s.label]
                      ? selections[s.label]
                      : state === "current"
                        ? "IN PROGRESS"
                        : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <button className="w-full border border-[#2a2a2a] text-[#888] text-[10px] font-bold tracking-widest uppercase py-3 rounded-full hover:border-[#ff2d78] hover:text-[#ff2d78] transition-colors flex items-center justify-center gap-2 mt-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
        SAVE BUILD
      </button>
    </aside>
  );
}
