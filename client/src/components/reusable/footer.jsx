import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-4">
      <div className="bg-gradient-to-r from-[#ff2d78] to-[#c2185b] rounded-t-[2rem] p-6 md:p-8 text-[#121212]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-black">4WHEELS</div>
            <p className="text-[9px] uppercase font-medium tracking-tight mt-2 opacity-70">
              &copy; 2026 4WHEELS SKATE CO. BUILT FOR THE CONCRETE GALLERY.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider">
            <Link to="/privacy" className="hover:underline">PRIVACY</Link>
            <Link to="/terms" className="hover:underline">TERMS</Link>
            <Link to="/retailers" className="hover:underline">RETAILERS</Link>
            <Link to="/contact" className="underline">CONTACT</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
