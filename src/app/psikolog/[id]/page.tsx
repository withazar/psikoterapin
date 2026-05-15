"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  Video,
  Shield,
  Clock,
  GraduationCap,
  Award,
  MessageCircle,
  Calendar,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  X,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Send,
} from "lucide-react";
import { getTumPsikologlar } from "@/lib/localData";
import { getPsikologYorumlari, createYorum, getPsikologRandevulari } from "@/lib/supabase-queries";

import {
  formatPara,
  formatTarih,
  UZMANLIK_ALANLARI,
  TERAPI_YONTEMLERI,
} from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRandevu } from "@/context/RandevuContext";
import { Yorum } from "@/types";


export default function PsikologDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { randevuAl } = useRandevu();
  const tumPsikologlar = getTumPsikologlar();
  const psikolog = tumPsikologlar.find((p: any) => p.id === params.id);

  const [showRandevuModal, setShowRandevuModal] = useState(false);
  const [showOnGorusmeModal, setShowOnGorusmeModal] = useState(false);
  const [randevuForm, setRandevuForm] = useState({
    tarih: "",
    saat: "",
    tip: "yuz-yuze" as "yuz-yuze" | "online",
    not: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!psikolog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-calm-900">
            Psikolog bulunamadı
          </h2>
          <Link href="/psikologlar" className="btn-primary mt-4 inline-flex">
            Psikologlara Dön
          </Link>
        </div>
      </div>
    );
  }

  const initials = psikolog.unvan
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const handleRandevuAl = () => {
    if (!user) {
      router.push("/kayit");
      return;
    }
    setShowRandevuModal(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleOnGorusme = () => {
    if (!user) {
      router.push("/kayit");
      return;
    }
    setShowOnGorusmeModal(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const submitRandevu = () => {
    if (!randevuForm.tarih || !randevuForm.saat) {
      setErrorMsg("Lütfen tarih ve saat seçin.");
      return;
    }
    if (!user) return;

    randevuAl({
      psikolog_id: psikolog.id,
      psikolog_ad: psikolog.unvan,
      danisan_id: user.id,
      danisan_ad: `${user.ad} ${user.soyad}`,
      tarih: randevuForm.tarih,
      saat: randevuForm.saat,
      tip: randevuForm.tip,
      not: randevuForm.not,
    });

    setSuccessMsg("Randevu talebiniz başarıyla gönderildi! Psikolog onayını bekleyin.");
    setShowRandevuModal(false);
    setRandevuForm({ tarih: "", saat: "", tip: "yuz-yuze", not: "" });
  };

  const submitOnGorusme = () => {
    if (!user) return;

    randevuAl({
      psikolog_id: psikolog.id,
      psikolog_ad: psikolog.unvan,
      danisan_id: user.id,
      danisan_ad: `${user.ad} ${user.soyad}`,
      tarih: new Date().toISOString().split("T")[0],
      saat: "Ön görüşme talep edildi",
      tip: "online",
      not: "Ücretsiz ön görüşme talebi",
    });

    setSuccessMsg("Ücretsiz ön görüşme talebiniz gönderildi! Psikolog sizinle iletişime geçecek.");
    setShowOnGorusmeModal(false);
  };

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Back Button */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/psikologlar"
            className="inline-flex items-center gap-1 text-sm text-calm-500 hover:text-calm-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Psikologlara Dön
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-700">{successMsg}</p>
            <button onClick={() => setSuccessMsg("")} className="ml-auto text-green-500 hover:text-green-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ring-2 ring-primary-100 shrink-0">
                  <span className="text-3xl font-bold text-primary-600">
                    {initials}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-calm-900">
                        {psikolog.unvan}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-amber-400">
                          <Star className="h-5 w-5 fill-current" />
                          <span className="ml-1 font-semibold text-calm-700">
                            {psikolog.puan_ortalamasi}
                          </span>
                        </div>
                        <span className="text-calm-400">
                          ({psikolog.yorum_sayisi} yorum)
                        </span>
                        <span className="text-calm-300">•</span>
                        <span className="text-calm-500">
                          {psikolog.deneyim_yili} yıl deneyim
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-calm-900">
                        {formatPara(psikolog.seans_ucreti)}
                      </p>
                      <p className="text-sm text-calm-500">/ seans</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {psikolog.rozetler.map((rozet) => (
                      <span
                        key={rozet.id}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          rozet.tip === "dogrulanmis-uzman"
                            ? "bg-primary-100 text-primary-700"
                            : rozet.tip === "populer"
                            ? "bg-amber-100 text-amber-700"
                            : rozet.tip === "one-cikan"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {rozet.tip === "one-cikan" && (
                          <Sparkles className="h-3 w-3" />
                        )}
                        {rozet.label}
                      </span>
                    ))}
                    {psikolog.diploma_onayli && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        <Shield className="h-3 w-3" />
                        Diploma Onaylı
                      </span>
                    )}
                  </div>

                  {/* Location & Features */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-calm-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {psikolog.sehir}
                      {psikolog.ilce && ` / ${psikolog.ilce}`}
                    </span>
                    {psikolog.terapi_tipi !== "yuz-yuze" && (
                      <span className="flex items-center gap-1.5 text-secondary-600">
                        <Video className="h-4 w-4" />
                        Online Terapi
                      </span>
                    )}
                    {psikolog.terapi_tipi !== "online" && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        Yüz Yüze Terapi
                      </span>
                    )}
                    {psikolog.ucretsiz_on_gorusme && (
                      <span className="flex items-center gap-1.5 text-primary-600">
                        <Clock className="h-4 w-4" />
                        Ücretsiz Ön Görüşme
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card">
              <h2 className="text-lg font-semibold text-calm-900 mb-3">
                Hakkında
              </h2>
              <p className="text-calm-600 leading-relaxed">
                {psikolog.hakkinda}
              </p>
            </div>

            {/* Specialties */}
            <div className="card">
              <h2 className="text-lg font-semibold text-calm-900 mb-4">
                Uzmanlık Alanları
              </h2>
              <div className="flex flex-wrap gap-2">
                {psikolog.uzmanlik_alani.map((alan) => (
                  <span
                    key={alan}
                    className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700"
                  >
                    {UZMANLIK_ALANLARI[alan] || alan}
                  </span>
                ))}
              </div>
            </div>

            {/* Therapy Methods */}
            <div className="card">
              <h2 className="text-lg font-semibold text-calm-900 mb-4">
                Terapi Yöntemleri
              </h2>
              <div className="flex flex-wrap gap-2">
                {psikolog.terapi_yontemi.map((yontem) => (
                  <span
                    key={yontem}
                    className="inline-flex items-center rounded-full bg-accent-50 px-4 py-1.5 text-sm font-medium text-accent-700"
                  >
                    {TERAPI_YONTEMLERI[yontem] || yontem}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <h2 className="text-lg font-semibold text-calm-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-500" />
                Eğitim
              </h2>
              <div className="space-y-4">
                {psikolog.egitim.map((egitim) => (
                  <div
                    key={egitim.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-calm-900">
                        {egitim.okul_adi}
                      </p>
                      <p className="text-sm text-calm-500">
                        {egitim.bolum} -{" "}
                        {egitim.derece === "lisans"
                          ? "Lisans"
                          : egitim.derece === "yuksek-lisans"
                          ? "Yüksek Lisans"
                          : "Doktora"}
                      </p>
                      <p className="text-xs text-calm-400">
                        {egitim.baslangic_yili} -{" "}
                        {egitim.devam_ediyor ? "Devam Ediyor" : egitim.bitis_yili}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="card">
              <h2 className="text-lg font-semibold text-calm-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-500" />
                Sertifikalar
              </h2>
              <div className="space-y-3">
                {psikolog.sertifikalar.map((sertifika) => (
                  <div
                    key={sertifika.id}
                    className="flex items-start gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-secondary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-calm-900">
                        {sertifika.ad}
                      </p>
                      <p className="text-sm text-calm-500">
                        {sertifika.kurum} - {sertifika.alinma_tarihi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yorumlar */}
            <YorumBolumu psikologId={psikolog.id} psikologAdi={psikolog.unvan} />
          </div>


          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appointment Card */}
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-calm-900 mb-4">
                Randevu Al
              </h3>

              {/* Price Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-calm-600">
                    Yüz Yüze Seans
                  </span>
                  <span className="font-semibold text-calm-900">
                    {formatPara(psikolog.seans_ucreti)}
                  </span>
                </div>
                {psikolog.online_ucret && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-calm-600">
                      Online Seans
                    </span>
                    <span className="font-semibold text-calm-900">
                      {formatPara(psikolog.online_ucret)}
                    </span>
                  </div>
                )}
                {psikolog.ucretsiz_on_gorusme && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-green-600 font-medium">
                      Ücretsiz Ön Görüşme
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      15 dk
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRandevuAl}
                className="btn-primary w-full justify-center mb-3"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Randevu Al
              </button>

              {psikolog.ucretsiz_on_gorusme && (
                <button
                  onClick={handleOnGorusme}
                  className="btn-secondary w-full justify-center"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Ücretsiz Ön Görüşme
                </button>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <p className="text-xs font-medium text-calm-400 uppercase tracking-wider">
                  İletişim
                </p>
                <p className="text-sm text-calm-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-calm-400" />
                  {psikolog.adres || `${psikolog.sehir} / ${psikolog.ilce}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Randevu Modal */}
      {showRandevuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-calm-900">Randevu Al</h3>
              <button onClick={() => setShowRandevuModal(false)} className="text-calm-400 hover:text-calm-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Psikolog</label>
                <input type="text" value={psikolog.unvan} disabled className="input-field bg-calm-50" />
              </div>
              <div>
                <label className="label">Seans Türü</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRandevuForm({ ...randevuForm, tip: "yuz-yuze" })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      randevuForm.tip === "yuz-yuze"
                        ? "bg-primary-600 text-white"
                        : "bg-calm-100 text-calm-600"
                    }`}
                  >
                    Yüz Yüze
                  </button>
                  <button
                    onClick={() => setRandevuForm({ ...randevuForm, tip: "online" })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      randevuForm.tip === "online"
                        ? "bg-primary-600 text-white"
                        : "bg-calm-100 text-calm-600"
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Tarih</label>
                <input
                  type="date"
                  value={randevuForm.tarih}
                  onChange={(e) => setRandevuForm({ ...randevuForm, tarih: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="label">Saat</label>
                <input
                  type="time"
                  value={randevuForm.saat}
                  onChange={(e) => setRandevuForm({ ...randevuForm, saat: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Not (İsteğe bağlı)</label>
                <textarea
                  placeholder="Randevu ile ilgili eklemek istedikleriniz..."
                  value={randevuForm.not}
                  onChange={(e) => setRandevuForm({ ...randevuForm, not: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <button onClick={submitRandevu} className="btn-primary w-full justify-center">
                Randevu Talep Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ön Görüşme Modal */}
      {showOnGorusmeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-calm-900">Ücretsiz Ön Görüşme</h3>
              <button onClick={() => setShowOnGorusmeModal(false)} className="text-calm-400 hover:text-calm-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-calm-900 mb-2">15 Dakikalık Ücretsiz Ön Görüşme</h4>
              <p className="text-sm text-calm-500 mb-6">
                {psikolog.unvan} ile 15 dakikalık ücretsiz ön görüşme talep ediyorsunuz. Psikolog sizinle iletişime geçecektir.
              </p>
              <button onClick={submitOnGorusme} className="btn-primary w-full justify-center">
                Ön Görüşme Talep Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== YORUM BÖLÜMÜ ==========

function YorumBolumu({ psikologId, psikologAdi }: { psikologId: string; psikologAdi: string }) {
  const { user } = useAuth();
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [yorumMetni, setYorumMetni] = useState("");
  const [puan, setPuan] = useState(5);
  const [yorumYapiliyor, setYorumYapiliyor] = useState(false);
  const [yorumYapabilir, setYorumYapabilir] = useState(false);
  const [yorumYapildi, setYorumYapildi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    loadYorumlar();
  }, [psikologId, user]);

  const loadYorumlar = async () => {
    setYukleniyor(true);
    try {
      // Supabase'den yorumları yükle
      const psikologYorumlari = await getPsikologYorumlari(psikologId);
      setYorumlar(psikologYorumlari);

      // Kullanıcı bu psikologdan terapi almış mı kontrol et
      if (user) {
        const randevular = await getPsikologRandevulari(psikologId);
        const tamamlananRandevu = randevular.find(
          (r: any) => r.danisan_id === user.id && r.durum === "tamamlandi"
        );
        setYorumYapabilir(!!tamamlananRandevu);

        // Daha önce yorum yapmış mı kontrol et
        const oncekiYorum = psikologYorumlari.find((y: any) => y.danisan_id === user.id);
        setYorumYapildi(!!oncekiYorum);
      }
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
    }
    setYukleniyor(false);
  };

  const handleYorumGonder = async () => {
    if (!user || !yorumMetni.trim()) return;
    
    try {
      await createYorum({
        psikolog_id: psikologId,
        danisan_id: user.id,
        danisan_adi: `${user.ad} ${user.soyad}`,
        puan: puan,
        yorum: yorumMetni.trim(),
        onayli: true,
      });

      // Yorumları yeniden yükle
      await loadYorumlar();
      setYorumMetni("");
      setPuan(5);
      setYorumYapildi(true);
      setYorumYapiliyor(false);
    } catch (err) {
      console.error("Yorum gönderilirken hata:", err);
    }
  };


  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-calm-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary-500" />
        Yorumlar ({yorumlar.length})
      </h2>

      {/* Yorum Ekle */}
      {user && yorumYapabilir && !yorumYapildi && (
        <div className="mb-6 p-4 rounded-xl bg-calm-50 border border-gray-200">
          {yorumYapiliyor ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-calm-700">Puanın:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((y) => (
                    <button key={y} onClick={() => setPuan(y)}>
                      <Star className={`h-5 w-5 ${y <= puan ? "text-amber-400 fill-amber-400" : "text-calm-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder={`${psikologAdi} ile deneyiminizi paylaşın...`}
                value={yorumMetni}
                onChange={(e) => setYorumMetni(e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setYorumYapiliyor(false)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  İptal
                </button>
                <button
                  onClick={handleYorumGonder}
                  disabled={!yorumMetni.trim()}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  Gönder
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setYorumYapiliyor(true)}
              className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-dashed border-gray-300 hover:border-primary-300 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-primary-400" />
              <span className="text-sm text-calm-500">Deneyiminizi paylaşın, yorum yapın...</span>
            </button>
          )}
        </div>
      )}

      {/* Yorum yapamazsa bilgi mesajı */}
      {user && !yorumYapabilir && !yorumYapildi && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Yorum yapabilmek için bu psikologdan terapi almanız gerekmektedir.
          </p>
        </div>
      )}

      {/* Yorum yapıldı mesajı */}
      {user && yorumYapildi && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Bu psikolog için yorumunuzu paylaştınız.
          </p>
        </div>
      )}

      {/* Yorum Listesi */}
      <div className="space-y-4">
        {yorumlar.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-calm-300 mx-auto mb-3" />
            <p className="text-sm text-calm-500">Henüz yorum yapılmamış.</p>
            {!user && (
              <Link href="/kayit" className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
                İlk yorumu sen yap
              </Link>
            )}
          </div>
        ) : (
          yorumlar.map((yorum) => (
            <div key={yorum.id} className="p-4 rounded-xl bg-calm-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600">
                      {yorum.danisan_adi?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-calm-900">{yorum.danisan_adi}</p>
                    <p className="text-xs text-calm-400">
                      {new Date(yorum.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < yorum.puan ? "text-amber-400 fill-amber-400" : "text-calm-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-calm-600">{yorum.yorum}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


