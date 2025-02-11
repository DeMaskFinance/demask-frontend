import { getProvider } from "@/libs/connection/getProvider";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

interface EVMResult {
  balanceToken: number;
  bigNumberBalance: number;
}

interface StarknetResult extends EVMResult {
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
      const provider = new ethers.providers.Web3Provider(providerChoice);
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

  const { data, isLoading } = useQuery<EVMResult | StarknetResult>({
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
