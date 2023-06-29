import getDMLToken from '@/libs/utils/getDMLToken';
import { useEffect, useState } from 'react';
const useDMLToken = (account:string,nftAddress:string, idNFT:string, tokenAddress:string) => {
    const [dmlToken, setDmlToken] = useState<string>('');
  
    useEffect(() => {
      const fetchDataDML = async () => {
        try {
          const dmlToken = await getDMLToken(nftAddress, idNFT, tokenAddress);
          setDmlToken(dmlToken);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchDataDML();
    }, [account,nftAddress, idNFT, tokenAddress]);
  
    return dmlToken;
  };
export default useDMLToken;