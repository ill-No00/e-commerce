import { Copy, Lock, Gift, Zap, Users, Star, Award, ShoppingBag, Share2 } from "lucide-react";

const perks = [
  {
    name: "FREE_SHIPPING",
    desc: "Free shipping on all orders, no minimum.",
    unlocked: true,
    icon: ShoppingBag,
    tier: null,
  },
  {
    name: "EARLY_DROP_ACCESS",
    desc: "Get 24h early access to new product drops.",
    unlocked: true,
    icon: Zap,
    tier: null,
  },
  {
    name: "10%_BUILDER_DISCOUNT",
    desc: "10% off all custom skate builds.",
    unlocked: true,
    icon: Gift,
    tier: null,
  },
  {
    name: "EXCLUSIVE_EVENTS",
    desc: "Invite to private crew events and comps.",
    unlocked: false,
    icon: Star,
    tier: "LEGEND_TIER",
  },
  {
    name: "CUSTOM_GRAPHICS",
    desc: "Commission custom deck artwork.",
    unlocked: false,
    icon: Award,
    tier: "LEGEND_TIER",
  },
];

const activities = [
  { icon: ShoppingBag, desc: "Completed a custom build", points: "+250", time: "2 hours ago" },
  { icon: Users, desc: "Referred a friend", points: "+500", time: "3 days ago" },
  { icon: Star, desc: "Hit PRO_TIER milestone", points: "+1,000", time: "1 week ago" },
  { icon: Gift, desc: "Redeemed free shipping perk", points: "-0", time: "2 weeks ago" },
  { icon: Zap, desc: "Early access drop purchase", points: "+150", time: "3 weeks ago" },
];

export default function AccountCrew() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">STREET_CREW</h1>
        <p className="text-[11px] text-[#888] mt-1">Your crew standing, perks, and community activity at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">CURRENT_TIER</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-black text-[#ff2d78] uppercase">PRO_TIER</span>
          </div>
          <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden mb-1">
            <div className="h-full w-[55%] bg-[#ff2d78] rounded-full" />
          </div>
          <div className="text-[10px] text-[#888] font-medium">2,750 / 5,000 XP to LEGEND_TIER</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">GALLERY_POINTS</div>
          <div className="text-3xl font-black text-[#00e5ff] mt-1">14,250</div>
          <button className="mt-3 text-[9px] font-bold text-[#00e5ff] border border-[#00e5ff]/40 rounded-full px-4 py-1.5 uppercase tracking-widest hover:bg-[#00e5ff]/10 transition-all">
            REDEEM_POINTS
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">CREW_RANK</div>
          <div className="text-3xl font-black text-white mt-1">#142</div>
          <div className="text-[10px] text-[#888] mt-1">Top 5% of riders</div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-[#ff2d78] rounded-full" />
          <h2 className="text-base font-black text-white uppercase tracking-tight">PERKS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((perk) => (
            <div
              key={perk.name}
              className={`rounded-xl border p-5 transition-all ${
                perk.unlocked
                  ? "bg-[#1a1a1a] border-[#2a2a2a] border-l-[3px] border-l-[#ff2d78]"
                  : "bg-[#141414] border-[#2a2a2a] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <perk.icon size={20} className={perk.unlocked ? "text-[#ff2d78]" : "text-[#555]"} />
                {!perk.unlocked && <Lock size={14} className="text-[#555]" />}
              </div>
              <div className={`text-xs font-black uppercase tracking-tight ${perk.unlocked ? "text-white" : "text-[#666]"}`}>
                {perk.name}
              </div>
              <div className="text-[10px] text-[#888] mt-1 leading-relaxed">{perk.desc}</div>
              {!perk.unlocked && (
                <div className="text-[8px] font-bold text-[#888] uppercase tracking-widest mt-3 bg-[#2a2a2a] rounded-full px-2.5 py-1 inline-block">
                  UNLOCKS AT {perk.tier}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-[#ff2d78] rounded-full" />
          <h2 className="text-base font-black text-white uppercase tracking-tight">INVITE_YOUR_CREW</h2>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[#ff2d78] text-xs font-mono font-bold">
              4W-ALEX-RIDER
            </div>
            <button className="flex items-center gap-2 text-[9px] font-bold bg-[#ff2d78] text-white rounded-full px-5 py-3 uppercase tracking-widest hover:brightness-110 transition-all">
              <Copy size={13} />
              COPY
            </button>
          </div>
          <div className="text-[11px] font-bold text-white">
            3 FRIENDS JOINED
            <span className="text-[#00e5ff] ml-2">+1,500 points</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-[#ff2d78] rounded-full" />
          <h2 className="text-base font-black text-white uppercase tracking-tight">ACTIVITY_FEED</h2>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl divide-y divide-[#2a2a2a]">
          {activities.map((act, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#2a2a2a] flex items-center justify-center">
                  <act.icon size={14} className="text-[#888]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{act.desc}</div>
                  <div className="text-[9px] text-[#666] mt-0.5">{act.time}</div>
                </div>
              </div>
              <span className="text-xs font-black text-[#00e5ff]">{act.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
