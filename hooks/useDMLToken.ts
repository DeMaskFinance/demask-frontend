import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import erc721Contract from "@/libs/utils/erc/erc721.contract";
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

  const { getDMLToken } = erc1155Contract();

  const { dmlToken: dmlTokenFunction } = erc721Contract();
  useEffect(() => {
    const fetchDataDML = async () => {
      try {
        let dmlToken;
        if (idNFT) {
          dmlToken = await getDMLToken(
            nftAddress,
            idNFT,
            tokenAddress,
            factoryAddress
          );
        } else {
          dmlToken = await dmlTokenFunction(
            wallet,
            nftAddress,
            tokenAddress,
            factoryAddress
          );
        }
        setDmlToken(dmlToken.toString);
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
