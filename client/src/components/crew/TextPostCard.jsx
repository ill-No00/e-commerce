import { MapPin } from "lucide-react";

export default function TextPostCard() {
  return (
    <div className="bg-[#141414] rounded-3xl overflow-hidden border border-[#2a2a2a] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff2d78] via-[#7c3aed] to-[#00e5ff]" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c3aed] shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">@NEON_VALLEY</div>
            <div className="text-[9px] font-medium text-[#666]">5 HOURS AGO</div>
          </div>
        </div>

        <p className="text-base md:text-lg font-black italic text-white leading-relaxed mb-4">
          "New spot unlocked near the docks. No security after 9PM. Who's in?"
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] font-bold text-[#666] uppercase tracking-wider">
            <MapPin size={11} />
            EAST SIDE DOCKS
          </div>
          <span className="text-[9px] font-bold text-[#ff2d78] bg-[#ff2d78]/10 rounded-full px-3 py-1 uppercase tracking-wider">SPOTTED</span>
          <span className="text-[9px] font-bold text-[#00e5ff] bg-[#00e5ff]/10 rounded-full px-3 py-1 uppercase tracking-wider">NIGHT SESSION</span>
        </div>
      </div>
    </div>
  );
}
