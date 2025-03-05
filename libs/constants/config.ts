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
  name: "Demask",
  description: "Demask Finance",
  url: "https://app.demask.finance",
  icons: ["https://app.demask.finance/bigFavicon.png"],
};
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "900", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});
export { queryClient, metadata, titillium };
