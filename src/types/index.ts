// ============ KULLANICI TİPLERİ ============

export type UserRole = "admin" | "psikolog" | "danisan";

export interface User {
  id: string;
  email: string;
  ad: string;
  soyad: string;
  rol: UserRole;
  avatar_url?: string;
  telefon?: string;
  created_at: string;
  updated_at: string;
}

// ============ PSİKOLOG TİPLERİ ============

export type UzmanlikAlani =
  | "klinik-psikoloji"
  | "cinsel-terapi"
  | "cift-terapisi"
  | "cocuk-psikolojisi"
  | "ergen-psikolojisi"
  | "anksiyete"
  | "depresyon"
  | "travma"
  | "bagimlilik"
  | "aile-danismanligi"
  | "psikolojik-degerlendirme"
  | "noropsikoloji"
  | "adli-psikoloji"
  | "spor-psikolojisi"
  | "is-psikolojisi";

export type TerapiYontemi =
  | "bdt"
  | "emdr"
  | "psikanalitik"
  | "humanistik"
  | "gestalt"
  | "aile-sistemleri"
  | "sanat-terapisi"
  | "psikodrama"
  | "farkindalik-temelli"
  | "dbt";

export type TerapiTipi = "online" | "yuz-yuze" | "her-ikisi";

export type AbonelikDurumu = "aktif" | "pasif" | "askida" | "deneme";

export type AbonelikPaketi = "temel" | "premium" | "one-cikan";

export interface PsikologProfili {
  id: string;
  kullanici_id: string;
  unvan: string;
  hakkinda: string;
  uzmanlik_alani: UzmanlikAlani[];
  terapi_yontemi: TerapiYontemi[];
  terapi_tipi: TerapiTipi;
  sehir: string;
  ilce?: string;
  adres?: string;
  seans_ucreti: number;
  online_ucret?: number;
  deneyim_yili: number;
  egitim: EgitimBilgisi[];
  sertifikalar: Sertifika[];
  rozetler: Rozet[];
  puan_ortalamasi: number;
  yorum_sayisi: number;
  diploma_onayli: boolean;
  profil_foto_url?: string;
  kapak_foto_url?: string;
  abonelik_durumu: AbonelikDurumu;
  abonelik_paketi: AbonelikPaketi;
  ucretsiz_on_gorusme: boolean;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface EgitimBilgisi {
  id: string;
  okul_adi: string;
  bolum: string;
  derece: "lisans" | "yuksek-lisans" | "doktora";
  baslangic_yili: number;
  bitis_yili?: number;
  devam_ediyor: boolean;
}

export interface Sertifika {
  id: string;
  ad: string;
  kurum: string;
  alinma_tarihi: string;
  gecerlilik_tarihi?: string;
  dosya_url?: string;
  onayli: boolean;
}

export interface Rozet {
  id: string;
  tip: "dogrulanmis-uzman" | "populer" | "yeni-uye" | "one-cikan" | "guvenilir";
  label: string;
}

// ============ RANDEVU TİPLERİ ============

export type RandevuDurumu = "bekliyor" | "onaylandi" | "iptal" | "tamamlandi";

export interface Randevu {
  id: string;
  psikolog_id: string;
  psikolog_ad?: string;
  danisan_id: string;
  danisan_ad?: string;
  tarih: string;
  saat: string;
  sure?: number; // dakika
  tip: "online" | "yuz-yuze";
  durum: RandevuDurumu;
  not?: string;
  ucret?: number;
  odeme_yapildi: boolean;
  created_at: string;
  updated_at: string;
}

// ============ YORUM TİPLERİ ============

export interface Yorum {
  id: string;
  psikolog_id: string;
  danisan_id: string;
  danisan_adi: string;
  puan: number;
  yorum: string;
  onayli: boolean;
  created_at: string;
}

// ============ BLOG TİPLERİ ============

export interface BlogYazi {
  id: string;
  psikolog_id: string;
  psikolog_adi: string;
  baslik: string;
  ozet: string;
  icerik: string;
  kapak_gorseli?: string;
  etiketler: string[];
  okunma_sayisi: number;
  yayinda: boolean;
  created_at: string;
  updated_at: string;
}

// ============ ABONELİK TİPLERİ ============

export interface Abonelik {
  id: string;
  psikolog_id: string;
  paket: AbonelikPaketi;
  durum: AbonelikDurumu;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  otomatik_yenile: boolean;
  stripe_abonelik_id?: string;
  ucret: number;
  created_at: string;
  updated_at: string;
}

// ============ ÖDEME TİPLERİ ============

export interface Odeme {
  id: string;
  psikolog_id: string;
  abonelik_id: string;
  stripe_odeme_id: string;
  tutar: number;
  durum: "basarili" | "basarisiz" | "iade";
  donem_baslangic: string;
  donem_bitis: string;
  created_at: string;
}

// ============ ANKET / AI EŞLEŞTİRME ============

export interface AnketCevabi {
  soru_index: number;
  cevap: string | string[];
}

export interface EslesmeSonucu {
  psikolog_id: string;
  uyum_puani: number;
  neden: string;
}

// ============ FİLTRELEME ============

export interface FiltrelemeParametreleri {
  uzmanlik_alani?: UzmanlikAlani[];
  sehir?: string;
  min_ucret?: number;
  max_ucret?: number;
  terapi_yontemi?: TerapiYontemi[];
  terapi_tipi?: TerapiTipi;
  sadece_onayli_diploma?: boolean;
  ucretsiz_on_gorusme?: boolean;
  rozet?: string[];
  sirala?: "puan" | "yorum" | "ucret" | "deneyim";
}
