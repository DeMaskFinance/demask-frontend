import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc721 from "@/abi/erc721/abiErc721.json";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";

const useCheckApproveNFT = (
  account: string,
  nftAddress: string,
  routerAddress: string,
  type: "erc721" | "erc1155"
) => {
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { data, isLoading, refetch } = useReadContract({
    abi: type === "erc721" ? abiErc721 : abiErc1155,
    address: nftAddress as `0x${string}`,
    functionName: "isApprovedForAll",
    args: [account, routerAddress],
  });

  useEffect(() => {
    setLoading(isLoading);
    if (data !== undefined) {
      setIsApprovedNFT(Boolean(data));
    }
  }, [data, isLoading]);

  return { isApprovedNFT, loading, refetch };
};

export default useCheckApproveNFT;
