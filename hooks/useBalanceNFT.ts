import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import { useEffect, useState } from "react";

const useBalanceNFT = (
  account: string,
  nftAddress: string,
  idNFT: string | number[],
  wallet: string,
  isOpenTransaction?: boolean
) => {
  const [balanceNFT, setBalanceNFT] = useState("0");
  useEffect(() => {
    const fetchBalanceNFT = async () => {
      if (account && nftAddress && idNFT) {
        try {
          const balance = await erc1155Contract.getBalanceNFT(
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
