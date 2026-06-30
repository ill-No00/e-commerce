import { Router } from "express";
import { getSupabase } from "../config/supabase.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { category, search, page = "1", limit = "12" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("products")
      .select(`
        id, name, slug, badge, base_price_cents, rating_avg, rating_count, is_active,
        category:categories!inner(name, slug),
        product_images(url, alt_text),
        product_variants(id, width, size_label, durometer, finish_name, finish_hex, price_cents, stock_status, is_default)
      `, { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq("category.slug", category);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
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

router.get("/:slug", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, series, badge, description, base_price_cents,
        construction, concave, trucks_spec, bearings_spec,
        category:categories(name, slug),
        product_images(url, alt_text, sort_order),
        product_variants(id, width, size_label, durometer, finish_name, finish_hex, price_cents, stock_status, stock_quantity, is_default)
      `)
      .eq("slug", req.params.slug)
      .single();

    if (error) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
