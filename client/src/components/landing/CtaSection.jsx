export default function CtaSection() {
  return (
    <section className="flex flex-col items-center text-center justify-center py-24 px-8">
      <h2 className="text-5xl md:text-6xl font-black text-[#F8F9FA] uppercase tracking-tight">
        JOIN THE
      </h2>
      <h2
        className="text-5xl md:text-6xl font-black uppercase tracking-widest text-transparent"
        style={{ WebkitTextStroke: "2px #6A4C93" }}
      >
        CREW
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <a
          href="/shop"
          className="bg-[#EF476F] text-[#121212] text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-full hover:scale-105 transition-transform"
        >
          EXPLORE THE SHOP
        </a>
        <a
          href="/"
          className="border border-[#EF476F] text-[#F8F9FA] text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#EF476F]/10 transition-colors"
        >
          FOLLOW THE STORY
        </a>
      </div>
    </section>
  );
}
