import getDMLToken from "@/libs/utils/getDMLToken";
import { useEffect, useState } from "react";
const useDMLToken = (
  account: string,
  nftAddress: string,
  idNFT: string,
  tokenAddress: string,
  wallet: string,
  factoryAddress:string,
  isOpenTransaction?:boolean,
  isOpenConfirmAddLiquidity?:boolean,
) => {
  const [dmlToken, setDmlToken] = useState<string>("");

  useEffect(() => {
    const fetchDataDML = async () => {
      try {
        const dmlToken = await getDMLToken(nftAddress, idNFT, tokenAddress, wallet,factoryAddress);
        console.log({
          dmlToken,
          nftAddress,
          idNFT,
          tokenAddress
        });
        
        setDmlToken(dmlToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataDML();
  }, [account, nftAddress, idNFT, tokenAddress, wallet,isOpenTransaction,isOpenConfirmAddLiquidity]);

  return dmlToken;
};
export default useDMLToken;
