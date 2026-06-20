import wheel from "../../assets/images/wheel.png";
import shadow from "../../assets/images/shadow.png";


export default function OurDnaSection() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-12 px-8 py-16">
      <div className="flex gap-4 w-full md:w-1/2">
        <div className="w-1/2 aspect-square bg-[#282826] rounded-2xl overflow-hidden" >
          <img src={wheel} alt="wheels" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 aspect-square bg-[#282826] rounded-2xl overflow-hidden" >
          <img src={shadow} alt="shadow" className="w-full h-full object-cover"  />
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <span className="text-[#EF476F] tracking-widest text-[10px] mb-2 block font-bold uppercase">
          OUR DNA
        </span>
        <h2 className="text-4xl font-black text-[#F8F9FA] tracking-tight leading-none mb-4 uppercase">
          NO RULES. JUST RUBBER.
        </h2>
        <p className="text-xs text-[#737373] max-w-md leading-relaxed mb-6">
          We don&apos;t follow trends. We set them. Every pair of 4WHEELS is
          forged in the intersection of street art, skate culture, and raw
          architectural brutalism. No compromises. No apologies.
        </p>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-teal-400">#BRUTALIST</span>
          <span className="text-[#EF476F]">#STREETBORN</span>
          <span className="text-[#6A4C93]">#FOURWHEELS</span>
        </div>
      </div>
    </section>
  );
}
