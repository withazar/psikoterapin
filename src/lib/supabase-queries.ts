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
  UserRole,
} from "@/types";

// ============================================
// LOCALSTORAGE YARDIMCILARI (Supabase offline fallback)
// ============================================

const LS_PREFIX = "psikoterapin_";

function getLocalData<T>(key: string): T[] {
  try {
    // Önce yeni key'i dene
    let data = localStorage.getItem(LS_PREFIX + key);
    if (!data) {
      // Eski key'den taşı (migrasyon)
      const oldKey = key.replace("psikoterapin_", "psikobul_");
      data = localStorage.getItem("psikobul_" + key);
      if (data) {
        localStorage.setItem(LS_PREFIX + key, data);
        localStorage.removeItem("psikobul_" + key);
      }
    }
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalData<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error("localStorage yazma hatası:", e);
  }
}

// ============================================
// PROFİL İŞLEMLERİ
// ============================================

export async function getProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data && !error) return data as User;
  } catch {}

  // Fallback: localStorage
  const users = getLocalData<any>("users");
  const user = users.find((u: any) => u.id === userId);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  try {
    await supabase.from("profiles").update(updates).eq("id", userId);
  } catch {}

  // Fallback: localStorage
  const users = getLocalData<any>("users");
  const index = users.findIndex((u: any) => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveLocalData("users", users);
  }
}

export async function getAllProfiles(): Promise<User[]> {
  try {
    const { data } = await supabase.from("profiles").select("*");
    if (data) return data as User[];
  } catch {}

  const users = getLocalData<any>("users");
  return users.map((u: any) => {
    const { password, ...rest } = u;
    return rest as User;
  });
}

// ============================================
// PSİKOLOG PROFİL İŞLEMLERİ
// ============================================

export async function getPsikologProfilleri(): Promise<PsikologProfili[]> {
  try {
    const { data } = await supabase
      .from("psikolog_profilleri")
      .select("*")
      .order("puan_ortalamasi", { ascending: false });
    if (data) return data as PsikologProfili[];
  } catch {}

  return getLocalData<PsikologProfili>("psikolog_profilleri");
}

export async function getPsikologProfili(
  id: string
): Promise<PsikologProfili | null> {
  try {
    const { data } = await supabase
      .from("psikolog_profilleri")
      .select("*")
      .eq("id", id)
      .single();
    if (data) return data as PsikologProfili;
  } catch {}

  const profiller = getLocalData<PsikologProfili>("psikolog_profilleri");
  return profiller.find((p) => p.id === id) || null;
}

export async function getPsikologProfiliByKullaniciId(
  kullaniciId: string
): Promise<PsikologProfili | null> {
  try {
    const { data } = await supabase
      .from("psikolog_profilleri")
      .select("*")
      .eq("kullanici_id", kullaniciId)
      .single();
    if (data) return data as PsikologProfili;
  } catch {}

  const profiller = getLocalData<PsikologProfili>("psikolog_profilleri");
  return profiller.find((p) => p.kullanici_id === kullaniciId) || null;
}

export async function upsertPsikologProfili(
  profil: Partial<PsikologProfili> & { kullanici_id: string }
): Promise<void> {
  try {
    const existing = await getPsikologProfiliByKullaniciId(profil.kullanici_id);
    if (existing) {
      await supabase
        .from("psikolog_profilleri")
        .update(profil)
        .eq("kullanici_id", profil.kullanici_id);
    } else {
      await supabase.from("psikolog_profilleri").insert(profil);
    }
  } catch {}

  // Fallback: localStorage
  const profiller = getLocalData<any>("psikolog_profilleri");
  const index = profiller.findIndex((p: any) => p.kullanici_id === profil.kullanici_id);
  if (index !== -1) {
    profiller[index] = { ...profiller[index], ...profil };
  } else {
    profiller.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      ...profil,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  saveLocalData("psikolog_profilleri", profiller);
}

// ============================================
// RANDEVU İŞLEMLERİ
// ============================================

export async function getRandevular(): Promise<Randevu[]> {
  try {
    const { data } = await supabase
      .from("randevular")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) return data as Randevu[];
  } catch {}

  return getLocalData<Randevu>("randevular");
}

export async function getDanisanRandevulari(
  danisanId: string
): Promise<Randevu[]> {
  try {
    const { data } = await supabase
      .from("randevular")
      .select("*")
      .eq("danisan_id", danisanId)
      .order("created_at", { ascending: false });
    if (data) return data as Randevu[];
  } catch {}

  const randevular = getLocalData<Randevu>("randevular");
  return randevular.filter((r) => r.danisan_id === danisanId);
}

export async function getPsikologRandevulari(
  psikologId: string
): Promise<Randevu[]> {
  try {
    const { data } = await supabase
      .from("randevular")
      .select("*")
      .eq("psikolog_id", psikologId)
      .order("created_at", { ascending: false });
    if (data) return data as Randevu[];
  } catch {}

  const randevular = getLocalData<Randevu>("randevular");
  return randevular.filter((r) => r.psikolog_id === psikologId);
}

export async function createRandevu(
  randevu: Omit<Randevu, "id" | "created_at" | "updated_at">
): Promise<Randevu | null> {
  try {
    const { data } = await supabase
      .from("randevular")
      .insert(randevu)
      .select()
      .single();
    if (data) return data as Randevu;
  } catch {}

  const yeniRandevu: Randevu = {
    ...randevu,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const randevular = getLocalData<Randevu>("randevular");
  randevular.unshift(yeniRandevu);
  saveLocalData("randevular", randevular);
  return yeniRandevu;
}

export async function updateRandevuDurumu(
  id: string,
  durum: Randevu["durum"]
): Promise<void> {
  try {
    await supabase
      .from("randevular")
      .update({ durum, updated_at: new Date().toISOString() })
      .eq("id", id);
  } catch {}

  const randevular = getLocalData<Randevu>("randevular");
  const index = randevular.findIndex((r) => r.id === id);
  if (index !== -1) {
    randevular[index] = { ...randevular[index], durum, updated_at: new Date().toISOString() };
    saveLocalData("randevular", randevular);
  }
}

// ============================================
// YORUM İŞLEMLERİ
// ============================================

export async function getPsikologYorumlari(
  psikologId: string
): Promise<Yorum[]> {
  try {
    const { data } = await supabase
      .from("yorumlar")
      .select("*")
      .eq("psikolog_id", psikologId)
      .order("created_at", { ascending: false });
    if (data) return data as Yorum[];
  } catch {}

  return getLocalData<Yorum>("yorumlar").filter((y) => y.psikolog_id === psikologId);
}

export async function createYorum(
  yorum: Omit<Yorum, "id" | "created_at">
): Promise<void> {
  try {
    await supabase.from("yorumlar").insert(yorum);
  } catch {}

  const yeniYorum: Yorum = {
    ...yorum,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
  };
  const yorumlar = getLocalData<Yorum>("yorumlar");
  yorumlar.unshift(yeniYorum);
  saveLocalData("yorumlar", yorumlar);
}

// ============================================
// BLOG İŞLEMLERİ
// ============================================

export async function getBlogYazilari(): Promise<BlogYazi[]> {
  try {
    const { data } = await supabase
      .from("blog_yazilari")
      .select("*")
      .eq("yayinda", true)
      .order("created_at", { ascending: false });
    if (data) return data as BlogYazi[];
  } catch {}

  return getLocalData<BlogYazi>("blog_yazilari").filter((b) => b.yayinda);
}

export async function getBlogYazi(id: string): Promise<BlogYazi | null> {
  try {
    const { data } = await supabase
      .from("blog_yazilari")
      .select("*")
      .eq("id", id)
      .single();
    if (data) return data as BlogYazi;
  } catch {}

  const yazilar = getLocalData<BlogYazi>("blog_yazilari");
  return yazilar.find((b) => b.id === id) || null;
}

// ============================================
// ABONELİK İŞLEMLERİ
// ============================================

export async function getPsikologAbonelik(
  psikologId: string
): Promise<Abonelik | null> {
  try {
    const { data } = await supabase
      .from("abonelikler")
      .select("*")
      .eq("psikolog_id", psikologId)
      .single();
    if (data) return data as Abonelik;
  } catch {}

  const abonelikler = getLocalData<Abonelik>("abonelikler");
  return abonelikler.find((a) => a.psikolog_id === psikologId) || null;
}

// ============================================
// ÖDEME İŞLEMLERİ
// ============================================

export async function getPsikologOdemeleri(
  psikologId: string
): Promise<Odeme[]> {
  try {
    const { data } = await supabase
      .from("odemeler")
      .select("*")
      .eq("psikolog_id", psikologId)
      .order("created_at", { ascending: false });
    if (data) return data as Odeme[];
  } catch {}

  return getLocalData<Odeme>("odemeler").filter((o) => o.psikolog_id === psikologId);
}

// ============================================
// ONAY BEKLEYEN PSİKOLOGLAR
// ============================================

export async function getOnayBekleyenler(): Promise<any[]> {
  try {
    const { data } = await supabase
      .from("onay_bekleyen_psikologlar")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) return data;
  } catch {}

  return getLocalData<any>("onay_bekleyenler");
}

export async function updateOnayDurumu(
  id: string,
  durum: "onaylandi" | "reddedildi"
): Promise<void> {
  try {
    await supabase
      .from("onay_bekleyen_psikologlar")
      .update({ durum })
      .eq("id", id);
  } catch {}

  const bekleyenler = getLocalData<any>("onay_bekleyenler");
  const index = bekleyenler.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    bekleyenler[index] = { ...bekleyenler[index], durum };
    saveLocalData("onay_bekleyenler", bekleyenler);
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
    await supabase.from("anket_cevaplari").insert({
      kullanici_id: kullaniciId,
      cevaplar,
      eslesme_sonuclari: eslesmeSonuclari,
    });
  } catch {}

  const anketler = getLocalData<any>("anket_cevaplari");
  anketler.push({
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
    kullanici_id: kullaniciId,
    cevaplar,
    eslesme_sonuclari: eslesmeSonuclari,
    created_at: new Date().toISOString(),
  });
  saveLocalData("anket_cevaplari", anketler);
}
