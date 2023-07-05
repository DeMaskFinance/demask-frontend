import getReserves from '@/libs/utils/getInforDML';
import { useEffect, useState } from 'react';

const useFetchReservesDML = (account:string,dmlToken:string|undefined, wallet:string, inputNFT:string) => {
  const [reserves, setReserves] = useState<any[]>([0]);

  useEffect(() => {
    const fetchReservesDML = async () => {
      try {
        if (dmlToken) {
          const {reserves}:any = await getReserves(dmlToken);
          setReserves(reserves);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservesDML();
  }, [account,dmlToken, wallet, inputNFT]);

  return reserves;
};

export default useFetchReservesDML;