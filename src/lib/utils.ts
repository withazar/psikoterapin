import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPara(tutar: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tutar);
}

export function formatTarih(tarih: string): string {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTarihKisa(tarih: string): string {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function yildizlariGoster(puan: number): string {
  const tam = Math.floor(puan);
  const yarim = puan - tam >= 0.5;
  let yildizlar = "★".repeat(tam);
  if (yarim) yildizlar += "½";
  yildizlar += "☆".repeat(5 - tam - (yarim ? 1 : 0));
  return yildizlar;
}

export function slugOlustur(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function rastgeleRenk(): string {
  const renkler = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
  ];
  return renkler[Math.floor(Math.random() * renkler.length)];
}

export const SEHIRLER = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Diyarbakır",
  "Kayseri",
  "Eskişehir",
  "Trabzon",
  "Samsun",
  "Denizli",
  "Online",
];

export const UZMANLIK_ALANLARI: Record<string, string> = {
  "klinik-psikoloji": "Klinik Psikoloji",
  "cinsel-terapi": "Cinsel Terapi",
  "cift-terapisi": "Çift Terapisi",
  "cocuk-psikolojisi": "Çocuk Psikolojisi",
  "ergen-psikolojisi": "Ergen Psikolojisi",
  anksiyete: "Anksiyete",
  depresyon: "Depresyon",
  travma: "Travma",
  bagimlilik: "Bağımlılık",
  "aile-danismanligi": "Aile Danışmanlığı",
  "psikolojik-degerlendirme": "Psikolojik Değerlendirme",
  noropsikoloji: "Nöropsikoloji",
  "adli-psikoloji": "Adli Psikoloji",
  "spor-psikolojisi": "Spor Psikolojisi",
  "is-psikolojisi": "İş Psikolojisi",
};

export const TERAPI_YONTEMLERI: Record<string, string> = {
  bdt: "BDT (Bilişsel Davranışçı Terapi)",
  emdr: "EMDR",
  psikanalitik: "Psikanalitik Terapi",
  humanistik: "Humanistik Terapi",
  gestalt: "Gestalt Terapi",
  "aile-sistemleri": "Aile Sistemleri",
  "sanat-terapisi": "Sanat Terapisi",
  psikodrama: "Psikodrama",
  "farkindalik-temelli": "Farkındalık Temelli Terapi",
  dbt: "DBT (Diyalektik Davranış Terapisi)",
};
