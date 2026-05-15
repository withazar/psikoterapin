import Link from "next/link";
import { Brain, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-calm-900 text-calm-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Psiko<span className="text-primary-400">terapin</span>
              </span>
            </Link>
            <p className="text-sm text-calm-400 leading-relaxed">
              Türkiye'nin en güvenilir psikolog bulma platformu. Uzman
              psikologlarla kolayca bağlantı kurun, randevunuzu alın.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-calm-800 text-calm-400 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </span>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-calm-800 text-calm-400 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </span>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-calm-800 text-calm-400 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zM16 16h-2v-3c0-1.071-.429-2-1.5-2s-1.5.929-1.5 2v3h-2v-6h2v.879c.375-.542 1.081-.879 2-.879 1.5 0 3 1.214 3 3.121V16z"/></svg>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/psikologlar" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Psikologlar
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/anket" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Size Uygun Psikolog
                </Link>
              </li>
              <li>
                <Link href="/kayit" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Psikolog musunuz?
                </Link>
              </li>
            </ul>
          </div>

          {/* For Psychologists */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Psikologlar İçin
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/kayit" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Profil Oluştur
                </Link>
              </li>
              <li>
                <Link href="/kayit" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Abonelik Paketleri
                </Link>
              </li>
              <li>
                <Link href="/panel" className="text-sm text-calm-400 hover:text-white transition-colors">
                  Psikolog Paneli
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-calm-400">destek@psikoterapin.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-calm-400">0850 123 45 67</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-calm-400">İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-calm-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-calm-500">
              &copy; {new Date().getFullYear()} Psikoterapin. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-1 text-sm text-calm-500">
              <Heart className="h-3.5 w-3.5 text-red-400" />
              <span>Sağlıklı günler dileriz</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
