import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import PaymentForm from "../../../components/checkout/PaymentForm";
import { paymentMethodsApi } from "../../../api/paymentMethods.js";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    const { cardholderName, cardNumber, expiry, cvv } = form;

    if (!cardholderName || !cardNumber || !expiry || !cvv) {
      setError("Please fill out all payment fields.");
      return;
    }

    const cleanedCard = cardNumber.replace(/\s+/g, "");
    if (cleanedCard.length < 13 || cleanedCard.length > 19) {
      setError("Please enter a valid card number.");
      return;
    }

    const expiryParts = expiry.split("/");
    if (expiryParts.length !== 2) {
      setError("Please enter expiry in MM/YY format.");
      return;
    }

    const month = parseInt(expiryParts[0], 10);
    let year = parseInt(expiryParts[1], 10);
    if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
      setError("Please enter a valid expiry date.");
      return;
    }

    if (year < 100) {
      year += 2000;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      setError("Please enter a valid security code.");
      return;
    }

    try {
      const last4 = cleanedCard.slice(-4);
      const brand = cleanedCard.startsWith("4") ? "VISA" : "MASTERCARD";
      
      const paymentRes = await paymentMethodsApi.create({
        provider: "STRIPE",
        provider_token: "tok_mock_" + Math.random().toString(36).slice(2, 8),
        brand,
        last4,
        expiry_month: month,
        expiry_year: year,
        cardholder_name: cardholderName,
      });

      const paymentMethodId = paymentRes.data?.id;
      if (paymentMethodId) {
        localStorage.setItem("checkout_payment_method_id", paymentMethodId);
        navigate("/checkout/review");
      } else {
        setError("Failed to validate card. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while saving payment method.");
    }
  };

  return (
    <div className="bg-[#0C0C0C] min-h-screen pt-16">
      <StepTimeline currentStep={2} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4">
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-2xl text-xs text-red-400 font-bold uppercase tracking-wider">
              {error}
            </div>
          )}
          <PaymentForm form={form} onChange={handleChange} />
        </div>
        <aside className="lg:col-span-5">
          <OrderSummary
            ctaText="CONTINUE TO REVIEW"
            onClick={handleSubmit}
          />
        </aside>
      </div>
    </div>
  );
}
