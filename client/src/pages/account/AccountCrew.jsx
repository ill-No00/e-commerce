import CrewHeader from "../../components/crew/CrewHeader";
import CreatePostCard from "../../components/crew/CreatePostCard";
import VideoPostCard from "../../components/crew/VideoPostCard";
import TextPostCard from "../../components/crew/TextPostCard";
import CrewChatWidget from "../../components/crew/CrewChatWidget";
import WeeklyMissionCard from "../../components/crew/WeeklyMissionCard";

export default function AccountCrew() {
  return (
    <div className="min-h-screen">
      <CrewHeader />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-[2] min-w-0 space-y-5">
          <CreatePostCard />
          <VideoPostCard />
          <TextPostCard />
        </div>

        <div className="flex-1 min-w-0 space-y-5">
          <CrewChatWidget />
          <WeeklyMissionCard />
        </div>
      </div>
    </div>
  );
}
