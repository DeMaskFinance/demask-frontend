import { EthereumProvider } from "@walletconnect/ethereum-provider";
import detectEthereumProvider from "@metamask/detect-provider";

declare global {
  interface Window {
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

  if (!provider && wallet === "Metamask") {
    const provider2 = await detectEthereumProvider();
    if (provider2 && provider2 === window.ethereum) {
      provider = provider2;
    }
  }

  if (!provider && wallet === "Coinbase") {
    if (Array.isArray(window.ethereum?.providers)) {
      for (const p of window.ethereum.providers) {
        if (p.isCoinbaseWallet) {
          provider = p;
          break;
        }
      }
    } else {
      provider = window.coinbaseWalletExtension;
    }
  }

  // OKX fallback
  if (!provider && wallet === "OKX") {
    if (Array.isArray(window.ethereum?.providers)) {
      for (const p of window.ethereum.providers) {
        if (p.isOkxWallet) {
          provider = p;
          break;
        }
      }
    } else if (window.okxwallet) {
      provider = window.okxwallet;
    }
  }

  // WalletConnect
  if (wallet === "WalletConnect") {
    provider = await EthereumProvider.init({
      projectId: "1af0159e7a959f2fff3f96c541aef2cb",
      chains: [11155111],
      optionalChains: [11155111],
      showQrModal: true,
      methods: ["eth_sendTransaction"],
      optionalMethods: [
        "personal_sign",
        "eth_sign",
        "eth_signTransaction",
        "eth_sendTransaction",
        "eth_signTypedData",
        "eth_signTypedData_v3",
        "eth_signTypedData_v4",
        "wallet_addEthereumChain",
        "eth_requestAccounts",
        "eth_accounts",
        "wallet_switchEthereumChain",
      ],
      events: [
        "eth_transactionHash",
        "chainChanged",
        "accountsChanged",
        "disconnect",
      ],
      rpcMap: {
        11155111: "https://ethereum-sepolia-rpc.publicnode.com",
      },
    });
  }

  return provider;
};
