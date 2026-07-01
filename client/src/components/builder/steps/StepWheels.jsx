import { useState, useEffect } from "react";
import { productsApi } from "../../../api/products.js";
import { formatCents } from "../../../utils/format.js";

export default function StepWheels({ selected, onSelect }) {
  const [wheels, setWheels] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ category: "wheels", limit: 20 })
      .then((res) => setWheels(res.data))
      .catch(() => setWheels(undefined))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 03</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE WHEELS</h1>

      {loading && <p className="text-xs text-[#888] mb-4">Loading wheels...</p>}
      {!loading && !wheels?.length && (
        <p className="text-xs text-[#888] mb-4">No wheels available</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {(wheels || []).map((w) => {
          const isSelected = selected?.id === w.id;
          const price = formatCents(w.base_price_cents);
          const variant = w.product_variants?.[0];
          return (
            <div
              key={w.id}
              className={`rounded-xl p-4 cursor-pointer transition-all relative ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(w)}
            >
              <div className="w-full aspect-square bg-[#111] rounded-full mt-2 mb-3 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="text-xs font-black text-white uppercase tracking-tight truncate">{w.name ?? "—"}</div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {variant?.size_label && (
                  <span className="text-[8px] font-bold bg-[#2a2a2a] text-[#888] px-2 py-0.5 rounded-full">{variant.size_label}</span>
                )}
                {variant?.durometer && (
                  <span className="text-[8px] font-bold bg-[#2a2a2a] text-[#888] px-2 py-0.5 rounded-full">{variant.durometer}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                {price && <span className="text-base font-black text-[#ff2d78]">{price}</span>}
                <button
                  className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-all ${
                    isSelected
                      ? "bg-[#ff2d78] text-white"
                      : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                  }`}
                >
                  {isSelected ? "✓" : "SELECT"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
