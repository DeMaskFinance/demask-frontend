import { ethers } from "ethers";
import abiErc20 from "@/abi/abiErc20.json";
const checkIsERC20 = async (contractAddress: string) => {
  const INFURA_ID = "9bab56a381cb440eb809f56e01c59de5";
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
  const contract = new ethers.Contract(contractAddress, abiErc20, provider);

  try {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply()/Math.pow(10, decimals);

    // Kiểm tra các phương thức ERC20
    if (name && symbol && totalSupply) {
      return {
        isERC20: true,
        name: name,
        symbol: symbol,
        totalSupply: totalSupply.toString(),
      };
    } else {
      return {
        isERC20: false,
        name: null,
        symbol: null,
        totalSupply: null,
      };
    }
  } catch (error) {
    console.error("Lỗi kiểm tra ERC20:", error);
    return {
      isERC20: false,
      name: null,
      symbol: null,
      totalSupply: null,
    };
  }
};
export default checkIsERC20;
