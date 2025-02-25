import { useReadContract } from "wagmi";
import abiErc1155 from "@/abi/abiErc1155.json";

const useBalanceNFT = (
  account: string,
  nftAddress: string,
  idNFT: string | number[]
) => {
  const { data: balance, isLoading } = useReadContract({
    abi: abiErc1155,
    address: nftAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [account, idNFT],
  });

  return { balanceNFT: balance ? balance.toString() : "0", isLoading };
};

export default useBalanceNFT;
