// Supabase Migration Runner
// Bu script SQL migration'ı Supabase'e uygular
// Çalıştırmak için: node scripts/run-migration.mjs

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mmutjipoztdcundcfabj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_GiH6JTsFg96Rs4gyawQ4sg_Lz6XC2AE";

async function runMigration() {
  console.log("=== SUPABASE MIGRATION ===");
  console.log("Proje: Psikoterapin");
  console.log("Supabase URL:", supabaseUrl);
  console.log("");

  const migrationPath = join(__dirname, "..", "supabase", "migrations", "00001_initial_schema.sql");
  const sql = readFileSync(migrationPath, "utf-8");

  console.log("SQL dosyasi okundu.");
  console.log("SQL uzunlugu:", sql.length, "karakter");
  console.log("");

  // SQL'i parcalara ayir
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  console.log("Toplam", statements.length, "SQL ifadesi bulundu.");
  console.log("");

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
   console.log("5. Ikinci migration'u da calistirin (e-posta dogrulamasi icin):");
   console.log("");
   console.log("========================================");
   const migration2Path = join(__dirname, "..", "supabase", "migrations", "00002_disable_email_confirm.sql");
   const sql2 = readFileSync(migration2Path, "utf-8");
   console.log(sql2);
   console.log("========================================");
   console.log("");
   console.log("6. Ucuncu migration'u da calistirin (yorumlar tablosu icin):");
   console.log("");
   console.log("========================================");
   const migration3Path = join(__dirname, "..", "supabase", "migrations", "00003_yorumlar_tablosu.sql");
   const sql3 = readFileSync(migration3Path, "utf-8");
   console.log(sql3);
   console.log("========================================");

}

runMigration().catch(console.error);
