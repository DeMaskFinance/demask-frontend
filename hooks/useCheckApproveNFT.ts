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
    const fetchApproval = async () => {
      setLoading(true);
      try {
        const approvalData = await refetch();
        if (approvalData) {
          setIsApprovedNFT(Boolean(approvalData.data));
        }
      } catch (error) {
        console.error("Error fetching approval status", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchApproval();
    }
  }, [account, nftAddress, routerAddress, type, isLoading, refetch]);

  return { isApprovedNFT, loading, refetch };
};

export default useCheckApproveNFT;
