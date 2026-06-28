import { Video, Camera, ArrowUp } from "lucide-react";

export default function CreatePostCard() {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#ff2d78] shrink-0" />
        <div className="flex-1 min-w-0">
          <textarea
            placeholder="WHAT'S THE MOVE? SHARE A CLIP OR SPOT..."
            className="w-full bg-transparent text-sm font-bold text-white uppercase tracking-tight placeholder:text-[#666] placeholder:font-bold resize-none h-14 md:h-16 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest hover:opacity-80 transition-all px-3 py-1.5 rounded-full bg-[#7c3aed]/10">
            <Video size={14} />
            DROP A VIDEO
          </button>
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#00e5ff] uppercase tracking-widest hover:opacity-80 transition-all px-3 py-1.5 rounded-full bg-[#00e5ff]/10">
            <Camera size={14} />
            SNAP A PHOTO
          </button>
        </div>

        <button className="flex items-center gap-2 text-[11px] font-black text-white bg-[#ff2d78] rounded-full px-5 py-2.5 uppercase tracking-widest hover:opacity-90 transition-all">
          DEPLOY
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
}
