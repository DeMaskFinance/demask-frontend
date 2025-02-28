import { Layout } from "@/components/Layouts";
import { AccountProvider } from "@/context/AccountContext";
import { metadata, queryClient, titillium } from "@/libs/constants";
import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import type { NextPage } from "next";
import NextAdapterPages from "next-query-params";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryParamProvider } from "use-query-params";
import { mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import store, { persistor } from "../store";
import MaintenanceError from "./maintenanceError";
import { StarknetProvider } from "@/components/StarknetProvider";
import { defineChain } from "viem";
import ProgressBar from "@/components/Layouts/ProviderRouter";
import NetworkListener from "@/components/NetworkListener";
import { networks, wagmiAdapter } from "@/config";
import { createAppKit } from '@reown/appkit/react';
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};

const projectId = "1af0159e7a959f2fff3f96c541aef2cb";

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'dark' as const,
}

createAppKit({
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0',
    '719bd888109f5e8dd23419b20e749900ce4d2fc6858cf588395f19c82fd036b3',
    '3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6',
  ],
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet'],
  },


})


export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const isMaintenanceMode = false;

  return (
    <Provider store={store}>
      <ProgressBar />
      <PersistGate loading={null} persistor={persistor}>
        <AccountProvider>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />

          <Script id="google-analytics">
            {` 
                    window.dataLayer = window.dataLayer || []; 
                    function gtag(){dataLayer.push(arguments);} 
                    gtag('js', new Date()); 
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}'); 
                `}
          </Script>
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
          <StarknetProvider>
            <QueryClientProvider client={queryClient}>
              <QueryParamProvider adapter={NextAdapterPages}>
                <style jsx global>{`
                  html {
                    font-family: ${titillium.style.fontFamily};
                  }
                `}</style>
                <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                  <Layout>
                    {isMaintenanceMode ? (
                      <MaintenanceError />
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </Layout>
                  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </WagmiProvider>
              </QueryParamProvider>
            </QueryClientProvider>
          </StarknetProvider>
        </AccountProvider>
      </PersistGate>
    </Provider>
  );
}
