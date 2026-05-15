"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Brain,
  Shield,
  Edit3,
  Save,
  LogOut,
  ChevronRight,
  MapPin,
  Video,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRandevu } from "@/context/RandevuContext";
import { formatTarih, formatPara } from "@/lib/utils";

export default function ProfilPage() {
  const router = useRouter();
  const { user, isAdmin, isPsikolog, logout, updateUser } = useAuth();
  const { danisanRandevulari } = useRandevu();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ad: "", soyad: "", telefon: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/kayit");
      return;
    }
    setForm({ ad: user.ad, soyad: user.soyad, telefon: user.telefon || "" });
  }, [user, router]);

  if (!user) return null;

  const randevular = danisanRandevulari(user.id);

  const handleSave = () => {
    updateUser({ ad: form.ad, soyad: form.soyad, telefon: form.telefon });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

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
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {user.ad[0]}{user.soyad[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-calm-900">
                  {user.ad} {user.soyad}
                </h1>
                <p className="text-sm text-calm-500">
                  {user.rol === "admin" ? "Admin" : user.rol === "psikolog" ? "Psikolog" : "Danışan"}
                  {user.rol === "psikolog" && (
                    <Link href="/panel" className="ml-2 text-primary-600 hover:text-primary-700">
                      • Paneli Aç
                    </Link>
                  )}
                  {user.rol === "admin" && (
                    <Link href="/admin" className="ml-2 text-primary-600 hover:text-primary-700">
                      • Admin Paneli
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="btn-ghost text-sm text-red-500 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Bekleyen", value: randevular.filter(r => r.durum === "bekliyor").length.toString(), color: "text-amber-600 bg-amber-100" },
              { label: "Onaylanan", value: randevular.filter(r => r.durum === "onaylandi").length.toString(), color: "text-green-600 bg-green-100" },
              { label: "Tamamlanan", value: randevular.filter(r => r.durum === "tamamlandi").length.toString(), color: "text-blue-600 bg-blue-100" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-calm-50">
                <p className={`text-2xl font-bold ${stat.color.split(" ")[0]}`}>{stat.value}</p>
                <p className="text-xs text-calm-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol - Profil Bilgileri */}
          <div className="md:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-calm-900">Profil Bilgileri</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {saved && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 text-green-700 text-xs mb-3">
                  <CheckCircle className="h-3 w-3" />
                  Profil güncellendi!
                </div>
              )}

              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-calm-500 mb-1 block">Ad</label>
                    <input
                      type="text"
                      value={form.ad}
                      onChange={(e) => setForm({ ...form, ad: e.target.value })}
                      className="input-field text-sm py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-calm-500 mb-1 block">Soyad</label>
                    <input
                      type="text"
                      value={form.soyad}
                      onChange={(e) => setForm({ ...form, soyad: e.target.value })}
                      className="input-field text-sm py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-calm-500 mb-1 block">Telefon</label>
                    <input
                      type="tel"
                      value={form.telefon}
                      onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                      className="input-field text-sm py-2"
                    />
                  </div>
                  <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-2">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Kaydet
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-calm-400" />
                    <span className="text-calm-600">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-calm-400" />
                    <span className="text-calm-600">{user.telefon || "Belirtilmemiş"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-calm-400" />
                    <span className="text-calm-600">
                      Kayıt: {formatTarih(user.created_at)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      user.rol === "admin" ? "bg-purple-100 text-purple-700" :
                      user.rol === "psikolog" ? "bg-primary-100 text-primary-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {user.rol === "admin" ? "Admin" : user.rol === "psikolog" ? "Psikolog" : "Danışan"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ - Randevular */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-calm-900 mb-4">Randevularım</h2>

            {randevular.length === 0 ? (
              <div className="card text-center py-12">
                <Calendar className="h-12 w-12 text-calm-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-calm-900">Henüz randevunuz yok</h3>
                <p className="text-sm text-calm-500 mb-4">Bir psikolog seçip randevu alabilirsiniz.</p>
                <Link href="/psikologlar" className="btn-primary inline-flex">
                  Psikolog Bul
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {randevular.map((randevu) => (
                  <div key={randevu.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <Brain className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-calm-900">
                            {randevu.psikolog_ad || "Psikolog"}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-calm-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{randevu.tarih ? formatTarih(randevu.tarih) : randevu.tarih}</span>
                            <Clock className="h-3.5 w-3.5 ml-1" />
                            <span>{randevu.saat}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${durumRenk(randevu.durum)}`}>
                              {randevu.tip === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                              {randevu.tip === "online" ? "Online" : "Yüz Yüze"}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${durumRenk(randevu.durum)}`}>
                              {durumLabel(randevu.durum)}
                            </span>
                          </div>
                          {randevu.not && (
                            <p className="text-xs text-calm-400 mt-2 italic">{randevu.not}</p>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/psikolog/${randevu.psikolog_id}`}
                        className="text-primary-600 hover:text-primary-700 shrink-0"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
