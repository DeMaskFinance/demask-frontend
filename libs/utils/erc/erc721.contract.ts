import abiFactory from "@/abi/erc721/abiFactory.json";
import abiRouter from "@/abi/erc721/abiRouter.json";
import { exponentialToDecimal } from "../convertExponential";
import ercContract from "./erc.contract";

const dmlToken = async (
  wallet: string,
  collectionAddress: string,
  tokenAddress: string,
  factoryAddress: string
) => {
  const contract = await ercContract.erc(wallet, factoryAddress, abiFactory);
  const dmlToken = await contract.dmlToken(tokenAddress, collectionAddress);
  return dmlToken;
};
const addLiquidity = async (
  wallet: string,
  collectionAddress: string,
  tokenAddress: string,
  idNFT: string[],
  routerAddress: string,
  amountErcDesired: number,
  account: string,
  txDeadline: number,
  valueToSend: string | 0
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
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
    tokenAddress,
    collectionAddress,
    idNFT,
    amountErcDesired,
    account,
    valueToSend,
    routerAddress
  });
  const result = await contract.addERC20ERC721(
    tokenAddress,
    collectionAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountErcDesired)),
    0,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: 8000000, value: valueToSend }
  );
  return result;
};
const buyERC20ERC721 = async (
  wallet: string,
  collectionAddress: string,
  tokenAddress: string,
  idNFT: string | number[],
  routerAddress: string,
  amountInMax: number,
  royaltyFee: number,
  account: string,
  txDeadline: number,
  valueToSend: string | 0
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
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

  const result = await contract.buyERC20ERC721(
    tokenAddress,
    collectionAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountInMax)),
    royaltyFee === 0 ? "5000" : royaltyFee! * 10000,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: 8000000, value: valueToSend }
  );
  return result;
};
const removeERC20ERC721 = async (
  wallet: string,
  nftAddress: string,
  tokenAddress: string,
  idNFT: string | number[],
  routerAddress: string,
  liquidity: number,
  amountTokenMin: string,
  amountNFTMin: string,
  account: string,
  txDeadline: number
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
  // const estimatedGas = await contract.estimateGas.removeERC20ERC721(
  //   tokenAddress,
  //   nftAddress,
  //   idNFT,
  //   Math.floor(Number(liquidity)).toString(),
  //   exponentialToDecimal(Number(amountTokenMin)),
  //   exponentialToDecimal(Number(amountNFTMin)),
  //   account,
  //   Math.floor((new Date().getTime() + txDeadline * 60000) / 1000)
  // );
  console.log(idNFT,amountNFTMin);
  
  const result = await contract.removeERC20ERC721(
    tokenAddress,
    nftAddress,
    idNFT,
    Math.floor(Number(liquidity)).toString(),
    exponentialToDecimal(Number(amountTokenMin)),
    exponentialToDecimal(Number(amountNFTMin)),
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: 8000000 }
  );
  return result;
};
const sellERC20ERC721 = async (
  wallet: string,
  nftAddress: string,
  tokenAddress: string,
  idNFT: string | number[],
  routerAddress: string,
  amountSellDec: number,
  fee: number,
  account: string,
  txDeadline: number,
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
  const estimatedGas = await contract.estimateGas.sellERC20ERC721(
    tokenAddress,
    nftAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountSellDec)),
    fee,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000)
  );
  const result = await contract.sellERC20ERC721(
    tokenAddress,
    nftAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountSellDec)),
    fee,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: estimatedGas }
  );
  return result;
};
const ercContract721 = {
  dmlToken,
  addLiquidity,
  buyERC20ERC721,
  sellERC20ERC721,
  removeERC20ERC721
};
export default ercContract721;
