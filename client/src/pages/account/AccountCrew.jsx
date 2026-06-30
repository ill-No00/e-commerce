import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { crewApi } from "../../api/crew.js";
import CrewHeader from "../../components/crew/CrewHeader";
import CreatePostCard from "../../components/crew/CreatePostCard";
import VideoPostCard from "../../components/crew/VideoPostCard";
import TextPostCard from "../../components/crew/TextPostCard";
import CrewChatWidget from "../../components/crew/CrewChatWidget";
import WeeklyMissionCard from "../../components/crew/WeeklyMissionCard";

export default function AccountCrew() {
  const [crewData, setCrewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crewApi
      .list()
      .then((res) => setCrewData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 size={20} className="text-[#ff2d78] animate-spin" />
      </div>
    );
  }

  const crewId = crewData?.[0]?.crew_id;

  return (
    <div className="min-h-screen">
      <CrewHeader crew={crewData?.[0]?.crews} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-[2] min-w-0 space-y-5">
          <CreatePostCard crewId={crewId} />
          <VideoPostCard />
          <TextPostCard />
        </div>

        <div className="flex-1 min-w-0 space-y-5">
          <CrewChatWidget crewId={crewId} />
          <WeeklyMissionCard crewId={crewId} />
        </div>
      </div>
    </div>
  );
}
