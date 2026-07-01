import { useState, useEffect } from "react";
import { productsApi } from "../../../api/products.js";
import { formatCents } from "../../../utils/format.js";

export default function StepHardware({ selectedBolt, onSelectBolt }) {
  const [hardware, setHardware] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ category: "hardware", limit: 20 })
      .then((res) => setHardware(res.data))
      .catch(() => setHardware(undefined))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 05</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">HARDWARE</h1>
      <p className="text-xs text-[#888] mb-6">Choose hardware for your build.</p>

      {loading && <p className="text-xs text-[#888] mb-4">Loading hardware...</p>}
      {!loading && !hardware?.length && (
        <p className="text-xs text-[#888] mb-4">No hardware available</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {(hardware || []).map((item) => {
          const isSelected = selectedBolt?.id === item.id;
          const price = formatCents(item.base_price_cents);
          const variant = item.product_variants?.[0];
          return (
            <div
              key={item.id}
              className={`rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.3)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelectBolt(item)}
            >
              <div className="text-sm font-black text-white text-center mb-2">{item.name ?? "—"}</div>
              {variant?.size_label && (
                <div className="text-[9px] text-[#888] text-center">{variant.size_label}</div>
              )}
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
