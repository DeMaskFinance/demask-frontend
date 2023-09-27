import Web3 from "web3";
const mumbaiNetwork = {
    chainId: "80001", // Chain ID của Mumbai
  };
export const checkNetwork = async (provider:any) => {
      try {
        const networkId = await provider.request({ method: "net_version" });
        if (networkId !== mumbaiNetwork.chainId) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: Web3.utils.toHex(mumbaiNetwork.chainId) }],
            });
          } catch (errors: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (errors.code === 4902) {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Mumbai",
                    chainId: Web3.utils.toHex(mumbaiNetwork.chainId),
                    nativeCurrency: {
                      name: "MATIC",
                      decimals: 18,
                      symbol: "MATIC",
                    },
                    rpcUrls: ["https://polygon-mumbai-bor.publicnode.com"],
                  },
                ],
              });
            }
            else{
                return false;
            }
          }
        }
      } catch (error) {
        console.error("Failed to switch network:", error);
        return;
      }
      return true;
    };
