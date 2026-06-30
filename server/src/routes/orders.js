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
      .from("orders")
      .select(`
        id, order_number, status, subtotal_cents, shipping_cents, tax_cents, total_cents, placed_at,
        order_items(product_name, variant_label, quantity, unit_price_cents)
      `)
      .eq("user_id", req.userId)
      .order("placed_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/shipping-methods", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id, order_number, status, subtotal_cents, shipping_cents, tax_cents, total_cents,
        placed_at, updated_at,
        shipping_address:addresses!shipping_address_id(*),
        payment_method:payment_methods!payment_method_id(provider, brand, last4, expiry_month, expiry_year),
        shipping_method:shipping_methods!shipping_method_id(name, price_cents),
        order_items(product_name, variant_label, quantity, unit_price_cents)
      `)
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .single();

    if (error) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const placeOrderSchema = z.object({
  shipping_address_id: z.string().uuid(),
  payment_method_id: z.string().uuid(),
  shipping_method_id: z.string().uuid(),
  subtotal_cents: z.number().int().min(0),
  shipping_cents: z.number().int().min(0),
  tax_cents: z.number().int().min(0),
  total_cents: z.number().int().min(0),
  items: z.array(z.object({
    product_name: z.string(),
    variant_label: z.string().optional(),
    variant_id: z.string().uuid().optional(),
    quantity: z.number().int().min(1),
    unit_price_cents: z.number().int().min(0),
  })).min(1),
});

router.post("/", async (req, res, next) => {
  try {
    const body = placeOrderSchema.parse(req.body);

    const supabase = getSupabase();

    // Validate item prices against DB
    const priceMismatches = [];
    for (const item of body.items) {
      let dbPrice;
      if (item.variant_id) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("price_cents")
          .eq("id", item.variant_id)
          .single();
        dbPrice = variant?.price_cents;
      } else {
        const { data: product } = await supabase
          .from("products")
          .select("product_variants(price_cents)")
          .eq("name", item.product_name)
          .single();
        dbPrice = product?.product_variants?.[0]?.price_cents;
      }
      if (dbPrice !== item.unit_price_cents) {
        priceMismatches.push({
          product_name: item.product_name,
          submitted: item.unit_price_cents,
          expected: dbPrice,
        });
      }
    }
    if (priceMismatches.length > 0) {
      return res.status(400).json({ error: "Price mismatch", details: priceMismatches });
    }

    // Validate subtotal
    const validatedSubtotal = body.items.reduce((sum, item) => {
      const dbItem = body.items.find((i) => i.product_name === item.product_name);
      return sum + item.unit_price_cents * item.quantity;
    }, 0);
    if (validatedSubtotal !== body.subtotal_cents) {
      return res.status(400).json({ error: "Price mismatch", details: [{ field: "subtotal_cents", submitted: body.subtotal_cents, expected: validatedSubtotal }] });
    }

    // Validate shipping
    const { data: shippingMethod } = await supabase
      .from("shipping_methods")
      .select("price_cents")
      .eq("id", body.shipping_method_id)
      .single();
    const validatedShipping = shippingMethod?.price_cents;
    if (validatedShipping !== body.shipping_cents) {
      return res.status(400).json({ error: "Price mismatch", details: [{ field: "shipping_cents", submitted: body.shipping_cents, expected: validatedShipping }] });
    }

    // Validate tax (8.5% with 5-cent tolerance)
    const validatedTax = Math.round(validatedSubtotal * 0.085);
    if (Math.abs(validatedTax - body.tax_cents) > 5) {
      return res.status(400).json({ error: "Price mismatch", details: [{ field: "tax_cents", submitted: body.tax_cents, expected: validatedTax }] });
    }

    // Validate total — use body.tax_cents (already validated within 5-cent tolerance)
    // so the total check uses the same tax figure the client used
    const validatedTotal = validatedSubtotal + validatedShipping + body.tax_cents;
    if (validatedTotal !== body.total_cents) {
      return res.status(400).json({ error: "Price mismatch", details: [{ field: "total_cents", submitted: body.total_cents, expected: validatedTotal }] });
    }

    const orderNumber = `4W-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: req.userId,
        shipping_address_id: body.shipping_address_id,
        payment_method_id: body.payment_method_id,
        shipping_method_id: body.shipping_method_id,
        subtotal_cents: body.subtotal_cents,
        shipping_cents: body.shipping_cents,
        tax_cents: body.tax_cents,
        total_cents: body.total_cents,
        status: "PROCESSING",
      })
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_name: item.product_name,
      variant_label: item.variant_label || null,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return res.status(400).json({ error: itemsError.message });
    }

    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", req.userId)
      .maybeSingle();
    if (cart) {
      await supabase.from("cart_items").delete().eq("cart_id", cart.id);
      await supabase.from("carts").delete().eq("id", cart.id);
    }

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
});

export default router;
