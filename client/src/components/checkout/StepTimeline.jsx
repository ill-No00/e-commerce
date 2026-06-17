const steps = [
  { num: 1, label: "SHIPPING" },
  { num: 2, label: "PAYMENT" },
  { num: 3, label: "REVIEW" },
];

export default function StepTimeline({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-0 px-8 py-8">
      {steps.map((step, i) => {
        const isCompleted = step.num < currentStep;
        const isActive = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive || isCompleted
                    ? "bg-[#EF476F] text-white"
                    : "bg-transparent border border-neutral-700 text-[#737373]"
                }`}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                  isActive || isCompleted ? "text-[#F8F9FA]" : "text-[#737373]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`w-32 h-0.5 mx-4 mb-6 transition-colors ${
                  step.num < currentStep ? "bg-[#EF476F]" : "bg-neutral-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
