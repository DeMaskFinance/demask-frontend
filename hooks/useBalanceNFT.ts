import getBalanceNFT from '@/libs/utils/getBalanceNFT';
import { useEffect, useState } from 'react';

const useBalanceNFT = (account:string, nftAddress:string, idNFT:string, wallet:string) => {
  const [balanceNFT, setBalanceNFT] = useState("0");

  useEffect(() => {
    const fetchBalanceNFT = async () => {
      if (account && nftAddress && idNFT) {
        try {
          const balance = await getBalanceNFT(account, wallet, nftAddress, idNFT);
          setBalanceNFT(balance);
        } catch (error) {
          console.error(error);
        }
      } else {
        setBalanceNFT("0"); // No Account
      }
    };

    fetchBalanceNFT();
  }, [account, idNFT, nftAddress, wallet]);

  return balanceNFT;
};

export default useBalanceNFT;