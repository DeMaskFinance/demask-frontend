import { starknetContract } from "@/libs/utils/starknet/contract";
import { useState } from "react";
import { GetTransactionReceiptResponse } from "starknet";

const useContractWrite = (
  wallet: string,
  contractAddress: string,
  funtionName: string,
  params: any[]
) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<GetTransactionReceiptResponse>();

  const writeAsync = async () => {
    setIsPending(true);

    try {
      const contract = await starknetContract.getContract(contractAddress);
      const account = await starknetContract.getWalletAccount(wallet);
      const myCall = contract.populate(funtionName, params);
      const res = await account.execute(myCall);
      console.log(res);

      const data = (await account.waitForTransaction(
        res.transaction_hash
      )) as GetTransactionReceiptResponse & {
        transaction_hash: string;
      };
      setData(data);
    } catch (error) {
      console.error("Error writing to contract:", error);
      setIsPending(false);
      // Handle error
    } finally {
      setIsPending(false);
    }
  };

  return {
    writeAsync,
    data,
    isPending,
  };
};

export default useContractWrite;
