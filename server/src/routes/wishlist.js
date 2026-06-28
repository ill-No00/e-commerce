import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("wishlist_items")
      .select(`
        id, added_at,
        product_variants(
          id, finish_name, finish_hex, price_cents, stock_status, width, size_label,
          products!inner(id, name, slug)
        )
      `)
      .order("added_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const addSchema = z.object({
  variant_id: z.string().uuid(),
});

router.post("/", async (req, res, next) => {
  try {
    const body = addSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: req.userId, variant_id: body.variant_id })
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

router.delete("/:id", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
