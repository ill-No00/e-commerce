export default function EditorialSection({ description }) {
  if (!description) return null;

  const paragraphs = description.split("\n\n").filter(Boolean);

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
          {paragraphs.map((p, i) => (
            <p key={i} className="text-xs text-[#737373] leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
