import "@/styles/globals.css";
import Head from "next/head";
import AccountContext, { AccountProvider } from "@/context/AccountContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Layout} from "@/components/Layouts";
import type { ReactElement,ReactNode } from 'react'
import type { AppProps } from "next/app";
import type { NextPage } from 'next'
import { getModeFromLocalStorage } from "@/libs/utils/getModeFromLocalStorage";

const queryClient = new QueryClient();
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};
export default function App({ Component, pageProps }: AppProps & { Component: NextPageWithLayout }) {
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <QueryClientProvider client={queryClient}>
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
