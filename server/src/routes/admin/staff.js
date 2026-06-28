import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../../config/supabase.js";
import { getServiceSupabase } from "../../config/supabase.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireAdmin, requireRole } from "../../middleware/admin.js";

const router = Router();

router.use(requireAuth, requireAdmin, requireRole("ADMIN"));

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, display_name, handle, email, role, status, joined_at, last_active_at")
      .order("joined_at", { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const roleCounts = { ADMIN: 0, FULFILLMENT: 0, VIEWER: 0 };
    for (const member of data || []) {
      if (roleCounts[member.role] !== undefined) {
        roleCounts[member.role]++;
      }
    }

    res.json({ data, roleCounts });
  } catch (err) {
    next(err);
  }
});

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "FULFILLMENT", "VIEWER"]),
  note: z.string().max(500).optional(),
});

router.post("/invite", async (req, res, next) => {
  try {
    const body = inviteSchema.parse(req.body);
    const supabase = getSupabase();
    const serviceSupabase = getServiceSupabase();

    const token = crypto.randomUUID();

    const { data, error } = await supabase
      .from("admin_invitations")
      .insert({
        email: body.email,
        role: body.role,
        token,
        invited_by: req.userId,
        note: body.note || null,
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

const roleSchema = z.object({
  role: z.enum(["ADMIN", "FULFILLMENT", "VIEWER"]),
});

router.put("/:id/role", async (req, res, next) => {
  try {
    const body = roleSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("admin_users")
      .update({ role: body.role })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Staff member not found" });
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
      .from("admin_users")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
