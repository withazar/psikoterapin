import Link from "next/link";
import { Brain, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-calm-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-8">
          <Brain className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold text-calm-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-calm-900 mb-2">
          Sayfa Bulunamadı
        </h2>
        <p className="text-calm-500 mb-8 leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
          Lütfen adresi kontrol edin veya ana sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Link>
          <Link
            href="/psikologlar"
            className="btn-secondary inline-flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Psikologları Keşfet
          </Link>
        </div>
      </div>
    </div>
  );
}
