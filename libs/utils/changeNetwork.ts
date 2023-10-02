import { getProvider } from './../connection/getProvider';
import Web3 from "web3";

export const changeNetwork = async (chainId: string, wallet:string , demask: any) => {
  try {
    const provider =  getProvider(wallet);
    const networkId = await provider.request({ method: "net_version" });
    if (networkId !== chainId) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chainId) }],
        });
        console.log("reload");

        // refresh
        window.location.reload();
      } catch (errors: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (errors.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: demask.chainName,
                chainId: Web3.utils.toHex(chainId),
                nativeCurrency: {
                  name: demask.NAME,
                  decimals: 18,
                  symbol: demask.CURRENCY,
                },
                rpcUrls: [demask.RPC],
              },
            ],
          });
          // refresh
          window.location.reload();
        } else {
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
