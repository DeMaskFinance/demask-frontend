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
import WalletIds from "@/libs/constants/walletIds";
import { useEffect } from "react";
type NextPageWithLayout<P = any> = NextPage<P> & {
  PageLayout?: any;
};

const STORAGE_KEY = "@appkit/recent_wallets";

interface Wallet {
  id: string;
  name: string;
  homepage?: string;
  [key: string]: any;
}
const projectId = "1af0159e7a959f2fff3f96c541aef2cb";

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'dark' as const,
}

export const modal = createAppKit({
  featuredWalletIds: [
    WalletIds.MetamaskId,
    WalletIds.BackpackId,
    WalletIds.HaHaId,
    WalletIds.LeapId,
    WalletIds.PhantomId,
  ],
  excludeWalletIds: [
    WalletIds.OKXId,
    WalletIds.KoalaId,
    WalletIds.BraveId,
  ],

  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet'],
  },
  allWallets: "HIDE",
})


export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const isMaintenanceMode = false;

  const removeRecentWallet = (walletId: string): void => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return;

    try {
      const recentWallets: Wallet[] = JSON.parse(storedData);
      const updatedWallets = recentWallets.filter(wallet => wallet.id !== walletId);

      if (updatedWallets.length !== recentWallets.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));
      }
    } catch (error) {
      console.error("Error parsing recent wallets from localStorage:", error);
    }
  };
  useEffect(() => {
    removeRecentWallet(WalletIds.OKXId);
  }, []);

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
