export default function MetricsRow({ stats }) {
  const metrics = [
    {
      label: "TOTAL SALES",
      value: stats?.totalSalesCents != null ? `$${(stats.totalSalesCents / 100).toLocaleString()}` : undefined,
      trend: "ALL TIME REVENUE",
      trendColor: "text-emerald-400",
    },
    {
      label: "ACTIVE ORDERS",
      value: stats?.activeOrders ?? undefined,
      trend: stats?.orderCounts
        ? `${stats.orderCounts.pending ?? 0} PENDING, ${stats.orderCounts.inTransit ?? 0} IN TRANSIT`
        : undefined,
      trendColor: "text-[#737373]",
    },
    {
      label: "NEW CREW MEMBERS",
      value: stats?.newCrewMembers ?? undefined,
      trend: "TOTAL CREW MEMBERS",
      trendColor: "text-[#EF476F]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="bg-[#171717] border border-neutral-900 rounded-2xl p-6">
          <span className="text-[10px] font-bold text-[#737373] tracking-wider uppercase">
            {m.label}
          </span>
          <div className="text-3xl font-black text-white tracking-tight mt-2">
            {m.value ?? "—"}
          </div>
          {m.trend && (
            <div className={`text-[10px] font-bold mt-2 ${m.trendColor}`}>{m.trend}</div>
          )}
        </div>
      ))}
    </div>
  );
}
