import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import ShippingForm from "../../../components/checkout/ShippingForm";
import ShippingMethodSelector from "../../../components/checkout/ShippingMethodSelector";
import { addressesApi } from "../../../api/addresses.js";
import { ordersApi } from "../../../api/orders.js";

export default function ShippingPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    ordersApi
      .getShippingMethods()
      .then((res) => {
        const activeMethods = res.data || [];
        setMethods(activeMethods);
        if (activeMethods.length > 0) {
          setSelectedMethod(activeMethods[0]);
          localStorage.setItem("checkout_shipping_method", JSON.stringify(activeMethods[0]));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    localStorage.setItem("checkout_shipping_method", JSON.stringify(method));
    // Trigger custom event so OrderSummary updates instantly
    window.dispatchEvent(new Event("storage"));
  };

  const handleSubmit = async () => {
    setError("");
    const { firstName, lastName, street, city, state, zip } = form;

    if (!firstName || !lastName || !street || !city || !state || !zip) {
      setError("Please fill out all shipping fields.");
      return;
    }

    if (!selectedMethod) {
      setError("Please select a shipping method.");
      return;
    }

    try {
      const addressRes = await addressesApi.create({
        first_name: firstName,
        last_name: lastName,
        street,
        city,
        state,
        zip_code: zip,
      });
      
      const addressId = addressRes.data?.id;
      if (addressId) {
        localStorage.setItem("checkout_address_id", addressId);
        navigate("/checkout/payment");
      } else {
        setError("Failed to create shipping address. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while saving address.");
    }
  };

  return (
    <div className="bg-[#0C0C0C] min-h-screen pt-16">
      <StepTimeline currentStep={1} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4">
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-2xl text-xs text-red-400 font-bold uppercase tracking-wider">
              {error}
            </div>
          )}
          <ShippingForm form={form} onChange={handleChange} />
          <ShippingMethodSelector
            methods={methods}
            selected={selectedMethod?.id}
            onSelect={handleSelectMethod}
          />
        </div>
        <aside className="lg:col-span-5">
          <OrderSummary
            ctaText="CONTINUE TO PAYMENT"
            onClick={handleSubmit}
          />
        </aside>
      </div>
    </div>
  );
}
