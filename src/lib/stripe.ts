import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const stripePromise = loadStripe(stripePublishableKey);

export const ABONELIK_PAKETLERI = [
  {
    id: "temel",
    ad: "Temel",
    ucret: 299,
    aciklama: "Profilinizi listeleyin ve danışanlarla bağlantı kurun",
    ozellikler: [
      "Profil oluşturma ve yayınlama",
      "Temel filtrelerde görünme",
      "Ayda 5 danışan talebi",
      "E-posta desteği",
    ],
    populer: false,
  },
  {
    id: "premium",
    ad: "Premium",
    ucret: 599,
    aciklama: "Öne çıkın ve daha fazla danışana ulaşın",
    ozellikler: [
      "Tüm Temel özellikler",
      "Öncelikli sıralama",
      "Sınırsız danışan talebi",
      "Blog yazma imkanı",
      "İstatistik paneli",
      "Öncelikli destek",
    ],
    populer: true,
  },
  {
    id: "one-cikan",
    ad: "Öne Çıkan",
    ucret: 999,
    aciklama: "Maksimum görünürlük ve ayrıcalıklar",
    ozellikler: [
      "Tüm Premium özellikler",
      "Ana sayfada öne çıkan profil",
      "Arama sonuçlarında ilk sıra",
      "Özel 'Öne Çıkan' rozeti",
      "Aylık SEO optimizasyonu",
      "Sosyal medya tanıtımı",
      "7/24 öncelikli destek",
    ],
    populer: false,
  },
];
