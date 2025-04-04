import AccountContext from "@/context/AccountContext";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useContext } from "react";
import abiErc20 from "@/abi/abiErc20.json";

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
  const { demask } = useContext(AccountContext);

  const fetchTokenBalanceEVM = async (): Promise<EVMResult> => {
    if (!account) return { balanceToken: 0, bigNumberBalance: 0 };

    try {
      // const provider = new ethers.providers.Web3Provider(providerChoice);
      const provider = new ethers.providers.JsonRpcProvider(demask.RPC);

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
    queryKey: ["useBalanceToken", account, chainId],
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
