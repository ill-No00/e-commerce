import { formatCents } from "../../../utils/format.js";

function getProductPrice(product) {
  if (!product) return undefined;
  const cents = product.base_price_cents ?? product.product_variants?.[0]?.price_cents;
  return formatCents(cents);
}

export default function StepReview({ selections, total }) {
  const categories = ["DECK", "TRUCKS", "WHEELS", "BEARINGS", "HARDWARE", "GRIP TAPE"];

  const items = categories.map((category) => {
    const product = selections[category];
    const variant = product?.product_variants?.[0];
    const spec = [variant?.size_label, variant?.durometer, product?.concave].filter(Boolean).join(" / ") || undefined;
    return {
      category,
      name: product?.name,
      spec,
      price: getProductPrice(product),
    };
  });

  return (
    <div className="flex gap-10">
      <div className="flex-1">
        <div className="text-[10px] text-[#ff2d78] font-semibold tracking-widest uppercase mb-1">STEP 06 // REVIEW</div>
        <h1 className="text-4xl font-black leading-none mb-1">
          <span className="text-white tracking-tight uppercase">THE FINAL</span>
          <br />
          <span className="text-[#ff2d78] tracking-tight uppercase">ASSEMBLY</span>
        </h1>
        <p className="text-[11px] text-[#888] mb-8">Verify every component before we lock in your build.</p>

        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <div
              key={item.category}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 relative group"
            >
              <div className="w-14 h-14 bg-[#111] rounded-lg shrink-0 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] text-[#888] font-semibold tracking-widest uppercase">{item.category}</div>
                <div className="text-sm font-black text-white uppercase tracking-tight truncate">{item.name ?? "—"}</div>
                {item.spec && <div className="text-[9px] text-[#666] mt-0.5">{item.spec}</div>}
                {item.price && <div className="text-[11px] font-bold text-[#ff2d78] mt-1">{item.price}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[300px] shrink-0">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">THE LEDGER</h2>
          </div>

          <div className="pt-4 pb-6">
            <div className="text-[9px] text-[#888] font-semibold tracking-widest uppercase mb-1">GRAND TOTAL</div>
            <div className="text-3xl font-black text-[#ff2d78]">
              {total > 0 ? `$${(total / 100).toFixed(2)}` : "—"}
            </div>
          </div>

          <button className="w-full bg-[#ff2d78] text-white font-black text-xs tracking-widest uppercase py-4 rounded-full hover:brightness-110 transition-all mb-3">
            PROCEED TO DEPLOYMENT →
          </button>
          <button className="w-full text-[10px] text-[#888] font-bold tracking-widest uppercase text-center hover:text-white transition-colors">
            SAVE BUILD FOR LATER
          </button>
        </div>
      </div>
    </div>
  );
}
