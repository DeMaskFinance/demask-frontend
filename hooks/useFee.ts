import ercContract from "@/libs/utils/erc/erc.contract";
import { useEffect, useState } from "react";

const useFee = (
  amount: number,
  dmlToken: string,
  wallet: string,
  account: string,
  rpc: string,
  feeManager: string,
  updatePrice: boolean
) => {
  const [totalFee, setTotalFee] = useState(0);
  useEffect(() => {
    const getFee = async () => {
      if (
        dmlToken !== "0x0000000000000000000000000000000000000000" &&
        dmlToken !== null &&
        amount
      ) {
        const { totalFee } = await ercContract.getFeeManager(
          feeManager,
          amount,
          rpc,
          dmlToken
        );
        setTotalFee(totalFee.toString());
      } else {
        setTotalFee(0);
      }
    };

    getFee();
  }, [amount, dmlToken, wallet, account, updatePrice]);

  return {
    totalFee,
  };
};

export default useFee;
