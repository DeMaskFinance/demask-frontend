import { QueryClient } from "@tanstack/react-query";
import { Titillium_Web } from "next/font/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60000,
      // gcTime: 5 * 60 * 1000,
      notifyOnChangeProps: "all",
    },
  },
});
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "900", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});
export { queryClient, metadata, titillium };
