-- ============================================
-- PSİKOTERAPİN SUPABASE VERİTABANI ŞEMASI
-- ============================================

-- 1. KULLANICILAR (Supabase Auth ile senkronize)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  ad TEXT NOT NULL DEFAULT '',
  soyad TEXT NOT NULL DEFAULT '',
  rol TEXT NOT NULL DEFAULT 'danisan' CHECK (rol IN ('admin', 'psikolog', 'danisan')),
  avatar_url TEXT DEFAULT '',
  telefon TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. PSİKOLOG PROFİLLERİ
CREATE TABLE IF NOT EXISTS public.psikolog_profilleri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  unvan TEXT NOT NULL DEFAULT '',
  hakkinda TEXT DEFAULT '',
  uzmanlik_alani TEXT[] DEFAULT '{}',
  terapi_yontemi TEXT[] DEFAULT '{}',
  terapi_tipi TEXT DEFAULT 'her-ikisi' CHECK (terapi_tipi IN ('online', 'yuz-yuze', 'her-ikisi')),
  sehir TEXT DEFAULT '',
  ilce TEXT DEFAULT '',
  adres TEXT DEFAULT '',
  seans_ucreti INTEGER DEFAULT 0,
  online_ucret INTEGER DEFAULT 0,
  deneyim_yili INTEGER DEFAULT 0,
  egitim JSONB DEFAULT '[]',
  sertifikalar JSONB DEFAULT '[]',
  rozetler JSONB DEFAULT '[]',
  puan_ortalamasi NUMERIC(3,2) DEFAULT 0,
  yorum_sayisi INTEGER DEFAULT 0,
  diploma_onayli BOOLEAN DEFAULT false,
  profil_foto_url TEXT DEFAULT '',
  kapak_foto_url TEXT DEFAULT '',
  abonelik_durumu TEXT DEFAULT 'deneme' CHECK (abonelik_durumu IN ('aktif', 'pasif', 'askida', 'deneme')),
  abonelik_paketi TEXT DEFAULT 'temel' CHECK (abonelik_paketi IN ('temel', 'premium', 'one-cikan')),
  ucretsiz_on_gorusme BOOLEAN DEFAULT false,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.psikolog_profilleri ENABLE ROW LEVEL SECURITY;

-- 3. RANDEVULAR
CREATE TABLE IF NOT EXISTS public.randevular (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES public.psikolog_profilleri(id) ON DELETE CASCADE,
  psikolog_ad TEXT DEFAULT '',
  danisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  danisan_ad TEXT DEFAULT '',
  tarih TEXT NOT NULL,
  saat TEXT NOT NULL,
  sure INTEGER DEFAULT 50,
  tip TEXT NOT NULL CHECK (tip IN ('online', 'yuz-yuze')),
  durum TEXT DEFAULT 'bekliyor' CHECK (durum IN ('bekliyor', 'onaylandi', 'iptal', 'tamamlandi')),
  notlar TEXT DEFAULT '',
  ucret INTEGER DEFAULT 0,
  odeme_yapildi BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.randevular ENABLE ROW LEVEL SECURITY;

-- 4. YORUMLAR
CREATE TABLE IF NOT EXISTS public.yorumlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES public.psikolog_profilleri(id) ON DELETE CASCADE,
  danisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  danisan_adi TEXT NOT NULL,
  puan INTEGER NOT NULL CHECK (puan >= 1 AND puan <= 5),
  yorum TEXT NOT NULL,
  onayli BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.yorumlar ENABLE ROW LEVEL SECURITY;

-- 5. BLOG YAZILARI
CREATE TABLE IF NOT EXISTS public.blog_yazilari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES public.psikolog_profilleri(id) ON DELETE CASCADE,
  psikolog_adi TEXT NOT NULL,
  baslik TEXT NOT NULL,
  ozet TEXT DEFAULT '',
  icerik TEXT DEFAULT '',
  kapak_gorseli TEXT DEFAULT '',
  etiketler TEXT[] DEFAULT '{}',
  okunma_sayisi INTEGER DEFAULT 0,
  yayinda BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_yazilari ENABLE ROW LEVEL SECURITY;

-- 6. ABONELİKLER
CREATE TABLE IF NOT EXISTS public.abonelikler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES public.psikolog_profilleri(id) ON DELETE CASCADE,
  paket TEXT NOT NULL CHECK (paket IN ('temel', 'premium', 'one-cikan')),
  durum TEXT DEFAULT 'aktif' CHECK (durum IN ('aktif', 'pasif', 'askida', 'deneme')),
  baslangic_tarihi TIMESTAMPTZ DEFAULT NOW(),
  bitis_tarihi TIMESTAMPTZ,
  otomatik_yenile BOOLEAN DEFAULT true,
  stripe_abonelik_id TEXT DEFAULT '',
  ucret INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.abonelikler ENABLE ROW LEVEL SECURITY;

-- 7. ÖDEMELER
CREATE TABLE IF NOT EXISTS public.odemeler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES public.psikolog_profilleri(id) ON DELETE CASCADE,
  abonelik_id UUID REFERENCES public.abonelikler(id) ON DELETE SET NULL,
  stripe_odeme_id TEXT DEFAULT '',
  tutar INTEGER NOT NULL,
  durum TEXT DEFAULT 'basarili' CHECK (durum IN ('basarili', 'basarisiz', 'iade')),
  donem_baslangic TIMESTAMPTZ,
  donem_bitis TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.odemeler ENABLE ROW LEVEL SECURITY;

-- 8. ANKET CEVAPLARI
CREATE TABLE IF NOT EXISTS public.anket_cevaplari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cevaplar JSONB NOT NULL DEFAULT '{}',
  eslesme_sonuclari JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.anket_cevaplari ENABLE ROW LEVEL SECURITY;

-- 9. ONAY BEKLEYEN PSİKOLOGLAR
CREATE TABLE IF NOT EXISTS public.onay_bekleyen_psikologlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad TEXT NOT NULL,
  email TEXT NOT NULL,
  alan TEXT DEFAULT '',
  basvuru_tarihi TIMESTAMPTZ DEFAULT NOW(),
  durum TEXT DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'reddedildi')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.onay_bekleyen_psikologlar ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLİCİLERİ
-- ============================================

-- Profiller: Herkes kendi profilini görebilir, admin her şeyi görebilir
DROP POLICY IF EXISTS "Profiller herkese açık (temel bilgiler)" ON public.profiles;
CREATE POLICY "Profiller herkese açık (temel bilgiler)"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin tüm profilleri yönetebilir" ON public.profiles;
CREATE POLICY "Admin tüm profilleri yönetebilir"
  ON public.profiles FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin'));

-- Psikolog profilleri: Herkes görebilir, sadece sahibi ve admin güncelleyebilir
DROP POLICY IF EXISTS "Psikolog profilleri herkese açık" ON public.psikolog_profilleri;
CREATE POLICY "Psikolog profilleri herkese açık"
  ON public.psikolog_profilleri FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Psikolog kendi profilini güncelleyebilir" ON public.psikolog_profilleri;
CREATE POLICY "Psikolog kendi profilini güncelleyebilir"
  ON public.psikolog_profilleri FOR UPDATE
  USING (auth.uid() = kullanici_id);

DROP POLICY IF EXISTS "Psikolog kendi profilini oluşturabilir" ON public.psikolog_profilleri;
CREATE POLICY "Psikolog kendi profilini oluşturabilir"
  ON public.psikolog_profilleri FOR INSERT
  WITH CHECK (auth.uid() = kullanici_id);

DROP POLICY IF EXISTS "Admin psikolog profillerini yönetebilir" ON public.psikolog_profilleri;
CREATE POLICY "Admin psikolog profillerini yönetebilir"
  ON public.psikolog_profilleri FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin'));

-- Randevular
DROP POLICY IF EXISTS "Danışan kendi randevularını görebilir" ON public.randevular;
CREATE POLICY "Danışan kendi randevularını görebilir"
  ON public.randevular FOR SELECT
  USING (auth.uid() = danisan_id);

DROP POLICY IF EXISTS "Psikolog kendine ait randevuları görebilir" ON public.randevular;
CREATE POLICY "Psikolog kendine ait randevuları görebilir"
  ON public.randevular FOR SELECT
  USING (auth.uid() IN (SELECT kullanici_id FROM public.psikolog_profilleri WHERE id = psikolog_id));

DROP POLICY IF EXISTS "Danışan randevu oluşturabilir" ON public.randevular;
CREATE POLICY "Danışan randevu oluşturabilir"
  ON public.randevular FOR INSERT
  WITH CHECK (auth.uid() = danisan_id);

DROP POLICY IF EXISTS "Psikolog randevuları güncelleyebilir" ON public.randevular;
CREATE POLICY "Psikolog randevuları güncelleyebilir"
  ON public.randevular FOR UPDATE
  USING (auth.uid() IN (SELECT kullanici_id FROM public.psikolog_profilleri WHERE id = psikolog_id));

DROP POLICY IF EXISTS "Admin tüm randevuları yönetebilir" ON public.randevular;
CREATE POLICY "Admin tüm randevuları yönetebilir"
  ON public.randevular FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin'));

-- Yorumlar
DROP POLICY IF EXISTS "Yorumlar herkese açık" ON public.yorumlar;
CREATE POLICY "Yorumlar herkese açık"
  ON public.yorumlar FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Danışan yorum ekleyebilir" ON public.yorumlar;
CREATE POLICY "Danışan yorum ekleyebilir"
  ON public.yorumlar FOR INSERT
  WITH CHECK (auth.uid() = danisan_id);

-- Blog
DROP POLICY IF EXISTS "Blog yazıları herkese açık" ON public.blog_yazilari;
CREATE POLICY "Blog yazıları herkese açık"
  ON public.blog_yazilari FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Psikolog kendi blog yazılarını yönetebilir" ON public.blog_yazilari;
CREATE POLICY "Psikolog kendi blog yazılarını yönetebilir"
  ON public.blog_yazilari FOR ALL
  USING (auth.uid() IN (SELECT kullanici_id FROM public.psikolog_profilleri WHERE id = psikolog_id));

-- Abonelikler
DROP POLICY IF EXISTS "Psikolog kendi aboneliğini görebilir" ON public.abonelikler;
CREATE POLICY "Psikolog kendi aboneliğini görebilir"
  ON public.abonelikler FOR SELECT
  USING (auth.uid() IN (SELECT kullanici_id FROM public.psikolog_profilleri WHERE id = psikolog_id));

DROP POLICY IF EXISTS "Admin abonelikleri yönetebilir" ON public.abonelikler;
CREATE POLICY "Admin abonelikleri yönetebilir"
  ON public.abonelikler FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin'));

-- Ödemeler
DROP POLICY IF EXISTS "Psikolog kendi ödemelerini görebilir" ON public.odemeler;
CREATE POLICY "Psikolog kendi ödemelerini görebilir"
  ON public.odemeler FOR SELECT
  USING (auth.uid() IN (SELECT kullanici_id FROM public.psikolog_profilleri WHERE id = psikolog_id));

DROP POLICY IF EXISTS "Admin ödemeleri yönetebilir" ON public.odemeler;
CREATE POLICY "Admin ödemeleri yönetebilir"
  ON public.odemeler FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin'));

-- ============================================
-- TRIGGER: Yeni kullanıcı kaydolduğunda profile ekle
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, ad, soyad, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'ad', ''),
    COALESCE(NEW.raw_user_meta_data->>'soyad', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'danisan')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: updated_at güncelleme
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_psikolog_profilleri_updated_at ON public.psikolog_profilleri;
CREATE TRIGGER update_psikolog_profilleri_updated_at
  BEFORE UPDATE ON public.psikolog_profilleri
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_randevular_updated_at ON public.randevular;
CREATE TRIGGER update_randevular_updated_at
  BEFORE UPDATE ON public.randevular
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_blog_yazilari_updated_at ON public.blog_yazilari;
CREATE TRIGGER update_blog_yazilari_updated_at
  BEFORE UPDATE ON public.blog_yazilari
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_abonelikler_updated_at ON public.abonelikler;
CREATE TRIGGER update_abonelikler_updated_at
  BEFORE UPDATE ON public.abonelikler
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
