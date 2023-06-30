import getDMLToken from '@/libs/utils/getDMLToken';
import { useEffect, useState } from 'react';
const useDMLToken = (account:string,nftAddress:string, idNFT:string, tokenAddress:string) => {
    const [dmlToken, setDmlToken] = useState<string>('');
  
    useEffect(() => {
      const fetchDataDML = async () => {
        try {
          let dmlToken ;
          if(tokenAddress === 'MATIC'){
            const tokenWETH = process.env.NEXT_PUBLIC_WETH as string;
            dmlToken = await getDMLToken(nftAddress, idNFT, tokenWETH);
          }else{
            dmlToken = await getDMLToken(nftAddress, idNFT, tokenAddress);
          }
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