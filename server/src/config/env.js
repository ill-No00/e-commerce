import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config({
  path: '../.env',
});


console.log(process.env)

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
    pass:required("SUPABASE_PASS"),
    serviceRoleKey:required("SUPABASE_ROLE_KEY"),
    key:required("SUPABASE_KEY")
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  rateLimit: {
    windowMs: 60_000,
    max: 100,
  },
};
