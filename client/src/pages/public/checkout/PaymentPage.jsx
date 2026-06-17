import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import PaymentForm from "../../../components/checkout/PaymentForm";

export default function PaymentPage() {
  return (
    <div className="bg-[#0C0C0C] min-h-screen pt-16">
      <StepTimeline currentStep={2} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 py-4">
        <div className="lg:col-span-7">
          <PaymentForm />
        </div>
        <aside className="lg:col-span-5">
          <OrderSummary ctaText="CONTINUE TO REVIEW" ctaTo="/checkout/review" />
        </aside>
      </div>
    </div>
  );
}
