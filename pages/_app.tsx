import { Layout } from "@/components/Layouts";
import { AccountProvider } from "@/context/AccountContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import type { NextPage } from "next";
import NextAdapterPages from "next-query-params";
import type { AppProps } from "next/app";
import { Titillium_Web } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { QueryParamProvider } from "use-query-params";
import { mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import store, { persistor } from "../store";
import MaintenanceError from "./maintenanceError";
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};
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
const projectId = "1af0159e7a959f2fff3f96c541aef2cb";
// const chains = [sepolia, mainnet];
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia],
  projectId,
  metadata,
});
const chains = [mainnet];
createWeb3Modal({ wagmiConfig, projectId, defaultChain: sepolia });
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
              <WagmiProvider config={wagmiConfig}>
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
              </WagmiProvider>
              {/* <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                themeVariables={{
                  "--w3m-z-index": "9999",
                }}
              /> */}
              <ToastContainer limit={1} />
            </QueryParamProvider>
          </QueryClientProvider>
        </AccountProvider>
      </PersistGate>
    </Provider>
  );
}
