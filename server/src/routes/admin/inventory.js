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
    const { category, search, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("products")
      .select(`
        id, name, slug, base_price_cents, is_active,
        categories(name),
        product_variants(id, sku, stock_status, stock_quantity, finish_name, size_label, price_cents)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const stats = { total: 0, lowStock: 0, outOfStock: 0, categories: new Set() };
    for (const product of data || []) {
      stats.total++;
      if (product.categories?.name) stats.categories.add(product.categories.name);
      for (const v of product.product_variants || []) {
        if (v.stock_status === "OUT_OF_STOCK") stats.outOfStock++;
        else if (v.stock_status === "LOW_STOCK") stats.lowStock++;
      }
    }

    res.json({
      data,
      stats: {
        totalSku: stats.total,
        lowStock: stats.lowStock,
        outOfStock: stats.outOfStock,
        categoryCount: stats.categories.size,
      },
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

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  base_price_cents: z.number().int().min(0),
  category_id: z.string().uuid().optional(),
  construction: z.string().optional(),
  concave: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

router.post("/products", async (req, res, next) => {
  try {
    const body = productSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("products")
      .insert(body)
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

router.put("/products/:id", async (req, res, next) => {
  try {
    const body = productSchema.partial().parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id/variants/:variantId/stock", async (req, res, next) => {
  try {
    const { stock_quantity } = z.object({
      stock_quantity: z.number().int().min(0),
    }).parse(req.body);

    const supabase = getSupabase();

    const stockStatus = stock_quantity === 0
      ? "OUT_OF_STOCK"
      : stock_quantity <= 5
        ? "LOW_STOCK"
        : "IN_STOCK";

    const { data, error } = await supabase
      .from("product_variants")
      .update({ stock_quantity, stock_status: stockStatus })
      .eq("id", req.params.variantId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", req.params.id);

    if (error) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
