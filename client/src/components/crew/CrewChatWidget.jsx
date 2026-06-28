import { Settings, Paperclip, Smile, AtSign, ArrowUp } from "lucide-react";

const messages = [
  { user: "@SKATE_OR_DIE", text: "Anyone hitting the east side tonight?", time: "2m ago", color: "text-[#ff2d78]" },
  { user: "@NEON_VALLEY", text: "I'm rolling through at 8. Got the new deck.", time: "1m ago", color: "text-[#00e5ff]" },
  { user: "@SKATE_OR_DIE", text: "Sick. Meet at the ramp?", time: "45s ago", color: "text-[#ff2d78]" },
  { user: "@KAIRO_SKATES", text: "Just scouted a new spot. Sending location.", time: "just now", color: "text-[#7c3aed]" },
];

export default function CrewChatWidget() {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider">CREW RADIO / LIVE CHAT</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-[#00e5ff]">4 RIDERS ON-AIR</span>
            <button className="text-[#888] hover:text-white transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-5 space-y-3 min-h-[240px] md:min-h-[280px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase ${msg.color}`}>{msg.user}</span>
              <span className="text-[8px] text-[#888]">{msg.time}</span>
            </div>
            <div className="bg-[#1a1a1a] rounded-full px-4 py-2 inline-block max-w-[90%]">
              <span className="text-[11px] font-medium text-white">{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-5 border-t border-[#2a2a2a]">
        <div className="relative">
          <input
            type="text"
            placeholder="SEND A MESSAGE TO THE CREW..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-[11px] font-medium text-white placeholder:text-[#888] px-4 py-3 pr-12 outline-none"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ff2d78] flex items-center justify-center hover:opacity-90 transition-all">
            <ArrowUp size={14} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button className="text-[#888] hover:text-white transition-colors"><Paperclip size={13} /></button>
          <button className="text-[#888] hover:text-white transition-colors"><Smile size={13} /></button>
          <button className="text-[#888] hover:text-white transition-colors"><AtSign size={13} /></button>
        </div>
      </div>
    </div>
  );
}
