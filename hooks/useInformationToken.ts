import { getProvider } from "@/libs/connection/getProvider";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

interface EVMResult {
  balanceToken: number;
  bigNumberBalance: number;
}

interface ERC721_TYPE extends EVMResult {
  balanceTokenStarknet: number;
  bigNumberBalanceStarknet: number;
}
const useInformationToken = (
  account: string,
  wallet: string,
  chainId: string
) => {
  const fetchTokenBalanceEVM = async (): Promise<EVMResult> => {
    if (!account) return { balanceToken: 0, bigNumberBalance: 0 };

    try {
      const providerChoice = await getProvider(wallet);

      // const provider = new ethers.providers.Web3Provider(providerChoice);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6"
      );

      const balance = await provider.getBalance(account);

      const balanceInEth = ethers.utils.formatEther(balance);
      return {
        balanceToken: Number(parseFloat(balanceInEth).toFixed(4)),
        bigNumberBalance: Number(balance.toString()),
      };
    } catch (error) {
      console.error("Error fetching EVM balance:", error);
      return { balanceToken: 0, bigNumberBalance: 0 };
    }
  };

  const { data, isLoading } = useQuery<EVMResult | ERC721_TYPE>({
    queryKey: ["useBalanceToken", account, wallet, chainId],
    queryFn: async () => {
      return await fetchTokenBalanceEVM();
    },
    enabled: !!account && !!chainId,
  });

  const result = {
    isLoadingBalance: isLoading,
  };

  return {
    ...result,
    balanceToken: data?.balanceToken || 0,
    bigNumberBalance: data?.bigNumberBalance || 0,
  };
};
export default useInformationToken;
