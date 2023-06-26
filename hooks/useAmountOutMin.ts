import getAmountSell from '@/libs/utils/getAmountSell';
import { useEffect, useState } from 'react';
const useAmountOutMin = (inputNFT:string, dmlToken:string, tokenAddress:string, nftAddress:string, idNFT:string, wallet:string, activeChoice:string) => {
    const [amountTokenSell, setAmountTokenSell] = useState('0');
  
    useEffect(() => {
      const getAmountOutMin = async () => {
        if (inputNFT && dmlToken !== '0x0000000000000000000000000000000000000000') {
          let amountAFee;
          if (tokenAddress === 'MATIC') {
            const tokenWETH = process.env.NEXT_PUBLIC_WETH as string;
            amountAFee = await getAmountSell(wallet, tokenWETH, nftAddress, idNFT, inputNFT);
          } else {
            amountAFee = await getAmountSell(wallet, tokenAddress, nftAddress, idNFT, inputNFT);
          }
  
          const amountToken = Number(amountAFee) * 0.95;
          setAmountTokenSell(amountToken.toString());
        } else {
          setAmountTokenSell('0');
        }
      };
  
      getAmountOutMin();
    }, [inputNFT, dmlToken, tokenAddress, nftAddress, idNFT, wallet, activeChoice]);
  
    return amountTokenSell;
  };
  
  export default useAmountOutMin;