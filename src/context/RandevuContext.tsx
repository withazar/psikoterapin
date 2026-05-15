"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Randevu, RandevuDurumu } from "@/types";

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

// LocalStorage yardımcıları
function getLocalRandevular(): Randevu[] {
  try {
    // Önce yeni key'i dene
    let data = localStorage.getItem("psikoterapin_randevular");
    if (!data) {
      // Eski key'den taşı
      data = localStorage.getItem("psikobul_randevular");
      if (data) {
        localStorage.setItem("psikoterapin_randevular", data);
        localStorage.removeItem("psikobul_randevular");
      }
    }
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveLocalRandevular(randevular: Randevu[]) {
  localStorage.setItem("psikoterapin_randevular", JSON.stringify(randevular));
}

export function RandevuProvider({ children }: { children: React.ReactNode }) {
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRandevular = useCallback(async () => {
    try {
      const data = getLocalRandevular();
      setRandevular(data);
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
      const yeniRandevu: Randevu = {
        ...data,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
        durum: "bekliyor",
        odeme_yapildi: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mevcut = getLocalRandevular();
      mevcut.unshift(yeniRandevu);
      saveLocalRandevular(mevcut);
      setRandevular(mevcut);

      return yeniRandevu;
    } catch (err) {
      console.error("Randevu oluşturma hatası:", err);
      return null;
    }
  }, []);

  const randevuOnayla = useCallback(async (id: string) => {
    try {
      const mevcut = getLocalRandevular();
      const guncel = mevcut.map((r) =>
        r.id === id ? { ...r, durum: "onaylandi" as RandevuDurumu, updated_at: new Date().toISOString() } : r
      );
      saveLocalRandevular(guncel);
      setRandevular(guncel);
    } catch (err) {
      console.error("Randevu onaylama hatası:", err);
    }
  }, []);

  const randevuIptal = useCallback(async (id: string) => {
    try {
      const mevcut = getLocalRandevular();
      const guncel = mevcut.map((r) =>
        r.id === id ? { ...r, durum: "iptal" as RandevuDurumu, updated_at: new Date().toISOString() } : r
      );
      saveLocalRandevular(guncel);
      setRandevular(guncel);
    } catch (err) {
      console.error("Randevu iptal hatası:", err);
    }
  }, []);

  const randevuTamamla = useCallback(async (id: string) => {
    try {
      const mevcut = getLocalRandevular();
      const guncel = mevcut.map((r) =>
        r.id === id ? { ...r, durum: "tamamlandi" as RandevuDurumu, updated_at: new Date().toISOString() } : r
      );
      saveLocalRandevular(guncel);
      setRandevular(guncel);
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
