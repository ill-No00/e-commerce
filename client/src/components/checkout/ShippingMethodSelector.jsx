export default function ShippingMethodSelector() {
  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-black text-white uppercase tracking-widest block mb-4">
        SHIPPING METHOD
      </h3>

      <div className="border-2 border-[#EF476F] p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-full border-2 border-[#EF476F] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF476F]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#EF476F] uppercase">
              STREET STANDARD DELIVERY
            </span>
            <p className="text-[11px] text-[#737373] mt-1">
              Expected arrival: 2–3 Business Days
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#F8F9FA]">FREE</span>
      </div>

      <div className="border border-neutral-800 p-5 rounded-2xl flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-full border-2 border-neutral-700 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
          </div>
          <div>
            <span className="text-sm font-bold text-white uppercase">
              EXPRESS DELIVERY
            </span>
            <p className="text-[11px] text-[#737373] mt-1">
              Expected arrival: Next Business Day
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#6A4C93]">$25.00</span>
      </div>
    </div>
  );
}
