import { useState, useEffect } from "react";
import { productsApi } from "../../../api/products.js";
import { formatCents } from "../../../utils/format.js";

export default function StepDeck({ selected, onSelect }) {
  const [decks, setDecks] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ category: "decks", limit: 20 })
      .then((res) => setDecks(res.data))
      .catch(() => setDecks(undefined))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 01</div>
      <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-6">CHOOSE YOUR DECK</h1>

      {loading && <p className="text-xs text-[#888] mb-4">Loading decks...</p>}
      {!loading && !decks?.length && (
        <p className="text-xs text-[#888] mb-4">No decks available</p>
      )}

      <div className="grid grid-cols-2 gap-5">
        {(decks || []).map((d) => {
          const isSelected = selected?.id === d.id;
          const price = formatCents(d.base_price_cents);
          const sizes = d.product_variants?.map((v) => v.size_label).filter(Boolean).join(" / ");
          const concave = d.concave;
          return (
            <div
              key={d.id}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#ff2d78] shadow-[0_0_16px_rgba(255,45,120,0.4)] bg-[#1a1a1a]"
                  : "border border-[#2a2a2a] bg-[#141414] hover:border-[#666]"
              }`}
              onClick={() => onSelect(d)}
            >
              {d.badge && (
                <span className="bg-[#ff2d78] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {d.badge}
                </span>
              )}
              <div className="w-full aspect-[3/4] bg-[#111] rounded-lg mt-2 mb-4 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                </svg>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tight">{d.name ?? "—"}</div>
              {price && <div className="text-sm font-black text-[#ff2d78] mt-0.5">{price}</div>}
              {sizes && <div className="text-[10px] text-[#888] mt-1">{sizes}</div>}
              {concave && <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">{concave} CONCAVE</div>}
              <button
                className={`w-full mt-3 text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-full transition-all ${
                  isSelected
                    ? "bg-[#ff2d78] text-white"
                    : "border border-white text-white hover:bg-[#ff2d78] hover:border-[#ff2d78]"
                }`}
              >
                {isSelected ? "SELECTED ✓" : "SELECT"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
