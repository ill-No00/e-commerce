const metrics = [
  {
    label: "TOTAL SALES",
    value: "$142,850",
    trend: "↗ +12.4% THIS MONTH",
    trendColor: "text-emerald-400",
  },
  {
    label: "ACTIVE ORDERS",
    value: "842",
    trend: "📦 42 IN PACKAGING",
    trendColor: "text-[#737373]",
  },
  {
    label: "NEW CREW MEMBERS",
    value: "124",
    trend: "➕ +18 SINCE YESTERDAY",
    trendColor: "text-[#EF476F]",
  },
];

export default function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="bg-[#171717] border border-neutral-900 rounded-2xl p-6">
          <span className="text-[10px] font-bold text-[#737373] tracking-wider uppercase">
            {m.label}
          </span>
          <div className="text-3xl font-black text-white tracking-tight mt-2">
            {m.value}
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${m.trendColor}`}>
            {m.trend}
          </span>
        </div>
      ))}
    </div>
  );
}
