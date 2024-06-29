import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import SmoothScrolling from "@/components/SmoothScrolling";
import { AOSInit } from "@/components/AOS";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "900", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Demask",
  description:
    "Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program",
  twitter: {
    site: "https://twitter.com/DemaskFinance",
  },
  openGraph: {
    title:
      "DeMask - Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program",
    description:
      "DeMask is the leading platform to find solutions to increase liquidity for the market for trading crypto collectibles. ",
    images: [
      {
        url: "https://file.demask.finance/d39fc733640a02ea90bf4891a9a9ca50.png",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: { rel: "apple-touch-icon-precomposed", url: "/favicon-32x32.png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <AOSInit />
        <body className={titillium.className}>
          <Header />

          <SmoothScrolling>{children}</SmoothScrolling>
          <Footer />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
