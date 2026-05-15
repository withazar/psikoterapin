"use client";

import { useEffect } from "react";
import { Brain, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uygulama hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-calm-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto mb-8">
          <Brain className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-calm-900 mb-4">
          Bir Hata Oluştu
        </h1>
        <p className="text-calm-500 mb-8 leading-relaxed">
          Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin
          veya ana sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 rounded-xl bg-red-50 border border-red-200 text-left">
            <p className="text-xs font-semibold text-red-800 mb-2">
              Hata Detayı (Sadece Geliştirme Modunda)
            </p>
            <pre className="text-xs text-red-700 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
