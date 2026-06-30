import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import ReviewCard from "../../../components/checkout/ReviewCard";
import { cartApi } from "../../../api/cart.js";
import { ordersApi } from "../../../api/orders.js";
import { addressesApi } from "../../../api/addresses.js";
import { paymentMethodsApi } from "../../../api/paymentMethods.js";

export default function ReviewPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch Cart
    cartApi
      .get()
      .then((res) => setCart(res.data))
      .catch(() => {});

    // 2. Read Shipping Method
    const savedMethodStr = localStorage.getItem("checkout_shipping_method");
    if (savedMethodStr) {
      try {
        setShippingMethod(JSON.parse(savedMethodStr));
      } catch {}
    }

    // 3. Fetch saved Address details
    const savedAddressId = localStorage.getItem("checkout_address_id");
    if (savedAddressId) {
      addressesApi
        .list()
        .then((res) => {
          const matched = (res.data || []).find((a) => a.id === savedAddressId);
          setAddress(matched);
        })
        .catch(() => {});
    }

    // 4. Fetch saved Payment Method details
    const savedPaymentMethodId = localStorage.getItem("checkout_payment_method_id");
    if (savedPaymentMethodId) {
      paymentMethodsApi
        .list()
        .then((res) => {
          const matched = (res.data || []).find((pm) => pm.id === savedPaymentMethodId);
          setPaymentMethod(matched);
        })
        .catch(() => {});
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (submitting) return;
    setError("");

    const addressId = localStorage.getItem("checkout_address_id");
    const paymentMethodId = localStorage.getItem("checkout_payment_method_id");

    if (!addressId || !paymentMethodId || !shippingMethod || !cart) {
      setError("Missing checkout information. Please go back and re-enter details.");
      return;
    }

    const items = cart.cart_items || [];
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const subtotal_cents = items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);
    const shipping_cents = shippingMethod.price_cents || 0;
    const tax_cents = Math.round(subtotal_cents * 0.085);
    const total_cents = subtotal_cents + shipping_cents + tax_cents;

    setSubmitting(true);
    try {
      await ordersApi.place({
        shipping_address_id: addressId,
        payment_method_id: paymentMethodId,
        shipping_method_id: shippingMethod.id,
        subtotal_cents,
        shipping_cents,
        tax_cents,
        total_cents,
        items: items.map((item) => ({
          product_name: item.product_variants?.products?.name || item.product_name || "Product",
          variant_label: item.product_variants?.size_label || item.variant_label || "",
          variant_id: item.variant_id || item.product_variants?.id,
          quantity: item.quantity,
          unit_price_cents: item.unit_price_cents,
        })),
      });

      // Clear local storage
      localStorage.removeItem("checkout_address_id");
      localStorage.removeItem("checkout_payment_method_id");
      localStorage.removeItem("checkout_shipping_method");

      navigate("/account/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place the order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0C0C0C] min-h-screen pt-16">
      <StepTimeline currentStep={3} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4">
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 leading-none">
            FINAL{" "}
            <span className="text-[#EF476F]">VERIFICATION</span>
          </h1>
          <p className="text-[11px] text-[#737373] mb-8 max-w-lg">
            Please review your order details carefully before placing your
            order. You can edit any section by clicking the edit button.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-2xl text-xs text-red-400 font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <ReviewCard title="SHIPPING ADDRESS" onEditClick={() => navigate("/checkout/shipping")}>
              {address ? (
                <div className="text-xs text-[#F8F9FA] space-y-1">
                  <p className="font-bold">{address.first_name} {address.last_name}</p>
                  <p className="text-[#737373]">{address.street}</p>
                  <p className="text-[#737373]">{address.city}, {address.state} {address.zip_code}</p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 uppercase font-black">No address details selected</p>
              )}
            </ReviewCard>

            <ReviewCard title="PAYMENT METHOD" onEditClick={() => navigate("/checkout/payment")}>
              {paymentMethod ? (
                <div className="text-xs text-[#F8F9FA] space-y-1">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6A4C93">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" stroke="#6A4C93" strokeWidth="0.5" />
                      <line x1="8" y1="14" x2="16" y2="14" stroke="#6A4C93" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-bold uppercase">
                      {paymentMethod.brand} ending in {paymentMethod.last4}
                    </span>
                  </div>
                  <p className="text-[#737373] ml-7">Expiry {paymentMethod.expiry_month.toString().padStart(2, "0")}/{paymentMethod.expiry_year.toString().slice(-2)}</p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 uppercase font-black">No payment details selected</p>
              )}
            </ReviewCard>

            <ReviewCard title="SHIPPING METHOD" onEditClick={() => navigate("/checkout/shipping")}>
              {shippingMethod ? (
                <div className="text-xs text-[#F8F9FA] space-y-1">
                  <p className="font-bold text-[#EF476F] uppercase">
                    {shippingMethod.name}
                  </p>
                  <p className="text-[#737373]">
                    {shippingMethod.price_cents === 0 ? "FREE" : `$${(shippingMethod.price_cents / 100).toFixed(2)}`}
                  </p>
                  <p className="text-[#737373]">
                    Expected arrival: {shippingMethod.min_business_days}–{shippingMethod.max_business_days} Business Days
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 uppercase font-black">No shipping method selected</p>
              )}
            </ReviewCard>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <OrderSummary
            ctaText={submitting ? "PLACING ORDER..." : "PLACE ORDER"}
            onClick={handlePlaceOrder}
          />
        </aside>
      </div>
    </div>
  );
}
