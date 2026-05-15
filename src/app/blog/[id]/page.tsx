"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  ChevronLeft,
  Calendar,
  Eye,
  ArrowRight,
  Clock,
  User,
  Tag,
} from "lucide-react";
import { MOCK_BLOG_YAZILARI, MOCK_PSIKOLOGLAR } from "@/lib/data";
import { formatTarih } from "@/lib/utils";

export default function BlogDetayPage() {
  const params = useParams();
  const yazi = MOCK_BLOG_YAZILARI.find((y) => y.id === params.id);

  if (!yazi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-calm-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-calm-900">
            Yazı bulunamadı
          </h2>
          <p className="mt-2 text-calm-500">
            Aradığınız blog yazısı mevcut değil.
          </p>
          <Link
            href="/blog"
            className="btn-primary mt-6 inline-flex"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  const psikolog = MOCK_PSIKOLOGLAR.find((p) => p.id === yazi.psikolog_id);

  return (
    <div className="min-h-screen bg-calm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-calm-500 hover:text-calm-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Blog'a Dön
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <div className="h-56 sm:h-72 lg:h-96 rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-50 flex items-center justify-center mb-8">
          <Brain className="h-20 w-20 sm:h-28 sm:w-28 text-primary-400" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-calm-500 mb-4">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {yazi.psikolog_adi}
          </span>
          <span className="text-calm-300">•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatTarih(yazi.created_at)}
          </span>
          <span className="text-calm-300">•</span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {yazi.okunma_sayisi} okunma
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-calm-900 leading-tight mb-4">
          {yazi.baslik}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {yazi.etiketler.map((etiket) => (
            <Link
              key={etiket}
              href={`/blog?tag=${etiket}`}
              className="inline-flex items-center gap-1 rounded-full bg-calm-100 px-3 py-1.5 text-xs font-medium text-calm-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              <Tag className="h-3 w-3" />
              {etiket}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="card mb-8">
          <div className="prose prose-calm max-w-none">
            <p className="text-lg text-calm-600 leading-relaxed mb-6 font-medium">
              {yazi.ozet}
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-calm-600 leading-relaxed whitespace-pre-line">
                {yazi.icerik}
              </p>
              <p className="mt-6 text-calm-500 italic">
                Bu yazı {yazi.psikolog_adi} tarafından PsikoBul Blog için
                hazırlanmıştır. Psikolojik destek almak için bir uzmana
                danışmanız önerilir.
              </p>
            </div>
          </div>
        </div>

        {/* Author Card */}
        {psikolog && (
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ring-2 ring-primary-100 shrink-0">
                <span className="text-xl font-bold text-primary-600">
                  {psikolog.unvan
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-calm-900">
                  {yazi.psikolog_adi}
                </p>
                <p className="text-sm text-calm-500 mt-0.5">
                  {psikolog.unvan} • {psikolog.sehir}
                </p>
                <Link
                  href={`/psikolog/${psikolog.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mt-2"
                >
                  Profili Gör
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link
            href="/blog"
            className="btn-secondary text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tüm Yazılar
          </Link>
          <Link
            href="/psikologlar"
            className="btn-primary text-sm"
          >
            Psikolog Bul
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </article>
    </div>
  );
}
