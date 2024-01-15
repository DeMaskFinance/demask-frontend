// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { walletConnectRpc } from "./connector";

// export const getWalletConnectProvider = () =>
//   new WalletConnectProvider({
//     rpc: walletConnectRpc,
//   });

import { EthereumProvider } from "@walletconnect/ethereum-provider";

async function getWalletConnectProvider() {
  try {
    const provider = await EthereumProvider.init({
      projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
      chains: [1], // REQUIRED chain ids
      optionalChains: [97, 80001, 280],
      showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
      methods: ["eth_sendTransaction"],
      events: ["eth_transactionHash","chainChanged", "accountsChanged", "connect", "disconnect"],
      // optionalEvents, // OPTIONAL ethereum events
      rpcMap: {
        "1": "https://mainnet.eth.aragon.network",
        "80001": "https://polygon-mumbai-bor.publicnode.com",
        "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "56": "https://bsc-dataseed.binance.org/",
        "280": "https://testnet.era.zksync.dev",
      },
    })
    return provider;
  } catch (error) {
    console.error("Lỗi khi khởi tạo WalletConnect Provider:", error);
    throw error;
  }
}

export default getWalletConnectProvider;
