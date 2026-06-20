import { useEffect } from "react";
import heroImage from "../../assets/images/hero_img_est.png";
import { useScreenSize } from "../../hooks/screen_size";
import logger from "../../utils/logger.js"


export default function HeroSection() {

  const size = useScreenSize();

  
  
  logger.log(size)

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8 py-12 min-h-screen">
      <div>
        <h1 className="lg:text-[140px] text-9xl font-black text-[#F8F9FA] tracking-tighter uppercase">
          BORN
        </h1>
        <h1 className="lg:text-[140px] text-9xl font-black text-[#EF476F] tracking-tighter uppercase">
          IN THE
        </h1>
        <h1 className="lg:text-[140px] text-9xl font-black text-[#F8F9FA] tracking-tighter uppercase">
          STREETS
        </h1>
        <p className="mt-6 text-md text-[#737373] leading-relaxed max-w-sm">
          Inspired by the raw energy of street culture, 4WHEELS brings you
          footwear that blends brutalist design with urban functionality.
        </p>
      </div>

      {
        size > 1190 ?
      
      <div className="relative w-full pl-20">
        
        <div className="w-[80%] aspect-4/5 bg-[#282826] rounded-3xl overflow-hidden" >
          <img className="w-full h-full object-cover" src={heroImage} alt="hero-image" />
        </div>
        

        <div className="absolute -bottom-10 left-4 bg-[#6A4C93] text-[#F8F9FA] font-bold text-3xl px-20 py-8  rounded-xl shadow-lg uppercase tracking-wider">
          EST. 2024
        </div>
      </div>
      :
      <></>
      }
    </section>
  );
}
