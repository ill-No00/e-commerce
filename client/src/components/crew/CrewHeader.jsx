import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { crewApi } from "../../api/crew.js";

const avatarColors = ["bg-[#ff2d78]", "bg-[#7c3aed]", "bg-[#00e5ff]", "bg-[#888]", "bg-[#1a1a1a]"];

export default function CrewHeader({ crew, crewId }) {
  const [members, setMembers] = useState(undefined);

  useEffect(() => {
    if (!crewId) return;
    crewApi
      .getMembers(crewId)
      .then((res) => setMembers(res.data))
      .catch(() => setMembers(undefined));
  }, [crewId]);

  const onlineCount = members?.filter((m) => m.is_online).length;
  const extraCount = members && members.length > 5 ? members.length - 5 : undefined;

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] md:text-[32px] font-black italic text-[#ff2d78] uppercase tracking-tight leading-none">
            {crew?.name ?? "—"}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {members?.length > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((_, i) => (
                    <div key={i} className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-[#0d0d0d]`} />
                  ))}
                </div>
                {extraCount != null && extraCount > 0 && (
                  <span className="ml-2 text-[10px] font-bold text-[#888] bg-[#141414] border border-[#2a2a2a] rounded-full px-2.5 py-0.5">
                    +{extraCount}
                  </span>
                )}
              </div>
            )}

            {onlineCount != null && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <Users size={14} className="text-[#00e5ff]" />
                <span className="text-white">ACTIVE RIDERS:</span>
                <span className="text-[#00e5ff]">{onlineCount} ONLINE</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {crew?.cred_points != null && (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-full px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] font-bold text-[#888] uppercase tracking-widest">CREW CRED:</span>
              <span className="text-sm md:text-base font-black text-[#00e5ff]">{crew.cred_points.toLocaleString()}</span>
            </div>
          )}

          {crew?.rank && (
            <div className="bg-[#141414] border border-[#2a2a2a] border-t-[3px] border-t-[#ff2d78] rounded-2xl px-4 md:px-5 py-2.5 md:py-3">
              <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-0.5">RANK</div>
              <div className="text-sm md:text-base font-black italic text-white uppercase tracking-tight">{crew.rank}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
