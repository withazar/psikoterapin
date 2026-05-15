"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser(profile as User);
          }
        }
      } catch (e) {
        console.warn("Auth başlatma hatası:", e);
      }
      setLoading(false);
    };

    initAuth();

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
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
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
          return { success: true };
        }
      }

      return { success: false, error: "Kullanıcı bulunamadı." };
    } catch (err: any) {
      return { success: false, error: err.message || "Giriş yapılırken bir hata oluştu." };
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; ad: string; soyad: string; telefon?: string; rol?: UserRole }) => {
    try {
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
        return { success: false, error: error.message };
      }

      if (authData?.user) {
        // Profil otomatik oluşturulacak (trigger ile)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profile) {
          setUser(profile as User);

          // Eğer psikolog kaydı ise, onay bekleyenlere ekle ve profil oluştur
          if (data.rol === "psikolog") {
            try {
              // Psikolog profili oluştur
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

              // Onay bekleyenlere ekle
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

      return { success: false, error: "Kayıt başarılı ancak profil oluşturulamadı." };
    } catch (err: any) {
      return { success: false, error: err.message || "Kayıt olurken bir hata oluştu." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Çıkış hatası:", e);
    }
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    try {
      await supabase.from("profiles").update(data).eq("id", user.id);
      setUser({ ...user, ...data, updated_at: new Date().toISOString() });
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
