import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY bulunamadı. Lütfen .env.local dosyasına ekleyin." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Migration SQL'ini oku
    const fs = await import("fs");
    const path = await import("path");
    const migrationPath = path.join(process.cwd(), "supabase", "migrations", "00003_yorumlar_tablosu.sql");
    const sql = fs.readFileSync(migrationPath, "utf-8");

    // SQL'i çalıştır
    const { error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Migration başarıyla çalıştırıldı!" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
