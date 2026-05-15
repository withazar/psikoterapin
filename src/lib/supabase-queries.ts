import { supabase } from "./supabase";
import type {
  User,
  PsikologProfili,
  Randevu,
  Yorum,
  BlogYazi,
  Abonelik,
  Odeme,
  AnketCevabi,
  EslesmeSonucu,
} from "@/types";

// ============================================
// PROFİL İŞLEMLERİ
// ============================================

export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as User;
}

export async function updateProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  if (error) throw error;
}

export async function getAllProfiles(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as User[];
}

// ============================================
// PSİKOLOG PROFİL İŞLEMLERİ
// ============================================

export async function getPsikologProfilleri(): Promise<PsikologProfili[]> {
  const { data, error } = await supabase
    .from("psikolog_profilleri")
    .select("*")
    .order("puan_ortalamasi", { ascending: false });
  if (error) throw error;
  return data as PsikologProfili[];
}

export async function getPsikologProfili(
  id: string
): Promise<PsikologProfili | null> {
  const { data, error } = await supabase
    .from("psikolog_profilleri")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as PsikologProfili;
}

export async function getPsikologProfiliByKullaniciId(
  kullaniciId: string
): Promise<PsikologProfili | null> {
  const { data, error } = await supabase
    .from("psikolog_profilleri")
    .select("*")
    .eq("kullanici_id", kullaniciId)
    .single();
  if (error) return null;
  return data as PsikologProfili;
}

export async function upsertPsikologProfili(
  profil: Partial<PsikologProfili> & { kullanici_id: string }
): Promise<void> {
  const existing = await getPsikologProfiliByKullaniciId(profil.kullanici_id);
  if (existing) {
    const { error } = await supabase
      .from("psikolog_profilleri")
      .update(profil)
      .eq("kullanici_id", profil.kullanici_id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("psikolog_profilleri")
      .insert(profil);
    if (error) throw error;
  }
}

// ============================================
// RANDEVU İŞLEMLERİ
// ============================================

export async function getRandevular(): Promise<Randevu[]> {
  const { data, error } = await supabase
    .from("randevular")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Randevu[];
}

export async function getDanisanRandevulari(
  danisanId: string
): Promise<Randevu[]> {
  const { data, error } = await supabase
    .from("randevular")
    .select("*")
    .eq("danisan_id", danisanId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Randevu[];
}

export async function getPsikologRandevulari(
  psikologId: string
): Promise<Randevu[]> {
  const { data, error } = await supabase
    .from("randevular")
    .select("*")
    .eq("psikolog_id", psikologId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Randevu[];
}

export async function createRandevu(
  randevu: Omit<Randevu, "id" | "created_at" | "updated_at">
): Promise<Randevu | null> {
  const { data, error } = await supabase
    .from("randevular")
    .insert(randevu)
    .select()
    .single();
  if (error) throw error;
  return data as Randevu;
}

export async function updateRandevuDurumu(
  id: string,
  durum: Randevu["durum"]
): Promise<void> {
  const { error } = await supabase
    .from("randevular")
    .update({ durum, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// YORUM İŞLEMLERİ
// ============================================

export async function getPsikologYorumlari(
  psikologId: string
): Promise<Yorum[]> {
  const { data, error } = await supabase
    .from("yorumlar")
    .select("*")
    .eq("psikolog_id", psikologId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Yorum[];
}

export async function createYorum(
  yorum: Omit<Yorum, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("yorumlar").insert(yorum);
  if (error) throw error;
}

// ============================================
// BLOG İŞLEMLERİ
// ============================================

export async function getBlogYazilari(): Promise<BlogYazi[]> {
  const { data, error } = await supabase
    .from("blog_yazilari")
    .select("*")
    .eq("yayinda", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as BlogYazi[];
}

export async function getBlogYazi(id: string): Promise<BlogYazi | null> {
  const { data, error } = await supabase
    .from("blog_yazilari")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as BlogYazi;
}

// ============================================
// ABONELİK İŞLEMLERİ
// ============================================

export async function getPsikologAbonelik(
  psikologId: string
): Promise<Abonelik | null> {
  const { data, error } = await supabase
    .from("abonelikler")
    .select("*")
    .eq("psikolog_id", psikologId)
    .single();
  if (error) return null;
  return data as Abonelik;
}

export async function createAbonelik(
  abonelik: Omit<Abonelik, "id" | "created_at" | "updated_at">
): Promise<void> {
  const { error } = await supabase.from("abonelikler").insert(abonelik);
  if (error) throw error;
}

export async function updateAbonelik(
  id: string,
  updates: Partial<Abonelik>
): Promise<void> {
  const { error } = await supabase
    .from("abonelikler")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// ÖDEME İŞLEMLERİ
// ============================================

export async function getPsikologOdemeleri(
  psikologId: string
): Promise<Odeme[]> {
  const { data, error } = await supabase
    .from("odemeler")
    .select("*")
    .eq("psikolog_id", psikologId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Odeme[];
}

export async function createOdeme(
  odeme: Omit<Odeme, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("odemeler").insert(odeme);
  if (error) throw error;
}

// ============================================
// ONAY BEKLEYEN PSİKOLOGLAR
// ============================================

export async function getOnayBekleyenler(): Promise<any[]> {
  const { data, error } = await supabase
    .from("onay_bekleyen_psikologlar")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addOnayBekleyen(data: {
  ad: string;
  email: string;
  alan: string;
  durum: string;
}): Promise<void> {
  const { error } = await supabase.from("onay_bekleyen_psikologlar").insert(data);
  if (error) throw error;
}

export async function updateOnayDurumu(
  id: string,
  durum: "onaylandi" | "reddedildi"
): Promise<void> {
  const { error } = await supabase
    .from("onay_bekleyen_psikologlar")
    .update({ durum })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// ANKET İŞLEMLERİ
// ============================================

export async function saveAnketCevabi(
  kullaniciId: string,
  cevaplar: Record<number, string | string[]>,
  eslesmeSonuclari: EslesmeSonucu[]
): Promise<void> {
  const { error } = await supabase.from("anket_cevaplari").insert({
    kullanici_id: kullaniciId,
    cevaplar,
    eslesme_sonuclari: eslesmeSonuclari,
  });
  if (error) throw error;
}
