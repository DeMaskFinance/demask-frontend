import abiRouter from "@/abi/abiRouter.json";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
const erc1155 = async (wallet: string, address: string, abi: any) => {
  const providerChoice = await getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};
//DML ADDRESS
const allowanceDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  routerAddress: string
) => {
  const contract = await erc1155(wallet, dmlAddress, abiDML);
  const dmlAllowance = await contract.allowance(account, routerAddress);
  const currentAllowance = dmlAllowance.toString();
  return currentAllowance;
};
//ROUTER
const getAmountBuy = async (
  wallet: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  amountNFT: string,
  routerAddress: string
) => {
  const contract = await erc1155(wallet, routerAddress, abiRouter);
  const amountAFee = await contract.getAmountBuy(
    tokenAddress,
    nftAddress,
    idNFT,
    amountNFT
  );
  return amountAFee;
};
const getAmountSell = async (
  wallet: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  routerAddress: string,
  amountNFT?: string
) => {
  const contract = await erc1155(wallet, routerAddress, abiRouter);
  const amountAFee = await contract.getAmountSell(
    tokenAddress,
    nftAddress,
    idNFT,
    amountNFT
  );
  return amountAFee;
};
const erc1155Contract = {
  allowanceDML,
  getAmountBuy,
  getAmountSell,
};
export default erc1155Contract;
