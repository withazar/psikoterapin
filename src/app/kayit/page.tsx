"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function KayitPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [rol, setRol] = useState<"danisan" | "psikolog">("danisan");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    ad: "",
    soyad: "",
    telefon: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "giris") {
        const result = await login(form.email, form.password);
        if (result.success) {
          router.push("/");
        } else {
          setError(result.error || "Giriş yapılırken bir hata oluştu.");
        }
      } else {
        if (!form.ad || !form.soyad) {
          setError("Ad ve soyad zorunludur.");
          setLoading(false);
          return;
        }
        const result = await register({
          email: form.email,
          password: form.password,
          ad: form.ad,
          soyad: form.soyad,
          telefon: form.telefon,
          rol: rol,
        });
        if (result.success) {
          setSuccess("Kaydınız başarıyla oluşturuldu! Yönlendiriliyorsunuz...");
          // Kullanıcı otomatik giriş yaptı, ana sayfaya yönlendir
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          setError(result.error || "Kayıt olurken bir hata oluştu.");
        }

      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-calm-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-calm-900">Psikoterapin</span>
          </Link>

          {/* Title */}
          <h1 className="text-2xl font-bold text-calm-900 mb-1">
            {mode === "giris" ? "Hoş Geldiniz" : "Hesap Oluşturun"}
          </h1>
          <p className="text-sm text-calm-500 mb-8">
            {mode === "giris"
              ? "Hesabınıza giriş yapın"
              : "Size en uygun psikoloğu bulmaya başlayın"}
          </p>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm mb-4">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Role Select (only in register mode) */}
          {mode === "kayit" && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setRol("danisan")}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  rol === "danisan"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white text-calm-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                Danışan
              </button>
              <button
                onClick={() => setRol("psikolog")}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  rol === "psikolog"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white text-calm-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                Psikolog
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "kayit" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Ad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                      <input
                        type="text"
                        placeholder="Ad"
                        value={form.ad}
                        onChange={(e) => setForm({ ...form, ad: e.target.value })}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Soyad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                      <input
                        type="text"
                        placeholder="Soyad"
                        value={form.soyad}
                        onChange={(e) => setForm({ ...form, soyad: e.target.value })}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Telefon (İsteğe bağlı)</label>
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
              </>
            )}

            <div>
              <label className="label">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                <input
                  type="email"
                  placeholder="ornek@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-calm-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-calm-400 hover:text-calm-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  İşleniyor...
                </span>
              ) : mode === "giris" ? (
                <>
                  Giriş Yap
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Hesap Oluştur
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="mt-6 text-center text-sm text-calm-500">
            {mode === "giris" ? "Henüz hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "giris" ? "kayit" : "giris");
                setError("");
                setSuccess("");
              }}
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              {mode === "giris" ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>

          {/* Demo Accounts */}
          {mode === "giris" && (
            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-2">🔑 DEMO HESAPLAR</p>
              <div className="space-y-1.5 text-xs text-amber-700">
                <button
                  onClick={() => {
                    setForm({ ...form, email: "admin@psikoterapin.com", password: "admin123" });
                  }}
                  className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <span className="font-medium">👑 Admin:</span> admin@psikoterapin.com / admin123
                </button>
                <button
                  onClick={() => {
                    setForm({ ...form, email: "ahmet@psikoterapin.com", password: "psikolog123" });
                  }}
                  className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <span className="font-medium">🧑‍⚕️ Psikolog:</span> ahmet@psikoterapin.com / psikolog123
                </button>
                <button
                  onClick={() => {
                    setForm({ ...form, email: "ayse@psikoterapin.com", password: "psikolog123" });
                  }}
                  className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <span className="font-medium">🧑‍⚕️ Psikolog:</span> ayse@psikoterapin.com / psikolog123
                </button>
                <button
                  onClick={() => {
                    setForm({ ...form, email: "mehmet@psikoterapin.com", password: "danisan123" });
                  }}
                  className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <span className="font-medium">🙋 Danışan:</span> mehmet@psikoterapin.com / danisan123
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Güvenli ve Kolay</h2>
          <p className="text-primary-100 leading-relaxed">
            Psikoterapin ile uzman psikologlara kolayca ulaşın, online veya yüz yüze
            randevunuzu hemen alın.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {[
              "Diploma onaylı uzmanlar",
              "Ücretsiz ön görüşme",
              "Online terapi imkanı",
              "7/24 destek",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-primary-100">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
