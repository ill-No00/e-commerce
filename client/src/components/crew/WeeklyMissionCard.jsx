export default function WeeklyMissionCard() {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-5 bg-[#ff2d78] rounded-full" />
        <h3 className="text-[13px] font-black italic text-[#ff2d78] uppercase tracking-tight">WEEKLY MISSION</h3>
      </div>

      <p className="text-[12px] font-medium text-[#888] leading-relaxed mb-5">
        Collect 500 Props collectively at East Side Plaza to unlock a 24-hour Cred Multiplier.
      </p>

      <div className="w-full h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
        <div className="h-full w-[72%] bg-gradient-to-r from-[#ff2d78] to-[#7c3aed] rounded-full" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">PROGRESS:</span>
          <span className="text-[11px] font-black text-white ml-1">72%</span>
        </div>
        <div className="text-[11px] font-bold text-[#00e5ff]">360 / 500</div>
      </div>
    </div>
  );
}
