import getAmountBuy from "@/libs/utils/getAmountBuy";
import { useEffect, useState } from "react";

const useAmountInMax = (
  inputNFT: string,
  dmlToken: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string | number[],
  wallet: string,
  account: string,
  rpc: string,
  routerAddress: string,
  updatePrice: boolean
) => {
  const [amountTokenBuy, setAmountTokenBuy] = useState(0);
  const [isLoadingBuy, setIsLoadingBuy] = useState<boolean>(false);
  useEffect(() => {
    const getAmountInMax = async () => {
      setIsLoadingBuy(true);

      if (dmlToken !== "0x0000000000000000000000000000000000000000") {
        const amountAFee = await getAmountBuy(
          wallet,
          tokenAddress,
          nftAddress,
          idNFT,
          inputNFT,
          rpc,
          routerAddress
        );
        if (amountAFee) {
          setAmountTokenBuy(amountAFee.toString());
        }
      } else {
        setAmountTokenBuy(0);
      }
      setIsLoadingBuy(false);
    };

    getAmountInMax();
  }, [
    inputNFT,
    dmlToken,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    account,
    updatePrice,
  ]);

  return { amountTokenBuy, isLoadingBuy };
};

export default useAmountInMax;
