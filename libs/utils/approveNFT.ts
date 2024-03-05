import abiErc1155 from "@/abi/abiErc1155.json";
import ercContract from "./erc/erc721.contract";

const approveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  routerAddress: string
) => {
  if (account && nftAddress && wallet) {
    const contract = await ercContract.erc(wallet, nftAddress, abiErc1155);
    try {
      const isApprovedNFT = await contract.isApprovedForAll(
        account,
        routerAddress
      );
      return isApprovedNFT;
    } catch (error) {
      console.error(error);
    }
  } else {
    return false;
  }
};
export default approveNFT;
