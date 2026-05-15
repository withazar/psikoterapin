"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Randevu, RandevuDurumu } from "@/types";
import { supabase } from "@/lib/supabase";

interface RandevuContextType {
  randevular: Randevu[];
  loading: boolean;
  randevuAl: (data: Omit<Randevu, "id" | "created_at" | "updated_at" | "durum" | "odeme_yapildi">) => Promise<Randevu | null>;
  randevuOnayla: (id: string) => Promise<void>;
  randevuIptal: (id: string) => Promise<void>;
  randevuTamamla: (id: string) => Promise<void>;
  danisanRandevulari: (danisanId: string) => Randevu[];
  psikologRandevulari: (psikologId: string) => Randevu[];
  bekleyenRandevular: (psikologId: string) => Randevu[];
  refreshRandevular: () => Promise<void>;
}

const RandevuContext = createContext<RandevuContextType | undefined>(undefined);

export function RandevuProvider({ children }: { children: React.ReactNode }) {
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRandevular = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("randevular")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRandevular(data as Randevu[]);
    } catch (err) {
      console.error("Randevu yükleme hatası:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshRandevular();
  }, [refreshRandevular]);

  const randevuAl = useCallback(async (data: Omit<Randevu, "id" | "created_at" | "updated_at" | "durum" | "odeme_yapildi">) => {
    try {
      const { data: yeniRandevu, error } = await supabase
        .from("randevular")
        .insert({
          ...data,
          durum: "bekliyor",
          odeme_yapildi: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (yeniRandevu) {
        setRandevular(prev => [yeniRandevu as Randevu, ...prev]);
        return yeniRandevu as Randevu;
      }
      return null;
    } catch (err) {
      console.error("Randevu oluşturma hatası:", err);
      return null;
    }
  }, []);

  const randevuOnayla = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("randevular")
        .update({ durum: "onaylandi", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setRandevular(prev =>
        prev.map(r => (r.id === id ? { ...r, durum: "onaylandi" as RandevuDurumu, updated_at: new Date().toISOString() } : r))
      );
    } catch (err) {
      console.error("Randevu onaylama hatası:", err);
    }
  }, []);

  const randevuIptal = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("randevular")
        .update({ durum: "iptal", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setRandevular(prev =>
        prev.map(r => (r.id === id ? { ...r, durum: "iptal" as RandevuDurumu, updated_at: new Date().toISOString() } : r))
      );
    } catch (err) {
      console.error("Randevu iptal hatası:", err);
    }
  }, []);

  const randevuTamamla = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("randevular")
        .update({ durum: "tamamlandi", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setRandevular(prev =>
        prev.map(r => (r.id === id ? { ...r, durum: "tamamlandi" as RandevuDurumu, updated_at: new Date().toISOString() } : r))
      );
    } catch (err) {
      console.error("Randevu tamamlama hatası:", err);
    }
  }, []);

  const danisanRandevulari = useCallback(
    (danisanId: string) => randevular.filter((r) => r.danisan_id === danisanId),
    [randevular]
  );

  const psikologRandevulari = useCallback(
    (psikologId: string) => randevular.filter((r) => r.psikolog_id === psikologId),
    [randevular]
  );

  const bekleyenRandevular = useCallback(
    (psikologId: string) => randevular.filter((r) => r.psikolog_id === psikologId && r.durum === "bekliyor"),
    [randevular]
  );

  return (
    <RandevuContext.Provider
      value={{
        randevular,
        loading,
        randevuAl,
        randevuOnayla,
        randevuIptal,
        randevuTamamla,
        danisanRandevulari,
        psikologRandevulari,
        bekleyenRandevular,
        refreshRandevular,
      }}
    >
      {children}
    </RandevuContext.Provider>
  );
}

export function useRandevu() {
  const context = useContext(RandevuContext);
  if (!context) {
    throw new Error("useRandevu must be used within a RandevuProvider");
  }
  return context;
}
