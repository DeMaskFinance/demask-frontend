// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { walletConnectRpc } from "./connector";

// export const getWalletConnectProvider = () =>
//   new WalletConnectProvider({
//     rpc: walletConnectRpc,
//   });

import { EthereumProvider } from '@walletconnect/ethereum-provider';

async function getWalletConnectProvider() {

  try {
    const provider = await EthereumProvider.init({
        projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
        chains: [1, 97, 80001], // REQUIRED chain ids
        showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
        methods: ["eth_sendTransaction"],
        events: ["eth_transactionHash"],
        // optionalEvents, // OPTIONAL ethereum events
        rpcMap: {
          "1": "https://mainnet.eth.aragon.network",
          "5": "https://goerli.eth.aragon.network",
          "137": "https://polygon-rpc.com",
          "80001": "https://polygon-mumbai-bor.publicnode.com",
          "1666600000": "https://api.harmony.one/",
          "1666700000": "https://api.s0.b.hmny.io/",
          "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
          "56": "https://bsc-dataseed.binance.org/",
          "588": "https://stardust.metis.io/?owner=588",
          "1088": "https://andromeda.metis.io/?owner=1088",
          "43113": "https://api.avax-test.network/ext/bc/C/rpc",
          "686": "https://eth-rpc-karura.aca-api.network/eth/http",
          "43114": "https://api.avax.network/ext/bc/c/rpc",
          "1311": "https://test.doschain.com/jsonrpc",
        }, // OPTIONAL rpc urls for each chain
      });
    return provider;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Lỗi khi khởi tạo WalletConnect Provider:', error);
    throw error;
  }
}

export default getWalletConnectProvider;