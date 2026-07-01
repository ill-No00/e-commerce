const borderColors = {
  info: "border-[#EF476F]",
  warning: "border-amber-400",
  success: "border-teal-400",
  error: "border-red-400",
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return undefined;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins} MINUTES AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} HOUR${hours > 1 ? "S" : ""} AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAY${days > 1 ? "S" : ""} AGO`;
}

export default function RevenueAndFeed({ activityLog }) {
  const feedEvents = activityLog?.length
    ? activityLog.map((event) => ({
        text: event.message,
        time: formatTimeAgo(event.created_at),
        border: borderColors[event.severity] || borderColors.info,
      }))
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      <div className="lg:col-span-8 bg-[#171717] border border-neutral-900 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#F8F9FA]">
            REVENUE STREAM
          </h3>
          <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider">
            <span className="text-white border-b border-[#EF476F] pb-0.5 cursor-pointer">WEEKLY</span>
            <span className="text-[#737373] cursor-pointer hover:text-white transition-colors">MONTHLY</span>
          </div>
        </div>

        <div className="w-full h-64 bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex items-center justify-center">
          <span className="text-xs text-[#737373] uppercase tracking-widest">No revenue data available</span>
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#F8F9FA] mb-4">
            LIVE FEED
          </h3>
          <div className="flex flex-col gap-4 text-[11px]">
            {!feedEvents?.length && (
              <p className="text-[#737373] text-xs">No activity yet</p>
            )}
            {feedEvents?.map((event, i) => (
              <div key={i} className={`border-l-2 ${event.border} pl-3 py-0.5`}>
                <p className="text-[#F8F9FA]">{event.text ?? "—"}</p>
                <p className="text-[#737373] text-[9px] font-bold mt-0.5">{event.time ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="w-full bg-[#121212] border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-white py-2.5 rounded-xl text-center hover:bg-neutral-900 transition-colors mt-4 cursor-pointer">
          VIEW ALL ACTIVITY
        </button>
      </div>
    </div>
  );
}
