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
      .from("payment_methods")
      .select("*")
      .order("is_default", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const saveCardSchema = z.object({
  provider: z.string(),
  provider_token: z.string(),
  brand: z.string(),
  last4: z.string().length(4),
  expiry_month: z.number().int().min(1).max(12),
  expiry_year: z.number().int(),
  cardholder_name: z.string().max(100).optional(),
  is_default: z.boolean().optional().default(false),
});

router.post("/", async (req, res, next) => {
  try {
    const body = saveCardSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("payment_methods")
      .insert({ user_id: req.userId, ...body })
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
      .from("payment_methods")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
