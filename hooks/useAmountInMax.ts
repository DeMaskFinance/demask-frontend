import getAmountBuy from '@/libs/utils/getAmountBuy';
import { useEffect, useState } from 'react';

const useAmountInMax = (inputNFT:string, dmlToken:string, tokenAddress:string, nftAddress:string, idNFT:string, wallet:string, activeChoice:string) => {
  const [amountTokenBuy, setAmountTokenBuy] = useState('0');
  const [isLoadingBuy,setIsLoadingBuy] = useState<boolean>(false);
  useEffect(() => {
    const getAmountInMax = async () => {
      setIsLoadingBuy(true);
      if (inputNFT && dmlToken !== '0x0000000000000000000000000000000000000000') {
        let amountAFee;
        if (tokenAddress === 'MATIC') {
          const tokenWETH = process.env.NEXT_PUBLIC_WETH as string;
          amountAFee = await getAmountBuy(wallet, tokenWETH, nftAddress, idNFT, inputNFT);
        } else {
          amountAFee = await getAmountBuy(wallet, tokenAddress, nftAddress, idNFT, inputNFT);
        }

        const amountToken = Number(amountAFee) * 1.05;
        setAmountTokenBuy(amountToken.toString());
      } else {
        setAmountTokenBuy('0');
      }
      setIsLoadingBuy(false);
    };

    getAmountInMax();
  }, [inputNFT, dmlToken, tokenAddress, nftAddress, idNFT, wallet, activeChoice]);

  return {amountTokenBuy,isLoadingBuy};
};

export default useAmountInMax;