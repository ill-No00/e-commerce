import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../../api/products.js";
import { formatCents } from "../../utils/format.js";

export default function RelatedProducts({ categorySlug, excludeSlug }) {
  const [products, setProducts] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) {
      setProducts(undefined);
      setLoading(false);
      return;
    }
    productsApi
      .list({ category: categorySlug, limit: 5 })
      .then((res) => {
        const filtered = (res.data || []).filter((p) => p.slug !== excludeSlug).slice(0, 4);
        setProducts(filtered);
      })
      .catch(() => setProducts(undefined))
      .finally(() => setLoading(false));
  }, [categorySlug, excludeSlug]);

  if (!loading && !products?.length) return null;

  return (
    <section className="px-8 py-12 border-t border-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          RELATED <span className="text-[#6A4C93]">HARDWARE</span>
        </h2>
      </div>

      {loading && (
        <p className="text-xs text-[#737373] uppercase tracking-widest">Loading related products...</p>
      )}

      {products?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }) {
  const price = formatCents(product.base_price_cents);
  const subtext = product.category?.name;

  return (
    <Link to={`/shop/${product.slug}`} className="bg-[#171717] rounded-2xl p-3 border border-neutral-900 flex flex-col">
      <div className="w-full aspect-[4/5] bg-[#282826] rounded-xl mb-4" />
      <div className="flex justify-between items-start mt-1">
        <span className="text-xs font-black text-white uppercase tracking-tight leading-none">
          {product.name ?? "—"}
        </span>
        <span className="text-xs font-bold text-[#EF476F]">{price ?? "—"}</span>
      </div>
      {subtext && (
        <span className="text-[10px] text-[#737373] uppercase tracking-wider mt-1">
          {subtext}
        </span>
      )}
    </Link>
  );
}
