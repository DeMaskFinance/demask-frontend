import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";
const useBananceOfDML = (
  account: string,
  dmlToken: string,
  isOpenTransaction: boolean
) => {
  const [balanceOfDML, setBalanceOfDML] = useState("");
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai-bor.publicnode.com"
  );
  const contract = new ethers.Contract(dmlToken, abiDML, provider);
  useEffect(() => {
    const getBalanceOf = async () => {
      if (dmlToken && account) {
        try {
          const result = await contract.balanceOf(account);
          const balanceOfDMLDec = divideByDecimal(result.toString(), "18");
          setBalanceOfDML(balanceOfDMLDec);
        } catch (error) {
          console.error(error);
        }
      } else {
        setBalanceOfDML("0");
      }
    };
    getBalanceOf();
  }, [dmlToken, account, isOpenTransaction]);
  return { balanceOfDML };
};
export default useBananceOfDML;
