import { useContext, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { waitForTransactionReceipt } from "@wagmi/core";

import { wagmiAdapter } from "@/config";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "../constants";

type Address = `0x${string}` | any;

export const useGetRewardDML = () => {
  const { writeContractAsync } = useWriteContract();

  const { account, chainId } = useContext(AccountContext);

  const { data: rewardData, refetch } = useReadContract({
    abi: abiDML,
    functionName: "viewReward",
    args: [account],
  });
  const getRewardDML = async (
    dmlTokenLiquidity: Address,
    account: Address,
    tokenAddress: Address,
    dmlDecimals: string,
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setReward: React.Dispatch<React.SetStateAction<string>>,
    setIsOpenSuccessCollect: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenErrorCollect: React.Dispatch<React.SetStateAction<boolean>>,
    setHash: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      setIsOpenTransaction(true);
      const tx = await writeContractAsync({
        address: dmlTokenLiquidity,
        abi: abiDML,
        functionName: "getReward",
        args: [[tokenAddress], account],
      });
      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
        hash: tx as any,
      });
      setHash(receipt.transactionHash);
      await refetch();
      const rewardArray: any = rewardData || [];
      const rewardDec = rewardArray.length > 0
        ? divideByDecimal(rewardArray[0].toString(), dmlDecimals)
        : "0";
      setReward(rewardDec);
      queryClient.refetchQueries({
        queryKey: ["useBalanceToken", account, chainId]
      })
      setIsOpenTransaction(false);
      setIsOpenSuccessCollect(true);

    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
      setIsOpenErrorCollect(true);
    }
  };

  return { getRewardDML };
};
