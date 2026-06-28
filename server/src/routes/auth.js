import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  options: z.object({
    data: z.object({
      username: z.string().optional(),
      display_name: z.string().optional(),
    }).optional(),
  }).optional(),
});

router.post("/signup", async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: body.options,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/session", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

const resetSchema = z.object({
  email: z.string().email(),
  redirectTo: z.string().url().optional(),
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const body = resetSchema.parse(req.body);
    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: body.redirectTo || `${req.protocol}://${req.get("host")}/reset-password`,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
});

export default router;
