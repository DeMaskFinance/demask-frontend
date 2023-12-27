// import { getWalletConnectProvider } from "@/components/Modal/ModalWallet/WalletConnectProvider";

import getWalletConnectProvider from "@/components/Modal/ModalWallet/WalletConnectProvider";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

export const getProvider = async (wallet: string) => {
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
    provider = await EthereumProvider.init({
      projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
      chains: [280], // REQUIRED chain ids
      // optionalChains: [97, 80001, 280],
      showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
      methods: ["eth_sendTransaction"],
      events: ["eth_transactionHash"],
      // optionalEvents, // OPTIONAL ethereum events
      rpcMap: {
        // "1": "https://mainnet.eth.aragon.network",
        // "80001": "https://polygon-mumbai-bor.publicnode.com",
        // "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
        // "56": "https://bsc-dataseed.binance.org/",
        "280": "https://testnet.era.zksync.dev",
      },
    });
  }
  return provider;
};
