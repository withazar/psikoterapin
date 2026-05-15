import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { RandevuProvider } from "@/context/RandevuContext";

export const metadata: Metadata = {
  title: {
    default: "Psikoterapin - Güvenilir Psikolog Bulma Platformu",
    template: "%s | Psikoterapin",
  },
  description:
    "Türkiye'nin en güvenilir psikolog bulma platformu. Uzman psikologlarla kolayca bağlantı kurun, online veya yüz yüze randevunuzu hemen alın.",
  keywords: [
    "psikolog",
    "terapi",
    "psikolojik destek",
    "online terapi",
    "cinsel terapi",
    "çift terapisi",
    "çocuk psikolojisi",
    "anksiyete",
    "depresyon",
    "psikoterapi",
    "psikolog bul",
    "randevu al",
  ],
  authors: [{ name: "Psikoterapin" }],
  creator: "Psikoterapin",
  publisher: "Psikoterapin",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://psikoterapin.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Psikoterapin",
    title: "Psikoterapin - Güvenilir Psikolog Bulma Platformu",
    description:
      "Türkiye'nin en güvenilir psikolog bulma platformu. Uzman psikologlarla kolayca bağlantı kurun.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Psikoterapin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Psikoterapin - Güvenilir Psikolog Bulma Platformu",
    description:
      "Türkiye'nin en güvenilir psikolog bulma platformu. Uzman psikologlarla kolayca bağlantı kurun.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-kodu", // Google Search Console için
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <RandevuProvider>
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </RandevuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
