import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

const useBananceOfDML = (
  account: string,
  dmlToken: any,
  isOpenTransaction?: boolean
) => {
  const [balanceOfDML, setBalanceOfDML] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balanceDML, setBalanceDML] = useState("0");

  const { data: balanceData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "balanceOf",
    args: [account],
  });

  const { data: totalSupplyData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "totalSupply",
  });

  useEffect(() => {
    if (balanceData) {
      const balanceDec = divideByDecimal(balanceData.toString(), "18");
      setBalanceOfDML(balanceDec);
      setBalanceDML(balanceData.toString());
    } else {
      setBalanceOfDML("0");
      setBalanceDML("0");
    }

    if (totalSupplyData) {
      setTotalSupply(totalSupplyData.toString());
    } else {
      setTotalSupply("0");
    }
  }, [balanceData, totalSupplyData, isOpenTransaction]);

  return { balanceOfDML, totalSupply, balanceDML };
};

export default useBananceOfDML;
