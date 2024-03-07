import ercContract from "@/libs/utils/erc/erc.contract";
import { useEffect, useState } from "react";

const useInformationDML = (
  dmlToken: string | undefined,
  wallet: string,
  account: string,
  isOpenTransaction?:boolean,
  isOpenBuyNFT?:boolean,
  isOpenSellNFT?:boolean,
  isOpenConfirmAddLiquidity?:boolean,
  isOpenConfirmRemoveLiquidity?:boolean,
  updatePrice?:boolean,
) => {
  const [reserves, setReserves] = useState<any[]>([0]);
  const [decimals, setDecimals] = useState<string>("18");
  const [reserveNFT, setReserveNFT] = useState<string>("");
  const [reserveToken, setReserveToken] = useState<string>("");
  const [isLoadingInforDML, setIsLoadingInforDML] = useState<boolean>(false);
  useEffect(() => {
    const fetchInforDML = async () => {
      setIsLoadingInforDML(true);
      try {
        if (dmlToken && wallet && account) {
          const {
            reserves,
            decimals,
            idNFT,
            nftAddress,
            reserveNFT,
            reserveToken,
            tokenAddress,
          }: any = await ercContract.getInforDML(dmlToken, wallet);
          setReserves(reserves);
          setDecimals(decimals);
          setReserveNFT(reserveNFT);
          setReserveToken(reserveToken);
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoadingInforDML(false);
    };

    fetchInforDML();
  }, [dmlToken, wallet, account,isOpenTransaction,isOpenBuyNFT,isOpenSellNFT,isOpenConfirmAddLiquidity,isOpenConfirmRemoveLiquidity,updatePrice]);

  return {
    reserves,
    decimals,
    reserveNFT,
    reserveToken,
    isLoadingInforDML,
  };
};

export default useInformationDML;
