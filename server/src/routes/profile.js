import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.userId)
      .single();

    if (error) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  username: z.string().min(2).max(30).optional(),
  avatar_url: z.string().url().optional(),
  stance: z.enum(["REGULAR", "GOOFY", "SWITCH"]).optional(),
  home_spot: z.string().max(200).optional(),
});

router.put("/", requireAuth, async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("profiles")
      .update(body)
      .eq("id", req.userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
