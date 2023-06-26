import getReserves from '@/libs/utils/getReserves';
import { useEffect, useState } from 'react';

const useFetchReservesDML = (dmlToken:string|undefined, wallet:string, inputNFT:string) => {
  const [reserves, setReserves] = useState(null);

  useEffect(() => {
    const fetchReservesDML = async () => {
      try {
        if (dmlToken) {
          const reserves = await getReserves(dmlToken, wallet);
          setReserves(reserves);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservesDML();
  }, [dmlToken, wallet, inputNFT]);

  return reserves;
};

export default useFetchReservesDML;