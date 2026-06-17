import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-4">
      <div className="bg-[#EF476F] rounded-t-[2rem] p-8 md:p-12 text-[#121212]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <div className="text-2xl font-black">4WHEELS</div>
            <p className="text-[10px] uppercase font-medium tracking-tight mt-2 opacity-80 max-w-xs">
              Built for the concrete gallery. Every scratch tells a story.
            </p>
            <p className="text-[9px] uppercase tracking-tight mt-4 opacity-60">
              &copy; 2026 4WHEELS SKATE CO.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">
              COLLECTIONS
            </h4>
            <div className="flex flex-col gap-2 text-[10px] font-bold uppercase text-[#121212]/80">
              <Link to="/shop">SHOP</Link>
              <Link to="/">STORY</Link>
              <Link to="/retailers">RETAILERS</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">
              LEGAL
            </h4>
            <div className="flex flex-col gap-2 text-[10px] font-bold uppercase text-[#121212]/80">
              <Link to="/privacy">PRIVACY</Link>
              <Link to="/terms">TERMS</Link>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">
                SOCIAL
              </h4>
              <div className="flex flex-col gap-2 text-[10px] font-bold uppercase text-[#121212]/80">
                <Link to="#">INSTAGRAM</Link>
                <Link to="#">YOUTUBE</Link>
              </div>
            </div>
            <div className="mt-6 md:mt-0 self-start md:self-end">
              <span className="bg-black text-white text-[9px] font-black uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                CONTACT CREW
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
