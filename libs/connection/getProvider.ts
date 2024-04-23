// import { getWalletConnectProvider } from "@/components/Modal/ModalWallet/WalletConnectProvider";

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
    // provider = await EthereumProvider.init({
    //   projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
    //   chains: [280], // REQUIRED chain ids
    //   optionalChains: [280, 5],
    //   showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
    //   methods: ["eth_sendTransaction"],
    //   optionalMethods: [
    //     "personal_sign",
    //     "eth_sign",
    //     "eth_signTransaction",
    //     "eth_sendTransaction",
    //     "eth_signTypedData",
    //     "eth_signTypedData_v3",
    //     "eth_signTypedData_v4",
    //     "wallet_addEthereumChain",
    //     "eth_requestAccounts",
    //     "eth_accounts",
    //     "wallet_switchEthereumChain",
    //   ],
    //   events: [
    //     "eth_transactionHash",
    //     "chainChanged",
    //     "accountsChanged",
    //     "disconnect",
    //   ],
    //   // optionalEvents, // OPTIONAL ethereum events
    //   rpcMap: {
    //     "280": "https://testnet.era.zksync.dev",
    //     "5": "https://ethereum-goerli.publicnode.com",
    //     "168587773": "https://rpc.ankr.com/blast_testnet_sepolia",
    //   },
    // });
    console.log("123");
  }
  return provider;
};
