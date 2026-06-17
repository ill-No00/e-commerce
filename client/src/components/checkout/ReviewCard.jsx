export default function ReviewCard({ title, children }) {
  return (
    <div className="bg-[#121212] rounded-3xl border border-neutral-900 p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
        <button className="text-[9px] font-bold text-[#6A4C93] uppercase tracking-wider hover:text-[#EF476F] transition-colors cursor-pointer flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          EDIT
        </button>
      </div>
      {children}
    </div>
  );
}
