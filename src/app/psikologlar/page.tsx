"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, MapPin, Filter } from "lucide-react";
import { getTumPsikologlar } from "@/lib/data";
import PsikologKarti from "@/components/PsikologKarti";
import {
  UZMANLIK_ALANLARI,
  TERAPI_YONTEMLERI,
  SEHIRLER,
} from "@/lib/utils";
import { UzmanlikAlani, TerapiYontemi, TerapiTipi } from "@/types";

export default function PsikologlarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlan, setSelectedAlan] = useState<string>("");
  const [selectedSehir, setSelectedSehir] = useState<string>("");
  const [selectedYontem, setSelectedYontem] = useState<string>("");
  const [selectedTip, setSelectedTip] = useState<string>("");
  const [siralama, setSiralama] = useState<string>("puan");
  const [filtrelerAcik, setFiltrelerAcik] = useState(false);

  const filtrelenmisPsikologlar = useMemo(() => {
    let sonuc = getTumPsikologlar();

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sonuc = sonuc.filter(
        (p) =>
          p.unvan.toLowerCase().includes(term) ||
          p.hakkinda.toLowerCase().includes(term) ||
          p.sehir.toLowerCase().includes(term) ||
          p.uzmanlik_alani.some((a) => a.toLowerCase().includes(term))
      );
    }

    if (selectedAlan) {
      sonuc = sonuc.filter((p) =>
        p.uzmanlik_alani.includes(selectedAlan as UzmanlikAlani)
      );
    }

    if (selectedSehir) {
      sonuc = sonuc.filter((p) => p.sehir === selectedSehir);
    }

    if (selectedYontem) {
      sonuc = sonuc.filter((p) =>
        p.terapi_yontemi.includes(selectedYontem as TerapiYontemi)
      );
    }

    if (selectedTip) {
      sonuc = sonuc.filter(
        (p) => p.terapi_tipi === (selectedTip as TerapiTipi) || p.terapi_tipi === "her-ikisi"
      );
    }

    switch (siralama) {
      case "puan":
        sonuc.sort((a, b) => b.puan_ortalamasi - a.puan_ortalamasi);
        break;
      case "yorum":
        sonuc.sort((a, b) => b.yorum_sayisi - a.yorum_sayisi);
        break;
      case "ucret":
        sonuc.sort((a, b) => a.seans_ucreti - b.seans_ucreti);
        break;
      case "deneyim":
        sonuc.sort((a, b) => b.deneyim_yili - a.deneyim_yili);
        break;
    }

    return sonuc;
  }, [searchTerm, selectedAlan, selectedSehir, selectedYontem, selectedTip, siralama]);

  const aktifFiltreSayisi = [
    selectedAlan,
    selectedSehir,
    selectedYontem,
    selectedTip,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-calm-900">Psikologlar</h1>
          <p className="mt-1 text-calm-500">
            Size en uygun psikoloğu bulun
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-calm-400" />
            <input
              type="text"
              placeholder="Psikolog adı, uzmanlık alanı veya şehir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={siralama}
              onChange={(e) => setSiralama(e.target.value)}
              className="input-field w-auto min-w-[140px]"
            >
              <option value="puan">En Yüksek Puan</option>
              <option value="yorum">En Çok Yorum</option>
              <option value="ucret">En Düşük Ücret</option>
              <option value="deneyim">En Deneyimli</option>
            </select>
            <button
              onClick={() => setFiltrelerAcik(!filtrelerAcik)}
              className={`btn-secondary relative ${
                filtrelerAcik ? "ring-2 ring-primary-500" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
              {aktifFiltreSayisi > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {aktifFiltreSayisi}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {filtrelerAcik && (
            <div className="lg:w-72 shrink-0 animate-slide-down">
              <div className="card space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-calm-900">Filtreler</h3>
                  <button
                    onClick={() => {
                      setSelectedAlan("");
                      setSelectedSehir("");
                      setSelectedYontem("");
                      setSelectedTip("");
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Temizle
                  </button>
                </div>

                {/* Uzmanlık Alanı */}
                <div>
                  <label className="label">Uzmanlık Alanı</label>
                  <select
                    value={selectedAlan}
                    onChange={(e) => setSelectedAlan(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tümü</option>
                    {Object.entries(UZMANLIK_ALANLARI).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Şehir */}
                <div>
                  <label className="label">Şehir</label>
                  <select
                    value={selectedSehir}
                    onChange={(e) => setSelectedSehir(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tümü</option>
                    {SEHIRLER.map((sehir) => (
                      <option key={sehir} value={sehir}>
                        {sehir}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Terapi Yöntemi */}
                <div>
                  <label className="label">Terapi Yöntemi</label>
                  <select
                    value={selectedYontem}
                    onChange={(e) => setSelectedYontem(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tümü</option>
                    {Object.entries(TERAPI_YONTEMLERI).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Terapi Tipi */}
                <div>
                  <label className="label">Terapi Tipi</label>
                  <div className="space-y-2">
                    {[
                      { value: "", label: "Tümü" },
                      { value: "online", label: "Online" },
                      { value: "yuz-yuze", label: "Yüz Yüze" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="terapiTipi"
                          value={option.value}
                          checked={selectedTip === option.value}
                          onChange={(e) => setSelectedTip(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-calm-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-calm-500">
                <span className="font-medium text-calm-700">
                  {filtrelenmisPsikologlar.length}
                </span>{" "}
                psikolog bulundu
              </p>
              {aktifFiltreSayisi > 0 && (
                <div className="flex items-center gap-2">
                  {selectedAlan && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                      {UZMANLIK_ALANLARI[selectedAlan]}
                      <button onClick={() => setSelectedAlan("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSehir && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-calm-100 px-3 py-1 text-xs font-medium text-calm-700">
                      {selectedSehir}
                      <button onClick={() => setSelectedSehir("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {filtrelenmisPsikologlar.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-calm-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-calm-900">
                  Sonuç bulunamadı
                </h3>
                <p className="mt-1 text-sm text-calm-500">
                  Filtreleri değiştirerek tekrar deneyin
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtrelenmisPsikologlar.map((psikolog) => (
                  <PsikologKarti key={psikolog.id} psikolog={psikolog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
