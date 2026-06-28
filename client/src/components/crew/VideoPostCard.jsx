import { Heart, MessageCircle, Repeat2, MoreHorizontal, Play } from "lucide-react";

export default function VideoPostCard() {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl overflow-hidden">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff2d78] to-[#7c3aed] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">@KAIRO_SKATES</div>
              <div className="text-[9px] font-medium text-[#666]">2 HOURS AGO</div>
            </div>
          </div>
          <button className="text-[#666] hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <p className="text-sm font-bold text-white leading-relaxed mb-4">
          Just unlocked the perfect line through the east side. Concrete's smooth, rails are waxed, and the vibes are immaculate.
          <span className="text-[#ff2d78]"> #EastSideElite</span>
          <span className="text-[#00e5ff]"> #SkateCulture</span>
        </p>
      </div>

      <div className="relative mx-5 mb-0">
        <div className="h-44 md:h-52 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-transparent to-transparent" />
          <div className="relative w-full h-full flex items-center justify-center">
            <svg width="100" height="80" viewBox="0 0 200 120" className="opacity-30">
              <rect x="10" y="10" width="180" height="100" rx="8" fill="none" stroke="#ff2d78" strokeWidth="0.5" />
              <path d="M30 80 L50 40 L70 80 Z" fill="#ff2d78" opacity="0.3" />
              <path d="M80 70 L120 30 L140 80 Z" fill="#00e5ff" opacity="0.2" />
              <circle cx="160" cy="50" r="15" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#ff2d78] flex items-center justify-center shadow-lg shadow-[#ff2d78]/30 hover:scale-105 transition-transform">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/60 rounded-full px-2.5 py-1">
            0:45
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#ff2d78] transition-colors">
            <Heart size={15} />
            42 PROPS
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#00e5ff] transition-colors">
            <MessageCircle size={15} />
            8 COMMENTS
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#7c3aed] transition-colors">
            <Repeat2 size={15} />
            REPOST
          </button>
        </div>
      </div>
    </div>
  );
}
