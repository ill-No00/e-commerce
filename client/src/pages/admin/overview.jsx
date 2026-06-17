import MetricsRow from "../../components/admin/MetricsRow";
import RevenueAndFeed from "../../components/admin/RevenueAndFeed";
import PerformanceHero from "../../components/admin/PerformanceHero";

export default function AdminOverview() {
  return (
    <>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-900">
        <h1 className="text-sm font-black text-[#EF476F] tracking-wider uppercase">
          CONCRETE GALLERY
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-[#171717] text-xs px-4 py-2 rounded-lg border border-neutral-800 w-64 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search gallery..."
              className="bg-transparent text-xs text-[#F8F9FA] placeholder:text-[#737373] outline-none w-full"
            />
          </div>
          <button className="text-[#737373] hover:text-white transition-colors" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button className="text-[#737373] hover:text-white transition-colors" aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-full bg-[#282826]" />
        </div>
      </div>

      <MetricsRow />
      <RevenueAndFeed />
      <PerformanceHero />
    </>
  );
}
