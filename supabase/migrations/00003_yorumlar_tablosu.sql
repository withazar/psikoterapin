-- Yorumlar tablosu
CREATE TABLE IF NOT EXISTS yorumlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psikolog_id UUID NOT NULL REFERENCES psikolog_profilleri(id) ON DELETE CASCADE,
  danisan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  danisan_adi TEXT NOT NULL,
  puan INTEGER NOT NULL CHECK (puan >= 1 AND puan <= 5),
  yorum TEXT NOT NULL,
  onayli BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Yorumlar için index
CREATE INDEX IF NOT EXISTS idx_yorumlar_psikolog_id ON yorumlar(psikolog_id);
CREATE INDEX IF NOT EXISTS idx_yorumlar_danisan_id ON yorumlar(danisan_id);

-- Her danışan bir psikologa sadece bir yorum yapabilir
CREATE UNIQUE INDEX IF NOT EXISTS idx_yorumlar_unique ON yorumlar(psikolog_id, danisan_id);

-- Yorum eklendiğinde psikolog puanını güncelle
CREATE OR REPLACE FUNCTION update_psikolog_puani()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE psikolog_profilleri
  SET 
    puan_ortalamasi = (
      SELECT ROUND(AVG(puan)::numeric, 1)
      FROM yorumlar
      WHERE psikolog_id = NEW.psikolog_id AND onayli = true
    ),
    yorum_sayisi = (
      SELECT COUNT(*)
      FROM yorumlar
      WHERE psikolog_id = NEW.psikolog_id AND onayli = true
    ),
    updated_at = now()
  WHERE id = NEW.psikolog_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: yorum eklendiğinde/güncellendiğinde/silindiğinde puanı güncelle
DROP TRIGGER IF EXISTS trg_yorum_eklendi ON yorumlar;
CREATE TRIGGER trg_yorum_eklendi
  AFTER INSERT OR UPDATE OR DELETE ON yorumlar
  FOR EACH ROW
  EXECUTE FUNCTION update_psikolog_puani();

-- RLS politikaları
ALTER TABLE yorumlar ENABLE ROW LEVEL SECURITY;

-- Herkes onaylı yorumları görebilir
CREATE POLICY "Herkes onaylı yorumları görebilir"
  ON yorumlar FOR SELECT
  USING (onayli = true);

-- Giriş yapmış kullanıcılar yorum ekleyebilir
CREATE POLICY "Giriş yapmış kullanıcılar yorum ekleyebilir"
  ON yorumlar FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Kullanıcı kendi yorumunu güncelleyebilir/silebilir
CREATE POLICY "Kullanıcı kendi yorumunu güncelleyebilir"
  ON yorumlar FOR UPDATE
  USING (auth.uid() = danisan_id);

CREATE POLICY "Kullanıcı kendi yorumunu silebilir"
  ON yorumlar FOR DELETE
  USING (auth.uid() = danisan_id);
