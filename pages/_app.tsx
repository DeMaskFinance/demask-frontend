import "@/styles/globals.css";
import Head from "next/head";
import { AccountProvider } from "@/context/AccountContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layouts";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { Poppins, Roboto_Mono, Titillium_Web } from "next/font/google";
import MaintenanceError from "./maintenanceError";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  mainnet,
  polygon,
  zkSyncTestnet,
  goerli,
} from "wagmi/chains";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextAdapterPages from "next-query-params";
import { QueryParamProvider } from "use-query-params";
import { Provider } from "react-redux";
import store, { persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
// import { ThemeProvider } from "next-themes";
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};
const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "900", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60000,
    },
  },
});
const chains = [arbitrum, mainnet, polygon, zkSyncTestnet, goerli];
const projectId = "1af0159e7a959f2fff3f96c541aef2cb";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const isMaintenanceMode = false;

  return (
    <Provider store={store}>
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
          <QueryClientProvider client={queryClient}>
            <QueryParamProvider adapter={NextAdapterPages}>
              <style jsx global>{`
                html {
                  font-family: ${titillium.style.fontFamily};
                }
              `}</style>
              <ThemeProvider attribute="class">
                <WagmiConfig config={wagmiConfig}>
                  {isMaintenanceMode ? (
                    <Layout>
                      <MaintenanceError />
                    </Layout>
                  ) : Component.PageLayout ? (
                    <Component.PageLayout>
                      <Component {...pageProps} />
                    </Component.PageLayout>
                  ) : (
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </WagmiConfig>
              </ThemeProvider>
              <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                themeVariables={{
                  "--w3m-z-index": "9999",
                }}
              />
              <ToastContainer limit={1} />
            </QueryParamProvider>
          </QueryClientProvider>
        </AccountProvider>
      </PersistGate>
    </Provider>
  );
}
