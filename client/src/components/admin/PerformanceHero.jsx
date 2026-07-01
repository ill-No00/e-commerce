import { formatCents } from "../../utils/format.js";

export default function PerformanceHero({ stats }) {
  return (
    <div className="w-full bg-[#171717] border border-neutral-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-5">
        <div className="w-full aspect-[16/9] bg-[#282826] rounded-xl relative flex items-center justify-center">
          {stats?.topProductName && (
            <span className="text-sm font-black text-white tracking-wide uppercase absolute bottom-4 left-4">
              {stats.topProductName}
            </span>
          )}
        </div>
      </div>

      <div className="md:col-span-7">
        {stats?.trendingLabel && (
          <span className="bg-[#EF476F]/20 text-[#EF476F] text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md inline-block mb-2">
            {stats.trendingLabel}
          </span>
        )}

        <div className="flex gap-4 mb-4 text-center">
          <div>
            <p className="text-[9px] text-[#737373] uppercase">Views</p>
            <p className="text-sm font-black text-white">{stats?.views ?? "—"}</p>
          </div>
          <div>
            <p className="text-[9px] text-[#737373] uppercase">Conversion</p>
            <p className="text-sm font-black text-white">{stats?.conversion ?? "—"}</p>
          </div>
          <div>
            <p className="text-[9px] text-[#737373] uppercase">Returns</p>
            <p className="text-sm font-black text-white">{stats?.returns ?? "—"}</p>
          </div>
        </div>

        {stats?.description && (
          <p className="text-xs text-[#737373] leading-relaxed max-w-xl">
            {stats.description}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <button className="border border-neutral-800 bg-[#121212] text-white text-[10px] font-bold uppercase px-6 py-2 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer">
            MANAGE RELEASE
          </button>
          <span className="text-lg font-black text-[#EF476F] font-mono">
            {stats?.gmvCents != null ? `${formatCents(stats.gmvCents)} G.M.V` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
