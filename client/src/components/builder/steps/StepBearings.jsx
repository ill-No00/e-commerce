import { useState, useEffect } from "react";
import { productsApi } from "../../../api/products.js";
import { formatCents } from "../../../utils/format.js";

export default function StepBearings({ selected, onSelect }) {
  const [bearings, setBearings] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ category: "bearings", limit: 20 })
      .then((res) => setBearings(res.data))
      .catch(() => setBearings(undefined))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 04</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE BEARINGS</h1>

      {loading && <p className="text-xs text-[#888] mb-4">Loading bearings...</p>}
      {!loading && !bearings?.length && (
        <p className="text-xs text-[#888] mb-4">No bearings available</p>
      )}

      <div className="grid grid-cols-2 gap-5">
        {(bearings || []).map((b) => {
          const isSelected = selected?.id === b.id;
          const price = formatCents(b.base_price_cents);
          return (
            <div
              key={b.id}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(b)}
            >
              <div className="w-full aspect-[4/3] bg-[#111] rounded-lg my-3 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{b.name ?? "—"}</div>
              {b.bearings_spec && (
                <div className="text-[9px] text-[#666] mt-1">{b.bearings_spec}</div>
              )}
              <div className="flex items-center justify-between mt-4">
                {price && <span className="text-lg font-black text-[#ff2d78]">{price}</span>}
                <button
                  className={`text-[10px] font-bold tracking-widest uppercase px-5 py-2 rounded-full transition-all ${
                    isSelected
                      ? "bg-[#ff2d78] text-white"
                      : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                  }`}
                >
                  {isSelected ? "SELECTED ✓" : "SELECT"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
