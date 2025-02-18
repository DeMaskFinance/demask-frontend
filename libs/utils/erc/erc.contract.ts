import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiDML from "@/abi/abiDML.json";
import abiCollection from "@/abi/abiCreateCollection.json";

import abiCollection721 from "@/abi/erc721/abiErc721Create.json";

import abiFeeManager from "@/abi/abiFeeManager.json";
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { exponentialToDecimal } from "../convertExponential";
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
  id: number,
  collection: string,
  account: string,
  wallet: string,
  type: string
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(
      wallet,
      collection,
      type === "erc721" ? abiCollection721 : abiCollection
    );

    try {
      const result = await contract.fillCreate(id.toString(), name, symbol, {
        gasLimit: 5_000_000,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};

const setRoyalty = async (
  feeManager: string,
  dmlToken: string,
  royaltyReceiver: string,
  royaltyPercent: number,
  blockTime: number,
  signature: string,
  account: string,
  wallet: string
) => {
  if (dmlToken && account && wallet) {
    const contract = await ercContract.erc(wallet, feeManager, abiFeeManager);
    try {
      const result = await contract.setRoyalty(
        dmlToken,
        royaltyReceiver,
        royaltyPercent,
        blockTime,
        signature
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
const getFeeManager = async (
  feeManager: string,
  amount: number,
  rpc: string,
  dmlToken: string
): Promise<{ totalFee: any }> => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(feeManager, abiFeeManager, provider);
  try {
    let totalFee = 0; // Default value
    if (amount) {
      totalFee = await contract.getTotalFee(dmlToken, amount);
    }
    return {
      totalFee,
    };
  } catch (error) {
    console.error(error);
    return {
      totalFee: 0, // Return default value in case of error
    };
  }
};
const getBuyArrays = async (
  feeManager: string,
  amount: number,
  dmlToken: string,
  account: string,
  wallet: string
) => {
  if (dmlToken && account) {
    const contract = await ercContract.erc(wallet, feeManager, abiFeeManager);
    try {
      const result = await contract.getBuyArrays(dmlToken, amount);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
const getSellArrays = async (
  feeManager: string,
  amount: number,
  dmlToken: string,
  account: string,
  wallet: string
) => {
  if (dmlToken && account) {
    const contract = await ercContract.erc(wallet, feeManager, abiFeeManager);
    try {
      const result = await contract.getSellArrays(dmlToken, amount, account);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
const mintedCountPerWallet = async (
  account: string,
  wallet: string,
  launchpadAddress: string,
  unit: number
) => {
  if (account) {
    const contract = await ercContract.erc(
      wallet,
      launchpadAddress,
      abiLaunchPad
    );
    try {
      const result = await contract.mintedCountPerWallet(account, unit);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
const buyLaunchpad = async (
  wallet: string,
  proof: any,
  launchpadAddress: string,
  inputAmount: number,
  limit: number | string,
  value: number
) => {
  const contract = await ercContract.erc(
    wallet,
    launchpadAddress,
    abiLaunchPad
  );
  const estimatedGas = await contract.estimateGas.buy(
    proof,
    limit,
    inputAmount,
    {
      value: exponentialToDecimal(value),
    }
  );

  const result = await contract.buy(proof, limit, inputAmount, {
    gasLimit: estimatedGas,
    value: exponentialToDecimal(value),
  });
  return result;
};
const ercContract = {
  erc,
  approveNFT,
  getTotalSupply,
  getInforDML,
  viewReward,
  fillCreate,
  setRoyalty,
  getFeeManager,
  getBuyArrays,
  getSellArrays,
  mintedCountPerWallet,
  buyLaunchpad,
};
export default ercContract;
