import abiDML from "@/abi/abiDML.json";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { wagmiAdapter } from "@/config";

type Address = `0x${string}` | any;

const useAllowanceDML = (
  account: Address,
  dmlAddress: Address,
  wallet: Address,
  isApprovedDML: boolean,
  inputLiquidity: string,
  routerAddress: Address
) => {
  const { data: allowance, error } = useReadContract({
    account,
    abi: abiDML,
    address: dmlAddress,
    functionName: "allowance",
    args: [account, routerAddress],
  });

  return Number(allowance);
};

export default useAllowanceDML;
