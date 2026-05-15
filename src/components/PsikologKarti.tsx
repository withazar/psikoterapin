"use client";

import Link from "next/link";
import { MapPin, Star, Video, Shield, Clock, Sparkles } from "lucide-react";
import { PsikologProfili } from "@/types";
import { formatPara, yildizlariGoster, UZMANLIK_ALANLARI } from "@/lib/utils";

interface Props {
  psikolog: PsikologProfili;
}

export default function PsikologKarti({ psikolog }: Props) {
  const initials = psikolog.unvan
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="card-hover group animate-fade-in h-full">
      <div className="flex flex-col sm:flex-row gap-5 h-full">
        {/* Profile Image */}
        <div className="relative shrink-0 sm:self-start">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden ring-2 ring-primary-100">
            {psikolog.profil_foto_url ? (
              <img
                src={psikolog.profil_foto_url}
                alt={psikolog.unvan}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-600">
                {initials}
              </span>
            )}
          </div>

          {/* Online Badge */}
          {psikolog.terapi_tipi === "online" && (
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-secondary-500 flex items-center justify-center ring-2 ring-white">
              <Video className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-calm-900 group-hover:text-primary-600 transition-colors">
                {psikolog.unvan}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm font-medium text-calm-700">
                    {psikolog.puan_ortalamasi}
                  </span>
                </div>
                <span className="text-calm-400 text-sm">
                  ({psikolog.yorum_sayisi} yorum)
                </span>
                <span className="text-calm-300">•</span>
                <span className="text-sm text-calm-500">
                  {psikolog.deneyim_yili} yıl deneyim
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-calm-900">
                {formatPara(psikolog.seans_ucreti)}
              </p>
              <p className="text-xs text-calm-500">/ seans</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {psikolog.rozetler.map((rozet) => (
              <span
                key={rozet.id}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  rozet.tip === "dogrulanmis-uzman"
                    ? "bg-primary-100 text-primary-700"
                    : rozet.tip === "populer"
                    ? "bg-amber-100 text-amber-700"
                    : rozet.tip === "one-cikan"
                    ? "bg-purple-100 text-purple-700"
                    : rozet.tip === "yeni-uye"
                    ? "bg-green-100 text-green-700"
                    : "bg-calm-100 text-calm-700"
                }`}
              >
                {rozet.tip === "one-cikan" && (
                  <Sparkles className="h-3 w-3" />
                )}
                {rozet.tip === "dogrulanmis-uzman" && (
                  <Shield className="h-3 w-3" />
                )}
                {rozet.label}
              </span>
            ))}
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {psikolog.uzmanlik_alani.slice(0, 3).map((alan) => (
              <span
                key={alan}
                className="inline-flex items-center rounded-full bg-calm-100 px-2.5 py-0.5 text-xs font-medium text-calm-600"
              >
                {UZMANLIK_ALANLARI[alan] || alan}
              </span>
            ))}
            {psikolog.uzmanlik_alani.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-calm-100 px-2.5 py-0.5 text-xs font-medium text-calm-500">
                +{psikolog.uzmanlik_alani.length - 3}
              </span>
            )}
          </div>

          {/* Location & Features */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-calm-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {psikolog.sehir}
            </span>
            {psikolog.terapi_tipi !== "yuz-yuze" && (
              <span className="flex items-center gap-1 text-secondary-600">
                <Video className="h-3.5 w-3.5" />
                Online
              </span>
            )}
            {psikolog.ucretsiz_on_gorusme && (
              <span className="flex items-center gap-1 text-primary-600">
                <Clock className="h-3.5 w-3.5" />
                Ücretsiz Ön Görüşme
              </span>
            )}
            {psikolog.diploma_onayli && (
              <span className="flex items-center gap-1 text-green-600">
                <Shield className="h-3.5 w-3.5" />
                Diploma Onaylı
              </span>
            )}
          </div>

          {/* Action */}
          <div className="mt-auto pt-4 flex items-center gap-3">
            <Link
              href={`/psikolog/${psikolog.id}`}
              className="btn-primary text-sm py-2 px-5"
            >
              Profili Gör
            </Link>
            {psikolog.ucretsiz_on_gorusme && (
              <button className="btn-ghost text-sm py-2 text-primary-600 hover:text-primary-700">
                Ücretsiz Ön Görüşme
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
