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
// LOCALSTORAGE FALLBACK
// ============================================

const PSIKOLOG_PROFIL_KEY = "psikoterapin_psikolog_profilleri";
const ABONELIK_KEY = "psikoterapin_abonelikler";
const ODEME_KEY = "psikoterapin_odemeler";
const ONAY_BEKLEYEN_KEY = "psikoterapin_onay_bekleyenler";
const RANDEVU_KEY = "psikoterapin_randevular";

function getLocal<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setLocal<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalSingle<T>(key: string, id: string): T | null {
  const items = getLocal<T>(key);
  return (items as any[]).find(i => i.id === id || i.kullanici_id === id) || null;
}

function upsertLocal<T extends { id?: string; kullanici_id?: string }>(key: string, item: Partial<T>): void {
  const items = getLocal<any>(key);
  const idx = items.findIndex((i: any) => 
    (item.id && i.id === item.id) || 
    (item.kullanici_id && i.kullanici_id === item.kullanici_id)
  );
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...item };
  } else {
    items.push({ ...item, id: item.id || `local-${Date.now()}` });
  }
  setLocal(key, items);
}

// ============================================
// SUPABASE BAĞLANTI KONTROL
// ============================================

async function isSupabaseConnected(): Promise<boolean> {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

// ============================================
// PROFİL İŞLEMLERİ
// ============================================

export async function getProfile(userId: string): Promise<User | null> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) return data as User;
    }
  } catch {}
  return null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);
      if (error) throw error;
    }
  } catch (e) {
    console.warn("Profil güncelleme hatası:", e);
  }
}

export async function getAllProfiles(): Promise<User[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as User[];
    }
  } catch {}
  return [];
}

// ============================================
// PSİKOLOG PROFİL İŞLEMLERİ
// ============================================

export async function getPsikologProfilleri(): Promise<PsikologProfili[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("psikolog_profilleri")
        .select("*")
        .order("puan_ortalamasi", { ascending: false });
      if (!error && data) return data as PsikologProfili[];
    }
  } catch {}
  return getLocal<PsikologProfili>(PSIKOLOG_PROFIL_KEY);
}

export async function getPsikologProfili(
  id: string
): Promise<PsikologProfili | null> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("psikolog_profilleri")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as PsikologProfili;
    }
  } catch {}
  return getLocalSingle<PsikologProfili>(PSIKOLOG_PROFIL_KEY, id);
}

export async function getPsikologProfiliByKullaniciId(
  kullaniciId: string
): Promise<PsikologProfili | null> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("psikolog_profilleri")
        .select("*")
        .eq("kullanici_id", kullaniciId)
        .single();
      if (!error && data) return data as PsikologProfili;
    }
  } catch {}
  return getLocalSingle<PsikologProfili>(PSIKOLOG_PROFIL_KEY, kullaniciId);
}

export async function upsertPsikologProfili(
  profil: Partial<PsikologProfili> & { kullanici_id: string }
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
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
  } catch (e) {
    console.warn("Supabase profil kaydı hatası, localStorage'a kaydediliyor:", e);
  }
  // Her durumda localStorage'a kaydet
  upsertLocal(PSIKOLOG_PROFIL_KEY, profil);
}

// ============================================
// RANDEVU İŞLEMLERİ
// ============================================

export async function getRandevular(): Promise<Randevu[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("randevular")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Randevu[];
    }
  } catch {}
  return getLocal<Randevu>(RANDEVU_KEY);
}

export async function getDanisanRandevulari(
  danisanId: string
): Promise<Randevu[]> {
  const all = await getRandevular();
  return all.filter(r => r.danisan_id === danisanId);
}

export async function getPsikologRandevulari(
  psikologId: string
): Promise<Randevu[]> {
  const all = await getRandevular();
  return all.filter(r => r.psikolog_id === psikologId);
}

export async function createRandevu(
  randevu: Omit<Randevu, "id" | "created_at" | "updated_at">
): Promise<Randevu | null> {
  const newRandevu: Randevu = {
    ...randevu,
    id: `randevu-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Randevu;
  
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("randevular")
        .insert(randevu)
        .select()
        .single();
      if (!error && data) return data as Randevu;
    }
  } catch {}
  
  // localStorage'a kaydet
  const randevular = getLocal<Randevu>(RANDEVU_KEY);
  randevular.push(newRandevu);
  setLocal(RANDEVU_KEY, randevular);
  return newRandevu;
}

export async function updateRandevuDurumu(
  id: string,
  durum: Randevu["durum"]
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase
        .from("randevular")
        .update({ durum, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    }
  } catch {}
  
  // localStorage'da güncelle
  const randevular = getLocal<Randevu>(RANDEVU_KEY);
  const idx = randevular.findIndex(r => r.id === id);
  if (idx >= 0) {
    randevular[idx].durum = durum;
    randevular[idx].updated_at = new Date().toISOString();
    setLocal(RANDEVU_KEY, randevular);
  }
}

// ============================================
// YORUM İŞLEMLERİ
// ============================================

export async function getPsikologYorumlari(
  psikologId: string
): Promise<Yorum[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("yorumlar")
        .select("*")
        .eq("psikolog_id", psikologId)
        .order("created_at", { ascending: false });
      if (!error && data) return data as Yorum[];
    }
  } catch {}
  return [];
}

export async function createYorum(
  yorum: Omit<Yorum, "id" | "created_at">
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase.from("yorumlar").insert(yorum);
      if (error) throw error;
    }
  } catch (e) {
    console.warn("Yorum kaydedilemedi:", e);
  }
}

// ============================================
// BLOG İŞLEMLERİ
// ============================================

export async function getBlogYazilari(): Promise<BlogYazi[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("blog_yazilari")
        .select("*")
        .eq("yayinda", true)
        .order("created_at", { ascending: false });
      if (!error && data) return data as BlogYazi[];
    }
  } catch {}
  return [];
}

export async function getBlogYazi(id: string): Promise<BlogYazi | null> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("blog_yazilari")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as BlogYazi;
    }
  } catch {}
  return null;
}

// ============================================
// ABONELİK İŞLEMLERİ
// ============================================

export async function getPsikologAbonelik(
  psikologId: string
): Promise<Abonelik | null> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("abonelikler")
        .select("*")
        .eq("psikolog_id", psikologId)
        .single();
      if (!error && data) return data as Abonelik;
    }
  } catch {}
  return getLocalSingle<Abonelik>(ABONELIK_KEY, psikologId);
}

export async function createAbonelik(
  abonelik: Omit<Abonelik, "id" | "created_at" | "updated_at">
): Promise<void> {
  const newAbonelik = {
    ...abonelik,
    id: `abonelik-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase.from("abonelikler").insert(abonelik);
      if (error) throw error;
    }
  } catch {}
  
  upsertLocal(ABONELIK_KEY, newAbonelik);
}

export async function updateAbonelik(
  id: string,
  updates: Partial<Abonelik>
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase
        .from("abonelikler")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    }
  } catch {}
  
  upsertLocal(ABONELIK_KEY, { id, ...updates });
}

// ============================================
// ÖDEME İŞLEMLERİ
// ============================================

export async function getPsikologOdemeleri(
  psikologId: string
): Promise<Odeme[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("odemeler")
        .select("*")
        .eq("psikolog_id", psikologId)
        .order("created_at", { ascending: false });
      if (!error && data) return data as Odeme[];
    }
  } catch {}
  return getLocal<Odeme>(ODEME_KEY).filter(o => o.psikolog_id === psikologId);
}

export async function createOdeme(
  odeme: Omit<Odeme, "id" | "created_at">
): Promise<void> {
  const newOdeme = {
    ...odeme,
    id: `odeme-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase.from("odemeler").insert(odeme);
      if (error) throw error;
    }
  } catch {}
  
  const odemeler = getLocal<Odeme>(ODEME_KEY);
  odemeler.push(newOdeme as Odeme);
  setLocal(ODEME_KEY, odemeler);
}

// ============================================
// ONAY BEKLEYEN PSİKOLOGLAR
// ============================================

export async function getOnayBekleyenler(): Promise<any[]> {
  try {
    if (await isSupabaseConnected()) {
      const { data, error } = await supabase
        .from("onay_bekleyen_psikologlar")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
  } catch {}
  return getLocal<any>(ONAY_BEKLEYEN_KEY);
}

export async function addOnayBekleyen(data: {
  ad: string;
  email: string;
  alan: string;
  durum: string;
}): Promise<void> {
  const newItem = {
    ...data,
    id: `onay-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase.from("onay_bekleyen_psikologlar").insert(data);
      if (error) throw error;
    }
  } catch {}
  
  const items = getLocal<any>(ONAY_BEKLEYEN_KEY);
  items.push(newItem);
  setLocal(ONAY_BEKLEYEN_KEY, items);
}

export async function updateOnayDurumu(
  id: string,
  durum: "onaylandi" | "reddedildi"
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase
        .from("onay_bekleyen_psikologlar")
        .update({ durum })
        .eq("id", id);
      if (error) throw error;
    }
  } catch {}
  
  const items = getLocal<any>(ONAY_BEKLEYEN_KEY);
  const idx = items.findIndex((i: any) => i.id === id);
  if (idx >= 0) {
    items[idx].durum = durum;
    setLocal(ONAY_BEKLEYEN_KEY, items);
  }
}

// ============================================
// ANKET İŞLEMLERİ
// ============================================

export async function saveAnketCevabi(
  kullaniciId: string,
  cevaplar: Record<number, string | string[]>,
  eslesmeSonuclari: EslesmeSonucu[]
): Promise<void> {
  try {
    if (await isSupabaseConnected()) {
      const { error } = await supabase.from("anket_cevaplari").insert({
        kullanici_id: kullaniciId,
        cevaplar,
        eslesme_sonuclari: eslesmeSonuclari,
      });
      if (error) throw error;
    }
  } catch (e) {
    console.warn("Anket kaydedilemedi:", e);
  }
}
