import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import { useEffect, useState } from "react";
const useAmountOutMin = (
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
  const [amountTokenSell, setAmountTokenSell] = useState(0);
  const [feeTradingSell, setFeeTradingSell] = useState(0);
  const [isLoadingSell, setIsLoadingSell] = useState<boolean>(false);
  useEffect(() => {
    const getAmountOutMin = async () => {
      setIsLoadingSell(true);
      if (
        inputNFT &&
        dmlToken !== "0x0000000000000000000000000000000000000000"
      ) {
        const amountAFee = await erc1155Contract.getAmountSell(
          wallet,
          tokenAddress,
          nftAddress,
          idNFT,
          routerAddress,
          inputNFT
        );
        setAmountTokenSell(amountAFee[0].toString());
        setFeeTradingSell(amountAFee[1].toString());
      } else {
        setFeeTradingSell(0);
        setAmountTokenSell(0);
      }
      setIsLoadingSell(false);
    };

    getAmountOutMin();
  }, [inputNFT, dmlToken, tokenAddress, nftAddress, idNFT, wallet, account,updatePrice]);

  return { amountTokenSell, isLoadingSell, feeTradingSell };
};

export default useAmountOutMin;
