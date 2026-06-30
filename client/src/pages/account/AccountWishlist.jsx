import { useState, useEffect } from "react";
import { Heart, ShoppingBag, X, Share2, Package, Loader2 } from "lucide-react";
import { wishlistApi } from "../../api/wishlist.js";

export default function AccountWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistApi
      .list()
      .then((res) => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (i) => {
    const item = items[i];
    try {
      await wishlistApi.remove(item.id);
      setItems((prev) => prev.filter((_, idx) => idx !== i));
    } catch {}
  };

  function mapItem(item) {
    const v = item.product_variants || {};
    const p = v.products || {};
    const priceCents = v.price_cents || 0;
    const stock = v.stock_status || "IN_STOCK";
    const stockColor =
      stock === "OUT_OF_STOCK" ? "text-[#ef4444]" :
      stock === "LOW_STOCK" ? "text-[#f59e0b]" :
      "text-[#22c55e]";
    return {
      id: item.id,
      category: p.slug?.split("-")[0]?.toUpperCase() || "ITEM",
      name: p.name || "Product",
      price: `$${(priceCents / 100).toFixed(2)}`,
      stock,
      stockColor,
    };
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">MY_WISHLIST</h1>
        <p className="text-[11px] text-[#888] mt-1">{items.length} items saved</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
        <div />
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 text-[8px] md:text-[9px] font-bold text-[#888] border border-[#2a2a2a] rounded-full px-3 md:px-4 py-2 md:py-2.5 uppercase tracking-widest hover:text-white hover:border-white transition-all flex-1 sm:flex-initial">
            <Share2 size={12} className="md:hidden" />
            <Share2 size={13} className="hidden md:block" />
            <span className="hidden xs:inline">SHARE_WISHLIST</span>
          </button>
          <select className="flex-1 sm:flex-initial text-[8px] md:text-[9px] font-bold bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 md:px-4 py-2 md:py-2.5 text-[#888] outline-none uppercase tracking-widest">
            <option>SORT: RECENTLY_ADDED</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="text-[#ff2d78] animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => {
            const mapped = mapItem(item);
            return (
            <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden group">
              <div className="relative">
                <div className="h-28 md:h-36 bg-[#111] flex items-center justify-center">
                  <Package size={28} className="md:hidden text-[#333]" />
                  <Package size={36} className="hidden md:block text-[#333]" />
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="absolute top-2 md:top-3 right-2 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#ff2d78]/20 flex items-center justify-center hover:bg-[#ff2d78]/40 transition-all"
                >
                  <Heart size={12} className="md:hidden text-[#ff2d78] fill-[#ff2d78]" />
                  <Heart size={14} className="hidden md:block text-[#ff2d78] fill-[#ff2d78]" />
                </button>
                <span className="absolute top-2 md:top-3 left-2 md:left-3 text-[7px] md:text-[8px] font-bold text-[#666] bg-[#0d0d0d]/80 rounded-full px-2 md:px-2.5 py-0.5 md:py-1 uppercase tracking-wider">
                  {mapped.category}
                </span>
              </div>
              <div className="p-3 md:p-4">
                <div className="text-[10px] md:text-xs font-black text-white uppercase tracking-tight leading-tight mb-1">{mapped.name}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] md:text-xs font-black text-[#ff2d78]">{mapped.price}</span>
                  <span className={`text-[8px] md:text-[9px] font-bold ${mapped.stockColor}`}>{mapped.stock}</span>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 bg-[#ff2d78] text-white text-[8px] md:text-[9px] font-black tracking-widest uppercase rounded-full py-2 md:py-2.5 hover:brightness-110 transition-all">
                    <ShoppingBag size={11} className="md:hidden" />
                    <ShoppingBag size={13} className="hidden md:block" />
                    ADD_TO_BUILD
                  </button>
                  <button
                    onClick={() => removeItem(i)}
                    className="w-8 h-8 md:w-10 md:h-9 flex items-center justify-center text-[#888] border border-[#2a2a2a] rounded-full hover:text-white hover:border-white transition-all"
                  >
                    <X size={11} className="md:hidden" />
                    <X size={13} className="hidden md:block" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 md:py-20">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex items-center justify-center mb-4 md:mb-5">
            <Heart size={24} className="md:hidden text-[#333]" />
            <Heart size={32} className="hidden md:block text-[#333]" />
          </div>
          <h2 className="text-sm md:text-base font-black text-white uppercase tracking-tight mb-2">YOUR_WISHLIST_IS_EMPTY</h2>
          <p className="text-[11px] text-[#888] mb-5">Save items you love to build later.</p>
          <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-[#ff2d78] border border-[#ff2d78]/40 rounded-full px-4 md:px-5 py-2.5 md:py-3 uppercase tracking-widest hover:bg-[#ff2d78]/10 transition-all">
            BROWSE_SHOP
            <svg width="12" className="md:hidden" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
            <svg width="14" className="hidden md:block" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
