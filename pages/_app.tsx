 import { Layout } from "@/components/Layouts";
import ProgressBar from "@/components/Layouts/ProviderRouter";
import { StarknetProvider } from "@/components/StarknetProvider";
import { networks, wagmiAdapter } from "@/config";
import { AccountProvider } from "@/context/AccountContext";
import { metadata, queryClient, titillium } from "@/libs/constants";
import "@/styles/globals.css";
import { createAppKit } from '@reown/appkit/react';
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import NextAdapterPages from "next-query-params";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryParamProvider } from "use-query-params";
import { WagmiProvider } from "wagmi";
import store, { persistor } from "../store";
import MaintenanceError from "./maintenanceError";
import SEOHead from "@/components/SEOHead";
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

export const modal = createAppKit({
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0',
    '719bd888109f5e8dd23419b20e749900ce4d2fc6858cf588395f19c82fd036b3',
    '3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6',
  ],
  excludeWalletIds: [
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
    "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3",
    "e401b54ca287ce5c4c4579a91220e79816cff07cdf18b388fde84449c3be8a51",
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
          <StarknetProvider>
            <QueryClientProvider client={queryClient}>

              <SEOHead />
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
                  <ReactQueryDevtools initialIsOpen={false} />
                </WagmiProvider>
              </QueryParamProvider>
            </QueryClientProvider>
          </StarknetProvider>
        </AccountProvider>
      </PersistGate>
    </Provider>
  );
}
