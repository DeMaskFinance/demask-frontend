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
  const [feeBuy, setFeeBuy] = useState<any[]>([]);
  const [feeSell, setFeeSell] = useState<any[]>([]);
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
        const feeBuyArrays = await ercContract.getBuyArrays(
          feeManager,
          amount,
          dmlToken,
          account,
          wallet
        );
        setFeeBuy(feeBuyArrays);
        const feeSellArrays = await ercContract.getSellArrays(
          feeManager,
          amount,
          dmlToken,
          account,
          wallet
        );
        setFeeSell(feeSellArrays);
      } else {
        setTotalFee(0);
      }
    };

    getFee();
  }, [amount, dmlToken, wallet, account, updatePrice]);

  return {
    totalFee,
    feeBuy,
    feeSell,
  };
};

export default useFee;
