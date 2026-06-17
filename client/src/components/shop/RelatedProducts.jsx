const products = [
  {
    title: "CHROME GHOST",
    price: "$175",
    subtext: "DECK ONLY",
  },
  {
    title: "PRO-AXLE TRUCKS",
    price: "$65",
    subtext: "HARDWARE",
  },
  {
    title: "NEON SPINNERS",
    price: "$55",
    subtext: "52MM WHEELS",
  },
  {
    title: "STREET HOODIE",
    price: "$85",
    subtext: "APPAREL",
  },
];

export default function RelatedProducts() {
  return (
    <section className="px-8 py-12 border-t border-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          RELATED <span className="text-[#6A4C93]">HARDWARE</span>
        </h2>
        <div className="flex gap-2 text-[#737373]">
          <button
            className="border border-neutral-700 rounded-full p-1.5 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="border border-neutral-700 rounded-full p-1.5 hover:text-white transition-colors"
            aria-label="Next"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-[#171717] rounded-2xl p-3 border border-neutral-900 flex flex-col">
      <div className="w-full aspect-[4/5] bg-[#282826] rounded-xl mb-4" />
      <div className="flex justify-between items-start mt-1">
        <span className="text-xs font-black text-white uppercase tracking-tight leading-none">
          {product.title}
        </span>
        <span className="text-xs font-bold text-[#EF476F]">{product.price}</span>
      </div>
      <span className="text-[10px] text-[#737373] uppercase tracking-wider mt-1">
        {product.subtext}
      </span>
    </div>
  );
}
