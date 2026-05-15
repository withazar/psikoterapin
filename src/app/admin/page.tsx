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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRandevu } from "@/context/RandevuContext";
import { getTumPsikologlar } from "@/lib/localData";

type TabId = "onay" | "psikologlar" | "odemeler" | "raporlar";

interface BekleyenPsikolog {
  id: string;
  ad: string;
  email: string;
  alan: string;
  basvuru: string;
  durum: "beklemede" | "onaylandi" | "reddedildi";
}

interface Odeme {
  id: number;
  psikolog: string;
  paket: string;
  tutar: string;
  tarih: string;
  durum: "basarili" | "basarisiz";
}

// ========== LOCALSTORAGE YARDIMCILARI ==========

function getLocalOnayBekleyenler(): BekleyenPsikolog[] {
  try {
    return JSON.parse(localStorage.getItem("psikoterapin_onay_bekleyenler") || "[]");
  } catch { return []; }
}

function saveLocalOnayBekleyenler(data: BekleyenPsikolog[]) {
  localStorage.setItem("psikoterapin_onay_bekleyenler", JSON.stringify(data));
}

function getLocalOdemeler(): Odeme[] {
  try {
    return JSON.parse(localStorage.getItem("psikoterapin_odemeler") || "[]");
  } catch { return []; }
}

function saveLocalOdemeler(data: Odeme[]) {
  localStorage.setItem("psikoterapin_odemeler", JSON.stringify(data));
}

// Varsayılan onay bekleyen verileri
function getDefaultOnayBekleyenler(): BekleyenPsikolog[] {
  return [
    { id: "b1", ad: "Dr. Mehmet Yılmaz", email: "mehmet@email.com", alan: "Klinik Psikoloji", basvuru: "12 Mayıs 2026", durum: "beklemede" },
    { id: "b2", ad: "Uzm. Psk. Zeynep Kaya", email: "zeynep@email.com", alan: "Çocuk Psikolojisi", basvuru: "11 Mayıs 2026", durum: "beklemede" },
    { id: "b3", ad: "Psk. Ali Demir", email: "ali@email.com", alan: "Cinsel Terapi", basvuru: "10 Mayıs 2026", durum: "beklemede" },
  ];
}

// Varsayılan ödeme verileri
function getDefaultOdemeler(): Odeme[] {
  return [
    { id: 1, psikolog: "Dr. Ayşe Demir", paket: "Premium", tutar: "599 TL", tarih: "15 Mayıs 2026", durum: "basarili" },
    { id: 2, psikolog: "Uzm. Psk. Can Yıldız", paket: "Temel", tutar: "299 TL", tarih: "14 Mayıs 2026", durum: "basarili" },
    { id: 3, psikolog: "Psk. Elif Su", paket: "Premium", tutar: "599 TL", tarih: "10 Mayıs 2026", durum: "basarisiz" },
  ];
}

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

  const tabs = [
    { id: "onay" as TabId, label: "Onay Bekleyenler", icon: Clock },
    { id: "psikologlar" as TabId, label: "Psikologlar", icon: Users },
    { id: "odemeler" as TabId, label: "Ödemeler", icon: CreditCard },
    { id: "raporlar" as TabId, label: "Raporlar", icon: BarChart3 },
  ];

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
              { label: "Toplam Psikolog", value: getTumPsikologlar().length.toString(), icon: Users, color: "text-blue-600 bg-blue-100" },
              { label: "Onay Bekleyen", value: getLocalOnayBekleyenler().length > 0 ? getLocalOnayBekleyenler().filter(b => b.durum === "beklemede").length.toString() : "3", icon: Clock, color: "text-amber-600 bg-amber-100" },
              { label: "Aktif Abonelik", value: getTumPsikologlar().filter(p => p.aktif).length.toString(), icon: CreditCard, color: "text-green-600 bg-green-100" },
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
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "onay" && <OnayBekleyenler />}
        {activeTab === "psikologlar" && <PsikologListesi />}
        {activeTab === "odemeler" && <OdemeTakibi />}
        {activeTab === "raporlar" && <Raporlar />}
      </div>
    </div>
  );
}

function OnayBekleyenler() {
  const [bekleyenler, setBekleyenler] = useState<BekleyenPsikolog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // localStorage'dan verileri al
    let data = getLocalOnayBekleyenler();
    
    // Eğer localStorage boşsa varsayılan verileri ekle
    if (data.length === 0) {
      data = getDefaultOnayBekleyenler();
      saveLocalOnayBekleyenler(data);
    }
    
    setBekleyenler(data);
  };

  const handleOnayla = (id: string) => {
    const guncel = bekleyenler.map(b => 
      b.id === id ? { ...b, durum: "onaylandi" as const } : b
    );
    setBekleyenler(guncel);
    saveLocalOnayBekleyenler(guncel);
  };

  const handleReddet = (id: string) => {
    const guncel = bekleyenler.map(b => 
      b.id === id ? { ...b, durum: "reddedildi" as const } : b
    );
    setBekleyenler(guncel);
    saveLocalOnayBekleyenler(guncel);
  };

  const filtered = bekleyenler.filter(b =>
    b.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.alan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Onay Bekleyen Psikologlar</h2>
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

      <div className="card">
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-calm-500 py-8">Onay bekleyen psikolog bulunmuyor.</p>
          ) : (
            filtered.map((psikolog) => (
              <div
                key={psikolog.id}
                className="flex items-center justify-between p-4 rounded-xl bg-calm-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    psikolog.durum === "onaylandi" ? "bg-green-100" :
                    psikolog.durum === "reddedildi" ? "bg-red-100" : "bg-primary-100"
                  }`}>
                    <span className={`font-bold text-sm ${
                      psikolog.durum === "onaylandi" ? "text-green-600" :
                      psikolog.durum === "reddedildi" ? "text-red-600" : "text-primary-600"
                    }`}>
                      {psikolog.ad.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-calm-900">{psikolog.ad}</p>
                    <p className="text-sm text-calm-500">{psikolog.alan} • {psikolog.basvuru}</p>
                    <p className="text-xs text-calm-400">{psikolog.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {psikolog.durum === "beklemede" ? (
                    <>
                      <button
                        onClick={() => handleOnayla(psikolog.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReddet(psikolog.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
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
  const tumPsikologlar = getTumPsikologlar();
  const psikologlar = tumPsikologlar.map((p: any) => ({
    id: p.id,
    ad: p.unvan,
    alan: Array.isArray(p.uzmanlik_alani) ? p.uzmanlik_alani[0] : "",
    paket: p.abonelik_paketi === "premium" ? "Premium" : p.abonelik_paketi === "one-cikan" ? "Öne Çıkan" : "Temel",
    durum: p.aktif ? "aktif" as const : "suresi-dolmus" as const,
    uyelik: p.aktif ? "Aktif" : "Süresi Doldu",
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-calm-900">Tüm Psikologlar</h2>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-calm-500">Psikolog</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Uzmanlık</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Paket</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Durum</th>
                <th className="text-left py-3 px-4 font-medium text-calm-500">Üyelik</th>
              </tr>
            </thead>
            <tbody>
              {psikologlar.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-600">
                          {p.ad.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-calm-900">{p.ad}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-calm-500">{p.alan}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.paket === "Premium" || p.paket === "Öne Çıkan"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-calm-100 text-calm-700"
                    }`}>{p.paket}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.durum === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.durum === "aktif" ? <><CheckCircle className="h-3 w-3" /> Aktif</> : <><AlertTriangle className="h-3 w-3" /> Süresi Doldu</>}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-calm-500">{p.uyelik}</td>
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
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);

  useEffect(() => {
    let data = getLocalOdemeler();
    if (data.length === 0) {
      data = getDefaultOdemeler();
      saveLocalOdemeler(data);
    }
    setOdemeler(data);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-calm-900 mb-6">Ödeme Takibi</h2>
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
              {odemeler.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-calm-900">{o.psikolog}</td>
                  <td className="py-3 px-4 text-calm-500">{o.paket}</td>
                  <td className="py-3 px-4 text-calm-900">{o.tutar}</td>
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
  return (
    <div>
      <h2 className="text-lg font-semibold text-calm-900 mb-6">Raporlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-calm-900 mb-4">Aylık İstatistikler</h3>
          <div className="space-y-3">
            {[
              { label: "Yeni Kayıt", value: "18" },
              { label: "Aktif Profil", value: getTumPsikologlar().filter((p: any) => p.aktif).length.toString() },
              { label: "Toplam Randevu", value: "234" },
              { label: "İptal Oranı", value: "%8" },
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
