import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc721 from "@/abi/erc721/abiErc721.json";
import { useWriteContract } from "wagmi";

const useApproveNFT = () => {
  const { writeContractAsync } = useWriteContract();

  const handleApproveNFT = async (
    account: any,
    nftAddress: string,
    setIsOpenTransaction: (open: boolean) => void,
    routerAddress: string,
    type?: "erc721" | "erc1155",
    refetch?: () => Promise<any>
  ) => {
    if (account) {
      try {
        setIsOpenTransaction(true);
        await writeContractAsync({
          account,
          abi: type === "erc721" ? abiErc721 : abiErc1155,
          address: nftAddress as `0x${string}`,
          functionName: "setApprovalForAll",
          args: [routerAddress, true],
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (refetch) {
          await refetch();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsOpenTransaction(false);
      }
    }
  };

  return { handleApproveNFT };
};

export default useApproveNFT;
