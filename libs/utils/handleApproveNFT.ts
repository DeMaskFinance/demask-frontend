import abiErc1155 from "@/abi/abiErc1155.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const handleApproveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  setIsOpen: any,
  setIsOpenTransaction:any,
  routerAddress:string
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
    try {
      const result = await contract.setApprovalForAll(routerAddress, true);
      setIsOpenTransaction(true);
      await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpen(true);
  }
};
export default handleApproveNFT;
