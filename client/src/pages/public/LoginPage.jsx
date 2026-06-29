import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth.jsx";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-wider text-white">WELCOME BACK</h1>
          <p className="text-[#888] text-xs uppercase tracking-widest mt-2">SIGN IN TO YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 space-y-6">
          {error && (
            <div className="bg-[#ff2d78]/10 border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="skater@4wheels.com"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#888] text-[10px] font-bold uppercase tracking-widest mb-2">PASSWORD</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff2d78] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-lg hover:bg-[#d61a5e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/reset-password"
              className="text-[#888] text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
            >
              FORGOT PASSWORD?
            </Link>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#666] text-[10px] uppercase tracking-widest">
            DON&apos;T HAVE AN ACCOUNT?{" "}
            <Link to="/signup" className="text-[#ff2d78] font-bold hover:underline">
              CREATE ONE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
