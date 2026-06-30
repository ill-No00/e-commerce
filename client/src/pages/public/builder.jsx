import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuilderSidebar from "../../components/builder/BuilderSidebar";
import LiveBuildPanel from "../../components/builder/LiveBuildPanel";
import StepDeck from "../../components/builder/steps/StepDeck";
import StepTrucks from "../../components/builder/steps/StepTrucks";
import StepBearings from "../../components/builder/steps/StepBearings";
import StepHardware from "../../components/builder/steps/StepHardware";
import StepGripTape from "../../components/builder/steps/StepGripTape";
import StepWheels from "../../components/builder/steps/StepWheels";
import StepReview from "../../components/builder/steps/StepReview";

const stepLabels = {
  1: "DECK",
  2: "TRUCKS",
  3: "WHEELS",
  4: "BEARINGS",
  5: "HARDWARE",
  6: "GRIP TAPE",
  7: "REVIEW",
};

const hasSelectionForStep = (step, selections, selectedBolt) => {
  switch (step) {
    case 1: return !!selections.DECK;
    case 2: return !!selections.TRUCKS;
    case 3: return !!selections.WHEELS;
    case 4: return !!selections.BEARINGS;
    case 5: return !!selectedBolt;
    case 6: return !!selections["GRIP TAPE"];
    case 7: return true;
    default: return false;
  }
};

export default function BuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    DECK: null,
    TRUCKS: null,
    WHEELS: null,
    BEARINGS: null,
    HARDWARE: null,
    "GRIP TAPE": null,
  });
  const [selectedBolt, setSelectedBolt] = useState(null);
  const [selectedRiser, setSelectedRiser] = useState("NO RISER");

  const handleSelect = (category) => (value) => {
    if (selections[category] === value) return;
    setSelections((prev) => ({ ...prev, [category]: value }));
  };

  const canProceed = hasSelectionForStep(currentStep, selections, selectedBolt);

  const goNext = () => {
    if (!canProceed) return;
    if (currentStep < 7) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (num) => {
    setCurrentStep(num);
    window.scrollTo(0, 0);
  };

  const total = (() => {
    const prices = {
      DECK: selections.DECK ? 65 : 0,
      TRUCKS: selections.TRUCKS ? 65 : 0,
      WHEELS: selections.WHEELS ? 42 : 0,
      BEARINGS: selections.BEARINGS ? 18 : 0,
      HARDWARE: selections.HARDWARE ? 5 : 0,
      "GRIP TAPE": selections["GRIP TAPE"] ? 10 : 0,
    };
    return Object.values(prices).reduce((a, b) => a + b, 0);
  })();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepDeck selected={selections.DECK} onSelect={handleSelect("DECK")} />;
      case 2:
        return <StepTrucks selected={selections.TRUCKS} onSelect={handleSelect("TRUCKS")} />;
      case 3:
        return <StepWheels selected={selections.WHEELS} onSelect={handleSelect("WHEELS")} />;
      case 4:
        return <StepBearings selected={selections.BEARINGS} onSelect={handleSelect("BEARINGS")} />;
      case 5:
        return (
          <StepHardware
            selectedBolt={selectedBolt}
            selectedRiser={selectedRiser}
            onSelectBolt={(v) => {
              setSelectedBolt(v);
              setSelections((prev) => ({ ...prev, HARDWARE: v }));
            }}
            onSelectRiser={setSelectedRiser}
          />
        );
      case 6:
        return <StepGripTape selected={selections["GRIP TAPE"]} onSelect={handleSelect("GRIP TAPE")} />;
      case 7:
        return <StepReview selections={selections} />;
      default:
        return null;
    }
  };

  const nextLabel = stepLabels[currentStep + 1];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <BuilderSidebar currentStep={currentStep} selections={selections} onStepClick={goToStep} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#2a2a2a] bg-[#0d0d0d]">
          <div className="flex items-center gap-8">
            <div className="text-[#ff2d78] text-xl font-black italic tracking-wider">4WHEELS</div>
            <div className="flex items-center gap-6 text-[10px] font-semibold tracking-widest uppercase">
              <span className="text-white">BUILDER</span>
              <span className="text-[#444]">SHOP</span>
              <span className="text-[#444]">STORY</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="text-[10px] font-bold tracking-widest uppercase text-[#ff2d78] hover:brightness-110 transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            EXIT BUILDER
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-4">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between px-8 py-5 border-t border-[#2a2a2a] bg-[#0d0d0d]">
          <div>
            {currentStep > 1 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#888] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                BACK
              </button>
            )}
          </div>

          <div>
            {currentStep < 7 ? (
              <button
                onClick={goNext}
                disabled={!canProceed}
                className={`text-[11px] font-black tracking-widest uppercase px-8 py-3 rounded-full transition-all flex items-center gap-2 ${
                  canProceed
                    ? "bg-[#ff2d78] text-white hover:brightness-110"
                    : "bg-[#2a2a2a] text-[#666] opacity-40 cursor-not-allowed"
                }`}
              >
                NEXT STEP: {nextLabel || ""}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => navigate("/cart")}
                className="text-[11px] font-black tracking-widest uppercase px-8 py-3 rounded-full bg-[#ff2d78] text-white hover:brightness-110 transition-all flex items-center gap-2"
              >
                PROCEED TO DEPLOYMENT
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <LiveBuildPanel currentStep={currentStep} selections={selections} total={total} />
    </div>
  );
}
