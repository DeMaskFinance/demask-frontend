import getAmountBuy from '@/libs/utils/getAmountBuy';
import { useEffect, useState } from 'react';

const useAmountInMax = (inputNFT:string, dmlToken:string, tokenAddress:string, nftAddress:string, idNFT:string, wallet:string,account:string,rpc:string,routerAddress:string,slippage:number) => {
  const [amountTokenBuy, setAmountTokenBuy] = useState(0);
  const [feeTradingBuy, setFeeTradingBuy] = useState(0);
  const [isLoadingBuy,setIsLoadingBuy] = useState<boolean>(false);
  console.log('test');
  console.log(inputNFT);
  
  useEffect(() => {
    const getAmountInMax = async () => {
      setIsLoadingBuy(true);
      if (inputNFT && dmlToken !== '0x0000000000000000000000000000000000000000') {
        const amountAFee =await getAmountBuy(wallet, tokenAddress, nftAddress, idNFT, inputNFT,rpc,routerAddress);
        console.log(amountAFee);
        
        if(amountAFee){
          setAmountTokenBuy(amountAFee[0] * (1+slippage));
          setFeeTradingBuy(amountAFee[1].toString());
        }
      } else {
        setFeeTradingBuy(0)
        setAmountTokenBuy(0);
      }
      setIsLoadingBuy(false);
    };

    getAmountInMax();
  }, [inputNFT, dmlToken, tokenAddress, nftAddress, idNFT, wallet,account,slippage]);

  return {amountTokenBuy,isLoadingBuy,feeTradingBuy};
};

export default useAmountInMax;