import abiDML from "@/abi/abiDML.json";
import { useReadContract } from "wagmi";

type Address = `0x${string}` | any;

const useAllowanceDML = (
  account: Address,
  dmlAddress: Address,
  routerAddress: Address
) => {
  const { data: allowance, refetch } = useReadContract({
    account,
    abi: abiDML,
    address: dmlAddress,
    functionName: "allowance",
    args: [account, routerAddress],
  });

  return { currentAllowance: Number(allowance), refetch };
};

export default useAllowanceDML;
