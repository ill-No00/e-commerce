import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth.jsx";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    displayName: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(form.email, form.password, {
        data: {
          username: form.username || undefined,
          display_name: form.displayName || undefined,
        },
      });

      if (result.session) {
        navigate("/signup/profile", { replace: true });
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">&#9993;</div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">CHECK YOUR EMAIL</h1>
          <p className="text-[#888] text-xs uppercase tracking-widest mt-3 leading-relaxed">
            We sent a confirmation link to <span className="text-white">{form.email}</span>
            <br />
            Click the link to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="inline-block mt-8 bg-[#ff2d78] text-white text-xs font-black uppercase tracking-widest py-3.5 px-8 rounded-lg hover:bg-[#d61a5e] transition-colors"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ff2d78]" />
            <span className="text-[#888] text-[10px] font-bold uppercase tracking-widest">STEP 1 OF 2</span>
            <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-wider text-white">JOIN THE CREW</h1>
          <p className="text-[#888] text-xs uppercase tracking-widest mt-2">CREATE YOUR 4WHEELS ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-[#ff2d78]/10 border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">EMAIL *</label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              required
              placeholder="skater@4wheels.com"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">USERNAME</label>
              <input
                type="text"
                value={form.username}
                onChange={update("username")}
                placeholder="sk8r99"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">DISPLAY NAME</label>
              <input
                type="text"
                value={form.displayName}
                onChange={update("displayName")}
                placeholder="Alex Rider"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">PASSWORD *</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pr-11 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">CONFIRM PASSWORD *</label>
            <input
              type={showPw ? "text" : "password"}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff2d78] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-lg hover:bg-[#d61a5e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#666] text-[10px] uppercase tracking-widest">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link to="/login" className="text-[#ff2d78] font-bold hover:underline">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
