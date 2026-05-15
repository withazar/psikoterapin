"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User, LogIn, Brain, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isPsikolog } = useAuth();

  const navigation = [
    { name: "Psikologlar", href: "/psikologlar" },
    { name: "Blog", href: "/blog" },
    { name: "Nasıl Çalışır?", href: "/#nasil-calisir" },
    { name: "Psikolog musunuz?", href: "/kayit" },
  ];

  const initials = user
    ? `${user.ad[0]}${user.soyad[0]}`
    : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-calm-900">
              Psiko<span className="text-primary-600">terapin</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-calm-600 transition-colors hover:bg-calm-100 hover:text-calm-900"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link
              href="/psikologlar"
              className="btn-ghost flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Ara</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {(isAdmin || isPsikolog) && (
                  <Link
                    href={isAdmin ? "/admin" : "/panel"}
                    className="btn-ghost flex items-center gap-1.5 text-sm"
                  >
                    {isAdmin ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <LayoutDashboard className="h-4 w-4" />
                    )}
                    {isAdmin ? "Admin" : "Panel"}
                  </Link>
                )}
                <Link
                  href="/profil"
                  className="flex items-center gap-2 rounded-xl bg-calm-100 px-3 py-1.5 text-sm font-medium text-calm-700 hover:bg-calm-200 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600">
                      {initials}
                    </span>
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.ad} {user.soyad}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="btn-ghost flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </button>
              </div>
            ) : (
              <>
                <Link href="/kayit" className="btn-secondary text-sm py-2 px-4">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Giriş Yap
                </Link>
                <Link href="/kayit" className="btn-primary text-sm py-2 px-4">
                  Psikolog musunuz?
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-calm-500 hover:bg-calm-100 hover:text-calm-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-down">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-calm-600 hover:bg-calm-100 hover:text-calm-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-calm-50">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-calm-900">{user.ad} {user.soyad}</p>
                      <p className="text-xs text-calm-500">{user.rol === "admin" ? "Admin" : user.rol === "psikolog" ? "Psikolog" : "Danışan"}</p>
                    </div>
                  </div>
                  {(isAdmin || isPsikolog) && (
                    <Link
                      href={isAdmin ? "/admin" : "/panel"}
                      className="btn-secondary text-sm py-2.5 px-4 justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {isAdmin ? "Admin Paneli" : "Psikolog Paneli"}
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="btn-ghost text-sm py-2.5 px-4 justify-center text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/kayit"
                    className="btn-secondary text-sm py-2.5 px-4 justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="btn-primary text-sm py-2.5 px-4 justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Psikolog musunuz?
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
