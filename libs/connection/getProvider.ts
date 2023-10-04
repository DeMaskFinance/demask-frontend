// import { getWalletConnectProvider } from "@/components/Modal/ModalWallet/WalletConnectProvider";

import getWalletConnectProvider from "@/components/Modal/ModalWallet/WalletConnectProvider";

export const getProvider = (wallet: string) => {
  let provider = null;
  if (wallet === "Metamask") {
    if (window.ethereum?.providers) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of window.ethereum?.providers) {
        if (p.isMetaMask) {
          provider = p;
          break;
        }
      }
    } else if (window.ethereum?.isMetaMask) {
      provider = window.ethereum;
    }
  }
  if (wallet === "Coinbase") {
    if (window.ethereum?.providers)
      // eslint-disable-next-line no-restricted-syntax
      for (const p of window.ethereum?.providers) {
        if (p.isCoinbaseWallet) {
          provider = p;
          break;
        }
      }
    else provider = window.coinbaseWalletExtension;
  }
  if (wallet === "WalletConnect") {
    provider = getWalletConnectProvider();
  }
  return provider;
};
