import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiFactory from "@/abi/erc721/abiFactory.json";
import abiRouter from "@/abi/erc721/abiRouter.json";
import { exponentialToDecimal } from "../convertExponential";
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
const addLiquidity = async (
  wallet: string,
  collectionAddress: string,
  tokenAddress: string,
  idNFT:string[],
  routerAddress: string,
  amountErcDesired:number,
  amountTokenMin:number,
  account:string,
  txDeadline:number,
  valueToSend:string | 0,
) => {
  const contract = await erc721(wallet, routerAddress, abiRouter);
  // const estimatedGas = await contract.estimateGas.addERC20ERC721(
  //   tokenAddress,
  //   collectionAddress,
  //   idNFT,
  //   exponentialToDecimal(Math.floor(amountErcDesired)),
  //   exponentialToDecimal(Math.floor(amountTokenMin)),
  //   account,
  //   Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
  //   { value: valueToSend }
  // );
  console.log({
    wallet,
    collectionAddress,
    tokenAddress,
    idNFT,
    routerAddress,
    amountErcDesired,
    amountTokenMin,
    account,
    txDeadline,
    valueToSend
  });
  
  const result = await contract.addERC20ERC721(
    tokenAddress,
    collectionAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountErcDesired)),
    exponentialToDecimal(Math.floor(amountTokenMin)),
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: 8000000, value: valueToSend }
  );
  const check = await contract.waitForTransaction(result.hash);
  return result;
};
// const checkResult = async () =>{

// }
const erc721Contract = {
  dmlToken,
  addLiquidity,
};
export default erc721Contract;
