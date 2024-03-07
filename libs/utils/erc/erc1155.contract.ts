import abiDML from "@/abi/abiDML.json";
import ercContract from "./erc.contract";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiFactory from "@/abi/abiFactory.json";
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
const viewReward = async (
  dmlToken: string,
  account: string,
  wallet: string
) => {
  if (dmlToken && account && wallet) {
    const contract = await ercContract.erc(wallet, dmlToken, abiDML);
    try {
      const result = await contract.viewReward(account);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
//NFT balance
const getBalanceNFT = async (
  account: string,
  nftAddress: string,
  idNFT: string,
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
  factoryAddress:string,
) => {
  const contract = await ercContract.erc(wallet, factoryAddress, abiFactory);
  try {
    const result = await contract.getDmlToken(tokenAddress, nftAddress, idNFT);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const erc1155Contract = {
  allowanceDML,
  getBalanceNFT,
  getDMLToken,
  viewReward
};
export default erc1155Contract;
