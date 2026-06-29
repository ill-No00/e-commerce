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
      .from("addresses")
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

const addressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(1),
  country: z.string().optional().default("US"),
  is_default: z.boolean().optional().default(false),
});

router.post("/", async (req, res, next) => {
  try {
    const body = addressSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("addresses")
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

router.put("/:id", async (req, res, next) => {
  try {
    const body = addressSchema.partial().parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("addresses")
      .update(body)
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
