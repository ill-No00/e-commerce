import dotenv from "dotenv";
dotenv.config();

function required(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required env var: ${name}. Check .env.example`);
  }
  return val;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),

  supabase: {
    url: required("SUPABASE_URL"),
    anonKey: required("SUPABASE_ANON_KEY"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  rateLimit: {
    windowMs: 60_000,
    max: 100,
  },
};
