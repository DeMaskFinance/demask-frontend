export {};
declare global {
  interface Window {
    updateWeb3Modal: any;
    ethereum: any;
    BinanceChain: any;
    web3: any;
    celo: any;
    clover: any;
    opera: any;
    bitkeep: any;
    starzwallet: any;
    coinbaseWalletExtension: any;
    okxwallet?: EthereumProvider;
    starknet_bitkeep: any;
    starknet_argentX: any;
    starknet_braavos: any;
  }
}
