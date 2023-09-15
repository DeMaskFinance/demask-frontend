import getBalanceNFT from "@/libs/utils/getBalanceNFT";
import { useEffect, useState } from "react";

const useBalanceNFT = (
  account: string,
  nftAddress: string,
  idNFT: string,
  wallet: string,
  isOpenTransaction?: boolean
) => {
  const [balanceNFT, setBalanceNFT] = useState("0");
  useEffect(() => {
    const fetchBalanceNFT = async () => {
      if (account && nftAddress && idNFT) {
        try {
          const balance = await getBalanceNFT(
            account,
            nftAddress,
            idNFT,
            wallet
          );
          setBalanceNFT(balance);
        } catch (error) {
          console.error(error);
        }
      } else {
        setBalanceNFT("0"); // No Account
      }
    };

    fetchBalanceNFT();
  }, [account, idNFT, nftAddress, wallet, isOpenTransaction]);

  return balanceNFT;
};

export default useBalanceNFT;
