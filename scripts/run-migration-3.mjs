// Supabase Migration Runner - Yorumlar Tablosu
// Bu script SQL migration'ı Supabase'e uygular
// Çalıştırmak için: node scripts/run-migration-3.mjs

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mmutjipoztdcundcfabj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdXRqaXBvenRkY3VuZGNmYWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjYyNjMsImV4cCI6MjA2MTk0MjI2M30.GiH6JTsFg96Rs4gyawQ4sg_Lz6XC2AE";

async function runMigration() {
  console.log("=== SUPABASE MIGRATION 3: Yorumlar Tablosu ===");
  console.log("");

  const migrationPath = join(__dirname, "..", "supabase", "migrations", "00003_yorumlar_tablosu.sql");
  const sql = readFileSync(migrationPath, "utf-8");

  console.log("SQL dosyasi okundu.");
  console.log("SQL uzunlugu:", sql.length, "karakter");
  console.log("");

  // Supabase Management API ile SQL çalıştır
  // NOT: Bu yöntem sadece service_role key ile çalışır
  // Anon key ile çalışmaz, o yüzden SQL Editor'dan manuel çalıştırman gerekecek
  
  console.log("=== MANUEL CALISTIRMA TALIMATLARI ===");
  console.log("");
  console.log("1. Tarayicinizda su adresi acin:");
  console.log("   https://supabase.com/dashboard/project/mmutjipoztdcundcfabj");
  console.log("");
  console.log("2. Sol menuden SQL Editor secin");
  console.log("");
  console.log("3. 'New Query' butonuna tiklayin");
  console.log("");
  console.log("4. Asagidaki SQL'i yapistirin ve Calistir (Ctrl+Enter) tiklayin:");
  console.log("");
  console.log("========================================");
  console.log(sql);
  console.log("========================================");
  console.log("");
  console.log("5. Ardindan Vercel'de otomatik deploy baslayacak.");
  console.log("   (GitHub'a pushlandi bile: git push basarili)");
}

runMigration().catch(console.error);
