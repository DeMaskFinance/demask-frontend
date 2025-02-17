import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc721 from "@/abi/erc721/abiErc721.json";
import ercContract from "./erc/erc.contract";

const handleApproveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  setIsOpenTransaction: any,
  routerAddress: string,
  type?: "erc721" | "erc1155"
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(
      wallet,
      nftAddress,
      type === "erc721" ? abiErc721 : abiErc1155
    );

    console.log(routerAddress);
    try {
      setIsOpenTransaction(true);
      const result = await contract.setApprovalForAll(routerAddress, true);
      await result.wait();
      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
    }
  }
};
export default handleApproveNFT;
