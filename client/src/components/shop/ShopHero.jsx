export default function ShopHero({
  series = "PRO PERFORMANCE SERIES",
  title = "NEON DRIFT EVO-1",
  price = "$189.00",
  oldPrice = "($245.00)",
  widths = ['8.0"', '8.25"', '8.5"'],
  selectedWidth = '8.0"',
  finishes = ["#EF476F", "#6A4C93", "#3A6B6B"],
  specs = [
    { label: "Construction", value: "7-PLY MAPLE" },
    { label: "Concave", value: "MEDIUM-HIGH" },
    { label: "Trucks", value: "TITANIUM 149" },
    { label: "Bearings", value: "ABEC-9 CERAMIC" },
  ],
  badge = null,
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-12 px-8 py-6 pt-24">
      <div className="md:col-span-7">
        <div className="w-full aspect-square bg-[#282826] rounded-3xl relative">
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {badge && (
              <span className="bg-[#6A4C93] text-[10px] text-white px-3 py-1 rounded-md uppercase font-bold">
                {badge}
              </span>
            )}
            <span className="bg-neutral-800/80 text-[9px] text-[#737373] px-3 py-1 rounded-md uppercase font-bold">
              LIMITED EDITION
            </span>
          </div>
          <div className="absolute bottom-4 right-4 bg-[#121212]/80 p-2 rounded-full text-white">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="w-1/4 aspect-square bg-[#282826] rounded-xl border-2 border-[#EF476F]" />
          <div className="w-1/4 aspect-square bg-[#282826] rounded-xl" />
          <div className="w-1/4 aspect-square bg-[#282826] rounded-xl" />
          <div className="w-1/4 aspect-square bg-[#282826] rounded-xl" />
        </div>
      </div>

      <div className="md:col-span-5">
        <span className="text-[#EF476F] tracking-widest text-[10px] mb-1 block font-bold">
          {series}
        </span>
        <h1 className="text-5xl font-black text-[#F8F9FA] uppercase tracking-tight leading-none mb-3">
          {title}
        </h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl font-bold text-[#EF476F]">{price}</span>
          {oldPrice && (
            <span className="text-sm line-through text-[#737373]}">{oldPrice}</span>
          )}
        </div>

        <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
          SELECT WIDTH
        </label>
        <div className="flex gap-2">
          {widths.map((w) => (
            <button
              key={w}
              className={
                w === selectedWidth
                  ? "bg-[#6A4C93] text-white px-4 py-2 rounded-xl text-xs font-bold"
                  : "bg-[#282826] text-[#737373] px-4 py-2 rounded-xl text-xs border border-neutral-800"
              }
            >
              {w}
            </button>
          ))}
        </div>

        <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2 mt-4">
          GRAPHIC FINISH
        </label>
        <div className="flex gap-3">
          {finishes.map((color, i) => (
            <div
              key={color}
              className={
                i === 0
                  ? `w-6 h-6 rounded-full ring-2 ring-[${color}] ring-offset-2 ring-offset-[#121212] cursor-pointer`
                  : "w-6 h-6 rounded-full cursor-pointer"
              }
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button className="w-full bg-[#EF476F] text-black font-black text-xs tracking-widest uppercase py-4 rounded-full shadow-lg hover:opacity-90 transition-opacity">
            ADD TO CART
          </button>
          <button className="w-full bg-[#1A1A1A] border border-neutral-800 text-[#F8F9FA] font-bold text-xs tracking-widest uppercase py-4 rounded-full hover:bg-neutral-800 transition-colors">
            ADD TO WISHLIST
          </button>
        </div>

        <div className="bg-[#171717] rounded-2xl p-4 mt-6 border border-neutral-900">
          <span className="text-[9px] text-[#EF476F] tracking-widest uppercase font-bold block mb-3">
            TECHNICAL SPECS
          </span>
          <div className="space-y-0">
            {specs.map((s) => (
              <SpecRow key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800 last:border-0 text-[11px]">
      <span className="text-[#737373]">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
}
