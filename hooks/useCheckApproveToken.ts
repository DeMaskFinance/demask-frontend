import handleBignumber from "@/libs/utils/handleBignumber";
import { useState, useEffect } from "react";

const useCheckApproveToken = (
  currentAllowance: string | null,
  inputLiquidity: string,
  isOpenTransaction: boolean
) => {
  const [isApprovedLiquidity, setIsApprovedLiquidity] =
    useState<boolean>(false);


  useEffect(() => {
    const checkApproveToken = async () => {
      try {
        if (
          currentAllowance &&
          Number(currentAllowance) <
            Number(
              Number(handleBignumber(Number(inputLiquidity), 18)).toFixed(0)
            )
        ) {
          setIsApprovedLiquidity(false);
        } else {
          setIsApprovedLiquidity(true);
        }
      } catch (error) {
        console.error("Error checking token approval:", error);
        setIsApprovedLiquidity(false);
      }
    };

    if (inputLiquidity) {
      checkApproveToken();
    }
  }, [currentAllowance, inputLiquidity, isOpenTransaction]);

  return isApprovedLiquidity;
};

export default useCheckApproveToken;
