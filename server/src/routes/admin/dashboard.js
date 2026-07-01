import { Router } from "express";
import { getSupabase } from "../../config/supabase.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireAdmin } from "../../middleware/admin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const supabase = getSupabase();

    const [totalSales, activeOrders, totalOrders, pendingOrders, shippedOrders, deliveredOrders, cancelledOrders, crewCount, activityLog] = await Promise.all([
      supabase.from("orders").select("total_cents").neq("status", "CANCELLED"),
      supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["PROCESSING", "SHIPPED"]),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "PROCESSING"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "SHIPPED"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "DELIVERED"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "CANCELLED"),
      supabase.from("crew_members").select("id", { count: "exact", head: true }),
      supabase.from("admin_activity_log").select("*").order("created_at", { ascending: false }).limit(10),
    ]).catch((err) => {
      console.error("Error fetching dashboard data:", err);
      
    });

    const totalRevenue = totalSales.data?.reduce((sum, o) => sum + (o.total_cents || 0), 0) || 0;

    res.json({
      data: {
        stats: {
          totalSalesCents: totalRevenue,
          activeOrders: activeOrders.count || 0,
          newCrewMembers: crewCount.count || 0,
          orderCounts: {
            total: totalOrders.count || 0,
            pending: pendingOrders.count || 0,
            inTransit: shippedOrders.count || 0,
            completed: deliveredOrders.count || 0,
            cancelled: cancelledOrders.count || 0,
          },
        },
        activityLog: activityLog.data || [],
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/activity-log", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const first = Math.min(50, parseInt(req.query.first, 10) || 10);

    const { data, error } = await supabase
      .from("admin_activity_log")
      .select("*")
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

export default router;
