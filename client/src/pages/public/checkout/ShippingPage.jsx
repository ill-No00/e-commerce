import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import ShippingForm from "../../../components/checkout/ShippingForm";
import ShippingMethodSelector from "../../../components/checkout/ShippingMethodSelector";

export default function ShippingPage() {
  return (
    <div className="bg-[#0C0C0C] min-h-screen pt-16">
      <StepTimeline currentStep={1} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4">
        <div className="lg:col-span-7">
          <ShippingForm />
          <ShippingMethodSelector />
        </div>
        <aside className="lg:col-span-5">
          <OrderSummary ctaText="CONTINUE TO PAYMENT" ctaTo="/checkout/payment" />
        </aside>
      </div>
    </div>
  );
}
