import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../../api/products.js";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, "-");
}

const categories = [
  { label: "DECK ONLY", selected: true },
  { label: "COMPLETES", selected: false },
  { label: "WHEELS & TRUCKS", selected: false },
  { label: "APPAREL", selected: false },
];

const deckSizes = [
  { label: '8.0"', selected: true },
  { label: '8.25"', selected: false },
  { label: '8.38"', selected: false },
  { label: '8.5"', selected: false },
  { label: '8.6"', selected: false },
];

const crewTags = ["TOKYO DRIFT", "NYC KINGS", "BERLIN CORE"];

function FilterCheckbox({ label, selected }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
          selected
            ? "bg-[#EF476F] border-[#EF476F]"
            : "border-neutral-700 group-hover:border-[#737373]"
        }`}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className={selected ? "text-[#F8F9FA] text-xs" : "text-[#737373] text-xs"}>
        {label}
      </span>
    </label>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="text-[10px] font-black text-white uppercase tracking-widest block mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProductCard({ product }) {
  const title = product.name || product.title;
  const price = product.base_price_cents != null
    ? `$${(product.base_price_cents / 100).toFixed(2)}`
    : product.price;
  const badge = product.badge || null;
  const rating = product.rating_avg ?? product.rating;
  const sub = product.category?.name || product.sub;
  const slug = product.slug || slugify(title);

  return (
    <Link
      to={`/shop/${slug}`}
      state={{
        title,
        price,
        tagline: sub,
        rating,
        badge,
      }}
      className="group block"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="w-full aspect-[3/4] bg-[#282826] rounded-2xl relative mb-3 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        {badge && (
          <span className="absolute top-3 right-3 bg-sky-500 text-white font-bold text-[8px] tracking-wider px-2 py-0.5 rounded uppercase">
            {badge}
          </span>
        )}
      </div>
      <div className="flex justify-between items-start mt-2">
        <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-[#EF476F] transition-colors">
          {title}
        </span>
        <span className="text-xs font-bold text-[#EF476F]">{price}</span>
      </div>
      <div className="flex justify-between items-center text-[10px] text-[#737373] mt-1">
        <span>{sub}</span>
        <span className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#EF476F" stroke="#EF476F" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {rating}
        </span>
      </div>
    </Link>
  );
}

function Pagination() {
  return (
    <div className="flex justify-center items-center gap-6 py-12 text-[10px] font-bold uppercase tracking-widest text-[#737373]">
      <span className="hover:text-white transition-colors cursor-pointer">← PREVIOUS</span>
      <div className="flex items-center gap-4">
        <span className="text-white border-b border-[#EF476F] pb-0.5">01</span>
        <span className="hover:text-white cursor-pointer">02</span>
        <span className="hover:text-white cursor-pointer">03</span>
      </div>
      <span className="hover:text-white transition-colors cursor-pointer">NEXT →</span>
    </div>
  );
}

export default function CatalogGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list()
      .then((res) => setProducts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="px-8 pt-12 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tight">
              <span className="text-[#F8F9FA]">THE </span>
              <span className="text-[#EF476F]">GALLERY</span>
            </h1>
            <p className="text-xs text-[#737373] tracking-wider uppercase max-w-sm mt-2">
              PREMIUM STREET HARDWARE. CURATED FOR THE CONCRETE PURIST.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#F8F9FA] text-xs shrink-0">
            <span>SORT BY:</span>
            <div className="border border-neutral-800 rounded-lg px-3 py-1.5 bg-[#171717] text-[11px] font-bold uppercase flex items-center gap-2 cursor-pointer">
              LATEST DROPS
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-6">
        <aside className="lg:col-span-3 flex flex-col gap-8">
          <FilterGroup title="CATEGORY">
            <div className="flex flex-col gap-2.5 text-xs text-[#737373] font-medium">
              {categories.map((cat) => (
                <FilterCheckbox key={cat.label} label={cat.label} selected={cat.selected} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="DECK SIZE">
            <div className="grid grid-cols-3 gap-1.5">
              {deckSizes.map((size) => (
                <button
                  key={size.label}
                  className={
                    size.selected
                      ? "bg-[#6A4C93] text-white font-bold rounded-lg py-2 text-center text-[11px]"
                      : "bg-[#171717] text-[#737373] border border-neutral-900 rounded-lg py-2 text-center text-[11px] hover:border-neutral-700 transition-colors"
                  }
                >
                  {size.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="STREET CREW">
            <div className="flex flex-wrap gap-1.5">
              {crewTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#171717] border border-neutral-800 text-[#737373]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </FilterGroup>
        </aside>

        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-[3/4] bg-[#282826] rounded-2xl mb-3" />
                    <div className="h-3 bg-[#282826] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#282826] rounded w-1/2" />
                  </div>
                ))
              : products.map((product) => (
                  <ProductCard key={product.id || product.name} product={product} />
                ))}

            <div className="md:col-span-2 w-full aspect-auto bg-[#282826] rounded-2xl p-6 flex flex-col justify-center items-center min-h-[250px] relative">
              <div className="flex flex-col items-center justify-center text-center my-auto">
                <span className="text-[9px] font-bold text-[#EF476F] tracking-widest uppercase mb-1">
                  CUSTOM BUILDER
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                  CRAFT YOUR OWN EDGE
                </h2>
                <Link
                  to="/builder"
                  className="bg-white text-[#121212] font-black text-[10px] tracking-widest uppercase px-6 py-2 rounded-full hover:scale-105 transition-transform mt-2 cursor-pointer inline-block"
                >
                  START BUILD
                </Link>
              </div>
            </div>
          </div>

          <Pagination />
        </div>
      </section>
    </>
  );
}
