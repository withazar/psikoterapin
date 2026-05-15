"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Settings,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  Save,
  Upload,
  FileText,
  Star,
  MessageSquare,
  CreditCard,
  LogOut,
  ChevronRight,
  Edit3,
  Eye,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  Heart,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRandevu } from "@/context/RandevuContext";
import { formatTarih, formatPara, SEHIRLER, UZMANLIK_ALANLARI, TERAPI_YONTEMLERI } from "@/lib/utils";
import {
  getPsikologProfiliByKullaniciId,
  upsertPsikologProfili,
  getPsikologAbonelik,
  createAbonelik,
  updateAbonelik,
} from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";

type PanelTab = "profil" | "randevular" | "yorumlar" | "abonelik" | "dokumanlar";

export default function PanelPage() {
  const router = useRouter();
  const { user, isPsikolog, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/kayit");
    } else if (!isPsikolog) {
      router.push("/");
    }
  }, [user, isPsikolog, router]);

  if (!user || !isPsikolog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-calm-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-calm-900">Erişim Engellendi</h2>
          <p className="mt-2 text-calm-500">Bu sayfaya sadece psikologlar erişebilir.</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return <PsikologPanel />;
}

function PsikologPanel() {
  const { user, updateUser } = useAuth();
  const { psikologRandevulari, randevuOnayla, randevuIptal, randevuTamamla } = useRandevu();
  const [activeTab, setActiveTab] = useState<PanelTab>("profil");

  const tabs = [
    { id: "profil" as PanelTab, label: "Profil", icon: User },
    { id: "randevular" as PanelTab, label: "Randevular", icon: Calendar },
    { id: "yorumlar" as PanelTab, label: "Yorumlar", icon: MessageSquare },
    { id: "abonelik" as PanelTab, label: "Abonelik", icon: CreditCard },
    { id: "dokumanlar" as PanelTab, label: "Dökümanlar", icon: FileText },
  ];

  const randevular = user ? psikologRandevulari(user.id) : [];
  const bekleyenRandevuSayisi = randevular.filter(r => r.durum === "bekliyor").length;

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-calm-900">Psikolog Paneli</h1>
                <p className="text-sm text-calm-500">
                  Hoş geldiniz, {user?.ad} {user?.soyad}
                </p>
              </div>
            </div>
            <Link href="/" className="text-sm text-calm-500 hover:text-calm-700">
              Siteye Dön
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bekleyen Randevu", value: bekleyenRandevuSayisi.toString(), icon: Clock, color: "text-amber-600 bg-amber-100" },
              { label: "Onaylanan", value: randevular.filter(r => r.durum === "onaylandi").length.toString(), icon: CheckCircle, color: "text-green-600 bg-green-100" },
              { label: "Tamamlanan", value: randevular.filter(r => r.durum === "tamamlandi").length.toString(), icon: Star, color: "text-blue-600 bg-blue-100" },
              { label: "Toplam Randevu", value: randevular.length.toString(), icon: Calendar, color: "text-purple-600 bg-purple-100" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-calm-50">
                <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-calm-500">{stat.label}</p>
                  <p className="text-lg font-bold text-calm-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-calm-500 hover:text-calm-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "profil" && <ProfilDuzenle />}
        {activeTab === "randevular" && (
          <RandevuListesi
            randevular={randevular}
            onOnayla={randevuOnayla}
            onIptal={randevuIptal}
            onTamamla={randevuTamamla}
          />
        )}
        {activeTab === "yorumlar" && <Yorumlar />}
        {activeTab === "abonelik" && <Abonelik />}
        {activeTab === "dokumanlar" && <Dokumanlar />}
      </div>
    </div>
  );
}

function ProfilDuzenle() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    unvan: "",
    sehir: "",
    telefon: user?.telefon || "",
    web: "",
    aciklama: "",
    egitim: "",
    deneyim: "",
    uzmanlik: [] as string[],
    yontemler: [] as string[],
    ucret: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const profil = await getPsikologProfiliByKullaniciId(user.id);
      if (profil) {
        setForm({
          unvan: profil.unvan || "",
          sehir: profil.sehir || "",
          telefon: user.telefon || "",
          web: "",
          aciklama: profil.hakkinda || "",
          egitim: profil.egitim?.map((e: any) => `${e.okul_adi} - ${e.bolum}`).join("\n") || "",
          deneyim: `${profil.deneyim_yili} yıl`,
          uzmanlik: profil.uzmanlik_alani || [],
          yontemler: profil.terapi_yontemi || [],
          ucret: profil.seans_ucreti?.toString() || "",
        });
      }
    } catch (err) {
      console.error("Profil yüklenirken hata:", err);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await upsertPsikologProfili({
        kullanici_id: user.id,
        unvan: form.unvan,
        sehir: form.sehir,
        hakkinda: form.aciklama,
        uzmanlik_alani: form.uzmanlik as any,
        terapi_yontemi: form.yontemler as any,
        seans_ucreti: parseInt(form.ucret) || 0,
        deneyim_yili: parseInt(form.deneyim) || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Profil kaydedilirken hata:", err);
    }
  };

  const toggleArray = (arr: string[], val: string): string[] => {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Profil Bilgileri</h2>
        <button onClick={handleSave} className="btn-primary text-sm py-2 px-4">
          <Save className="h-4 w-4 mr-1.5" />
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            Temel Bilgiler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Ad Soyad</label>
              <input
                type="text"
                value={`${user?.ad} ${user?.soyad}`}
                disabled
                className="input-field bg-calm-50"
              />
            </div>
            <div>
              <label className="label">E-posta</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input-field bg-calm-50"
              />
            </div>
            <div>
              <label className="label">Ünvan</label>
              <input
                type="text"
                placeholder="Örn: Uzm. Psk., Dr., Klinik Psikolog"
                value={form.unvan}
                onChange={(e) => setForm({ ...form, unvan: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={form.telefon}
                  onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label">Şehir</label>
              <select
                value={form.sehir}
                onChange={(e) => setForm({ ...form, sehir: e.target.value })}
                className="input-field"
              >
                <option value="">Şehir seçin</option>
                {SEHIRLER.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Web Sitesi</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                <input
                  type="url"
                  placeholder="https://"
                  value={form.web}
                  onChange={(e) => setForm({ ...form, web: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hakkında */}
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-500" />
            Hakkında
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Açıklama</label>
              <textarea
                placeholder="Kendinizi tanıtın, çalışma tarzınızı anlatın..."
                value={form.aciklama}
                onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
                rows={4}
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="label">Eğitim</label>
              <textarea
                placeholder="Mezuniyet bilgileriniz, sertifikalarınız..."
                value={form.egitim}
                onChange={(e) => setForm({ ...form, egitim: e.target.value })}
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="label">Deneyim</label>
              <textarea
                placeholder="Çalışma deneyimleriniz..."
                value={form.deneyim}
                onChange={(e) => setForm({ ...form, deneyim: e.target.value })}
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        {/* Uzmanlık Alanları */}
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary-500" />
            Uzmanlık Alanları
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(UZMANLIK_ALANLARI).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setForm({ ...form, uzmanlik: toggleArray(form.uzmanlik, key) })}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  form.uzmanlik.includes(key)
                    ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                    : "bg-calm-100 text-calm-600 hover:bg-calm-200"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Terapi Yöntemleri */}
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary-500" />
            Terapi Yöntemleri
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TERAPI_YONTEMLERI).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setForm({ ...form, yontemler: toggleArray(form.yontemler, key) })}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  form.yontemler.includes(key)
                    ? "bg-secondary-100 text-secondary-700 ring-1 ring-secondary-300"
                    : "bg-calm-100 text-calm-600 hover:bg-calm-200"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Seans Ücreti */}
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary-500" />
            Seans Ücreti
          </h3>
          <div className="max-w-xs">
            <label className="label">Seans ücreti (₺)</label>
            <input
              type="number"
              placeholder="500"
              value={form.ucret}
              onChange={(e) => setForm({ ...form, ucret: e.target.value })}
              className="input-field"
              min={0}
            />
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4 mr-1.5" />
            {saved ? "Kaydedildi ✓" : "Profili Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RandevuListesi({
  randevular,
  onOnayla,
  onIptal,
  onTamamla,
}: {
  randevular: any[];
  onOnayla: (id: string) => void;
  onIptal: (id: string) => void;
  onTamamla: (id: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? randevular : randevular.filter(r => r.durum === filter);

  const durumRenk = (durum: string) => {
    switch (durum) {
      case "bekliyor": return "bg-amber-100 text-amber-700";
      case "onaylandi": return "bg-green-100 text-green-700";
      case "iptal": return "bg-red-100 text-red-700";
      case "tamamlandi": return "bg-blue-100 text-blue-700";
      default: return "bg-calm-100 text-calm-700";
    }
  };

  const durumLabel = (durum: string) => {
    switch (durum) {
      case "bekliyor": return "Bekliyor";
      case "onaylandi": return "Onaylandı";
      case "iptal": return "İptal";
      case "tamamlandi": return "Tamamlandı";
      default: return durum;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Randevularım</h2>
        <div className="flex gap-2">
          {["all", "bekliyor", "onaylandi", "tamamlandi", "iptal"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-calm-100 text-calm-600 hover:bg-calm-200"
              }`}
            >
              {f === "all" ? "Tümü" : durumLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="h-12 w-12 text-calm-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-calm-900">Randevu bulunmuyor</h3>
            <p className="text-sm text-calm-500">Henüz randevunuz yok.</p>
          </div>
        ) : (
          filtered.map((randevu) => (
            <div key={randevu.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">D</span>
                  </div>
                  <div>
                    <p className="font-medium text-calm-900">
                      Danışan: {randevu.danisan_ad || randevu.danisan_id}
                    </p>
                    <p className="text-sm text-calm-500">
                      {randevu.tarih ? formatTarih(randevu.tarih) : "Tarih belirtilmemiş"}
                      {randevu.saat && ` • ${randevu.saat}`}
                    </p>
                    {randevu.not && (
                      <p className="text-xs text-calm-400 mt-1">{randevu.not}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${durumRenk(randevu.durum)}`}>
                    {durumLabel(randevu.durum)}
                  </span>
                  {randevu.durum === "bekliyor" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onOnayla(randevu.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Onayla
                      </button>
                      <button
                        onClick={() => onIptal(randevu.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        İptal
                      </button>
                    </div>
                  )}
                  {randevu.durum === "onaylandi" && (
                    <button
                      onClick={() => onTamamla(randevu.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Tamamla
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Yorumlar() {
  const yorumlar = [
    { id: 1, danisan: "Ayşe K.", puan: 5, yorum: "Çok ilgili ve profesyonel bir psikolog. Kesinlikle tavsiye ederim.", tarih: "10 Mayıs 2026" },
    { id: 2, danisan: "Mehmet D.", puan: 4, yorum: "İyi bir dinleyici ve çözüm odaklı. Memnun kaldım.", tarih: "5 Mayıs 2026" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-calm-900 mb-6">Yorumlar</h2>
      <div className="space-y-4">
        {yorumlar.map((y) => (
          <div key={y.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-600">{y.danisan[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-calm-900">{y.danisan}</p>
                  <p className="text-xs text-calm-400">{y.tarih}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < y.puan ? "text-amber-400 fill-amber-400" : "text-calm-300"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-calm-600">{y.yorum}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Abonelik() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [psikologProfili, setPsikologProfili] = useState<any>(null);
  const [activePaket, setActivePaket] = useState<string>("temel");
  const [odemeYontemi, setOdemeYontemi] = useState("kredi-karti");

  useEffect(() => {
    loadAbonelik();
  }, [user?.id]);

  const loadAbonelik = async () => {
    if (!user?.id) return;
    try {
      const profil = await getPsikologProfiliByKullaniciId(user.id);
      setPsikologProfili(profil);
      if (profil?.abonelik_paketi) {
        setActivePaket(profil.abonelik_paketi);
      }
    } catch (err) {
      console.error("Abonelik yüklenirken hata:", err);
    }
  };

  const paketler = [
    {
      id: "temel",
      ad: "Temel",
      fiyat: 299,
      aciklama: "Profilinizi listeleyin",
      ozellikler: [
        "Profil oluşturma",
        "Arama sonuçlarında listelenme",
        "Aylık 5 danışan talebi",
        "Temel istatistikler",
      ],
      popular: false,
    },
    {
      id: "one-cikan",
      ad: "Öne Çıkan",
      fiyat: 449,
      aciklama: "Öne çıkın ve büyüyün",
      ozellikler: [
        "Tüm temel özellikler",
        "Arama sonuçlarında öne çıkma",
        "Sınırsız danışan talebi",
        "Blog yazma özelliği",
        "Öne Çıkan rozeti",
      ],
      popular: true,
    },
    {
      id: "premium",
      ad: "Premium",
      fiyat: 599,
      aciklama: "Maksimum görünürlük",
      ozellikler: [
        "Tüm öne çıkan özellikler",
        "Ana sayfada öne çıkarma",
        "Öncelikli müşteri desteği",
        "Detaylı istatistikler",
        "Premium rozeti",
        "Sosyal medya tanıtımı",
      ],
      popular: false,
    },
  ];

  const handleSubscribe = async (paketId: string) => {
    if (paketId === activePaket || !user?.id) return;
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Psikolog profilini bul
      const profil = await getPsikologProfiliByKullaniciId(user.id);
      if (!profil) {
        setErrorMsg("Psikolog profili bulunamadı.");
        setLoading(false);
        return;
      }

      // Mevcut aboneliği kontrol et
      const mevcutAbonelik = await getPsikologAbonelik(profil.id);

      if (mevcutAbonelik) {
        // Aboneliği güncelle
        await updateAbonelik(mevcutAbonelik.id, {
          paket: paketId as any,
          durum: "aktif",
          bitis_tarihi: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          ucret: paketler.find(p => p.id === paketId)?.fiyat || 299,
        });
      } else {
        // Yeni abonelik oluştur
        await createAbonelik({
          psikolog_id: profil.id,
          paket: paketId as any,
          durum: "aktif",
          baslangic_tarihi: new Date().toISOString(),
          bitis_tarihi: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          otomatik_yenile: true,
          ucret: paketler.find(p => p.id === paketId)?.fiyat || 299,
        });
      }

      // Psikolog profilini güncelle
      await upsertPsikologProfili({
        kullanici_id: user.id,
        abonelik_paketi: paketId as any,
        abonelik_durumu: "aktif",
        aktif: true,
      });

      setActivePaket(paketId);
      setSuccessMsg(`${paketler.find(p => p.id === paketId)?.ad} paketine başarıyla geçtiniz!`);
    } catch (err) {
      setErrorMsg("Abonelik güncellenirken bir hata oluştu.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const profil = await getPsikologProfiliByKullaniciId(user.id);
      if (profil) {
        const mevcutAbonelik = await getPsikologAbonelik(profil.id);
        if (mevcutAbonelik) {
          await updateAbonelik(mevcutAbonelik.id, {
            durum: "pasif",
            otomatik_yenile: false,
          });
        }
      }
      setSuccessMsg("Aboneliğiniz iptal edildi. Dönem sonuna kadar hizmet almaya devam edebilirsiniz.");
    } catch (err) {
      setErrorMsg("İptal işlemi sırasında bir hata oluştu.");
    }
    setLoading(false);
  };

  const aktifPaketBilgi = paketler.find(p => p.id === activePaket);

  return (
    <div className="max-w-5xl">
      {/* Aktif Abonelik Bilgisi */}
      {psikologProfili?.abonelik_durumu === "aktif" && (
        <div className="card bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-calm-900">
                  {aktifPaketBilgi?.ad} Paketi Aktif
                </h3>
                <p className="text-sm text-calm-500 mt-1">
                  {psikologProfili?.abonelik_paketi === "premium" ? "Premium" : psikologProfili?.abonelik_paketi === "one-cikan" ? "Öne Çıkan" : "Temel"} paket
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              Aboneliği İptal Et
            </button>
          </div>
        </div>
      )}

      {/* Başarı/Error Mesajları */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Paketler */}
      <h2 className="text-lg font-semibold text-calm-900 mb-2">Abonelik Paketleri</h2>
      <p className="text-sm text-calm-500 mb-6">
        Profilinizi öne çıkarın, daha fazla danışana ulaşın
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paketler.map((p) => {
          const isActive = activePaket === p.id;
          return (
            <div
              key={p.id}
              className={`card-hover relative flex flex-col ${
                p.popular ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/10" : ""
              } ${isActive ? "ring-2 ring-green-500" : ""}`}
            >
              {p.popular && !isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    En Popüler
                  </span>
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-green-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Aktif Paket
                  </span>
                </div>
              )}
              <div className="text-center pt-4">
                <h3 className="text-lg font-semibold text-calm-900">{p.ad}</h3>
                <p className="mt-1 text-sm text-calm-500">{p.aciklama}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-calm-900">{p.fiyat}</span>
                  <span className="text-sm text-calm-500"> TL / ay</span>
                </p>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {p.ozellikler.map((oz) => (
                  <li key={oz} className="flex items-start gap-2 text-sm text-calm-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {oz}
                  </li>
                ))}
              </ul>

              {/* Ödeme Yöntemi Seçimi (sadece aktif değilse göster) */}
              {!isActive && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="text-xs font-medium text-calm-500 mb-2 block">
                    Ödeme Yöntemi
                  </label>
                  <select
                    value={odemeYontemi}
                    onChange={(e) => setOdemeYontemi(e.target.value)}
                    className="input-field text-sm py-2"
                  >
                    <option value="kredi-karti">Kredi Kartı</option>
                    <option value="banka-havalesi">Banka Havalesi</option>
                  </select>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => handleSubscribe(p.id)}
                  disabled={loading || isActive}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-green-100 text-green-700 cursor-default"
                      : loading
                      ? "bg-calm-100 text-calm-500 cursor-wait"
                      : p.popular
                      ? "btn-primary w-full justify-center"
                      : "btn-secondary w-full justify-center"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      İşleniyor...
                    </span>
                  ) : isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1.5 inline" />
                      Aktif
                    </>
                  ) : (
                    `${p.fiyat} TL ile Başla`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ödeme Geçmişi */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-calm-900 mb-4">Ödeme Geçmişi</h3>
        <div className="card">
          {psikologProfili?.abonelik_durumu === "aktif" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-calm-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-calm-900">
                      {aktifPaketBilgi?.ad} Paketi - {odemeYontemi === "kredi-karti" ? "Kredi Kartı" : "Banka Havalesi"}
                    </p>
                    <p className="text-xs text-calm-400">
                      {new Date().toLocaleDateString("tr-TR")} • {aktifPaketBilgi?.fiyat} TL
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Ödendi
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-10 w-10 text-calm-300 mx-auto mb-3" />
              <p className="text-sm text-calm-500">Henüz ödeme geçmişiniz bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dokumanlar() {
  const [files, setFiles] = useState<{ name: string; date: string; size: string }[]>([]);

  const handleUpload = () => {
    const newFile = {
      name: `belge-${files.length + 1}.pdf`,
      date: new Date().toLocaleDateString("tr-TR"),
      size: `${Math.floor(Math.random() * 5) + 1} MB`,
    };
    setFiles([...files, newFile]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Dökümanlar</h2>
        <button onClick={handleUpload} className="btn-primary text-sm py-2 px-4">
          <Upload className="h-4 w-4 mr-1.5" />
          Döküman Yükle
        </button>
      </div>

      <div className="card">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-calm-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-calm-900">Henüz döküman yok</h3>
            <p className="text-sm text-calm-500">Diploma, sertifika ve diğer belgelerinizi yükleyin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-calm-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-calm-900">{file.name}</p>
                    <p className="text-xs text-calm-400">{file.date} • {file.size}</p>
                  </div>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  İndir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
