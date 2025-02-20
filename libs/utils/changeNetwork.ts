import { toast } from "sonner";
import { getProvider } from "./../connection/getProvider";
import Web3 from "web3";

export const changeNetwork = async (
  chainId: string,
  wallet: string,
  demask: any,
  setIsWrongNetwork: React.Dispatch<React.SetStateAction<boolean>>,
  updateChainId: any,
  setLoading?: any
) => {
  try {
    const provider = await getProvider(wallet);
    const networkId = await provider.request({ method: "net_version" });
    setLoading(true);

    if (networkId !== chainId) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chainId) }],
        });

        setIsWrongNetwork(false);
        updateChainId(chainId);
        toast.success("Chain switched successfully.");
        document.body.style.overflowY = "auto";
      } catch (errors: any) {
        if (errors.code === 4902) {
          console.log({
            chainName: demask.chainName,
            chainId: Web3.utils.toHex(chainId),
            nativeCurrency: {
              name: demask.NAME,
              decimals: 18,
              symbol: demask.CURRENCY,
            },
            rpcUrls: [demask.RPC],
          });
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
          setIsWrongNetwork(false);
          document.body.style.overflowY = "auto";
        } else {
          console.error("Failed:", errors);
          return false;
        }
      }
    }
  } catch (error) {
    console.error("Failed to switch network:", error);
    return;
  } finally {
    setLoading(false);
  }
  return true;
};
