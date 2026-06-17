const days = [
  { label: "MON", height: "h-20", highlight: false },
  { label: "TUE", height: "h-28", highlight: false },
  { label: "WED", height: "h-24", highlight: false },
  { label: "THU", height: "h-32", highlight: false },
  { label: "FRI", height: "h-40", highlight: true },
  { label: "SAT", height: "h-28", highlight: false },
  { label: "SUN", height: "h-16", highlight: false },
];

const feedEvents = [
  {
    text: "@SkateKing purchased &lsquo;Concrete V1&rsquo;",
    time: "2 MINUTES AGO",
    border: "border-[#EF476F]",
  },
  {
    text: "Inventory Alert: Low stock on &lsquo;Obsidian Trucks&rsquo;",
    time: "15 MINUTES AGO",
    border: "border-amber-400",
  },
  {
    text: "New Crew Member Joined: UrbanFloR_99",
    time: "1 HOUR AGO",
    border: "border-teal-400",
  },
];

export default function RevenueAndFeed() {
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

        <div className="w-full h-64 bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-end">
          <div className="flex justify-between items-end h-40 mt-auto px-4">
            {days.map((day) => (
              <div key={day.label} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-8 ${day.highlight ? "bg-[#EF476F]" : "bg-[#282826]"} rounded-t-md ${day.height} transition-all`}
                  />
                  {day.highlight && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-[#121212] text-[8px] font-black px-2 py-0.5 rounded whitespace-nowrap uppercase">
                      Peak
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#737373] font-bold">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#F8F9FA] mb-4">
            LIVE FEED
          </h3>
          <div className="flex flex-col gap-4 text-[11px]">
            {feedEvents.map((event, i) => (
              <div key={i} className={`border-l-2 ${event.border} pl-3 py-0.5`}>
                <p className="text-[#F8F9FA]" dangerouslySetInnerHTML={{ __html: event.text }} />
                <p className="text-[#737373] text-[9px] font-bold mt-0.5">{event.time}</p>
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
