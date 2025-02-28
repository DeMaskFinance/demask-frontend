import ercContract from "@/libs/utils/erc/erc.contract";
import { starknetContract } from "@/libs/utils/starknet/contract";
import { useState } from "react";
import { GetTransactionReceiptResponse } from "starknet";
import abiMint721 from "../abi/erc721/abiDefault721.json";

const useContractWrite = (
  wallet: string,
  contractAddress: string,
  functionName: string
) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<GetTransactionReceiptResponse>();
  const [error, setError] = useState<Error | null>(null);

  const writeAsync = async (params: any[]) => {
    setIsPending(true);
    setError(null);

    try {
      const contract = await ercContract.erc(
        wallet,
        contractAddress,
        abiMint721
      );
      const account = await starknetContract.getWalletAccount(wallet);
      const myCall = contract.populate(functionName, params);
      const res = await account.execute(myCall);

      const receipt = (await account.waitForTransaction(
        res.transaction_hash
      )) as GetTransactionReceiptResponse & { transaction_hash: string };
      setData(receipt);
      return receipt;
    } catch (error) {
      console.error("Error writing to contract:", error);
      setError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    writeAsync,
    data,
    isPending,
    error,
  };
};

export default useContractWrite;
