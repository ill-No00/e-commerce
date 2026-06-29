import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth.jsx";
import { Camera, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const STANCES = [
  { value: "REGULAR", label: "REGULAR" },
  { value: "GOOFY", label: "GOOFY" },
  { value: "SWITCH", label: "SWITCH" },
];

const TIERS = [
  { value: "STREET", label: "STREET", desc: "FRESH BLOOD" },
  { value: "PARK", label: "PARK", desc: "GETTING AIR" },
  { value: "VERT", label: "VERT", desc: "VERTICAL VIBES" },
  { value: "PRO", label: "PRO", desc: "PRO STATUS" },
  { value: "LEGEND", label: "LEGEND", desc: "STREET LEGEND" },
];

export default function SignupProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [stance, setStance] = useState("");
  const [homeSpot, setHomeSpot] = useState("");
  const [tier, setTier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("4wheels_token");
      const body = {};

      if (stance) body.stance = stance;
      if (homeSpot) body.home_spot = homeSpot;
      if (tier) body.tier = tier;

      if (Object.keys(body).length > 0) {
        const res = await fetch(`${API}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to update profile");
        }
      }

      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/account", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
            <span className="text-[#888] text-[10px] font-bold uppercase tracking-widest">STEP 2 OF 2</span>
            <span className="w-2 h-2 rounded-full bg-[#ff2d78]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">YOUR PROFILE</h1>
          <p className="text-[#888] text-xs uppercase tracking-widest mt-2">SET UP YOUR RIDER IDENTITY</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 space-y-7">
          {error && (
            <div className="bg-[#ff2d78]/10 border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <div className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1">AVATAR</div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-[#0d0d0d] border-2 border-dashed border-[#2a2a2a] flex items-center justify-center overflow-hidden hover:border-[#ff2d78] transition-colors group cursor-pointer"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={22} className="text-[#666] group-hover:text-[#ff2d78] transition-colors" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            {user?.email && (
              <span className="text-[#666] text-[10px] uppercase tracking-widest">{user.email}</span>
            )}
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">STANCE</label>
            <div className="grid grid-cols-3 gap-2">
              {STANCES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStance(s.value)}
                  className={`px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                    stance === s.value
                      ? "bg-[#ff2d78] border-[#ff2d78] text-white"
                      : "bg-[#0d0d0d] border-[#2a2a2a] text-[#888] hover:border-[#666]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">HOME SPOT</label>
            <input
              type="text"
              value={homeSpot}
              onChange={(e) => setHomeSpot(e.target.value)}
              placeholder="Venice Beach Skatepark, CA"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">TIER</label>
            <div className="grid grid-cols-2 gap-3">
              {TIERS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  className={`px-3 py-3 rounded-lg border text-left transition-colors ${
                    tier === t.value
                      ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                      : "bg-[#0d0d0d] border-[#2a2a2a] hover:border-[#666]"
                  }`}
                >
                  <div className={`text-xs font-bold uppercase tracking-wider ${tier === t.value ? "text-white" : "text-white"}`}>
                    {t.label}
                  </div>
                  <div className={`text-[9px] uppercase tracking-widest mt-0.5 ${tier === t.value ? "text-white/60" : "text-[#666]"}`}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-[#888] text-xs font-black uppercase tracking-widest py-3.5 rounded-lg hover:border-[#666] transition-colors"
            >
              SKIP
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#ff2d78] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-lg hover:bg-[#d61a5e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? "SAVING..." : "COMPLETE PROFILE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
