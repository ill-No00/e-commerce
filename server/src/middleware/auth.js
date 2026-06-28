import { getSupabase } from "../config/supabase.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.split(" ")[1];

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;
  req.userId = data.user.id;
  next();
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    req.userId = null;
    return next();
  }

  const token = header.split(" ")[1];
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser(token);

  req.user = data?.user || null;
  req.userId = data?.user?.id || null;
  next();
}
