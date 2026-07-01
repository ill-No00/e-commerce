import { useState, useEffect } from "react";
import { productsApi } from "../../../api/products.js";
import { formatCents } from "../../../utils/format.js";

export default function StepTrucks({ selected, onSelect, deckSelection }) {
  const [trucks, setTrucks] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ category: "trucks", limit: 20 })
      .then((res) => setTrucks(res.data))
      .catch(() => setTrucks(undefined))
      .finally(() => setLoading(false));
  }, []);

  const deckWidth = deckSelection?.product_variants?.[0]?.size_label;

  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 02</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">SELECT TRUCKS</h1>

      {deckWidth && (
        <div className="bg-[#1a1a1a] border-l-4 border-[#7c3aed] rounded-r-xl p-4 mb-6 flex items-start gap-3">
          <div>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">AXLE WIDTH MATCH</span>
            <p className="text-[11px] text-[#888] mt-1">
              Your selected deck recommends an axle width of{" "}
              <span className="text-[#00e5ff] font-bold">{deckWidth}</span>.
            </p>
          </div>
        </div>
      )}

      {loading && <p className="text-xs text-[#888] mb-4">Loading trucks...</p>}
      {!loading && !trucks?.length && (
        <p className="text-xs text-[#888] mb-4">No trucks available</p>
      )}

      <div className="grid grid-cols-2 gap-5">
        {(trucks || []).map((t) => {
          const isSelected = selected?.id === t.id;
          const price = formatCents(t.base_price_cents);
          const variant = t.product_variants?.[0];
          return (
            <div
              key={t.id}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(t)}
            >
              <div className="w-full aspect-[4/3] bg-[#111] rounded-lg mb-4 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="12" x2="22" y2="12" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{t.name ?? "—"}</div>
              {variant?.width && (
                <div className="text-[10px] text-[#888] mt-1">Axle: {variant.width}</div>
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
