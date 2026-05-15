"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  CreditCard,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Search,
  Shield,
  AlertTriangle,
  DollarSign,
  UserCheck,
  Eye,
  LogOut,
  Star,
  MapPin,
  Video,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatTarih, formatPara, UZMANLIK_ALANLARI } from "@/lib/utils";
import {
  getPsikologProfilleri,
  getOnayBekleyenler,
  updateOnayDurumu,
  upsertPsikologProfili,
} from "@/lib/supabase-queries";

type TabId = "onay" | "psikologlar" | "odemeler" | "raporlar";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/kayit");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-calm-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-calm-900">Erişim Engellendi</h2>
          <p className="mt-2 text-calm-500">Bu sayfaya erişim yetkiniz yok.</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("onay");
  const [refreshKey, setRefreshKey] = useState(0);
  const [tumPsikologlar, setTumPsikologlar] = useState<any[]>([]);
  const [bekleyenler, setBekleyenler] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      const psikologlar = await getPsikologProfilleri();
      setTumPsikologlar(psikologlar);
      const bekleyen = await getOnayBekleyenler();
      setBekleyenler(bekleyen);
    } catch (err) {
      console.error("Veri yüklenirken hata:", err);
    }
  };

  const bekleyenSayisi = bekleyenler.filter((b: any) => b.durum === "beklemede").length;

  const tabs = [
    { id: "onay" as TabId, label: "Onay Bekleyenler", icon: Clock, badge: bekleyenSayisi },
    { id: "psikologlar" as TabId, label: "Psikologlar", icon: Users },
    { id: "odemeler" as TabId, label: "Ödemeler", icon: CreditCard },
    { id: "raporlar" as TabId, label: "Raporlar", icon: BarChart3 },
  ];

  const handleRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-calm-900">Admin Paneli</h1>
                <p className="text-sm text-calm-500">Psikoterapin yönetim paneli</p>
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
              { label: "Toplam Psikolog", value: tumPsikologlar.length.toString(), icon: Users, color: "text-blue-600 bg-blue-100" },
              { label: "Onay Bekleyen", value: bekleyenSayisi.toString(), icon: Clock, color: "text-amber-600 bg-amber-100" },
              { label: "Aktif Abonelik", value: tumPsikologlar.filter(p => p.aktif).length.toString(), icon: CreditCard, color: "text-green-600 bg-green-100" },
              { label: "Aylık Gelir", value: "53.211 TL", icon: DollarSign, color: "text-purple-600 bg-purple-100" },
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
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-calm-500 hover:text-calm-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-500 text-white text-xs font-bold px-1">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "onay" && <OnayBekleyenler key={refreshKey} onRefresh={handleRefresh} />}
        {activeTab === "psikologlar" && <PsikologListesi key={refreshKey} />}
        {activeTab === "odemeler" && <OdemeTakibi key={refreshKey} />}
        {activeTab === "raporlar" && <Raporlar key={refreshKey} />}
      </div>
    </div>
  );
}

function OnayBekleyenler({ onRefresh }: { onRefresh: () => void }) {
  const [bekleyenler, setBekleyenler] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getOnayBekleyenler();
      setBekleyenler(data);
    } catch (err) {
      console.error("Onay bekleyenler yüklenirken hata:", err);
    }
  };

  const handleOnayla = async (id: string) => {
    try {
      await updateOnayDurumu(id, "onaylandi");
      setSuccessMsg(`Psikolog başarıyla onaylandı!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
      onRefresh();
    } catch (err) {
      console.error("Onaylama hatası:", err);
    }
  };

  const handleReddet = async (id: string) => {
    try {
      await updateOnayDurumu(id, "reddedildi");
      setSuccessMsg(`Psikolog reddedildi.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
      onRefresh();
    } catch (err) {
      console.error("Reddetme hatası:", err);
    }
  };

  const filtered = bekleyenler.filter((b: any) =>
    b.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.alan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bekleyenSayisi = bekleyenler.filter((b: any) => b.durum === "beklemede").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-calm-900">Onay Bekleyen Psikologlar</h2>
          <p className="text-sm text-calm-500 mt-1">
            {bekleyenSayisi > 0
              ? `${bekleyenSayisi} psikolog onay bekliyor`
              : "Tüm başvurular işlenmiş"}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-64"
          />
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {successMsg}
        </div>
      )}

      <div className="card">
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-calm-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-calm-900">Onay bekleyen psikolog bulunmuyor</h3>
              <p className="text-sm text-calm-500 mt-1">Yeni kayıt olan psikologlar burada görünecek.</p>
            </div>
          ) : (
            filtered.map((psikolog: any) => (
              <div
                key={psikolog.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl gap-4 ${
                  psikolog.durum === "onaylandi" ? "bg-green-50 border border-green-200" :
                  psikolog.durum === "reddedildi" ? "bg-red-50 border border-red-200" :
                  "bg-calm-50"
                }`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                    psikolog.durum === "onaylandi" ? "bg-green-100" :
                    psikolog.durum === "reddedildi" ? "bg-red-100" : "bg-primary-100"
                  }`}>
                    <span className={`font-bold text-sm ${
                      psikolog.durum === "onaylandi" ? "text-green-600" :
                      psikolog.durum === "reddedildi" ? "text-red-600" : "text-primary-600"
                    }`}>
                      {psikolog.ad.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-calm-900 truncate">{psikolog.ad}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-calm-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {psikolog.email}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                        {psikolog.alan}
                      </span>
                      <span className="text-xs text-calm-400">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(psikolog.created_at).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {psikolog.durum === "beklemede" ? (
                    <>
                      <button
                        onClick={() => handleOnayla(psikolog.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReddet(psikolog.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reddet
                      </button>
                    </>
                  ) : (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      psikolog.durum === "onaylandi"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {psikolog.durum === "onaylandi" ? (
                        <><CheckCircle className="h-3 w-3" /> Onaylandı</>
                      ) : (
                        <><XCircle className="h-3 w-3" /> Reddedildi</>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PsikologListesi() {
  const [tumPsikologlar, setTumPsikologlar] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPsikologProfilleri().then(setTumPsikologlar).catch(console.error);
  }, []);

  const psikologlar = tumPsikologlar
    .filter((p: any) => 
      p.unvan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sehir.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((p: any) => ({
      id: p.id,
      ad: p.unvan,
      sehir: p.sehir,
      alan: Array.isArray(p.uzmanlik_alani) && p.uzmanlik_alani.length > 0
        ? (UZMANLIK_ALANLARI[p.uzmanlik_alani[0]] || p.uzmanlik_alani[0])
        : "",
      puan: p.puan_ortalamasi,
      yorum: p.yorum_sayisi,
      ucret: p.seans_ucreti,
      paket: p.abonelik_paketi === "premium" ? "Premium" : p.abonelik_paketi === "one-cikan" ? "Öne Çıkan" : "Temel",
      aktif: p.aktif,
      diploma_onayli: p.diploma_onayli,
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Tüm Psikologlar ({psikologlar.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
          <input
            type="text"
            placeholder="Psikolog veya şehir ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-64"
          />
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-calm-500">Psikolog</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Şehir</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Uzmanlık</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Puan</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Ücret</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Paket</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Durum</th>
              </tr>
            </thead>
            <tbody>
              {psikologlar.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-calm-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary-600">
                          {p.ad.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-calm-900 truncate block">{p.ad}</span>
                        {p.diploma_onayli && (
                          <span className="text-xs text-green-600 flex items-center gap-0.5">
                            <Shield className="h-3 w-3" /> Diploma Onaylı
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-calm-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.sehir}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-calm-500">{p.alan}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {p.puan}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-calm-900">{formatPara(p.ucret)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.paket === "Premium" || p.paket === "Öne Çıkan"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-calm-100 text-calm-700"
                    }`}>
                      {p.paket === "Öne Çıkan" && <Sparkles className="h-3 w-3 mr-1" />}
                      {p.paket}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.aktif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.aktif ? (
                        <><CheckCircle className="h-3 w-3" /> Aktif</>
                      ) : (
                        <><AlertTriangle className="h-3 w-3" /> Pasif</>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OdemeTakibi() {
  const [odemeler] = useState<any[]>([
    { id: 1, psikolog: "Uzm. Klinik Psikolog Ayşe Yılmaz", paket: "Premium", tutar: "599 TL", tarih: "15 Mayıs 2026", durum: "basarili" },
    { id: 2, psikolog: "Uzm. Psikolog Mehmet Demir", paket: "Temel", tutar: "299 TL", tarih: "14 Mayıs 2026", durum: "basarili" },
    { id: 3, psikolog: "Çocuk ve Ergen Psikoloğu Zeynep Kaya", paket: "Premium", tutar: "599 TL", tarih: "10 Mayıs 2026", durum: "basarili" },
    { id: 4, psikolog: "Klinik Psikolog Canan Şahin", paket: "Öne Çıkan", tutar: "449 TL", tarih: "8 Mayıs 2026", durum: "basarili" },
    { id: 5, psikolog: "Uzm. Psikolog Ali Yıldız", paket: "Temel", tutar: "299 TL", tarih: "5 Mayıs 2026", durum: "basarisiz" },
  ]);

  const toplamGelir = odemeler
    .filter(o => o.durum === "basarili")
    .reduce((sum, o) => sum + parseInt(o.tutar.replace(/[^0-9]/g, "")), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-calm-900">Ödeme Takibi</h2>
          <p className="text-sm text-calm-500 mt-1">
            Toplam gelir: <span className="font-semibold text-calm-900">{formatPara(toplamGelir)}</span>
          </p>
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-calm-500">Psikolog</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Paket</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Tutar</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Tarih</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Durum</th>
              </tr>
            </thead>
            <tbody>
              {odemeler.map((o: any) => (
                <tr key={o.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-calm-900">{o.psikolog}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      o.paket === "Premium" || o.paket === "Öne Çıkan"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-calm-100 text-calm-700"
                    }`}>{o.paket}</span>
                  </td>
                  <td className="py-3 px-4 text-calm-900 font-medium">{o.tutar}</td>
                  <td className="py-3 px-4 text-calm-500">{o.tarih}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      o.durum === "basarili" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {o.durum === "basarili" ? <><CheckCircle className="h-3 w-3" /> Başarılı</> : <><XCircle className="h-3 w-3" /> Başarısız</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Raporlar() {
  const [tumPsikologlar, setTumPsikologlar] = useState<any[]>([]);

  useEffect(() => {
    getPsikologProfilleri().then(setTumPsikologlar).catch(console.error);
  }, []);

  const aktifSayisi = tumPsikologlar.filter(p => p.aktif).length;
  const premiumSayisi = tumPsikologlar.filter(p => p.abonelik_paketi === "premium" || p.abonelik_paketi === "one-cikan").length;

  return (
    <div>
      <h2 className="text-lg font-semibold text-calm-900 mb-6">Raporlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4">Aylık İstatistikler</h3>
          <div className="space-y-3">
            {[
              { label: "Toplam Psikolog", value: tumPsikologlar.length.toString() },
              { label: "Aktif Profil", value: aktifSayisi.toString() },
              { label: "Premium Üye", value: premiumSayisi.toString() },
              { label: "Temel Paket", value: (tumPsikologlar.length - premiumSayisi).toString() },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-calm-500">{item.label}</span>
                <span className="text-sm font-semibold text-calm-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4">Popüler Uzmanlıklar</h3>
          <div className="space-y-3">
            {[
              { alan: "Anksiyete", yuzde: 85 },
              { alan: "Cinsel Terapi", yuzde: 72 },
              { alan: "Çift Terapisi", yuzde: 68 },
              { alan: "Depresyon", yuzde: 55 },
              { alan: "Çocuk Psikolojisi", yuzde: 50 },
            ].map((item) => (
              <div key={item.alan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-calm-600">{item.alan}</span>
                  <span className="text-calm-500">%{item.yuzde}</span>
                </div>
                <div className="h-2 bg-calm-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${item.yuzde}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
