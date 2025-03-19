import { getProvider } from "@/libs/connection/getProvider";
import { constants, Contract, RpcProvider, WalletAccount } from "starknet";
const getRPCProvider = () => {
  const RPC_Provider = new RpcProvider({
    nodeUrl: constants.NetworkName.SN_MAIN,
    chainId: constants.StarknetChainId.SN_SEPOLIA,
  });

  return {
    RpcProvider: RPC_Provider,
  };
};
const getContract = async (classHash: string) => {
  const { RpcProvider } = getRPCProvider();
  const { abi } = await RpcProvider.getClassAt(classHash);

  if (abi === undefined) {
    throw new Error("no abi.");
  }
  const contract = new Contract(abi, classHash, RpcProvider);

  return contract;
};
const getWalletAccount = async (wallet: string) => {
  try {
    const provider = await getProvider(wallet);
    const { RpcProvider } = starknetContract.getRPCProvider();

    return new WalletAccount(RpcProvider, provider);
  } catch (error) {
    console.error("Error creating WalletAccount:", error);
    throw error;
  }
};
export const starknetContract = {
  getRPCProvider,
  getContract,
  getWalletAccount,
};
