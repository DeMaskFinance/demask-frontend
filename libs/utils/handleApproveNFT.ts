import abiErc1155 from "@/abi/abiErc1155.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";
import ercContract from "./erc/erc.contract";

const handleApproveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any,
  routerAddress: string
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(wallet, nftAddress, abiErc1155);
    try {
      setIsOpenTransaction(true);
      const result = await contract.setApprovalForAll(routerAddress, true);
      await result.wait();
      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
    }
  } else {
    setIsOpen(true);
  }
};
export default handleApproveNFT;
