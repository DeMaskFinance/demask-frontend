import { getProvider } from "./../connection/getProvider";
import Web3 from "web3";

export const addNetwork = async (wallet: string, demask: any) => {
  try {
    const provider = await getProvider(wallet);
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: Web3.utils.toHex(demask.chainId),
          chainName: demask.chainName,
          nativeCurrency: {
            name: demask.NAME,
            symbol: demask.CURRENCY,
            decimals: 18,
          },
          rpcUrls: [demask.RPC],
          blockExplorerUrls: demask.EXPLORER ? [demask.EXPLORER] : [],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Failed to add network:", error);
    return false;
  }
};
