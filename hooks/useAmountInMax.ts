import erc1155Contract from '@/libs/utils/erc/erc1155.contract';
import getAmountBuy from "@/libs/utils/getAmountBuy";
import { useEffect, useState } from "react";

const useAmountInMax = (
  inputNFT: string,
  dmlToken: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  wallet: string,
  account: string,
  rpc: string,
  routerAddress: string,
  updatePrice: boolean
) => {
  const [amountTokenBuy, setAmountTokenBuy] = useState(0);
  const [feeTradingBuy, setFeeTradingBuy] = useState(0);
  const [isLoadingBuy, setIsLoadingBuy] = useState<boolean>(false);

  useEffect(() => {
    const getAmountInMax = async () => {
      setIsLoadingBuy(true);
      if (
        inputNFT &&
        dmlToken !== "0x0000000000000000000000000000000000000000"
      ) {
        const amountAFee = await erc1155Contract.getAmountBuy(
          wallet,
          tokenAddress,
          nftAddress,
          idNFT,
          inputNFT,
          routerAddress
        );
        if (amountAFee) {
          setAmountTokenBuy(amountAFee[0].toString());
          setFeeTradingBuy(amountAFee[1].toString());
        }
      } else {
        setFeeTradingBuy(0);
        setAmountTokenBuy(0);
      }
      setIsLoadingBuy(false);
    };

    getAmountInMax();
  }, [inputNFT, dmlToken, tokenAddress, nftAddress, idNFT, wallet, account,updatePrice]);

  return { amountTokenBuy, isLoadingBuy, feeTradingBuy };
};

export default useAmountInMax;
