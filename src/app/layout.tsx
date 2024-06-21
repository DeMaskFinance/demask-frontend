import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={titillium.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
