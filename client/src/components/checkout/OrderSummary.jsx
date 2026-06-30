import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/cart.js";
import { Loader2 } from "lucide-react";

export default function OrderSummary({ ctaText = "CONTINUE TO PAYMENT", ctaTo = "/checkout/payment", onClick }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cartApi
      .get()
      .then((res) => setCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 size={20} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  const items = cart?.cart_items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price_cents * item.quantity) / 100, 0);

  // Read selected shipping method from localStorage
  const savedMethodStr = localStorage.getItem("checkout_shipping_method");
  let shipping = 0;
  if (savedMethodStr) {
    try {
      const savedMethod = JSON.parse(savedMethodStr);
      shipping = (savedMethod.price_cents || 0) / 100;
    } catch {}
  }

  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  const btnClasses = "w-full bg-[#EF476F] text-black font-black text-xs tracking-widest uppercase py-4 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-center block";

  return (
    <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 flex flex-col sticky top-28">
      <h2 className="text-md font-black text-white uppercase tracking-tight mb-6">
        ORDER SUMMARY
      </h2>

      <div className="flex flex-col gap-4 pb-4 border-b border-neutral-800">
        {items.map((item) => {
          const name = item.product_variants?.products?.name || item.product_name || "Product";
          const meta = item.product_variants?.size_label || item.variant_label || "";
          const price = `$${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}`;
          return (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#282826] rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-tight truncate">
                  {name}
                </p>
                <p className="text-[9px] text-[#6A4C93] font-bold tracking-wider uppercase mt-0.5">
                  {meta}
                </p>
                <p className="text-[10px] text-[#737373] mt-0.5">QTY: {item.quantity}</p>
              </div>
              <span className="text-xs font-bold text-white flex-shrink-0">{price}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 pt-4 pb-4 border-b border-neutral-800 text-xs">
        <div className="flex justify-between items-center text-[#737373]">
          <span>SUBTOTAL</span>
          <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[#737373]">
          <span>SHIPPING</span>
          <span className="font-bold text-white">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-[#737373]">
          <span>TAXES</span>
          <span className="font-bold text-white">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline pt-4 pb-6">
        <span className="text-xs font-black text-white uppercase tracking-wider">TOTAL</span>
        <span className="text-3xl font-black text-[#EF476F] tracking-tight">${total.toFixed(2)}</span>
      </div>

      {onClick ? (
        <button onClick={onClick} className={btnClasses}>
          {ctaText}
        </button>
      ) : (
        <Link to={ctaTo} className={btnClasses}>
          {ctaText}
        </Link>
      )}
    </div>
  );
}
