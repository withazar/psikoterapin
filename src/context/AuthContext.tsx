"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";
import { upsertPsikologProfili, saveOnayBekleyenler, getOnayBekleyenler } from "@/lib/localData";
import { UZMANLIK_ALANLARI } from "@/lib/utils";


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; ad: string; soyad: string; telefon?: string; rol?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAdmin: boolean;
  isPsikolog: boolean;
  isDanisan: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========== LOCALSTORAGE YARDIMCILARI (Supabase offline fallback) ==========

function getLocalUsers(): any[] {
  try {
    let data = localStorage.getItem("psikoterapin_users");
    if (!data) {
      data = localStorage.getItem("psikobul_users");
      if (data) {
        localStorage.setItem("psikoterapin_users", data);
        localStorage.removeItem("psikobul_users");
      }
    }
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("localStorage okuma hatası, temizleniyor:", e);
    localStorage.removeItem("psikoterapin_users");
    localStorage.removeItem("psikobul_users");
    return [];
  }
}

function saveLocalUsers(users: any[]) {
  try {
    localStorage.setItem("psikoterapin_users", JSON.stringify(users));
  } catch (e) {
    console.error("localStorage yazma hatası:", e);
  }
}

function getLocalSession(): any {
  try {
    let data = localStorage.getItem("psikoterapin_session");
    if (!data) {
      data = localStorage.getItem("psikobul_session");
      if (data) {
        localStorage.setItem("psikoterapin_session", data);
        localStorage.removeItem("psikobul_session");
      }
    }
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    localStorage.removeItem("psikoterapin_session");
    localStorage.removeItem("psikobul_session");
    return null;
  }
}

function saveLocalSession(session: any) {
  try {
    if (session) {
      localStorage.setItem("psikoterapin_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("psikoterapin_session");
    }
  } catch (e) {
    console.error("Session yazma hatası:", e);
  }
}

// ========== DEMO KULLANICILAR ==========

const DEMO_USERS = [
  {
    id: "admin-demo-001",
    email: "admin@psikoterapin.com",
    password: "admin123",
    ad: "Admin",
    soyad: "User",
    rol: "admin" as UserRole,
    telefon: "0555 000 00 01",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-001",
    email: "ahmet@psikoterapin.com",
    password: "psikolog123",
    ad: "Ahmet",
    soyad: "Yılmaz",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 02",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-002",
    email: "ayse@psikoterapin.com",
    password: "psikolog123",
    ad: "Ayşe",
    soyad: "Demir",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 03",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "danisan-demo-001",
    email: "mehmet@psikoterapin.com",
    password: "danisan123",
    ad: "Mehmet",
    soyad: "Kaya",
    rol: "danisan" as UserRole,
    telefon: "0555 000 00 04",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-003",
    email: "zeynep@psikoterapin.com",
    password: "psikolog123",
    ad: "Zeynep",
    soyad: "Kaya",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 05",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-004",
    email: "canan@psikoterapin.com",
    password: "psikolog123",
    ad: "Canan",
    soyad: "Şahin",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 06",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-005",
    email: "ali@psikoterapin.com",
    password: "psikolog123",
    ad: "Ali",
    soyad: "Yıldız",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 07",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "psikolog-demo-006",
    email: "elif@psikoterapin.com",
    password: "psikolog123",
    ad: "Elif",
    soyad: "Yıldırım",
    rol: "psikolog" as UserRole,
    telefon: "0555 000 00 08",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

function initDemoUsers() {
  try {
    const existing = getLocalUsers();
    let updated = false;
    for (const demoUser of DEMO_USERS) {
      const exists = existing.find((u: any) => u.email === demoUser.email);
      if (!exists) {
        existing.push(demoUser);
        updated = true;
      }
    }
    if (updated) {
      saveLocalUsers(existing);
    }
  } catch (e) {
    console.error("Demo kullanıcı ekleme hatası:", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Demo kullanıcıları başlat
        initDemoUsers();

        // 1. Önce Supabase Auth oturumunu kontrol et
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Supabase'den profil bilgilerini al
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser(profile as User);
            saveLocalSession(profile);
            return;
          }
        }

        // 2. Supabase yoksa localStorage'dan yükle
        const localSession = getLocalSession();
        if (localSession) {
          setUser(localSession);
        }
      } catch (e) {
        console.warn("Auth başlatma hatası (Supabase offline olabilir):", e);
        // Fallback: localStorage
        const localSession = getLocalSession();
        if (localSession) {
          setUser(localSession);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Supabase Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profile) {
            setUser(profile as User);
            saveLocalSession(profile);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          saveLocalSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // 1. Önce Supabase Auth ile dene
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data?.user && !error) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          setUser(profile as User);
          saveLocalSession(profile);
          return { success: true };
        }
      }

      // 2. Supabase başarısız olursa localStorage'a düş
      if (error) {
        console.warn("Supabase giriş hatası, localStorage deneniyor:", error.message);
      }
    } catch (e) {
      console.warn("Supabase giriş hatası (offline mod), localStorage deneniyor:", e);
    }

    // Fallback: localStorage
    try {
      const users = getLocalUsers();
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        saveLocalSession(userWithoutPassword);
        return { success: true };
      }

      return { success: false, error: "E-posta veya şifre hatalı. Demo hesapları kullanmayı deneyin!" };
    } catch (err: any) {
      return { success: false, error: err.message || "Giriş yapılırken bir hata oluştu." };
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; ad: string; soyad: string; telefon?: string; rol?: UserRole }) => {
    try {
      // 1. Önce Supabase Auth ile kayıt dene
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            ad: data.ad,
            soyad: data.soyad,
            rol: data.rol || "danisan",
          },
        },
      });

      if (authData?.user && !error) {
        // Profil otomatik oluşturulacak (trigger ile)
        // Biraz bekle ve profili al
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profile) {
          setUser(profile as User);
          saveLocalSession(profile);
          return { success: true };
        }
      }

      // Supabase hatası varsa localStorage'a düş
      if (error) {
        console.warn("Supabase kayıt hatası, localStorage deneniyor:", error.message);
      }
    } catch (e) {
      console.warn("Supabase kayıt hatası (offline mod), localStorage deneniyor:", e);
    }

    // Fallback: localStorage
    try {
      const users = getLocalUsers();

      if (users.find((u: any) => u.email === data.email)) {
        return { success: false, error: "Bu e-posta adresi zaten kayıtlı." };
      }

      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
        email: data.email,
        password: data.password,
        ad: data.ad,
        soyad: data.soyad,
        rol: data.rol || "danisan",
        telefon: data.telefon || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      users.push(newUser);
      saveLocalUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      saveLocalSession(userWithoutPassword);

      // Eğer psikolog kaydı ise, onay bekleyenlere ekle ve profil oluştur
      if (data.rol === "psikolog") {
        try {
          // Psikolog profili oluştur
          upsertPsikologProfili({
            kullanici_id: newUser.id,
            unvan: `Uzm. Psk. ${data.ad} ${data.soyad}`,
            hakkinda: "",
            uzmanlik_alani: [],
            terapi_yontemi: [],
            terapi_tipi: "yuz-yuze",
            sehir: "",
            seans_ucreti: 500,
            deneyim_yili: 0,
            egitim: [],
            sertifikalar: [],
            rozetler: [{ id: `rozet-${newUser.id}`, tip: "yeni-uye", label: "Yeni Üye" }],
            puan_ortalamasi: 0,
            yorum_sayisi: 0,
            diploma_onayli: false,
            profil_foto_url: "",
            abonelik_durumu: "deneme",
            abonelik_paketi: "temel",
            ucretsiz_on_gorusme: false,
            aktif: false,
            admin_onaylandi: false,
            email: data.email,
            telefon: data.telefon || "",
          });

          // Onay bekleyenlere ekle
          const bekleyenler = getOnayBekleyenler();
          bekleyenler.push({
            id: `bekleyen-${newUser.id}`,
            kullanici_id: newUser.id,
            ad: `Uzm. Psk. ${data.ad} ${data.soyad}`,
            email: data.email,
            telefon: data.telefon || "",
            alan: "Psikoloji",
            basvuru: new Date().toLocaleDateString("tr-TR"),
            durum: "beklemede",
            profil: {
              kullanici_id: newUser.id,
              unvan: `Uzm. Psk. ${data.ad} ${data.soyad}`,
              email: data.email,
            },
          });
          saveOnayBekleyenler(bekleyenler);
        } catch (e) {
          console.error("Psikolog profili oluşturma hatası:", e);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Kayıt olurken bir hata oluştu." };
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      // Supabase'den çıkış yap
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase çıkış hatası:", e);
    }
    // localStorage'ı da temizle
    setUser(null);
    saveLocalSession(null);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    try {
      // Supabase'de güncelle
      await supabase.from("profiles").update(data).eq("id", user.id);
    } catch (e) {
      console.warn("Supabase profil güncelleme hatası:", e);
    }

    // localStorage'ı da güncelle
    try {
      const users = getLocalUsers();
      const index = users.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data, password: users[index].password, updated_at: new Date().toISOString() };
        saveLocalUsers(users);
      }

      const updated = { ...user, ...data, updated_at: new Date().toISOString() };
      setUser(updated);
      saveLocalSession(updated);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin: user?.rol === "admin",
        isPsikolog: user?.rol === "psikolog",
        isDanisan: user?.rol === "danisan",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
