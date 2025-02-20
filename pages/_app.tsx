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
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};

const projectId = "1af0159e7a959f2fff3f96c541aef2cb";

const monad = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'TMON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6'],
      webSocket: ['wss://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://monad-foundation.notion.site/Monad-Testnet-Onboarding-Guide-17c6367594f280369b6fddeed24de9db' },
  },
  contracts: {
    multicall3: {
      address: '0xd70160709b01d7e5E3CDEfB80eb7807345bB51c2',
      blockCreated: 5882,
    },
  },
})

const wagmiConfig = defaultWagmiConfig({
  chains: [monad],
  projectId,
  metadata,
});


createWeb3Modal({ wagmiConfig, projectId, defaultChain: sepolia });
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
                {/* <WagmiProvider config={wagmiConfig}> */}
                <Layout>
                  {isMaintenanceMode ? (
                    <MaintenanceError />
                  ) : (
                    <Component {...pageProps} />
                  )}
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
                {/* </WagmiProvider> */}
              </QueryParamProvider>
            </QueryClientProvider>
          </StarknetProvider>
        </AccountProvider>
      </PersistGate>
    </Provider>
  );
}
