import { useState, useEffect } from "react";
import { adminApi } from "../../api/admin.js";
import { formatCents } from "../../utils/format.js";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";

const catColors = {
  DECKS: "bg-[#ff2d78]/20 text-[#ff2d78]",
  TRUCKS: "bg-[#7c3aed]/20 text-[#a78bfa]",
  WHEELS: "bg-[#00e5ff]/20 text-[#00e5ff]",
  BEARINGS: "bg-[#f59e0b]/20 text-[#f59e0b]",
  HARDWARE: "bg-[#888]/20 text-[#888]",
  "GRIP TAPE": "bg-[#22c55e]/20 text-[#22c55e]",
};

function mapProduct(p) {
  const category = p.categories?.name?.toUpperCase() || undefined;
  const variant = p.product_variants?.[0];
  const stock = variant?.stock_quantity;
  return {
    id: p.id,
    name: p.name,
    sku: variant?.sku,
    category,
    catColor: category ? catColors[category] : undefined,
    price: formatCents(p.base_price_cents ?? variant?.price_cents),
    stock,
    status: p.is_active ? "ACTIVE" : "INACTIVE",
    product_variants: p.product_variants,
  };
}

export default function InventoryPage() {
  const [activeCat, setActiveCat] = useState("ALL");
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(1);
  const [apiProducts, setApiProducts] = useState(undefined);
  const [apiStats, setApiStats] = useState(undefined);
  const [pagination, setPagination] = useState(undefined);
  const [loadingProds, setLoadingProds] = useState(true);

  useEffect(() => {
    adminApi
      .inventory()
      .then((res) => {
        setApiProducts(res.data);
        setApiStats(res.stats);
        setPagination(res.pagination);
      })
      .catch(() => {
        setApiProducts(undefined);
        setApiStats(undefined);
        setPagination(undefined);
      })
      .finally(() => setLoadingProds(false));
  }, []);

  const productList = (apiProducts || []).map(mapProduct);
  const categories = ["ALL", ...new Set(productList.map((p) => p.category).filter(Boolean))];
  const filtered = activeCat === "ALL" ? productList : productList.filter((p) => p.category === activeCat);

  const stats = apiStats
    ? [
        { label: "TOTAL SKUS", value: String(apiStats.totalSku ?? 0), sub: "Active components", color: "text-white" },
        { label: "LOW STOCK", value: String(apiStats.lowStock ?? 0), sub: "Below 10 units", color: "text-[#f59e0b]" },
        { label: "OUT OF STOCK", value: String(apiStats.outOfStock ?? 0), sub: "Needs reorder", color: "text-[#ef4444]" },
        { label: "CATEGORIES", value: String(apiStats.categoryCount ?? 0), sub: "Product categories", color: "text-white" },
      ]
    : undefined;

  const stockColor = (stock) => {
    if (stock == null) return "text-[#888]";
    if (stock === 0) return "text-[#ef4444]";
    if (stock < 20) return "text-[#f59e0b]";
    return "text-[#22c55e]";
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-5 mb-6">
        {(stats || Array.from({ length: 4 })).map((s, i) => (
          <div key={s?.label || i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{s?.label}</div>
            <div className={`text-2xl font-black mt-1 ${s?.color || "text-white"}`}>{s?.value ?? "—"}</div>
            <div className="text-[10px] text-[#888] mt-1">{s?.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 text-[10px] font-bold uppercase tracking-widest flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeCat === c ? "bg-[#7c3aed] text-white" : "text-[#888] hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="SEARCH..." className="bg-transparent text-xs text-white placeholder:text-[#888] outline-none w-36" />
          </div>
          <button className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#ff2d78] px-4 py-2 rounded-full hover:brightness-110">
            ADD PRODUCT
          </button>
          <button className="text-[10px] font-bold tracking-widest uppercase text-[#888] border border-[#2a2a2a] px-4 py-2 rounded-full hover:text-white hover:border-white">
            IMPORT
          </button>
        </div>
      </div>

      <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#141414] text-[#888] text-[10px] uppercase tracking-widest font-semibold">
              <th className="text-left px-5 py-4">PRODUCT</th>
              <th className="text-left px-5 py-4">SKU</th>
              <th className="text-left px-5 py-4">CATEGORY</th>
              <th className="text-left px-5 py-4">PRICE</th>
              <th className="text-left px-5 py-4">STOCK</th>
              <th className="text-left px-5 py-4">STATUS</th>
              <th className="text-right px-5 py-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loadingProds && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-xs text-[#888] uppercase tracking-widest">
                  No products found
                </td>
              </tr>
            )}
            {filtered.map((p, i) => (
              <tr key={p.sku || p.id || i} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#111] rounded-lg shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">{p.name ?? "—"}</div>
                      <div className="text-[9px] text-[#888] mt-0.5">{p.category ?? "—"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[10px] font-mono text-[#888]">{p.sku ?? "—"}</td>
                <td className="px-5 py-4">
                  {p.category && (
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${p.catColor || "bg-[#2a2a2a] text-[#888]"}`}>
                      {p.category}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-xs font-bold text-white">{p.price ?? "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${stockColor(p.stock)}`}>{p.stock ?? "—"}</span>
                    {p.stock != null && p.stock > 0 && p.stock < 5 && (
                      <span className="text-[8px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-1.5 py-0.5 rounded-full uppercase">LOW</span>
                    )}
                    {p.stock === 0 && (
                      <span className="text-[8px] font-bold text-[#ef4444] bg-[#ef4444]/20 px-1.5 py-0.5 rounded-full uppercase">OUT OF STOCK</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {p.status && (
                    <span className="text-[8px] font-bold bg-[#22c55e]/20 text-[#22c55e] px-2 py-0.5 rounded-full uppercase">
                      {p.status}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[#888] hover:text-white transition-colors mr-2" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="text-[#888] hover:text-white transition-colors mr-2" title="Archive">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" />
                      <line x1="10" y1="12" x2="14" y2="12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setRestockProduct(p); setRestockQty(1); }}
                    className="text-[#888] hover:text-[#00e5ff] transition-colors"
                    title="Restock"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination current={pagination.page} total={pagination.totalPages} />
      )}

      <Modal open={!!restockProduct} onClose={() => setRestockProduct(null)}>
        {restockProduct && (
          <>
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-1">RESTOCK</h2>
            <p className="text-xs text-[#888] mb-4">{restockProduct.name ?? "—"} — Current stock: <span className="text-white font-bold">{restockProduct.stock ?? "—"}</span></p>
            <div className="mb-6">
              <label className="text-[9px] font-bold text-[#888] uppercase tracking-widest block mb-2">ADD UNITS</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRestockQty(Math.max(1, restockQty - 1))}
                  className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#ff2d78] transition-colors"
                >−</button>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg text-center text-white text-sm font-bold px-3 py-2 outline-none"
                />
                <button
                  onClick={() => setRestockQty(restockQty + 1)}
                  className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#ff2d78] transition-colors"
                >+</button>
              </div>
            </div>
            <button className="w-full bg-[#ff2d78] text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-full hover:brightness-110 transition-all mb-3">
              CONFIRM RESTOCK
            </button>
            <button onClick={() => setRestockProduct(null)} className="w-full text-[10px] font-bold tracking-widest uppercase text-[#888] py-2 hover:text-white transition-colors">
              CANCEL
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
