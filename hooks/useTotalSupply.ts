import getBalanceNFT from '@/libs/utils/getBalanceNFT';
import getTotalSupply from '@/libs/utils/getTotalSupply';
import { useEffect, useState } from 'react';
const useTotalSupply = (account: string,
    wallet: string,
    dmlAddress: string,
    isApprovedDML: boolean) => {
  const [totalSupply, setTotalSupply] = useState("0");
  useEffect(() => {
    const fetchTotalSupplyDML = async () => {
        console.log("123");
        
      if (account && dmlAddress && wallet) {
        try {
          const res = await getTotalSupply(account,wallet,dmlAddress);
          setTotalSupply(res);
        } catch (error) {
          console.error(error);
        }
      } else {
        setTotalSupply("0"); // No Account
      }
    };

    fetchTotalSupplyDML();
  }, [account,wallet,dmlAddress,isApprovedDML]);

  return totalSupply;
};

export default useTotalSupply;