import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../../config/supabase.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireAdmin, requireRole } from "../../middleware/admin.js";

const router = Router();

router.use(requireAuth, requireAdmin, requireRole("ADMIN"));

router.get("/store", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/store", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("store_settings")
        .update(req.body)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ data });
    }

    const { data, error } = await supabase
      .from("store_settings")
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/notifications", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/notifications", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("notification_preferences")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("notification_preferences")
        .update(req.body)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ data });
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/integrations", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("integrations")
      .select("*");

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/integrations/:id/connect", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("integrations")
      .update({ is_connected: true, connected_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(404).json({ error: "Integration not found" });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/builder", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const [configResult, settingsResult] = await Promise.all([
      supabase.from("builder_config").select("*").order("sort_order", { ascending: true }),
      supabase.from("builder_settings").select("*").limit(1).maybeSingle(),
    ]);

    if (configResult.error) return res.status(400).json({ error: configResult.error.message });

    res.json({
      data: {
        steps: configResult.data || [],
        settings: settingsResult.data || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

const toggleStepSchema = z.object({
  is_enabled: z.boolean(),
});

router.put("/builder/steps/:id", async (req, res, next) => {
  try {
    const body = toggleStepSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("builder_config")
      .update({ is_enabled: body.is_enabled })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(404).json({ error: "Builder step not found" });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/builder/settings", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("builder_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("builder_settings")
        .update(req.body)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ data });
    }

    const { data, error } = await supabase
      .from("builder_settings")
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/danger-zone/reset-builder-data", async (req, res, next) => {
  try {
    const supabase = getSupabase();

    await supabase.from("cart_items").delete().neq("id", "none");
    await supabase.from("builder_config").update({ is_enabled: true }).neq("id", "none");

    await supabase.from("danger_zone_log").insert({
      action: "RESET_BUILDER_DATA",
      performed_by: req.userId,
    });

    res.json({ message: "Builder data reset successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/activity-log", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_activity_log")
      .insert({ ...req.body, user_id: req.userId })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
