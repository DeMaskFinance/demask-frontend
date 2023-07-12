import "@/styles/globals.css";
import Head from "next/head";
import AccountContext, { AccountProvider } from "@/context/AccountContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Layout } from "@/components/Layouts";
import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { Poppins } from "next/font/google";
const queryClient = new QueryClient();
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  return (
    <AccountProvider>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
      </Head>
      <QueryClientProvider client={queryClient}>
        <style jsx global>{`
          html {
            font-family: ${poppins.style.fontFamily};
          }
        `}</style>
        {Component.PageLayout ? (
          <Component.PageLayout>
            <Component {...pageProps} />
          </Component.PageLayout>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </QueryClientProvider>
    </AccountProvider>
  );
}
