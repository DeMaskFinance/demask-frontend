import { CallData } from "starknet";
import { starknetContract } from "./contract";
import { default as compiledTestSierra } from "@/abi/starknet/contract_erc721_NFT.contract_class.json";

const deployContractCollection = async (
  account: string,
  wallet: string,
  values: InitialValues,
  nonce: number
) => {
  const ClassHash =
    "0x0534bea08bd2d24851914eab6e6a0beb579d5f19c44844c75775a312511cfbb9";
  console.log({
    account,
    wallet,
    values,
    nonce,
  });

  try {
    const contractWallet = await starknetContract.getWalletAccount(wallet);
    const contractCallData = new CallData(compiledTestSierra.abi);
    const contractConstructor = contractCallData.compile("constructor", {
      owner: account,
      name: values.contractName,
      symbol: values.symbol,
      id: nonce,
    });
    console.log(wallet);

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
