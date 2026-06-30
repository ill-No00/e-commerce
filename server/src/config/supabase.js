import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

let client = null;
let serviceClient = null;

export function getSupabase() {
  if (!client) {
    client = createClient(config.supabase.url, config.supabase.key);
    
  }
  return client;
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




