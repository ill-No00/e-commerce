import { useEffect, useState } from "react";
import { Settings, Paperclip, Smile, AtSign, ArrowUp } from "lucide-react";
import { crewApi } from "../../api/crew.js";

function formatTimeAgo(dateStr) {
  if (!dateStr) return undefined;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

const userColors = ["text-[#ff2d78]", "text-[#00e5ff]", "text-[#7c3aed]", "text-[#f59e0b]"];

export default function CrewChatWidget({ crewId }) {
  const [messages, setMessages] = useState(undefined);

  useEffect(() => {
    if (!crewId) return;
    crewApi
      .getChat(crewId)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages(undefined));
  }, [crewId]);

  const onlineCount = messages?.length;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider">CREW RADIO / LIVE CHAT</span>
          </div>
          <div className="flex items-center gap-3">
            {onlineCount != null && (
              <span className="text-[9px] font-bold text-[#00e5ff]">{onlineCount} MESSAGES</span>
            )}
            <button className="text-[#888] hover:text-white transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-5 space-y-3 min-h-[240px] md:min-h-[280px] overflow-y-auto">
        {!messages?.length && (
          <p className="text-[11px] text-[#888]">No messages yet</p>
        )}
        {messages?.map((msg, i) => (
          <div key={msg.id || i}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase ${userColors[i % userColors.length]}`}>
                @{msg.profiles?.username ?? "unknown"}
              </span>
              <span className="text-[8px] text-[#888]">{formatTimeAgo(msg.created_at) ?? "—"}</span>
            </div>
            <div className="bg-[#1a1a1a] rounded-full px-4 py-2 inline-block max-w-[90%]">
              <span className="text-[11px] font-medium text-white">{msg.body ?? "—"}</span>
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
