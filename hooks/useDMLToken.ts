import erc721Contract from "@/libs/utils/erc/erc721.contract";
import getDMLToken from "@/libs/utils/getDMLToken";
import { useEffect, useState } from "react";
const useDMLToken = (
  account: string,
  nftAddress: string,
  tokenAddress: string,
  wallet: string,
  factoryAddress: string,
  idNFT?: string,
  isOpenTransaction?: boolean,
  isOpenConfirmAddLiquidity?: boolean
) => {
  const [dmlToken, setDmlToken] = useState<string>("");

  useEffect(() => {
    const fetchDataDML = async () => {
      try {
        let dmlToken;
        if (idNFT) {
          dmlToken = await getDMLToken(
            nftAddress,
            idNFT,
            tokenAddress,
            wallet,
            factoryAddress
          );
        } else {
          dmlToken = await erc721Contract.dmlToken(
            wallet,
            nftAddress,
            tokenAddress,
            factoryAddress
          );
        }
        setDmlToken(dmlToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataDML();
  }, [
    account,
    nftAddress,
    idNFT,
    tokenAddress,
    wallet,
    isOpenTransaction,
    isOpenConfirmAddLiquidity,
  ]);

  return dmlToken;
};
export default useDMLToken;
