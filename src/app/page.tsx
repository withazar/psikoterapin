"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Shield,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  Brain,
  Heart,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { MOCK_BLOG_YAZILARI } from "@/lib/data";
import { getTumPsikologlar } from "@/lib/localData";
import PsikologKarti from "@/components/PsikologKarti";
import { formatPara } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/psikologlar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/psikologlar");
    }
  };

  const tumPsikologlar = getTumPsikologlar();
  // Sadece aktif psikologları göster
  const aktifPsikologlar = tumPsikologlar.filter((p: any) => p.aktif !== false);
  // Öne çıkanlar: premium veya one-cikan paketi olan aktif psikologlar
  const oneCikanPsikologlar = aktifPsikologlar.filter(
    (p: any) => p.abonelik_paketi === "one-cikan" || p.abonelik_paketi === "premium"
  );
  // Popüler psikologlar: rozetlerinde "populer" olan aktif psikologlar
  const populerPsikologlar = aktifPsikologlar.filter(
    (p: any) => p.rozetler?.some((r: any) => r.tip === "populer")
  );
  const sonBloglar = MOCK_BLOG_YAZILARI.slice(0, 3);

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Türkiye'nin Güvenilir Psikolog Platformu
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-calm-900 text-balance">
              Size En Uygun
              <span className="text-primary-600"> Psikoloğu </span>
              Bulun
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-calm-500 max-w-2xl mx-auto">
              Uzman psikologlar arasından ihtiyacınıza en uygun olanı seçin,
              online veya yüz yüze randevunuzu hemen alın.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white rounded-2xl shadow-lg shadow-primary-500/10 ring-1 ring-gray-200">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-calm-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Uzmanlık alanı, şehir veya psikolog adı..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-transparent text-calm-900 placeholder:text-calm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary py-3.5 px-8 text-base whitespace-nowrap"
                >
                  Ara
                </button>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Anksiyete",
                "Cinsel Terapi",
                "Çift Terapisi",
                "Çocuk Psikolojisi",
                "Depresyon",
                "Online Terapi",
              ].map((kategori) => (
                <Link
                  key={kategori}
                  href={`/psikologlar?q=${kategori.toLowerCase()}`}
                  className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-calm-600 shadow-sm ring-1 ring-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-200 transition-all"
                >
                  {kategori}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Uzman Psikolog", value: "500+" },
                { label: "Mutlu Danışan", value: "10.000+" },
                { label: "Tamamlanan Seans", value: "50.000+" },
                { label: "Onaylı Diploma", value: "%100" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-calm-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ÖNE ÇIKAN PSİKOLOGLAR ============ */}
      {oneCikanPsikologlar.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="section-title">Öne Çıkan Psikologlar</h2>
                <p className="section-subtitle">
                  En çok tercih edilen uzmanlarımız
                </p>
              </div>
              <Link
                href="/psikologlar"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Tümünü Gör
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oneCikanPsikologlar.slice(0, 3).map((psikolog) => (
                <PsikologKarti key={psikolog.id} psikolog={psikolog} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/psikologlar" className="btn-secondary">
                Tüm Psikologları Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ NASIL ÇALIŞIR ============ */}
      <section id="nasil-calisir" className="py-16 sm:py-20 bg-calm-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nasıl Çalışır?</h2>
            <p className="section-subtitle">
              3 adımda size en uygun psikoloğu bulun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Arama Yapın",
                desc: "Uzmanlık alanı, şehir, terapi yöntemi gibi kriterlerle size en uygun psikoloğu bulun.",
                color: "bg-primary-100 text-primary-600",
              },
              {
                icon: MessageCircle,
                title: "Bağlantı Kurun",
                desc: "Profilini incelediğiniz psikologla ücretsiz ön görüşme randevusu alın.",
                color: "bg-secondary-100 text-secondary-600",
              },
              {
                icon: Calendar,
                title: "Randevu Alın",
                desc: "Size uygun zaman diliminde online veya yüz yüze seansınızı planlayın.",
                color: "bg-accent-100 text-accent-600",
              },
            ].map((step, i) => (
              <div key={step.title} className="card-hover text-center p-8">
                <div className="relative inline-flex">
                  <div
                    className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-calm-900 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-calm-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-calm-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPÜLER PSİKOLOGLAR ============ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Popüler Psikologlar</h2>
              <p className="section-subtitle">
                Danışanlar tarafından en çok tercih edilenler
              </p>
            </div>
            <Link
              href="/psikologlar"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Tümünü Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {populerPsikologlar.slice(0, 4).map((psikolog) => (
              <PsikologKarti key={psikolog.id} psikolog={psikolog} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEDEN PSİKOTERAPİN ============ */}
      <section className="py-16 sm:py-20 bg-calm-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Neden Psikoterapin?
            </h2>
            <p className="mt-2 text-lg text-calm-300">
              Size en iyi deneyimi sunmak için buradayız
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Güvenilir Uzmanlar",
                desc: "Tüm psikologların diplomaları onaylanır",
              },
              {
                icon: Star,
                title: "Doğrulanmış Yorumlar",
                desc: "Gerçek danışan yorumları ile karşılaştırın",
              },
              {
                icon: Users,
                title: "Geniş Uzman Ağı",
                desc: "15+ uzmanlık alanında yüzlerce psikolog",
              },
              {
                icon: Heart,
                title: "Size Özel Eşleştirme",
                desc: "Yapay zeka ile en uygun psikoloğu bulun",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="h-14 w-14 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-primary-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-calm-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABONELİK PAKETLERİ ============ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Psikologlar İçin Paketler</h2>
            <p className="section-subtitle">
              Profilinizi öne çıkarın, daha fazla danışana ulaşın
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                ad: "Temel",
                ucret: 299,
                aciklama: "Profilinizi listeleyin",
                ozellikler: [
                  "Profil oluşturma",
                  "Temel sıralama",
                  "Ayda 5 talep",
                ],
                populer: false,
              },
              {
                ad: "Premium",
                ucret: 599,
                aciklama: "Öne çıkın ve büyüyün",
                ozellikler: [
                  "Öncelikli sıralama",
                  "Sınırsız talep",
                  "Blog yazma",
                  "İstatistik paneli",
                ],
                populer: true,
              },
              {
                ad: "Öne Çıkan",
                ucret: 999,
                aciklama: "Maksimum görünürlük",
                ozellikler: [
                  "Ana sayfada öne çıkma",
                  "İlk sırada listelenme",
                  "Özel rozet",
                  "Sosyal medya tanıtımı",
                ],
                populer: false,
              },
            ].map((paket) => (
              <div
                key={paket.ad}
                className={`card-hover relative ${
                  paket.populer
                    ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/10"
                    : ""
                }`}
              >
                {paket.populer && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      En Popüler
                    </span>
                  </div>
                )}
                <div className="text-center pt-4">
                  <h3 className="text-lg font-semibold text-calm-900">
                    {paket.ad}
                  </h3>
                  <p className="mt-1 text-sm text-calm-500">
                    {paket.aciklama}
                  </p>
                  <p className="mt-4">
                    <span className="text-4xl font-bold text-calm-900">
                      {formatPara(paket.ucret)}
                    </span>
                    <span className="text-sm text-calm-500">/ay</span>
                  </p>
                </div>
                <ul className="mt-6 space-y-3">
                  {paket.ozellikler.map((ozellik) => (
                    <li
                      key={ozellik}
                      className="flex items-center gap-2 text-sm text-calm-600"
                    >
                      <div className="h-5 w-5 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
                        <svg
                          className="h-3 w-3 text-secondary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      {ozellik}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/kayit"
                    className={
                      paket.populer
                        ? "btn-primary w-full justify-center"
                        : "btn-secondary w-full justify-center"
                    }
                  >
                    Başla
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BLOG ============ */}
      <section className="py-16 sm:py-20 bg-calm-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Psikoloji Blogu</h2>
              <p className="section-subtitle">
                Uzmanlarımızdan değerli içerikler
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Tüm Yazılar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sonBloglar.map((yazi) => (
              <Link
                key={yazi.id}
                href={`/blog/${yazi.id}`}
                className="card-hover group"
              >
                <div className="h-40 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                  <Brain className="h-12 w-12 text-primary-400" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {yazi.etiketler.slice(0, 2).map((etiket) => (
                    <span
                      key={etiket}
                      className="inline-flex items-center rounded-full bg-calm-100 px-2.5 py-0.5 text-xs font-medium text-calm-600"
                    >
                      {etiket}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-calm-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {yazi.baslik}
                </h3>
                <p className="mt-2 text-sm text-calm-500 line-clamp-2">
                  {yazi.ozet}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-calm-400">
                  <span>{yazi.psikolog_adi}</span>
                  <span>{yazi.okunma_sayisi} okunma</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-card p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Siz de Psikoterapin'e Katılın
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Uzman psikologlardan oluşan ağımıza katılın, profilinizi
                oluşturun ve danışanlarla buluşun.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kayit"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-all"
                >
                  Psikolog musunuz?
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/psikologlar"
                  className="inline-flex items-center justify-center rounded-xl bg-primary-600/20 backdrop-blur-sm px-8 py-3.5 text-base font-semibold text-white ring-1 ring-white/30 hover:bg-primary-600/30 transition-all"
                >
                  Psikologları Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
