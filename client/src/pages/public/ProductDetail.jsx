import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ShopHero from "../../components/shop/ShopHero";
import EditorialSection from "../../components/shop/EditorialSection";
import CustomerReviews from "../../components/shop/CustomerReviews";
import RelatedProducts from "../../components/shop/RelatedProducts";

const productCatalog = {
  "tokyo-neon-24": {
    series: "STREET PRO SERIES",
    title: "TOKYO NEON '24",
    price: "$85.00",
    oldPrice: null,
    widths: ['8.0"', '8.25"', '8.38"'],
    selectedWidth: '8.25"',
    finishes: ["#EF476F", "#00B4D8", "#6A4C93"],
    specs: [
      { label: "Construction", value: "7-PLY MAPLE" },
      { label: "Concave", value: "MEDIUM" },
      { label: "Trucks", value: "STANDARD 129" },
      { label: "Bearings", value: "ABEC-7 STEEL" },
    ],
    badge: "PRO SERIES",
  },
  "concrete-ghost": {
    series: "STREET SERIES",
    title: "CONCRETE GHOST",
    price: "$79.00",
    oldPrice: null,
    widths: ['8.0"', '8.25"'],
    selectedWidth: '8.0"',
    finishes: ["#737373", "#121212", "#F8F9FA"],
    specs: [
      { label: "Construction", value: "7-PLY MAPLE" },
      { label: "Concave", value: "MEDIUM" },
      { label: "Trucks", value: "STANDARD 129" },
      { label: "Bearings", value: "ABEC-5 STEEL" },
    ],
    badge: null,
  },
  "purple-haze-v2": {
    series: "SIGNATURE SERIES",
    title: "PURPLE HAZE V2",
    price: "$92.00",
    oldPrice: "($110.00)",
    widths: ['8.25"', '8.5"', '8.6"'],
    selectedWidth: '8.5"',
    finishes: ["#6A4C93", "#EF476F", "#3A6B6B"],
    specs: [
      { label: "Construction", value: "7-PLY MAPLE + CARBON" },
      { label: "Concave", value: "HIGH" },
      { label: "Trucks", value: "TITANIUM 149" },
      { label: "Bearings", value: "ABEC-9 CERAMIC" },
    ],
    badge: "NEW DROP",
  },
  "blur-element": {
    series: "TEAM EDITION",
    title: "BLUR ELEMENT",
    price: "$85.00",
    oldPrice: null,
    widths: ['8.0"', '8.25"'],
    selectedWidth: '8.0"',
    finishes: ["#3A6B6B", "#121212", "#EF476F"],
    specs: [
      { label: "Construction", value: "7-PLY MAPLE" },
      { label: "Concave", value: "MEDIUM-HIGH" },
      { label: "Trucks", value: "STANDARD 139" },
      { label: "Bearings", value: "ABEC-7 STEEL" },
    ],
    badge: null,
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = productCatalog[id] || {
    series: "PRO PERFORMANCE SERIES",
    title: state?.title || "NEON DRIFT EVO-1",
    price: state?.price || "$189.00",
    oldPrice: "($245.00)",
    widths: ['8.0"', '8.25"', '8.5"'],
    selectedWidth: '8.0"',
    finishes: ["#EF476F", "#6A4C93", "#3A6B6B"],
    specs: [
      { label: "Construction", value: "7-PLY MAPLE" },
      { label: "Concave", value: "MEDIUM-HIGH" },
      { label: "Trucks", value: "TITANIUM 149" },
      { label: "Bearings", value: "ABEC-9 CERAMIC" },
    ],
    badge: state?.badge || null,
  };

  return (
    <div className="bg-[#121212] min-h-screen">
      <ShopHero
        series={product.series}
        title={product.title}
        price={product.price}
        oldPrice={product.oldPrice}
        widths={product.widths}
        selectedWidth={product.selectedWidth}
        finishes={product.finishes}
        specs={product.specs}
        badge={product.badge}
      />
      <EditorialSection />
      <CustomerReviews />
      <RelatedProducts />
    </div>
  );
}
