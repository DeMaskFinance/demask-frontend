import abiFactory from "@/abi/abiFactory.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getDMLToken = async (
  nftAddress: string,
  idNFT: string,
  tokenAddress: string,
  wallet: string,
  factoryAddress:string,
) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(factoryAddress, abiFactory, signer);
  try {
    const result = await contract.getDmlToken(tokenAddress, nftAddress, idNFT);
    return result;
  } catch (error) {
    console.error(error);
  }
};
export default getDMLToken;
