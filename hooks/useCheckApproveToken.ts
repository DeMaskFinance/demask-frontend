import handleBignumber from "@/libs/utils/handleBignumber";
import { useState, useEffect } from "react";

const useCheckApproveToken = (
  currentAllowance: any,
  inputLiquidity: string,
  isOpenTransaction: boolean
) => {
  const [isApprovedLiquidity, setIsApprovedLiquidity] =
    useState<boolean>(false);

  useEffect(() => {
    if (!inputLiquidity || isNaN(Number(inputLiquidity))) {
      setIsApprovedLiquidity(false);
      return;
    }

    try {
      const inputAmount = BigInt(
        handleBignumber(Number(inputLiquidity), 18).toFixed(0)
      );
      const allowanceAmount = BigInt(currentAllowance || 0);

      setIsApprovedLiquidity(allowanceAmount >= inputAmount);
    } catch (error) {
      console.error("Error checking token approval:", error);
      setIsApprovedLiquidity(false);
    }
  }, [currentAllowance, inputLiquidity, isOpenTransaction]);

  return isApprovedLiquidity;
};

export default useCheckApproveToken;
