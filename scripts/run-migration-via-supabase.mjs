// Supabase Migration Runner via Supabase Client
// Bu script SQL migration'ı Supabase'e uygular
// Çalıştırmak için: node scripts/run-migration-via-supabase.mjs

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://mmutjipoztdcundcfabj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdXRqaXBvenRkY3VuZGNmYWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjYyNjMsImV4cCI6MjA2MTk0MjI2M30.GiH6JTsFg96Rs4gyawQ4sg_Lz6XC2AE";

async function runMigration() {
  console.log("=== SUPABASE MIGRATION 3: Yorumlar Tablosu ===");
  console.log("");

  const migrationPath = join(__dirname, "..", "supabase", "migrations", "00003_yorumlar_tablosu.sql");
  const sql = readFileSync(migrationPath, "utf-8");

  console.log("SQL dosyasi okundu.");
  console.log("SQL uzunlugu:", sql.length, "karakter");
  console.log("");

  // SQL'i satır satır ayır ve her birini Supabase REST API ile çalıştır
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--") && !s.startsWith("\n--"));

  console.log("Toplam", statements.length, "SQL ifadesi bulundu.");
  console.log("");

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i + 1}/${statements.length}] Calistiriliyor...`);
    
    try {
      // Supabase REST API ile SQL çalıştır
      // NOT: Anon key ile sadece SELECT çalışır, DDL (CREATE TABLE vs) çalışmaz
      // Bu yüzden bu script sadece SELECT sorguları için çalışır
      // DDL için service_role key veya SQL Editor gerekir
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ query: stmt }),
      });
      
      if (response.ok) {
        successCount++;
        console.log(`  ✓ Basarili`);
      } else {
        const err = await response.text();
        console.log(`  ✗ Hata: ${err}`);
        failCount++;
      }
    } catch (err) {
      console.log(`  ✗ Hata: ${err.message}`);
      failCount++;
    }
  }

  console.log("");
  console.log("=== SONUC ===");
  console.log(`Basarili: ${successCount}, Hatali: ${failCount}`);
  console.log("");
  
  if (failCount > 0) {
    console.log("NOT: DDL ifadeleri (CREATE TABLE, ALTER TABLE vb.) anon key ile calismaz.");
    console.log("Bu SQL'i Supabase Dashboard > SQL Editor'da manuel calistirmalisiniz.");
    console.log("");
    console.log("Alternatif olarak, asagidaki URL'yi tarayicida acip SQL Editor'a yapistirin:");
    console.log("https://supabase.com/dashboard/project/mmutjipoztdcundcfabj");
  }
}

runMigration().catch(console.error);
