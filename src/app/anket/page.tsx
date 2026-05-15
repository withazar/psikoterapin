"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Star,
  MapPin,
  Video,
  Heart,
  Shield,
  Clock,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { getTumPsikologlar } from "@/lib/data";
import { formatPara, UZMANLIK_ALANLARI, TERAPI_YONTEMLERI } from "@/lib/utils";

interface Soru {
  id: number;
  soru: string;
  altMetin?: string;
  tip: "tekli" | "coklu" | "aralik";
  cevaplar: { label: string; value: string; icon?: string }[];
}

const sorular: Soru[] = [
  {
    id: 1,
    soru: "Hangi konuda destek almak istiyorsunuz?",
    altMetin: "Birden fazla seçenek işaretleyebilirsiniz",
    tip: "coklu",
    cevaplar: [
      { label: "Anksiyete & Kaygı", value: "anksiyete", icon: "😰" },
      { label: "Depresyon", value: "depresyon", icon: "😔" },
      { label: "İlişki & Çift Sorunları", value: "cift-terapisi", icon: "💑" },
      { label: "Cinsel Terapi", value: "cinsel-terapi", icon: "❤️" },
      { label: "Travma", value: "travma", icon: "💔" },
      { label: "Çocuk & Ergen Psikolojisi", value: "cocuk-psikolojisi", icon: "👶" },
      { label: "Bağımlılık", value: "bagimlilik", icon: "🔄" },
      { label: "Aile Danışmanlığı", value: "aile-danismanligi", icon: "👨‍👩‍👧‍👦" },
      { label: "Stres Yönetimi", value: "klinik-psikoloji", icon: "🧘" },
      { label: "Özgüven & Kişisel Gelişim", value: "klinik-psikoloji", icon: "🌟" },
    ],
  },
  {
    id: 2,
    soru: "Hangi terapi yöntemini tercih edersiniz?",
    tip: "tekli",
    cevaplar: [
      { label: "Fark etmez, uzman karar versin", value: "farketmez" },
      { label: "BDT (Bilişsel Davranışçı Terapi)", value: "bdt" },
      { label: "EMDR", value: "emdr" },
      { label: "Psikanalitik Terapi", value: "psikanalitik" },
      { label: "Sanat Terapisi", value: "sanat-terapisi" },
      { label: "Farkındalık Temelli Terapi", value: "farkindalik-temelli" },
    ],
  },
  {
    id: 3,
    soru: "Terapiyi nasıl almak istersiniz?",
    tip: "tekli",
    cevaplar: [
      { label: "Yüz Yüze", value: "yuz-yuze", icon: "🏢" },
      { label: "Online (Görüntülü)", value: "online", icon: "💻" },
      { label: "Fark etmez", value: "her-ikisi", icon: "🤷" },
    ],
  },
  {
    id: 4,
    soru: "Hangi şehirde hizmet almak istiyorsunuz?",
    tip: "tekli",
    cevaplar: [
      { label: "İstanbul", value: "İstanbul" },
      { label: "Ankara", value: "Ankara" },
      { label: "İzmir", value: "İzmir" },
      { label: "Diğer / Online", value: "Online" },
      { label: "Fark etmez", value: "farketmez" },
    ],
  },
  {
    id: 5,
    soru: "Seans ücreti aralığınız nedir?",
    tip: "tekli",
    cevaplar: [
      { label: "500 TL ve altı", value: "500" },
      { label: "500 - 1000 TL", value: "1000" },
      { label: "1000 - 1500 TL", value: "1500" },
      { label: "Fark etmez", value: "farketmez" },
    ],
  },
  {
    id: 6,
    soru: "Cinsiyet tercihiniz var mı?",
    tip: "tekli",
    cevaplar: [
      { label: "Fark etmez", value: "farketmez" },
      { label: "Kadın psikolog", value: "kadin" },
      { label: "Erkek psikolog", value: "erkek" },
    ],
  },
];

interface Eslesme {
  psikolog: any;
  puan: number;
  nedenler: string[];
}

export default function AnketPage() {
  const router = useRouter();
  const [currentSoru, setCurrentSoru] = useState(0);
  const [cevaplar, setCevaplar] = useState<Record<number, string | string[]>>({});
  const [sonuclar, setSonuclar] = useState<Eslesme[] | null>(null);

  const handleCevap = (soruId: number, value: string) => {
    const soru = sorular.find(s => s.id === soruId);
    if (!soru) return;

    if (soru.tip === "coklu") {
      const mevcut = (cevaplar[soruId] as string[]) || [];
      const yeni = mevcut.includes(value)
        ? mevcut.filter(v => v !== value)
        : [...mevcut, value];
      setCevaplar({ ...cevaplar, [soruId]: yeni });
    } else {
      setCevaplar({ ...cevaplar, [soruId]: value });
    }
  };

  const ileri = () => {
    if (currentSoru < sorular.length - 1) {
      setCurrentSoru(currentSoru + 1);
    } else {
      eslestir();
    }
  };

  const geri = () => {
    if (currentSoru > 0) {
      setCurrentSoru(currentSoru - 1);
    }
  };

  const eslestir = () => {
    const tumPsikologlar = getTumPsikologlar();
    const sonuc: Eslesme[] = tumPsikologlar.map((p: any) => {
      let puan = 0;
      const nedenler: string[] = [];

      // Uzmanlık alanı eşleşmesi
      const secilenAlanlar = cevaplar[1] as string[] || [];
      const eslesenAlanlar = secilenAlanlar.filter(a => p.uzmanlik_alani.includes(a as any));
      if (eslesenAlanlar.length > 0) {
        puan += eslesenAlanlar.length * 25;
        nedenler.push(`${eslesenAlanlar.length} uzmanlık alanınızda uzman`);
      }

      // Terapi yöntemi eşleşmesi
      const secilenYontem = cevaplar[2] as string;
      if (secilenYontem && secilenYontem !== "farketmez" && p.terapi_yontemi.includes(secilenYontem as any)) {
        puan += 15;
        nedenler.push("Tercih ettiğiniz terapi yönteminde uzman");
      }

      // Terapi tipi eşleşmesi
      const secilenTip = cevaplar[3] as string;
      if (secilenTip && (p.terapi_tipi === secilenTip || secilenTip === "her-ikisi")) {
        puan += 10;
      }

      // Şehir eşleşmesi
      const secilenSehir = cevaplar[4] as string;
      if (secilenSehir && secilenSehir !== "farketmez" && p.sehir === secilenSehir) {
        puan += 10;
        nedenler.push("Şehrinizde hizmet veriyor");
      }

      // Ücret eşleşmesi
      const secilenUcret = parseInt(cevaplar[5] as string);
      if (!isNaN(secilenUcret) && p.seans_ucreti <= secilenUcret) {
        puan += 10;
        nedenler.push("Bütçenize uygun");
      }

      // Rozet bonusu
      if (p.diploma_onayli) puan += 5;
      if (p.ucretsiz_on_gorusme) {
        puan += 5;
        nedenler.push("Ücretsiz ön görüşme imkanı");
      }

      // Puan bonusu
      puan += Math.round(p.puan_ortalamasi * 3);

      return { psikolog: p, puan: Math.min(puan, 100), nedenler };
    });

    sonuc.sort((a, b) => b.puan - a.puan);
    setSonuclar(sonuc.slice(0, 6));
  };

  const anketDevamEdiyor = currentSoru < sorular.length;
  const soru = sorular[currentSoru];
  const mevcutCevap = cevaplar[soru?.id];

  const ileriDisabled = () => {
    if (!soru) return true;
    if (soru.tip === "coklu") {
      const arr = mevcutCevap as string[] | undefined;
      return !arr || arr.length === 0;
    }
    return !mevcutCevap;
  };

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-calm-900">Size Uygun Psikolog</h1>
              <p className="text-sm text-calm-500">Kısa bir anketle size en uygun psikoloğu bulalım</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {anketDevamEdiyor ? (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-calm-500">
                  Soru {currentSoru + 1} / {sorular.length}
                </span>
                <span className="text-sm font-medium text-primary-600">
                  %{Math.round(((currentSoru + 1) / sorular.length) * 100)}
                </span>
              </div>
              <div className="h-2 bg-calm-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentSoru + 1) / sorular.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Soru */}
            <div className="card">
              <h2 className="text-xl font-semibold text-calm-900 mb-1">
                {soru.soru}
              </h2>
              {soru.altMetin && (
                <p className="text-sm text-calm-500 mb-6">{soru.altMetin}</p>
              )}

              <div className="space-y-2">
                {soru.cevaplar.map((cevap) => {
                  const secili = soru.tip === "coklu"
                    ? (mevcutCevap as string[] || []).includes(cevap.value)
                    : mevcutCevap === cevap.value;

                  return (
                    <button
                      key={cevap.value}
                      onClick={() => handleCevap(soru.id, cevap.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        secili
                          ? "border-primary-500 bg-primary-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-calm-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cevap.icon && (
                          <span className="text-xl">{cevap.icon}</span>
                        )}
                        <span className={`font-medium ${secili ? "text-primary-700" : "text-calm-700"}`}>
                          {cevap.label}
                        </span>
                        {secili && (
                          <CheckCircle className="h-5 w-5 text-primary-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={geri}
                disabled={currentSoru === 0}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Geri
              </button>
              <button
                onClick={ileri}
                disabled={ileriDisabled()}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {currentSoru === sorular.length - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Eşleştir
                  </>
                ) : (
                  <>
                    Devam
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : sonuclar ? (
          <div>
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-calm-900">
                Size En Uygun Psikologlar
              </h2>
              <p className="text-calm-500 mt-1">
                {sonuclar.length} psikolog sizinle eşleşti
              </p>
              <button
                onClick={() => { setSonuclar(null); setCurrentSoru(0); setCevaplar({}); }}
                className="text-sm text-primary-600 hover:text-primary-700 mt-2"
              >
                Anketi tekrarla
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {sonuclar.map((eslesme, index) => (
                <Link
                  key={eslesme.psikolog.id}
                  href={`/psikolog/${eslesme.psikolog.id}`}
                  className="card-hover block"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-gray-100 text-gray-600" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-calm-100 text-calm-500"
                    }`}>
                      <span className="font-bold text-sm">{index + 1}</span>
                    </div>

                    {/* Avatar */}
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary-600">
                        {eslesme.psikolog.unvan.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-calm-900">
                            {eslesme.psikolog.unvan}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-sm text-calm-500">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span>{eslesme.psikolog.puan_ortalamasi}</span>
                            <span>•</span>
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{eslesme.psikolog.sehir}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-semibold text-calm-900">
                            {formatPara(eslesme.psikolog.seans_ucreti)}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              eslesme.puan >= 80 ? "bg-green-100 text-green-700" :
                              eslesme.puan >= 60 ? "bg-amber-100 text-amber-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              %{eslesme.puan} Uyum
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Nedenler */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {eslesme.nedenler.map((neden, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                            <CheckCircle className="h-3 w-3" />
                            {neden}
                          </span>
                        ))}
                        {eslesme.psikolog.ucretsiz_on_gorusme && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <Clock className="h-3 w-3" />
                            Ücretsiz Ön Görüşme
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-calm-300 shrink-0 mt-4" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/psikologlar" className="btn-secondary">
                Tüm Psikologları Gör
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
