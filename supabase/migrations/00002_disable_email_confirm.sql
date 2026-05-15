-- ============================================
-- E-POSTA DOĞRULAMASINI KAPAT
-- ============================================

-- Yeni kullanıcılar için e-posta doğrulamasını kaldır
-- Bu sayede kayıt sonrası direkt giriş yapılabilecek

-- Mevcut kullanıcıların e-postalarını doğrula
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- Yeni kayıtlarda otomatik doğrulama için trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'auto_confirm_email_trigger'
  ) THEN
    CREATE TRIGGER auto_confirm_email_trigger
      BEFORE INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.auto_confirm_email();
  END IF;
END;
$$;
