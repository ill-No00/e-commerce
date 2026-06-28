import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

async function getOrCreateCart(supabase, userId) {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw error;
  return created;
}

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const cart = await getOrCreateCart(supabase, req.userId);

    const { data, error } = await supabase
      .from("carts")
      .select(`
        id, user_id, created_at, updated_at,
        cart_items(
          id, quantity, unit_price_cents, reserved_until,
          product_variants(
            id, finish_name, width, size_label, durometer, finish_hex, stock_status, price_cents,
            products(name, slug)
          )
        )
      `)
      .eq("id", cart.id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const addItemSchema = z.object({
  variant_id: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  unit_price_cents: z.number().int().min(0),
});

router.post("/items", async (req, res, next) => {
  try {
    const body = addItemSchema.parse(req.body);
    const supabase = getSupabase();
    const cart = await getOrCreateCart(supabase, req.userId);

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("variant_id", body.variant_id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + body.quantity })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ data });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cart.id,
        variant_id: body.variant_id,
        quantity: body.quantity,
        unit_price_cents: body.unit_price_cents,
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

const updateQtySchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

router.put("/items/:id", async (req, res, next) => {
  try {
    const body = updateQtySchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: body.quantity })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const cart = await getOrCreateCart(supabase, req.userId);

    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    await supabase.from("carts").delete().eq("id", cart.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
