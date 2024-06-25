import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import SmoothScrolling from "@/components/SmoothScrolling";
import { AOSInit } from "@/components/AOS";
import Head from "next/head";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          ></link>
        </Head>
        <AOSInit />
        <body className={titillium.className}>
          <Header />
          {children}
          {/* <SmoothScrolling></SmoothScrolling> */}
          <Footer />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
