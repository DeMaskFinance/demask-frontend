import ercContract from "@/libs/utils/erc/erc.contract";
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
        const result = await ercContract.approveNFT(
          account,
          wallet,
          nftAddress,
          routerAddress
        );
        setIsApprovedNFT(result);
      } catch (error) {
        console.error("Error approving NFT:", error);
        setIsApprovedNFT(false);
      }
    };

    // Gọi hàm kiểm tra nếu các giá trị cần thiết đã thay đổi
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
