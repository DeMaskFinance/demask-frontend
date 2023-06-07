export async function changeNetwork() {
    const ethereum = (window as any).ethereum;
    if (ethereum.networkVersion !== 80001) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (errors: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (errors.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Mumbai",
                chainId: "0x13881",
                nativeCurrency: {
                  name: "MATIC",
                  decimals: 18,
                  symbol: "MATIC",
                },
                rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
              },
            ],
          });
        }
      }
    }
  }