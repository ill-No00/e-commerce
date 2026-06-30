import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { productsApi } from "../../api/products.js";
import ShopHero from "../../components/shop/ShopHero";
import EditorialSection from "../../components/shop/EditorialSection";
import CustomerReviews from "../../components/shop/CustomerReviews";
import RelatedProducts from "../../components/shop/RelatedProducts";

export default function ProductDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getBySlug(id)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="text-[#ff2d78] text-xs font-bold uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black text-white uppercase tracking-tight mb-2">PRODUCT NOT FOUND</div>
          <p className="text-[#888] text-xs uppercase tracking-widest">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const series = product.series || "PRO PERFORMANCE SERIES";
  const price = product.base_price_cents != null
    ? `$${(product.base_price_cents / 100).toFixed(2)}`
    : state?.price || "$189.00";
  const badge = product.badge || state?.badge || null;
  const widths = product.product_variants?.map((v) => v.size_label).filter(Boolean) || ['8.0"', '8.25"', '8.5"'];
  const finishes = product.product_variants?.map((v) => v.finish_hex).filter(Boolean) || ["#EF476F", "#6A4C93", "#3A6B6B"];
  const specs = product.construction || product.concave || product.trucks_spec || product.bearings_spec
    ? [
        ...(product.construction ? [{ label: "Construction", value: product.construction }] : []),
        ...(product.concave ? [{ label: "Concave", value: product.concave }] : []),
        ...(product.trucks_spec ? [{ label: "Trucks", value: product.trucks_spec }] : []),
        ...(product.bearings_spec ? [{ label: "Bearings", value: product.bearings_spec }] : []),
      ]
    : [
        { label: "Construction", value: "7-PLY MAPLE" },
        { label: "Concave", value: "MEDIUM" },
        { label: "Trucks", value: "STANDARD 129" },
        { label: "Bearings", value: "ABEC-7 STEEL" },
      ];

  return (
    <div className="bg-[#121212] min-h-screen">
      <ShopHero
        series={series}
        title={product.name}
        price={price}
        oldPrice={state?.oldPrice || null}
        widths={widths}
        selectedWidth={widths[0]}
        finishes={finishes}
        specs={specs}
        badge={badge}
      />
      <EditorialSection />
      <CustomerReviews productId={product.id} />
      <RelatedProducts />
    </div>
  );
}
