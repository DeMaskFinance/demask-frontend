import abiErc1155 from "@/abi/abiErc1155.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const approveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  routerAddress: string
) => {
  if (account && nftAddress && wallet) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
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
    console.log("No account");
    return false;
  }
};
export default approveNFT;
