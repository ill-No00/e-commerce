export default function EditorialSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 px-8 py-16 border-t border-neutral-900 mt-12">
      <div className="md:col-span-4">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">
          THE CONCRETE{" "}
          <span className="text-[#EF476F]">MASTERPIECE.</span>
        </h2>
      </div>
      <div className="md:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <p className="text-xs text-[#737373] leading-relaxed">
            Every curve, every contour of the Neon Drift EVO-1 is born from the
            raw friction between urethane and asphalt. We don't design in a
            studio — we prototype on abandoned basketball courts, drainage
            ditches, and handrails that have been worn smooth by generations of
            steel grind plates.
          </p>
          <p className="text-xs text-[#737373] leading-relaxed">
            The 7-ply maple construction is cold-pressed at 2000 PSI, delivering
            a pop that resonates through your tibia on every ollie. This isn't
            just a deck — it's a weaponized plank of liberation engineered for
            the concrete jungle.
          </p>
        </div>
      </div>
    </section>
  );
}
