import { useEffect, useState } from "react";
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Play } from "lucide-react";
import { crewApi } from "../../api/crew.js";

function formatTimeAgo(dateStr) {
  if (!dateStr) return undefined;
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "JUST NOW";
  if (hours < 24) return `${hours} HOURS AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAYS AGO`;
}

export default function VideoPostCard({ crewId }) {
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    if (!crewId) return;
    crewApi
      .getPosts(crewId, { first: 10 })
      .then((res) => {
        const videoPost = (res.data || []).find((p) => p.media_type === "VIDEO") || res.data?.[0];
        setPost(videoPost);
      })
      .catch(() => setPost(undefined));
  }, [crewId]);

  if (!post) return null;

  const likeCount = post.crew_post_likes?.[0]?.count;
  const commentCount = post.crew_post_comments?.[0]?.count;
  const username = post.profiles?.username;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl overflow-hidden">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff2d78] to-[#7c3aed] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{username ? `@${username}` : "—"}</div>
              <div className="text-[9px] font-medium text-[#666]">{formatTimeAgo(post.created_at) ?? "—"}</div>
            </div>
          </div>
          <button className="text-[#666] hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {post.body && (
          <p className="text-sm font-bold text-white leading-relaxed mb-4">
            {post.body}
            {post.hashtags?.map((tag) => (
              <span key={tag} className="text-[#ff2d78]"> #{tag}</span>
            ))}
          </p>
        )}
      </div>

      {post.media_url && (
        <div className="relative mx-5 mb-0">
          <div className="h-44 md:h-52 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#ff2d78] flex items-center justify-center shadow-lg shadow-[#ff2d78]/30 hover:scale-105 transition-transform">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-6">
          {likeCount != null && (
            <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#ff2d78] transition-colors">
              <Heart size={15} />
              {likeCount} PROPS
            </button>
          )}
          {commentCount != null && (
            <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#00e5ff] transition-colors">
              <MessageCircle size={15} />
              {commentCount} COMMENTS
            </button>
          )}
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#7c3aed] transition-colors">
            <Repeat2 size={15} />
            REPOST
          </button>
        </div>
      </div>
    </div>
  );
}
