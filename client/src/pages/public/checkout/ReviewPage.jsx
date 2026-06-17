import StepTimeline from "../../../components/checkout/StepTimeline";
import OrderSummary from "../../../components/checkout/OrderSummary";
import ReviewCard from "../../../components/checkout/ReviewCard";

export default function ReviewPage() {
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

          <div className="flex flex-col gap-4">
            <ReviewCard title="SHIPPING ADDRESS">
              <div className="text-xs text-[#F8F9FA] space-y-1">
                <p className="font-bold">Tony Alva</p>
                <p className="text-[#737373]">1234 Venice Blvd</p>
                <p className="text-[#737373]">Los Angeles, CA 90210</p>
              </div>
            </ReviewCard>

            <ReviewCard title="PAYMENT METHOD">
              <div className="text-xs text-[#F8F9FA] space-y-1">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#6A4C93">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" stroke="#6A4C93" strokeWidth="0.5" />
                    <line x1="8" y1="14" x2="16" y2="14" stroke="#6A4C93" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-bold">Visa ending in 4242</span>
                </div>
                <p className="text-[#737373] ml-7">Expiry 08/28</p>
              </div>
            </ReviewCard>

            <ReviewCard title="SHIPPING METHOD">
              <div className="text-xs text-[#F8F9FA] space-y-1">
                <p className="font-bold text-[#EF476F] uppercase">
                  Street Standard Delivery
                </p>
                <p className="text-[#737373]">FREE</p>
                <p className="text-[#737373]">Expected arrival: 2–3 Business Days</p>
              </div>
            </ReviewCard>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <OrderSummary ctaText="PLACE ORDER" ctaTo="/" />
        </aside>
      </div>
    </div>
  );
}
