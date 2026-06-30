import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { adminApi } from "../../api/admin.js";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";

const stats = [
  { label: "TOTAL SKUS", value: "186", sub: "Active components", color: "text-white" },
  { label: "LOW STOCK", value: "8", sub: "Below 10 units", color: "text-[#f59e0b]" },
  { label: "OUT OF STOCK", value: "3", sub: "Needs reorder", color: "text-[#ef4444]" },
  { label: "CATEGORIES", value: "6", sub: "Deck, Trucks, Wheels…", color: "text-white" },
];

const products = [
  { name: "Tokyo Neon '24", sku: "DK-TOK-001", category: "DECKS", catColor: "bg-[#ff2d78]/20 text-[#ff2d78]", price: "$65.00", stock: 42, status: "ACTIVE" },
  { name: "Concrete Ripper V2", sku: "DK-CRV-002", category: "DECKS", catColor: "bg-[#ff2d78]/20 text-[#ff2d78]", price: "$70.00", stock: 28, status: "ACTIVE" },
  { name: "Shadow Maple Pro", sku: "DK-SMP-003", category: "DECKS", catColor: "bg-[#ff2d78]/20 text-[#ff2d78]", price: "$75.00", stock: 7, status: "ACTIVE" },
  { name: "Obsidian Pro V2", sku: "TR-OBS-001", category: "TRUCKS", catColor: "bg-[#7c3aed]/20 text-[#a78bfa]", price: "$65.00", stock: 15, status: "ACTIVE" },
  { name: "Neon Pivot V3", sku: "TR-NPV-002", category: "TRUCKS", catColor: "bg-[#7c3aed]/20 text-[#a78bfa]", price: "$58.00", stock: 3, status: "ACTIVE" },
  { name: "Hollow Lights 149", sku: "TR-HOL-003", category: "TRUCKS", catColor: "bg-[#7c3aed]/20 text-[#a78bfa]", price: "$55.00", stock: 0, status: "ACTIVE" },
  { name: "Spitfire F4 52mm", sku: "WH-SPF-001", category: "WHEELS", catColor: "bg-[#00e5ff]/20 text-[#00e5ff]", price: "$42.00", stock: 64, status: "ACTIVE" },
  { name: "Bones STF V5", sku: "WH-BST-002", category: "WHEELS", catColor: "bg-[#00e5ff]/20 text-[#00e5ff]", price: "$38.00", stock: 22, status: "ACTIVE" },
  { name: "Bones Reds", sku: "BR-BRD-001", category: "BEARINGS", catColor: "bg-[#f59e0b]/20 text-[#f59e0b]", price: "$18.00", stock: 0, status: "ACTIVE" },
  { name: "Bronson G3", sku: "BR-BRG-002", category: "BEARINGS", catColor: "bg-[#f59e0b]/20 text-[#f59e0b]", price: "$22.00", stock: 11, status: "ACTIVE" },
  { name: "Allen 1\" Neon", sku: "HW-ALN-001", category: "HARDWARE", catColor: "bg-[#888]/20 text-[#888]", price: "$5.00", stock: 150, status: "ACTIVE" },
  { name: "Mob Grip Black", sku: "GT-MOB-001", category: "GRIP TAPE", catColor: "bg-[#22c55e]/20 text-[#22c55e]", price: "$10.00", stock: 4, status: "ACTIVE" },
];

const categories = ["ALL", "DECKS", "TRUCKS", "WHEELS", "BEARINGS", "HARDWARE", "GRIP TAPE"];

export default function InventoryPage() {
  const [activeCat, setActiveCat] = useState("ALL");
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(1);
  const [apiProducts, setApiProducts] = useState(null);
  const [loadingProds, setLoadingProds] = useState(true);

  useEffect(() => {
    adminApi
      .inventory()
      .then((res) => setApiProducts(res.data))
      .catch(() => {})
      .finally(() => setLoadingProds(false));
  }, []);

  const productList = apiProducts ?? products;
  const filtered = activeCat === "ALL" ? productList : productList.filter((p) => p.category === activeCat);

  const stockColor = (stock) => {
    if (stock === 0) return "text-[#ef4444]";
    if (stock < 5) return "text-[#f59e0b]";
    if (stock < 20) return "text-[#f59e0b]";
    return "text-[#22c55e]";
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest">{s.label}</div>
            <div className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[#888] mt-1">{s.sub}</div>
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
            {filtered.map((p, i) => (
              <tr key={p.sku} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#111] rounded-lg shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">{p.name}</div>
                      <div className="text-[9px] text-[#888] mt-0.5">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[10px] font-mono text-[#888]">{p.sku}</td>
                <td className="px-5 py-4">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${p.catColor}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-bold text-white">{p.price}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${stockColor(p.stock)}`}>{p.stock}</span>
                    {p.stock > 0 && p.stock < 5 && (
                      <span className="text-[8px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-1.5 py-0.5 rounded-full uppercase">LOW</span>
                    )}
                    {p.stock === 0 && (
                      <span className="text-[8px] font-bold text-[#ef4444] bg-[#ef4444]/20 px-1.5 py-0.5 rounded-full uppercase">OUT OF STOCK</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[8px] font-bold bg-[#22c55e]/20 text-[#22c55e] px-2 py-0.5 rounded-full uppercase">
                    {p.status}
                  </span>
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

      <Pagination current={1} total={5} />

      <Modal open={!!restockProduct} onClose={() => setRestockProduct(null)}>
        {restockProduct && (
          <>
            <h2 className="text-sm font-black text-white uppercase tracking-tight mb-1">RESTOCK</h2>
            <p className="text-xs text-[#888] mb-4">{restockProduct.name} — Current stock: <span className="text-white font-bold">{restockProduct.stock}</span></p>
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
