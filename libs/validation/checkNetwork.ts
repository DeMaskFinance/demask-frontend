const mumbaiNetwork = {
    chainId: "0x13881", // Chain ID của Mumbai
  };
export const checkNetwork = async (provider:any) => {
      try {
        const networkId = await provider.request({ method: "net_version" });
        if (networkId !== mumbaiNetwork.chainId) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            });
          } catch (errors: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (errors.code === 4902) {
              await provider.request({
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
