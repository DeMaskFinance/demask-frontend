import abiDML from "@/abi/abiDML.json";

import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getInforDML = async (dmlToken: string,wallet:string) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlToken, abiDML, signer);
  try {
    const reserves = await contract.getReserves();
    const decimals = await contract.decimals();
    const idNFT = await contract.tokenId();
    const nftAddress = await contract.NFT();
    const reserveNFT = await contract.reserveNFT();
    const reserveToken = await contract.reserveToken();
    const tokenAddress = await contract.token();
    return {reserves,decimals,idNFT,nftAddress,reserveNFT,reserveToken,tokenAddress};
  } catch (error) {
    console.error(error);
  }
};
export default getInforDML;
