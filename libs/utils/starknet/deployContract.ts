import { CallData } from "starknet";
import { starknetContract } from "./contract";
import { default as compiledTestSierra } from "@/abi/starknet/contract_erc721_NFT.contract_class.json";

const deployContractCollection = async (
  account: string,
  wallet: string,
  values: InitialValues,
  nonce: number,
  classHash: string
) => {
  try {
    const contractWallet = await starknetContract.getWalletAccount(wallet);
    const contractCallData = new CallData(compiledTestSierra.abi);
    const contractConstructor = contractCallData.compile("constructor", {
      owner: account,
      name: values.contractName,
      symbol: values.symbol,
      id: nonce,
    });

    const deployResponse = await contractWallet.deployContract({
      classHash: classHash,
      constructorCalldata: contractConstructor,
    });
    const data = await contractWallet.waitForTransaction(
      deployResponse.transaction_hash
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deployContract = {
  deployContractCollection,
};
