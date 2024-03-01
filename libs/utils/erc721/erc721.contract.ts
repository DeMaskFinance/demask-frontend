import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiFactory from "@/abi/erc721/abiFactory.json";

const erc721 = async (wallet: string, address: string, abi: any) => {
  const providerChoice = await getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};
const dmlToken = async (
  wallet: string,
  collectionAddress: string,
  tokenAddress: string,
  factoryAddress: string
) => {
  const contract = await erc721(wallet, factoryAddress, abiFactory);
  const dmlToken = await contract.dmlToken(collectionAddress, tokenAddress);
  return dmlToken;
};
const erc721Contract = {
  dmlToken,
};
export default erc721Contract;
