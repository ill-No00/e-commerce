import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import addressRoutes from "./routes/addresses.js";
import paymentMethodRoutes from "./routes/paymentMethods.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import crewRoutes from "./routes/crew.js";

import adminDashboardRoutes from "./routes/admin/dashboard.js";
import adminOrderRoutes from "./routes/admin/orders.js";
import adminInventoryRoutes from "./routes/admin/inventory.js";
import adminStaffRoutes from "./routes/admin/staff.js";
import adminSettingsRoutes from "./routes/admin/settings.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/crew", crewRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/inventory", adminInventoryRoutes);
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

app.use(errorHandler);

export { app };
