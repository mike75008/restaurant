import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "Restaurant | L'Art de la Table",
  description:
    "Cuisine de saison, produits sourcés avec soin, un savoir-faire qui sublime chaque assiette.",
  keywords: "restaurant, bistrot, gastronomie, paris, cuisine française, réservation",
  openGraph: {
    title: "Restaurant | L'Art de la Table",
    description: "Cuisine de saison, produits d'exception, savoir-faire artisanal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className="antialiased">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
