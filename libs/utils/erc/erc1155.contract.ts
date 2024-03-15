import abiRouter from "@/abi/abiRouter.json";
import abiDML from "@/abi/abiDML.json";
import ercContract from "./erc.contract";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiFactory from "@/abi/abiFactory.json";
import { exponentialToDecimal } from "../convertExponential";
//DML ADDRESS
const allowanceDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  routerAddress: string
) => {
  const contract = await ercContract.erc(wallet, dmlAddress, abiDML);
  const dmlAllowance = await contract.allowance(account, routerAddress);
  const currentAllowance = dmlAllowance.toString();
  return currentAllowance;
};

//NFT balance
const getBalanceNFT = async (
  account: string,
  nftAddress: string,
  idNFT: string | number[],
  wallet: string
) => {
  if (account) {
    const contract = await ercContract.erc(wallet, nftAddress, abiErc1155);
    try {
      const bigNumberBalance = await contract.balanceOf(
        account,
        idNFT.toString()
      );
      const balance = bigNumberBalance.toString();
      return balance;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("No account");
  }
};
const getDMLToken = async (
  nftAddress: string,
  idNFT: string,
  tokenAddress: string,
  wallet: string,
  factoryAddress: string
) => {
  const contract = await ercContract.erc(wallet, factoryAddress, abiFactory);
  try {
    const result = await contract.getDmlToken(tokenAddress, nftAddress, idNFT);
    return result;
  } catch (error) {
    console.error(error);
  }
};
const buyERC20ERC1155 = async (
  wallet: string,
  nftAddress: string,
  tokenAddress: string,
  idNFT: string | number[],
  routerAddress: string,
  amountBuyDec: number,
  inputNFT: string,
  fee: number,
  account: string,
  txDeadline: number,
  value: string | 0
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
  const estimatedGas = await contract.estimateGas.buyERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    inputNFT,
    exponentialToDecimal(Math.floor(amountBuyDec)),
    fee,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { value }
  );

  const result = await contract.buyERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    inputNFT,
    exponentialToDecimal(Math.floor(amountBuyDec)),
    fee,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: estimatedGas, value: value }
  );
  return result;
};
const removeERC20ERC1155 = async (
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
  const estimatedGas = await contract.estimateGas.removeERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    Math.floor(Number(liquidity)).toString(),
    exponentialToDecimal(Number(amountTokenMin)),
    exponentialToDecimal(Number(amountNFTMin)),
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000)
  );
  const result = await contract.removeERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    Math.floor(Number(liquidity)).toString(),
    exponentialToDecimal(Number(amountTokenMin)),
    exponentialToDecimal(Number(amountNFTMin)),
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: estimatedGas }
  );
  return result;
};
const addERC20ERC1155 = async (
  wallet: string,
  nftAddress: string,
  tokenAddress: string,
  idNFT: string | number[],
  routerAddress: string,
  amountErcDesired: number,
  inputNFT: string,
  account: string,
  txDeadline: number,
  valueToSend: string | 0
) => {
  const contract = await ercContract.erc(wallet, routerAddress, abiRouter);
  const estimatedGas = await contract.estimateGas.addERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountErcDesired)),
    inputNFT,
    0,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { value: valueToSend }
  );
  const result = await contract.addERC20ERC1155(
    tokenAddress,
    nftAddress,
    idNFT,
    exponentialToDecimal(Math.floor(amountErcDesired)),
    inputNFT,
    0,
    account,
    Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
    { gasLimit: estimatedGas, value: valueToSend }
  );
  return result;
};
const erc1155Contract = {
  allowanceDML,
  getBalanceNFT,
  getDMLToken,
  buyERC20ERC1155,
  removeERC20ERC1155,
  addERC20ERC1155,
};
export default erc1155Contract;
