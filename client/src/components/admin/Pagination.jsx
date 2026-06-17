export default function Pagination({ current = 1, total = 3 }) {
  return (
    <div className="flex justify-center items-center gap-6 py-6 text-[10px] font-bold uppercase tracking-widest text-[#888]">
      <span className="hover:text-white transition-colors cursor-pointer">← PREV</span>
      <div className="flex items-center gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              i + 1 === current
                ? "text-white border-b border-[#ff2d78] pb-0.5"
                : "hover:text-white cursor-pointer"
            }
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
      <span className="hover:text-white transition-colors cursor-pointer">NEXT →</span>
    </div>
  );
}
