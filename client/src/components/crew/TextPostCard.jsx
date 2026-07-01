import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { crewApi } from "../../api/crew.js";

function formatTimeAgo(dateStr) {
  if (!dateStr) return undefined;
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} HOURS AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAYS AGO`;
}

export default function TextPostCard({ crewId }) {
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    if (!crewId) return;
    crewApi
      .getPosts(crewId, { first: 10 })
      .then((res) => {
        const textPost = (res.data || []).find((p) => !p.media_url || p.media_type !== "VIDEO");
        setPost(textPost);
      })
      .catch(() => setPost(undefined));
  }, [crewId]);

  if (!post) return null;

  const username = post.profiles?.username;

  return (
    <div className="bg-[#141414] rounded-3xl overflow-hidden border border-[#2a2a2a] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff2d78] via-[#7c3aed] to-[#00e5ff]" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c3aed] shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">{username ? `@${username}` : "—"}</div>
            <div className="text-[9px] font-medium text-[#666]">{formatTimeAgo(post.created_at) ?? "—"}</div>
          </div>
        </div>

        {post.body && (
          <p className="text-base md:text-lg font-black italic text-white leading-relaxed mb-4">
            &ldquo;{post.body}&rdquo;
          </p>
        )}

        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {post.hashtags.map((tag) => (
              <span key={tag} className="text-[9px] font-bold text-[#ff2d78] bg-[#ff2d78]/10 rounded-full px-3 py-1 uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
