import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

let anonClient = null;
let serviceClient = null;

export function getSupabase() {
  if (!anonClient) {
    anonClient = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return anonClient;
}

export function getServiceSupabase() {
  if (!serviceClient) {
    serviceClient = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return serviceClient;
}
