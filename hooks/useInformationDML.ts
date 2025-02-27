import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import abiDML from "@/abi/abiDML.json";

type Address = `0x${string}`;

type UseInformationDMLProps = {
  dmlToken?: Address;
  wallet: Address;
  account: Address;
  isOpenTransaction?: boolean;
  isOpenBuyNFT?: boolean;
  isOpenSellNFT?: boolean;
  isOpenConfirmAddLiquidity?: boolean;
  isOpenConfirmRemoveLiquidity?: boolean;
  updatePrice?: boolean;
};

const useInformationDML = ({
  dmlToken,
  wallet,
  account,
  isOpenTransaction,
  isOpenBuyNFT,
  isOpenSellNFT,
  isOpenConfirmAddLiquidity,
  isOpenConfirmRemoveLiquidity,
  updatePrice,
}: UseInformationDMLProps) => {
  const [reserves, setReserves] = useState<any[]>([0]);
  const [decimals, setDecimals] = useState<string>("18");
  const [reserveNFT, setReserveNFT] = useState<string>("");
  const [reserveToken, setReserveToken] = useState<string>("");
  const [isLoadingInforDML, setIsLoadingInforDML] = useState<boolean>(false);

  const { data: reservesData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "getReserves",
  });

  const { data: decimalsData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "decimals",
  });

  const { data: reserveNFTData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "reserveNFT",
  });

  const { data: reserveTokenData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "reserveToken",
  });

  useEffect(() => {
    setIsLoadingInforDML(true);
    try {
      if (reservesData) setReserves(reservesData as any[]);
      if (decimalsData) setDecimals(decimalsData.toString());
      if (reserveNFTData) setReserveNFT(reserveNFTData.toString());
      if (reserveTokenData) setReserveToken(reserveTokenData.toString());
    } catch (error) {
      console.error(error);
    }
    setIsLoadingInforDML(false);
  }, [
    reservesData,
    decimalsData,
    reserveNFTData,
    reserveTokenData,
    isOpenTransaction,
    isOpenBuyNFT,
    isOpenSellNFT,
    isOpenConfirmAddLiquidity,
    isOpenConfirmRemoveLiquidity,
    updatePrice,
  ]);

  return {
    reserves,
    decimals,
    reserveNFT,
    reserveToken,
    isLoadingInforDML,
  };
};

export default useInformationDML;
