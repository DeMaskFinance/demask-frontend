import { EthereumProvider } from "@walletconnect/ethereum-provider";
import detectEthereumProvider from "@metamask/detect-provider";

declare global {
  interface Window {
    //@ts-expect-error:error
    ethereum: any;
    okxwallet?: any;
  }
}

export const getProvider = async (wallet: string) => {
  let provider = null;

  if (window.ethereum) {
    const availableProviders = new Map<string, any>();

    const handleProviderAnnounce = (event: any) => {
      const { info, provider } = event.detail;
      if (info?.uuid && !availableProviders.has(info.uuid)) {
        availableProviders.set(info.uuid, { name: info.name, provider });
      }
    };

    window.addEventListener("eip6963:announceProvider", handleProviderAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    await new Promise((resolve) => setTimeout(resolve, 500));

    const providerEntry = Array.from(availableProviders.values()).find(
      (p) => p.name?.toLowerCase() === wallet.toLowerCase()
    );

    provider = providerEntry ? providerEntry.provider : null;

    window.removeEventListener(
      "eip6963:announceProvider",
      handleProviderAnnounce
    );
  }

  return provider;
};
