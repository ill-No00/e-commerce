import HeroSection from "../../components/landing/HeroSection";
import OurDnaSection from "../../components/landing/OurDnaSection";
import AsymmetricalGrid from "../../components/landing/AsymmetricalGrid";
import CtaSection from "../../components/landing/CtaSection";

export default function LandingPage() {
  return (
    <div className="bg-[#121212] min-h-screen pt-16">
      <HeroSection />
      <OurDnaSection />
      <AsymmetricalGrid />
      <CtaSection />
    </div>
  );
}
