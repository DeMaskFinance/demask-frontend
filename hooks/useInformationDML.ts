import getInfor from '@/libs/utils/getInforDML';
import { useEffect, useState } from 'react';

const useInformationDML = (dmlToken:string|undefined) => {
  const [reserves, setReserves] = useState<any[]>([0]);
  const [decimals,setDecimals] = useState<string>("18");
  const [idNFT,setIdNFT] = useState<string>("");
  const [nftAddress,setNftAddress] = useState<string>("");
  const [reserveNFT,setReserveNFT] = useState<string>("");
  const [reserveToken,setReserveToken] = useState<string>("");
  const [tokenAddress,setTokenAddress] = useState<string>("");
  useEffect(() => {
    const fetchInforDML = async () => {
      try {
        if (dmlToken) {
          const {reserves,decimals,idNFT,nftAddress,reserveNFT,reserveToken,tokenAddress}:any = await getInfor(dmlToken);
          setReserves(reserves);
          setDecimals(decimals);
          setIdNFT(idNFT);
          setNftAddress(nftAddress);
          setReserveNFT(reserveNFT);
          setTokenAddress(tokenAddress);
          setReserveToken(reserveToken);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInforDML();
  }, [dmlToken]);

  return {reserves,decimals,idNFT,nftAddress,reserveNFT,reserveToken,tokenAddress};
};

export default useInformationDML;