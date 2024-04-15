import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiDML from "@/abi/abiDML.json";
import abiCollection from "@/abi/abiCreateCollection.json";
const erc = async (wallet: string, address: string, abi: any) => {
  const providerChoice = await getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};
const approveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  routerAddress: string
) => {
  if (account && nftAddress && wallet) {
    const contract = await erc(wallet, nftAddress, abiErc1155);
    try {
      const isApprovedNFT = await contract.isApprovedForAll(
        account,
        routerAddress
      );
      return isApprovedNFT;
    } catch (error) {
      console.error(error);
    }
  } else {
    return false;
  }
};
//DML Token
const getTotalSupply = async (
  account: string,
  wallet: string,
  dmlAddress: string
) => {
  if (account && dmlAddress && wallet) {
    const contract = await erc(wallet, dmlAddress, abiDML);
    try {
      const currentTotalSupply = await contract.totalSupply();
      const totalSupply = currentTotalSupply.toString();
      return totalSupply;
    } catch (error) {
      console.error(error);
    }
  } else {
    return false;
  }
};
const getInforDML = async (dmlToken: string, wallet: string) => {
  const contract = await erc(wallet, dmlToken, abiDML);
  try {
    const reserves = await contract.getReserves();
    const decimals = await contract.decimals();
    const reserveNFT = await contract.reserveNFT();
    const reserveToken = await contract.reserveToken();
    return { reserves, decimals, reserveNFT, reserveToken };
  } catch (error) {
    console.error(error);
  }
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
const fillCreate = async (
  name: string,
  symbol: string,
  collection: string,
  account: string,
  wallet: string
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(wallet, collection, abiCollection);
    try {
      const result = await contract.fillCreate(name, symbol);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
const ercContract = {
  erc,
  approveNFT,
  getTotalSupply,
  getInforDML,
  viewReward,
  fillCreate,
};
export default ercContract;
