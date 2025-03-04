import abiDML from "@/abi/abiDML.json";
import { wagmiAdapter } from "@/config";
import { waitForTransactionReceipt } from "@wagmi/core";
import BigNumber from "bignumber.js";
import { useWriteContract } from "wagmi";

type Address = `0x${string}` | any;

const handleApproveDML = () => {
  const { writeContractAsync } = useWriteContract();

  const approveDML = async (
    account: Address,
    dmlAddress: Address,
    inputLiquidity: string,
    setIsOpenTransaction: (state: boolean) => void,
    routerAddress: Address
  ) => {
    if (account) {
      const inputLiquidityBN = new BigNumber(inputLiquidity || 0)
        .times(new BigNumber(10).pow(18))
        .toFixed(0);

      try {
        const result = await writeContractAsync({
          account,
          abi: abiDML,
          address: dmlAddress,
          functionName: "approve",
          args: [routerAddress, inputLiquidityBN],
        });
        setIsOpenTransaction(true);

        await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
          hash: result,
        });
        setIsOpenTransaction(false);
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };

  return {
    approveDML,
  };
};

export default handleApproveDML;
