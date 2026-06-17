export default function AsymmetricalGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-12">
      <div className="md:col-span-7 w-full aspect-[4/5] bg-[#282826] rounded-3xl p-8 flex flex-col justify-end relative">
        <h3 className="text-2xl font-black text-[#F8F9FA] uppercase mb-2">
          THE GALLERY
        </h3>
        <p className="text-[11px] text-[#737373] max-w-xs">
          Explore our curated collection of street photography capturing the
          essence of urban culture and movement.
        </p>
      </div>

      <div className="md:col-span-5">
        <div className="bg-[#6A4C93] rounded-3xl p-8 flex items-center justify-center min-h-[220px]">
          <p className="text-lg text-[#F8F9FA] tracking-wide uppercase leading-snug font-bold">
            &ldquo;STREET SKATING ISN&apos;T A HOBBY, IT&apos;S A RADICAL
            RECLAMATION OF PUBLIC SPACE.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-[#282826] rounded-3xl aspect-square" />
          <div className="bg-[#EF476F] rounded-3xl p-6 flex flex-col justify-between aspect-square">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#121212]"
            >
              <path
                d="M4 28L16 4L28 28"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 18H22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[#121212] font-black text-sm uppercase tracking-tight">
              PURE FLOW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
