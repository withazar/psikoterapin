import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabase client'ı oluştur
// Not: Eğer Supabase bağlantısı yoksa (offline/local), hata fırlatmak yerine
// localStorage tabanlı fallback kullanılır. Bu sayede demo modda çalışabilir.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "psikoterapin_supabase_auth",
  },
  global: {
    headers: {
      "x-application-name": "psikoterapin",
    },
  },
});

// Supabase bağlantı testi
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
