import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

async function checkCrewMembership(supabase, userId, crewId) {
  const { data } = await supabase
    .from("crew_members")
    .select("id")
    .eq("user_id", userId)
    .eq("crew_id", crewId)
    .maybeSingle();
  return !!data;
}

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("crew_members")
      .select("crew_id, crews(id, name, cred_points, rank)")
      .eq("user_id", req.userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const joinSchema = z.object({
  crew_id: z.string().uuid(),
});

router.post("/join", async (req, res, next) => {
  try {
    const body = joinSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("crew_members")
      .insert({ crew_id: body.crew_id, user_id: req.userId })
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

router.get("/:crewId/members", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("crew_members")
      .select("user_id, is_online, profiles(username, avatar_url)")
      .eq("crew_id", req.params.crewId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:crewId/posts", requireAuth, async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const isMember = await checkCrewMembership(supabase, req.userId, req.params.crewId);
    if (!isMember) return res.status(403).json({ error: "You must be a crew member to view posts" });
    const first = Math.min(50, parseInt(req.query.first, 10) || 10);

    const { data, error } = await supabase
      .from("crew_posts")
      .select(`
        id, body, media_url, media_type, hashtags, created_at,
        profiles(username, avatar_url),
        crew_post_likes(count),
        crew_post_comments(count)
      `)
      .eq("crew_id", req.params.crewId)
      .order("created_at", { ascending: false })
      .limit(first);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const postSchema = z.object({
  crew_id: z.string().uuid(),
  body: z.string().min(1).max(5000),
  media_url: z.string().url().optional(),
  media_type: z.enum(["IMAGE", "VIDEO", "LINK"]).optional(),
  hashtags: z.array(z.string()).optional(),
});

router.post("/posts", async (req, res, next) => {
  try {
    const body = postSchema.parse(req.body);
    const supabase = getSupabase();
    const isMember = await checkCrewMembership(supabase, req.userId, body.crew_id);
    if (!isMember) return res.status(403).json({ error: "You must be a crew member to post" });

    const { data, error } = await supabase
      .from("crew_posts")
      .insert({
        user_id: req.userId,
        crew_id: body.crew_id,
        body: body.body,
        media_url: body.media_url || null,
        media_type: body.media_type || null,
        hashtags: body.hashtags || [],
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

router.post("/posts/:id/like", async (req, res, next) => {
  try {
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from("crew_post_likes")
      .select("id")
      .eq("post_id", req.params.id)
      .eq("user_id", req.userId)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "Already liked" });
    }

    const { data, error } = await supabase
      .from("crew_post_likes")
      .insert({ post_id: req.params.id, user_id: req.userId })
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

router.delete("/posts/:id/like", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("crew_post_likes")
      .delete()
      .eq("post_id", req.params.id)
      .eq("user_id", req.userId);

    if (error) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

const commentSchema = z.object({
  body: z.string().min(1).max(1000),
});

router.post("/posts/:id/comments", async (req, res, next) => {
  try {
    const body = commentSchema.parse(req.body);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("crew_post_comments")
      .insert({
        post_id: req.params.id,
        user_id: req.userId,
        body: body.body,
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

router.get("/:crewId/chat", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const isMember = await checkCrewMembership(supabase, req.userId, req.params.crewId);
    if (!isMember) return res.status(403).json({ error: "You must be a crew member to view chat" });
    const first = Math.min(100, parseInt(req.query.first, 10) || 50);

    const { data, error } = await supabase
      .from("crew_chat_messages")
      .select("id, body, created_at, profiles(username)")
      .eq("crew_id", req.params.crewId)
      .order("created_at", { ascending: false })
      .limit(first);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const chatSchema = z.object({
  crew_id: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

router.post("/chat", async (req, res, next) => {
  try {
    const body = chatSchema.parse(req.body);
    const supabase = getSupabase();
    const isMember = await checkCrewMembership(supabase, req.userId, body.crew_id);
    if (!isMember) return res.status(403).json({ error: "You must be a crew member to chat" });

    const { data, error } = await supabase
      .from("crew_chat_messages")
      .insert({
        crew_id: body.crew_id,
        user_id: req.userId,
        body: body.body,
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

router.get("/:crewId/missions", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("crew_missions")
      .select("*")
      .eq("crew_id", req.params.crewId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
