import { getSupabase } from "../config/supabase.js";

export async function requireAdmin(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, role, status")
    .eq("id", req.userId)
    .single();

  if (error || !data) {
    return res.status(403).json({ error: "Access denied. Staff privileges required." });
  }

  if (data.status !== "ACTIVE") {
    return res.status(403).json({ error: "Account deactivated. Contact an administrator." });
  }

  req.staff = data;
  req.staffRole = data.role;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.staff || !roles.includes(req.staff.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of: ${roles.join(", ")}`,
      });
    }
    next();
  };
}
