import { getProvider } from "@/libs/connection/getProvider";
import { constants, Contract, RpcProvider, WalletAccount } from "starknet";
const getRPCProvider = () => {
  const RPC_Provider = new RpcProvider({
    nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
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

    const walletAccount = new WalletAccount(RpcProvider, provider as never);
    console.log(walletAccount);

    return walletAccount;
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
