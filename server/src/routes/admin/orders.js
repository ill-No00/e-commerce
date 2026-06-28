import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../../config/supabase.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireAdmin, requireRole } from "../../middleware/admin.js";

const router = Router();

router.use(requireAuth, requireAdmin, requireRole("ADMIN", "FULFILLMENT"));

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { status, search, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("orders")
      .select(`
        id, order_number, status, total_cents, placed_at,
        profiles!user_id(display_name, email),
        order_items(product_name, quantity)
      `, { count: "exact" })
      .order("placed_at", { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,profiles.email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

const statusSchema = z.object({
  status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

router.put("/:id/status", async (req, res, next) => {
  try {
    const body = statusSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("orders")
      .update({ status: body.status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
