import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { monadTestnet, polygon } from "@reown/appkit/networks";

export const projectId = "c00998d2cdc140a2fb0fc47599957079";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Demask Finance",
  description: "Demask Finance",
  url: "https://app.demask.finance",
  icons: ["https://app.demask.finance/bigFavicon.png"],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [monadTestnet] as [AppKitNetwork, ...AppKitNetwork[]];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
