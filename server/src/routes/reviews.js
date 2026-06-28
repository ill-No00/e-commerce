import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:productId", optionalAuth, async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, body, author_label, created_at, user_id")
      .eq("product_id", req.params.productId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(1).max(2000).optional(),
  author_label: z.string().max(100).optional(),
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = reviewSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: req.userId,
        ...body,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
