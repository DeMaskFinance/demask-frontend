import { ethers } from "ethers";
import abiErc20 from "@/abi/abiErc20.json";
const checkIsERC20 = async (contractAddress: string) => {
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-bor.publicnode.com');
  const contract = new ethers.Contract(contractAddress, abiErc20, provider);

  try {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply()/Math.pow(10, decimals);

    // check ERC20 method
    if (name && symbol && totalSupply && decimals) {
      return {
        isERC20: true,
        name: name,
        symbol: symbol,
        totalSupply: totalSupply.toString(),
        decimals:decimals,
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
    console.error("Error ERC20 type:", error);
    return {
      isERC20: false,
      name: null,
      symbol: null,
      totalSupply: null,
    };
  }
};
export default checkIsERC20;
