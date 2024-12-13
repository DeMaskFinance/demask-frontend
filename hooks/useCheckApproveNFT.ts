import ercContract from "@/libs/utils/erc/erc.contract";
import utilsStarknet from "@/utils/utils.starknet";
import { useState, useEffect } from "react";

const useCheckApproveNFT = (
  account: string,
  wallet: string,
  nftAddress: string,
  routerAddress: string,
  isOpenTransaction: boolean
) => {
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);

  useEffect(() => {
    const checkApproveNFT = async () => {
      try {
        const isApprove = await utilsStarknet.isApproveForAll({
          target: nftAddress,
          account: account,
          operator: routerAddress,
        });
        setIsApprovedNFT(isApprove);
      } catch (error) {
        console.error("Error approving NFT:", error);
        setIsApprovedNFT(false);
      }
    };
    if (account && wallet && nftAddress && routerAddress) {
      checkApproveNFT();
    }
  }, [
    account,
    wallet,
    nftAddress,
    routerAddress,
    isOpenTransaction,
    ercContract,
  ]);

  return isApprovedNFT;
};

export default useCheckApproveNFT;
