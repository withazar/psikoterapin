"use client";

import Link from "next/link";
import { Brain, ArrowRight, Search } from "lucide-react";
import { MOCK_BLOG_YAZILARI } from "@/lib/data";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BlogContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [searchParams]);

  const allTags = Array.from(
    new Set(MOCK_BLOG_YAZILARI.flatMap((y) => y.etiketler))
  );

  const filteredPosts = MOCK_BLOG_YAZILARI.filter((yazi) => {
    const matchesSearch =
      yazi.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yazi.ozet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || yazi.etiketler.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-calm-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-calm-900">
              Psikoloji Blogu
            </h1>
            <p className="mt-2 text-lg text-calm-500">
              Uzman psikologlarımızdan değerli içerikler
            </p>
          </div>
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-calm-400" />
            <input
              type="text"
              placeholder="Yazı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag("")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !selectedTag
                ? "bg-primary-600 text-white"
                : "bg-white text-calm-600 hover:bg-calm-100 ring-1 ring-gray-200"
            }`}
          >
            Tümü
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-primary-600 text-white"
                  : "bg-white text-calm-600 hover:bg-calm-100 ring-1 ring-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((yazi) => (
            <Link
              key={yazi.id}
              href={`/blog/${yazi.id}`}
              className="card-hover group"
            >
              <div className="h-44 rounded-xl bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-50 flex items-center justify-center mb-4">
                <Brain className="h-14 w-14 text-primary-400" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {yazi.etiketler.map((etiket) => (
                  <span
                    key={etiket}
                    className="inline-flex items-center rounded-full bg-calm-100 px-2.5 py-0.5 text-xs font-medium text-calm-600"
                  >
                    {etiket}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-calm-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {yazi.baslik}
              </h2>
              <p className="mt-2 text-sm text-calm-500 line-clamp-3">
                {yazi.ozet}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-calm-400">
                <span>{yazi.psikolog_adi}</span>
                <span>{yazi.okunma_sayisi} okunma</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Brain className="h-12 w-12 text-calm-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-calm-900">
              Yazı bulunamadı
            </h3>
            <p className="text-sm text-calm-500">
              Farklı bir arama yapmayı deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-calm-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-calm-300 mx-auto mb-4 animate-pulse" />
          <p className="text-calm-500">Yükleniyor...</p>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
