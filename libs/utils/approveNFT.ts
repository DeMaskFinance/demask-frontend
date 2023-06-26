import abiErc1155 from "@/abi/abiErc1155.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const approveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
    const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
    try {
      const isApprovedNFT = await contract.isApprovedForAll(
        account,
        routerAddress
      );
      console.log(isApprovedNFT);
      
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
