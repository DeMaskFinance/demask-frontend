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
  const [isLoadingInforDML,setIsLoadingInforDML] = useState<boolean>(false);
  useEffect(() => {
    const fetchInforDML = async () => {
      setIsLoadingInforDML(true)
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
      setIsLoadingInforDML(false)
    };

    fetchInforDML();
  }, [dmlToken]);

  return {reserves,decimals,idNFT,nftAddress,reserveNFT,reserveToken,tokenAddress,isLoadingInforDML};
};

export default useInformationDML;