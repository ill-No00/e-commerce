export default function ShippingMethodSelector({ methods = [], selected, onSelect }) {
  const handleSelect = (method) => {
    if (onSelect) {
      onSelect(method);
    }
  };

  const activeMethods = methods;

  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-black text-white uppercase tracking-widest block mb-4">
        SHIPPING METHOD
      </h3>

      <div className="flex flex-col gap-4">
        {!activeMethods?.length && (
          <p className="text-xs text-[#737373] uppercase tracking-widest">No shipping methods available</p>
        )}
        {(activeMethods || []).map((method) => {
          const isSelected = selected === method.id;
          const price = method.price_cents === 0 ? "FREE" : `$${(method.price_cents / 100).toFixed(2)}`;
          const timeText =
            method.min_business_days === method.max_business_days
              ? `${method.min_business_days} Business Day${method.min_business_days > 1 ? "s" : ""}`
              : `${method.min_business_days}–${method.max_business_days} Business Days`;

          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method)}
              className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#EF476F] bg-[#1a1315]"
                  : "border border-neutral-800 hover:border-neutral-700 bg-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[#EF476F]" : "border-neutral-700"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSelected ? "bg-[#EF476F]" : "bg-transparent"
                    }`}
                  />
                </div>
                <div>
                  <span
                    className={`text-sm font-bold uppercase ${
                      isSelected ? "text-[#EF476F]" : "text-white"
                    }`}
                  >
                    {method.name}
                  </span>
                  <p className="text-[11px] text-[#737373] mt-1">Expected arrival: {timeText}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${isSelected ? "text-[#EF476F]" : "text-[#737373]"}`}>
                {price}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
