// ========== MERKEZİ LOCALSTORAGE VERİ KATMANI ==========
// Tüm sayfalar buradan veri okur, böylece güncellemeler her yerde görünür.

import { PsikologProfili, AbonelikPaketi } from "@/types";
import { MOCK_PSIKOLOGLAR } from "./data";

// ========== PSİKOLOG PROFİLLERİ ==========

const STORAGE_KEY_PROFILLER = "psikoterapin_psikolog_profilleri";
const STORAGE_KEY_ABONELIKLER = "psikoterapin_abonelikler";
const STORAGE_KEY_RANDEVULAR = "psikoterapin_randevular";
const STORAGE_KEY_KULLANICILAR = "psikoterapin_kullanicilar";
const STORAGE_KEY_OTURUM = "psikoterapin_oturum";
const STORAGE_KEY_ONAY_BEKLEYENLER = "psikoterapin_onay_bekleyenler";
const STORAGE_KEY_ODEMELER = "psikoterapin_odemeler";

// Eski key'leri temizle (psikobul_ prefix'li)
function migrateOldKeys() {
  const oldKeys = [
    "psikobul_psikolog_profilleri",
    "psikobul_randevular",
    "psikobul_users",
    "psikobul_session",
    "psikobul_onay_bekleyenler",
    "psikobul_odemeler",
  ];
  oldKeys.forEach((key) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        // Yeni key'e taşı
        const newKey = key.replace("psikobul_", "psikoterapin_");
        if (!localStorage.getItem(newKey)) {
          localStorage.setItem(newKey, data);
        }
        localStorage.removeItem(key);
      }
    } catch {}
  });
}

// Migration'ı çalıştır
if (typeof window !== "undefined") {
  migrateOldKeys();
}

// ========== PSİKOLOG PROFİLLERİ ==========

export function getPsikologProfilleri(): any[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROFILLER);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function savePsikologProfilleri(profiller: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILLER, JSON.stringify(profiller));
  } catch (e) {
    console.error("Profil kaydetme hatası:", e);
  }
}

export function getPsikologProfiliByKullaniciId(kullaniciId: string): any {
  const profiller = getPsikologProfilleri();
  return profiller.find((p: any) => p.kullanici_id === kullaniciId) || null;
}

export function upsertPsikologProfili(profil: any) {
  const profiller = getPsikologProfilleri();
  const index = profiller.findIndex((p: any) => p.kullanici_id === profil.kullanici_id);
  if (index !== -1) {
    profiller[index] = { ...profiller[index], ...profil, updated_at: new Date().toISOString() };
  } else {
    profiller.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      ...profil,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  savePsikologProfilleri(profiller);
}

// ========== TÜM PSİKOLOGLARI AL (MOCK + LOCALSTORAGE BİRLEŞİK) ==========

export function getTumPsikologlar(): PsikologProfili[] {
  // Mock verileri al
  const tumPsikologlar = [...MOCK_PSIKOLOGLAR];
  
  // localStorage'daki profilleri al
  const localProfiller = getPsikologProfilleri();
  
  // Abonelik verilerini al
  const abonelikler = getAbonelikler();
  
  // Admin onay bilgilerini al
  const onayBekleyenler = getOnayBekleyenler();
  
  // Her bir mock psikolog için localStorage'daki güncel bilgileri uygula
  return tumPsikologlar.map((mockPsk) => {
    // Kullanıcı ID'sine göre eşleştir
    const localProfil = localProfiller.find((lp: any) => lp.kullanici_id === mockPsk.kullanici_id);
    
    // Abonelik bilgisini kontrol et
    const abonelik = abonelikler[mockPsk.kullanici_id];
    
    // Admin onay durumunu kontrol et
    const onayDurumu = onayBekleyenler.find((b: any) => b.kullanici_id === mockPsk.kullanici_id);
    
    let updatedPsk = { ...mockPsk };
    
    if (localProfil) {
      updatedPsk = {
        ...updatedPsk,
        unvan: localProfil.unvan || mockPsk.unvan,
        hakkinda: localProfil.hakkinda || mockPsk.hakkinda,
        sehir: localProfil.sehir || mockPsk.sehir,
        uzmanlik_alani: localProfil.uzmanlik_alani || mockPsk.uzmanlik_alani,
        terapi_yontemi: localProfil.terapi_yontemi || mockPsk.terapi_yontemi,
        seans_ucreti: localProfil.seans_ucreti || mockPsk.seans_ucreti,
        deneyim_yili: localProfil.deneyim_yili || mockPsk.deneyim_yili,
        // Admin onay durumunu local profil'den al
        admin_onaylandi: localProfil.admin_onaylandi !== undefined ? localProfil.admin_onaylandi : mockPsk.admin_onaylandi,
        aktif: localProfil.aktif !== undefined ? localProfil.aktif : mockPsk.aktif,
      };
    }
    
    // Admin onay durumunu onay bekleyenlerden de kontrol et
    if (onayDurumu) {
      if (onayDurumu.durum === "onaylandi") {
        updatedPsk.admin_onaylandi = true;
        updatedPsk.aktif = true;
      } else if (onayDurumu.durum === "reddedildi") {
        updatedPsk.admin_onaylandi = false;
        updatedPsk.aktif = false;
      }
    }
    
    // Abonelik bilgisini uygula (localStorage'daki abonelik önceliklidir)
    if (abonelik) {
      updatedPsk.abonelik_paketi = abonelik.paket || updatedPsk.abonelik_paketi;
      updatedPsk.abonelik_durumu = abonelik.durum || updatedPsk.abonelik_durumu;
      // Abonelik aktifse ve admin onayladıysa aktif et
      if (abonelik.durum === "aktif" && updatedPsk.admin_onaylandi !== false) {
        updatedPsk.aktif = true;
      }
    } else {
      // Abonelik yoksa mock'taki bilgiyi kullan
      updatedPsk.aktif = mockPsk.aktif !== undefined ? mockPsk.aktif : true;
    }
    
    return updatedPsk;
  });
}



// ========== ABONELİKLER ==========

export function getAbonelikler(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ABONELIKLER) || "{}");
  } catch {
    return {};
  }
}

export function saveAbonelik(kullaniciId: string, abonelikData: any) {
  const data = getAbonelikler();
  data[kullaniciId] = abonelikData;
  try {
    localStorage.setItem(STORAGE_KEY_ABONELIKLER, JSON.stringify(data));
  } catch (e) {
    console.error("Abonelik kaydetme hatası:", e);
  }
}

export function getAbonelik(kullaniciId: string): any {
  const data = getAbonelikler();
  return data[kullaniciId] || null;
}

// ========== RANDEVULAR ==========

export function getRandevular(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_RANDEVULAR) || "[]");
  } catch {
    return [];
  }
}

export function saveRandevular(randevular: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_RANDEVULAR, JSON.stringify(randevular));
  } catch (e) {
    console.error("Randevu kaydetme hatası:", e);
  }
}

// ========== KULLANICILAR ==========

export function getKullanicilar(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_KULLANICILAR) || "[]");
  } catch {
    return [];
  }
}

export function saveKullanicilar(kullanicilar: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_KULLANICILAR, JSON.stringify(kullanicilar));
  } catch (e) {
    console.error("Kullanıcı kaydetme hatası:", e);
  }
}

export function getOturum(): any {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_OTURUM) || "null");
  } catch {
    return null;
  }
}

export function saveOturum(oturum: any) {
  try {
    if (oturum) {
      localStorage.setItem(STORAGE_KEY_OTURUM, JSON.stringify(oturum));
    } else {
      localStorage.removeItem(STORAGE_KEY_OTURUM);
    }
  } catch (e) {
    console.error("Oturum kaydetme hatası:", e);
  }
}

// ========== ONAY BEKLEYENLER ==========

export function getOnayBekleyenler(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ONAY_BEKLEYENLER) || "[]");
  } catch {
    return [];
  }
}

export function saveOnayBekleyenler(data: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ONAY_BEKLEYENLER, JSON.stringify(data));
  } catch (e) {
    console.error("Onay bekleyen kaydetme hatası:", e);
  }
}

// ========== ÖDEMELER ==========

export function getOdemeler(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ODEMELER) || "[]");
  } catch {
    return [];
  }
}

export function saveOdemeler(data: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ODEMELER, JSON.stringify(data));
  } catch (e) {
    console.error("Ödeme kaydetme hatası:", e);
  }
}

// ========== YORUMLAR ==========

const STORAGE_KEY_YORUMLAR = "psikoterapin_yorumlar";

export function getYorumlar(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_YORUMLAR) || "[]");
  } catch {
    return [];
  }
}

export function saveYorumlar(yorumlar: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_YORUMLAR, JSON.stringify(yorumlar));
  } catch (e) {
    console.error("Yorum kaydetme hatası:", e);
  }
}

export function getPsikologYorumlari(psikologId: string): any[] {
  const yorumlar = getYorumlar();
  return yorumlar.filter((y: any) => y.psikolog_id === psikologId && y.onayli);
}

export function yorumEkle(yorum: any) {
  const yorumlar = getYorumlar();
  yorumlar.push({
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
    ...yorum,
    onayli: true,
    created_at: new Date().toISOString(),
  });
  saveYorumlar(yorumlar);
  
  // Psikolog puanını güncelle
  const psikologYorumlari = yorumlar.filter((y: any) => y.psikolog_id === yorum.psikolog_id && y.onayli);
  const ortalamaPuan = psikologYorumlari.reduce((sum: number, y: any) => sum + y.puan, 0) / psikologYorumlari.length;
  
  const profiller = getPsikologProfilleri();
  const profilIndex = profiller.findIndex((p: any) => p.kullanici_id === yorum.psikolog_id);
  if (profilIndex !== -1) {
    profiller[profilIndex].puan_ortalamasi = Math.round(ortalamaPuan * 10) / 10;
    profiller[profilIndex].yorum_sayisi = psikologYorumlari.length;
    savePsikologProfilleri(profiller);
  }
  
  // Mock verilerdeki puanı da güncelle
  const tumPsikologlar = getTumPsikologlar();
  const mockIndex = tumPsikologlar.findIndex((p: any) => p.kullanici_id === yorum.psikolog_id);
  if (mockIndex !== -1) {
    // Mock veriler localStorage'da saklanmadığı için sadece local profiller güncellenir
  }
}


