import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "FoodSal - Gastronomia & Sabor",
  description: "Saboreie nossa seleção especial diretamente da sua mesa. Peça de forma rápida e elegante.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${outfit.variable} h-full`}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F5E6D3] text-stone-800 antialiased selection:bg-[#C62828] selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}