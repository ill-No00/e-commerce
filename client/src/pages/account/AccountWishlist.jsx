import { useState } from "react";
import { Heart, ShoppingBag, X, Share2, Package } from "lucide-react";

const wishlistItems = [
  { category: "DECK", name: "OBSIDIAN SERIES V.2", price: "$94.00", stock: "IN_STOCK", stockColor: "text-[#22c55e]" },
  { category: "WHEELS", name: "STREET GRIP WHEELS 54MM", price: "$45.00", stock: "IN_STOCK", stockColor: "text-[#22c55e]" },
  { category: "TRUCKS", name: "TITANIUM KINGPINS V3", price: "$78.00", stock: "LOW_STOCK", stockColor: "text-[#f59e0b]" },
  { category: "BEARINGS", name: "CERAMIC SPEED BEARINGS", price: "$62.00", stock: "IN_STOCK", stockColor: "text-[#22c55e]" },
  { category: "HARDWARE", name: "HEX DRIVE BOLT SET", price: "$12.00", stock: "IN_STOCK", stockColor: "text-[#22c55e]" },
  { category: "GRIP TAPE", name: "OBSIDIAN GRIP TAPE 9\"", price: "$18.00", stock: "OUT_OF_STOCK", stockColor: "text-[#ef4444]" },
];

export default function AccountWishlist() {
  const [items, setItems] = useState(wishlistItems);

  const removeItem = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">MY_WISHLIST</h1>
          <p className="text-[11px] text-[#888] mt-1">{items.length} items saved</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[9px] font-bold text-[#888] border border-[#2a2a2a] rounded-full px-4 py-2.5 uppercase tracking-widest hover:text-white hover:border-white transition-all">
            <Share2 size={13} />
            SHARE_WISHLIST
          </button>
          <select className="text-[9px] font-bold bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2.5 text-[#888] outline-none uppercase tracking-widest">
            <option>SORT: RECENTLY_ADDED</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden group">
              <div className="relative">
                <div className="h-36 bg-[#111] flex items-center justify-center">
                  <Package size={36} className="text-[#333]" />
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ff2d78]/20 flex items-center justify-center hover:bg-[#ff2d78]/40 transition-all"
                >
                  <Heart size={14} className="text-[#ff2d78] fill-[#ff2d78]" />
                </button>
                <span className="absolute top-3 left-3 text-[8px] font-bold text-[#666] bg-[#0d0d0d]/80 rounded-full px-2.5 py-1 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <div className="text-xs font-black text-white uppercase tracking-tight leading-tight mb-1">{item.name}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#ff2d78]">{item.price}</span>
                  <span className={`text-[9px] font-bold ${item.stockColor}`}>{item.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#ff2d78] text-white text-[9px] font-black tracking-widest uppercase rounded-full py-2.5 hover:brightness-110 transition-all">
                    <ShoppingBag size={13} />
                    ADD_TO_BUILD
                  </button>
                  <button
                    onClick={() => removeItem(i)}
                    className="w-10 h-9 flex items-center justify-center text-[#888] border border-[#2a2a2a] rounded-full hover:text-white hover:border-white transition-all"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex items-center justify-center mb-5">
            <Heart size={32} className="text-[#333]" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-tight mb-2">YOUR_WISHLIST_IS_EMPTY</h2>
          <p className="text-[11px] text-[#888] mb-5">Save items you love to build later.</p>
          <button className="flex items-center gap-2 text-[10px] font-bold text-[#ff2d78] border border-[#ff2d78]/40 rounded-full px-5 py-3 uppercase tracking-widest hover:bg-[#ff2d78]/10 transition-all">
            BROWSE_SHOP
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
