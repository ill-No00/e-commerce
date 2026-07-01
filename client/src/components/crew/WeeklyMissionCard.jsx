import { useEffect, useState } from "react";
import { crewApi } from "../../api/crew.js";

export default function WeeklyMissionCard({ crewId }) {
  const [mission, setMission] = useState(undefined);

  useEffect(() => {
    if (!crewId) return;
    crewApi
      .getMissions(crewId)
      .then((res) => setMission(res.data?.[0]))
      .catch(() => setMission(undefined));
  }, [crewId]);

  if (!mission) return null;

  const progress = mission.target_value
    ? Math.round((mission.current_value / mission.target_value) * 100)
    : undefined;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-5 bg-[#ff2d78] rounded-full" />
        <h3 className="text-[13px] font-black italic text-[#ff2d78] uppercase tracking-tight">WEEKLY MISSION</h3>
      </div>

      {mission.description && (
        <p className="text-[12px] font-medium text-[#888] leading-relaxed mb-5">
          {mission.description}
        </p>
      )}

      {progress != null && (
        <>
          <div className="w-full h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#ff2d78] to-[#7c3aed] rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">PROGRESS:</span>
              <span className="text-[11px] font-black text-white ml-1">{progress}%</span>
            </div>
            {mission.target_value != null && (
              <div className="text-[11px] font-bold text-[#00e5ff]">
                {mission.current_value ?? 0} / {mission.target_value}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
