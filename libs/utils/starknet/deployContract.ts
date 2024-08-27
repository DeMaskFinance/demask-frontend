import { CallData } from "starknet";
import { starknetContract } from "./contract";
import { default as compiledTestSierra } from "@/abi/starknet/contract_erc721_NFT.contract_class.json";
import { InitialValues } from "@/libs/types/Collection";

const deployContractCollection = async (
  account: string,
  wallet: string,
  values: InitialValues,
  nonce: number
) => {
  const ClassHash =
    "0x031cc63192738afed3457500f010c7f45d34cd55d3783f5598126dba8032c098";
  try {
    const contractCallData = new CallData(compiledTestSierra.abi);
    const contractConstructor = contractCallData.compile("constructor", {
      owner: account,
      name: values.contractName,
      symbol: values.symbol,
      id: nonce,
    });
    const contractWallet = await starknetContract.getWalletAccount(wallet);
    const deployResponse = await contractWallet.deployContract({
      classHash: ClassHash,
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
