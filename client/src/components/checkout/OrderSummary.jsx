import { Link } from "react-router-dom";

const products = [
  { name: "CONCRETE RIPPER V2", meta: '8.25" /DECK ONLY', price: "$65.00", qty: 1 },
  { name: "STREET CREW 52MM", meta: "99A /SET OF 4", price: "$45.00", qty: 1 },
];

export default function OrderSummary({ ctaText = "CONTINUE TO PAYMENT", ctaTo = "/checkout/payment" }) {
  const subtotal = 110.0;
  const shipping = 0.0;
  const tax = 9.35;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 flex flex-col sticky top-28">
      <h2 className="text-md font-black text-white uppercase tracking-tight mb-6">
        ORDER SUMMARY
      </h2>

      <div className="flex flex-col gap-4 pb-4 border-b border-neutral-800">
        {products.map((p) => (
          <div key={p.name} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#282826] rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white uppercase tracking-tight truncate">
                {p.name}
              </p>
              <p className="text-[9px] text-[#6A4C93] font-bold tracking-wider uppercase mt-0.5">
                {p.meta}
              </p>
              <p className="text-[10px] text-[#737373] mt-0.5">QTY: {p.qty}</p>
            </div>
            <span className="text-xs font-bold text-white flex-shrink-0">{p.price}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-4 pb-4 border-b border-neutral-800 text-xs">
        <div className="flex justify-between items-center text-[#737373]">
          <span>SUBTOTAL</span>
          <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[#737373]">
          <span>SHIPPING</span>
          <span className="font-bold text-emerald-400">FREE</span>
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

      <Link
        to={ctaTo}
        className="w-full bg-[#EF476F] text-black font-black text-xs tracking-widest uppercase py-4 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-center block"
      >
        {ctaText}
      </Link>
    </div>
  );
}
