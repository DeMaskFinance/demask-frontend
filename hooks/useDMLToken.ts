import getDMLToken from "@/libs/utils/getDMLToken";
import { useEffect, useState } from "react";
const useDMLToken = (
  account: string,
  nftAddress: string,
  idNFT: string,
  tokenAddress: string,
  wallet: string
) => {
  const [dmlToken, setDmlToken] = useState<string>("");

  useEffect(() => {
    const fetchDataDML = async () => {
      try {
        let dmlToken;
        if (tokenAddress === "MATIC") {
          const tokenWETH = process.env.NEXT_PUBLIC_WETH as string;
          dmlToken = await getDMLToken(nftAddress, idNFT, tokenWETH, wallet);
        } else {
          dmlToken = await getDMLToken(nftAddress, idNFT, tokenAddress, wallet);
        }
        setDmlToken(dmlToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataDML();
  }, [account, nftAddress, idNFT, tokenAddress, wallet]);

  return dmlToken;
};
export default useDMLToken;
