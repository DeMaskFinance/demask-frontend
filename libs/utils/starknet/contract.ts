import { getProvider } from "@/libs/connection/getProvider";
import { constants, Contract, RpcProvider, WalletAccount } from "starknet";
const getRPCProvider = () => {
  const RPC_Provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
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
  const provider = await getProvider(wallet);
  const { RpcProvider } = starknetContract.getRPCProvider();

  return new WalletAccount(RpcProvider, provider as never);
};
const deployContractCollection = async (wallet: string) => {
  const provider = await getProvider(wallet);
  const { RpcProvider } = starknetContract.getRPCProvider();

  return new WalletAccount(RpcProvider, provider as never);
};
export const starknetContract = {
  getRPCProvider,
  getContract,
  getWalletAccount,
};
