import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { getProvider } from "@/libs/connection/getProvider";
const useBananceOfDML = (
  account: string,
  dmlToken: string,
  wallet: string,
  isOpenTransaction?: boolean
) => {
  const [balanceOfDML, setBalanceOfDML] = useState("");

  useEffect(() => {
    const getBalanceOf = async () => {
      if (dmlToken && account && wallet) {
        try {
          const providerChoice = getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(dmlToken, abiDML, signer);
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
  }, [dmlToken, account, isOpenTransaction, wallet]);
  return { balanceOfDML };
};
export default useBananceOfDML;
