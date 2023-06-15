import abiErc1155 from "@/abi/abiErc1155.json";
import { ethers } from "ethers";

const checkIsERC1155 = async (contractAddress: string) => {
  console.log(contractAddress);
  
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );
  const contract = new ethers.Contract(contractAddress, abiErc1155, provider);
  try {
    await contract.supportsInterface('0xd9b67a26');
    return true;
  } catch (error) {
    console.error("Lỗi kiểm tra ERC20:", error);
    return false
  }
};
export default checkIsERC1155;
