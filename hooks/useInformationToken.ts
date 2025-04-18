import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { starknet } from "@/libs/constants";
import { starknetContract } from "@/libs/utils/starknet/contract";
import { getProviders } from "@/utils/utils.starknet";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useContext } from "react";

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
  const { providers } = useContext(AccountContext);
  const fetchTokenBalanceEVM = async (): Promise<EVMResult> => {
    if (!account) return { balanceToken: 0, bigNumberBalance: 0 };

    try {
      const providerChoice = await getProviders(wallet, providers);
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

  const fetchTokenBalanceStarknet = async (): Promise<StarknetResult> => {
    if (!account)
      return {
        balanceToken: 0,
        bigNumberBalance: 0,
        balanceTokenStarknet: 0,
        bigNumberBalanceStarknet: 0,
      };

    try {
      const contractETH = await starknetContract.getContract(starknet.addrETH);
      const contractStarknet = await starknetContract.getContract(
        starknet.addrStarknet
      );

      const balanceETH = await contractETH.balanceOf(account);
      const balanceStarknet = await contractStarknet.balanceOf(account);

      const balanceInEthETH = ethers.utils.formatEther(balanceETH);
      const balanceInEthStarknet = ethers.utils.formatEther(balanceStarknet);

      return {
        balanceToken: Number(parseFloat(balanceInEthETH).toFixed(4)),
        bigNumberBalance: balanceETH.toString(),
        balanceTokenStarknet: Number(
          parseFloat(balanceInEthStarknet).toFixed(4)
        ),
        bigNumberBalanceStarknet: balanceStarknet.toString(),
      };
    } catch (error) {
      console.error("Error fetching Starknet balance:", error);
      return {
        balanceToken: 0,
        bigNumberBalance: 0,
        balanceTokenStarknet: 0,
        bigNumberBalanceStarknet: 0,
      };
    }
  };

  const { data, isLoading } = useQuery<EVMResult | StarknetResult>({
    queryKey: ["useBalanceToken", account, wallet, chainId],
    queryFn: async () => {
      if (chainId === starknet.StarknetChainId.SN_SEPOLIA) {
        return await fetchTokenBalanceStarknet();
      } else {
        return await fetchTokenBalanceEVM();
      }
    },
    enabled: !!account && !!chainId,
  });

  const result = {
    isLoadingBalance: isLoading,
  };

  if (chainId === starknet.StarknetChainId.SN_SEPOLIA) {
    return {
      ...result,
      balanceToken: data?.balanceToken || 0,
      bigNumberBalance: data?.bigNumberBalance || 0,
      balanceTokenStarknet: (data as StarknetResult)?.balanceTokenStarknet || 0,
      bigNumberBalanceStarknet:
        (data as StarknetResult)?.bigNumberBalanceStarknet || 0,
    };
  } else {
    return {
      ...result,
      balanceToken: data?.balanceToken || 0,
      bigNumberBalance: data?.bigNumberBalance || 0,
    };
  }
};
export default useInformationToken;
