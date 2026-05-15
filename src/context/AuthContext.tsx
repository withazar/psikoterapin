"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { supabase, testSupabaseConnection } from "@/lib/supabase";
import { upsertPsikologProfili, addOnayBekleyen } from "@/lib/supabase-queries";

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

// ============ LOCALSTORAGE DEMO AUTH ============
const AUTH_STORAGE_KEY = "psikoterapin_auth_user";

// Demo kullanıcılar
const DEMO_USERS: User[] = [
  {
    id: "admin-demo-001",
    email: "admin@psikoterapin.com",
    ad: "Admin",
    soyad: "User",
    rol: "admin",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "psikolog-demo-001",
    email: "ahmet@psikoterapin.com",
    ad: "Ahmet",
    soyad: "Yılmaz",
    rol: "psikolog",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "psikolog-demo-002",
    email: "ayse@psikoterapin.com",
    ad: "Ayşe",
    soyad: "Demir",
    rol: "psikolog",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "danisan-demo-001",
    email: "mehmet@psikoterapin.com",
    ad: "Mehmet",
    soyad: "Kaya",
    rol: "danisan",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

// Demo şifreler
const DEMO_PASSWORDS: Record<string, string> = {
  "admin@psikoterapin.com": "admin123",
  "ahmet@psikoterapin.com": "psikolog123",
  "ayse@psikoterapin.com": "psikolog123",
  "mehmet@psikoterapin.com": "danisan123",
};

// localStorage'dan kayıtlı kullanıcıları al
function getLocalUsers(): User[] {
  try {
    const stored = localStorage.getItem("psikoterapin_local_users");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// localStorage'a kayıtlı kullanıcı ekle
function addLocalUser(user: User, password: string) {
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem("psikoterapin_local_users", JSON.stringify(users));
  
  // Şifreyi de sakla
  const passwords: Record<string, string> = {};
  try {
    const stored = localStorage.getItem("psikoterapin_local_passwords");
    if (stored) Object.assign(passwords, JSON.parse(stored));
  } catch {}
  passwords[user.email] = password;
  localStorage.setItem("psikoterapin_local_passwords", JSON.stringify(passwords));
}

// localStorage'dan kullanıcı ara
function findLocalUser(email: string, password: string): User | null {
  // Önce demo kullanıcıları kontrol et
  const demoUser = DEMO_USERS.find(u => u.email === email);
  if (demoUser && DEMO_PASSWORDS[email] === password) {
    return demoUser;
  }
  
  // Sonra kayıtlı kullanıcıları kontrol et
  const users = getLocalUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    const passwords: Record<string, string> = {};
    try {
      const stored = localStorage.getItem("psikoterapin_local_passwords");
      if (stored) Object.assign(passwords, JSON.parse(stored));
    } catch {}
    if (passwords[email] === password) {
      return user;
    }
  }
  
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Önce localStorage'daki kullanıcıyı kontrol et
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // Supabase session'ı kontrol et
        const isConnected = await testSupabaseConnection();
        if (isConnected) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser(profile as User);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Auth başlatma hatası:", e);
      }
      setLoading(false);
    };

    initAuth();

    // Supabase auth state değişikliklerini dinle
    try {
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
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    } catch {
      // Supabase bağlantısı yoksa sorun değil
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Önce localStorage demo/kayıtlı kullanıcıları kontrol et
      const localUser = findLocalUser(email, password);
      if (localUser) {
        setUser(localUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
        return { success: true };
      }

      // Supabase ile giriş yapmayı dene
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          if (profile) {
            setUser(profile as User);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            return { success: true };
          }
        }
      }

      return { success: false, error: "E-posta veya şifre hatalı." };
    } catch (err: any) {
      return { success: false, error: err.message || "Giriş yapılırken bir hata oluştu." };
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; ad: string; soyad: string; telefon?: string; rol?: UserRole }) => {
    try {
      // Önce Supabase'e kaydetmeyi dene
      const isConnected = await testSupabaseConnection();
      
      if (isConnected) {
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

        if (error) {
          // Supabase hatası varsa localStorage'a kaydet
          console.warn("Supabase kayıt hatası, localStorage'a kaydediliyor:", error.message);
        } else if (authData?.user) {
          // Profil otomatik oluşturulacak (trigger ile)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (profile) {
            setUser(profile as User);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));

            // Eğer psikolog kaydı ise, onay bekleyenlere ekle ve profil oluştur
            if (data.rol === "psikolog") {
              try {
                await upsertPsikologProfili({
                  kullanici_id: authData.user.id,
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
                  rozetler: [{ id: `rozet-${authData.user.id}`, tip: "yeni-uye", label: "Yeni Üye" }],
                  puan_ortalamasi: 0,
                  yorum_sayisi: 0,
                  diploma_onayli: false,
                  profil_foto_url: "",
                  abonelik_durumu: "deneme",
                  abonelik_paketi: "temel",
                  ucretsiz_on_gorusme: false,
                  aktif: false,
                });

                await addOnayBekleyen({
                  ad: `Uzm. Psk. ${data.ad} ${data.soyad}`,
                  email: data.email,
                  alan: "Psikoloji",
                  durum: "beklemede",
                });
              } catch (e) {
                console.error("Psikolog profili oluşturma hatası:", e);
              }
            }

            return { success: true };
          }
        }
      }

      // Supabase bağlantısı yoksa veya hata varsa localStorage'a kaydet
      const newUser: User = {
        id: `local-${Date.now()}`,
        email: data.email,
        ad: data.ad,
        soyad: data.soyad,
        rol: data.rol || "danisan",
        telefon: data.telefon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addLocalUser(newUser, data.password);
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Kayıt olurken bir hata oluştu." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase çıkış hatası:", e);
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    try {
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        await supabase.from("profiles").update(data).eq("id", user.id);
      }
      const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn("Profil güncelleme hatası:", e);
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
