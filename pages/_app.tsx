import { Layout } from "@/components/Layouts";
import ProgressBar from "@/components/Layouts/ProviderRouter";
import SEOHead from "@/components/SEOHead";
import { StarknetProvider } from "@/components/StarknetProvider";
import { networks, wagmiAdapter } from "@/config";
import { AccountProvider } from "@/context/AccountContext";
import { metadata, queryClient, titillium } from "@/libs/constants";
import WalletIds from "@/libs/constants/walletIds";
import "@/styles/globals.css";
import { createAppKit } from '@reown/appkit/react';
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import NextAdapterPages from "next-query-params";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryParamProvider } from "use-query-params";
import { WagmiProvider } from "wagmi";
import store from "../store";
import MaintenanceError from "./maintenanceError";
import ProfileProvider from "@/components/Providers/ProfileProvider";
import ProfileReconnectProvider from "@/components/Providers/ProfileProvider";
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

  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) {
  //   return null;
  // }


  return (
    <Provider store={store}>
      <ProgressBar />
      <SEOHead />
      <AccountProvider>
        <StarknetProvider>
          <QueryClientProvider client={queryClient}>
            <QueryParamProvider adapter={NextAdapterPages}>
              <style jsx global>{`
                  html {
                    font-family: ${titillium.style.fontFamily};
                  }
                `}</style>
              <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <ProfileReconnectProvider>

                  <Layout>
                    {isMaintenanceMode ? (
                      <MaintenanceError />
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </Layout>
                </ProfileReconnectProvider>
                <ReactQueryDevtools initialIsOpen={false} />
              </WagmiProvider>
            </QueryParamProvider>
          </QueryClientProvider>
        </StarknetProvider>
      </AccountProvider>
    </Provider>
  );
}
