import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/cart.js";
import { Loader2 } from "lucide-react";

function CartLineItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="bg-[#171717] border border-neutral-900 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-5 min-w-0">
        <div className="w-24 h-24 bg-[#282826] rounded-xl flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">
            {item.title}
          </h3>
          <span className="text-[10px] text-[#6A4C93] font-bold tracking-wider uppercase mt-1">
            {item.meta}
          </span>
        </div>
      </div>

      <div className="flex items-center bg-[#121212] border border-neutral-800 rounded-xl px-3 py-1.5 gap-4 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
          className="text-xs text-[#737373] hover:text-white transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="text-xs font-bold text-white min-w-[12px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.quantity + 1)}
          className="text-xs text-[#737373] hover:text-white transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="flex flex-col items-end justify-between h-20 flex-shrink-0">
        <span className="text-sm font-bold text-white">{item.price}</span>
        <button
          onClick={onRemove}
          className="text-[9px] font-bold text-[#737373] tracking-wider uppercase hover:text-[#EF476F] transition-colors cursor-pointer flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          REMOVE
        </button>
      </div>
    </div>
  );
}

export default function CartContent() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cartApi
      .get()
      .then((res) => setCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateQuantity = async (itemId, newQty) => {
    try {
      await cartApi.updateItem(itemId, newQty);
      setCart(prev => ({
        ...prev,
        cart_items: prev.cart_items.map(ci =>
          ci.id === itemId ? { ...ci, quantity: newQty } : ci
        ),
      }));
    } catch {}
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartApi.removeItem(itemId);
      setCart(prev => ({
        ...prev,
        cart_items: prev.cart_items.filter(ci => ci.id !== itemId),
      }));
    } catch {}
  };

  const items = cart?.cart_items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price_cents * item.quantity) / 100, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 size={20} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <section className="px-8 pt-12 pb-6">
        <h1 className="text-5xl font-black text-[#F8F9FA] tracking-tighter">
          YOUR BAG
        </h1>
        <span className="text-[10px] text-[#EF476F] font-bold uppercase tracking-widest mt-1 block">
          {items.length} ITEM{items.length !== 1 ? "S" : ""}
        </span>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={{
                title: item.product_variants?.products?.name || item.product_name || "Product",
                meta: item.product_variants?.size_label || item.variant_label || "",
                price: `$${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}`,
                quantity: item.quantity,
              }}
              onUpdateQuantity={(newQty) => handleUpdateQuantity(item.id, newQty)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#888] text-xs uppercase tracking-widest">Your bag is empty</p>
              <Link to="/shop" className="inline-block mt-4 text-[#ff2d78] text-xs font-bold uppercase tracking-widest hover:underline">
                CONTINUE SHOPPING
              </Link>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-[#171717] border border-neutral-900 rounded-3xl p-6 flex flex-col">
            <h2 className="text-md font-black text-white uppercase tracking-tight mb-6">
              SUMMARY
            </h2>

            <div className="flex flex-col gap-3 pb-4 border-b border-neutral-800 text-xs">
              <div className="flex justify-between items-center text-[#737373]">
                <span>SUBTOTAL</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#737373]">
                <span>ESTIMATED SHIPPING</span>
                <span className="font-bold text-white">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-[#737373]">
                <span>SALES TAX</span>
                <span className="font-bold text-white">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-4 pb-6">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                TOTAL
              </span>
              <span className="text-3xl font-black text-[#EF476F] tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout/shipping"
              className="w-full bg-[#EF476F] text-black font-black text-xs tracking-widest uppercase py-4 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all mb-4 text-center block"
            >
              CHECKOUT NOW
            </Link>

            <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-wider text-[#737373] mt-2">
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                FREE SHIPPING ON ORDERS OVER $150
              </span>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                30 DAY STREET-TESTED GUARANTEE
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center mt-6 text-[8px] font-black tracking-widest text-[#737373]">
              <span className="border border-neutral-800 bg-[#121212] px-2.5 py-1 rounded">VISA</span>
              <span className="border border-neutral-800 bg-[#121212] px-2.5 py-1 rounded">MASTERCARD</span>
              <span className="border border-neutral-800 bg-[#121212] px-2.5 py-1 rounded">APPLE PAY</span>
              <span className="border border-neutral-800 bg-[#121212] px-2.5 py-1 rounded">BITCOIN</span>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
