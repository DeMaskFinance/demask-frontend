import { useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";

type Address = `0x${string}`;

export const useGetRewardDML = () => {
  const { writeContractAsync } = useWriteContract();
  const { data: rewardData } = useReadContract();

  const getRewardDML = async (
    dmlTokenLiquidity: Address | any,
    account: Address,
    tokenAddress: Address | any,
    dmlDecimals: string,
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setReward: React.Dispatch<React.SetStateAction<string>>,
    setIsOpenSuccessCollect: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenErrorCollect: React.Dispatch<React.SetStateAction<boolean>>,
    setHash: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    try {
      setIsOpenTransaction(true);
      const tx = await writeContractAsync({
        address: dmlTokenLiquidity,
        abi: abiDML,
        functionName: "getReward",
        args: [[tokenAddress], account],
      });
      setHash(tx);

      const rewardDec = divideByDecimal(rewardData?.toString() || "0", dmlDecimals);
      setReward(rewardDec);
      setIsOpenTransaction(false);
      setIsOpenSuccessCollect(true);

      // await updateBalance();
    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
      setIsOpenErrorCollect(true);
    }
  };

  return { getRewardDML };
};
