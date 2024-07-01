import getAmountSell from "@/libs/utils/getAmountSell";
import { useEffect, useState } from "react";
const useAmountOutMin = (
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
  const [amountTokenSell, setAmountTokenSell] = useState(0);
  const [isLoadingSell, setIsLoadingSell] = useState<boolean>(false);
  useEffect(() => {
    const getAmountOutMin = async () => {
      setIsLoadingSell(true);
      if (dmlToken !== "0x0000000000000000000000000000000000000000") {
        const amountAFee = await getAmountSell(
          wallet,
          tokenAddress,
          nftAddress,
          idNFT,
          inputNFT,
          rpc,
          routerAddress
        );
        if (amountAFee) {
          setAmountTokenSell(amountAFee.toString());
        }
      } else {
        setAmountTokenSell(0);
      }
      setIsLoadingSell(false);
    };

    getAmountOutMin();
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

  return { amountTokenSell, isLoadingSell };
};

export default useAmountOutMin;
