import {
  Abi,
  CairoCustomEnum,
  Call,
  constants,
  Contract,
  ec,
  GetTransactionReceiptResponse,
  RpcProvider,
  StarknetDomain,
  TypedData,
  WalletAccount,
} from "starknet";
import utilsConstants from "./utilts.contants";
import { WalletType } from "@/libs/types";
import { getCookie } from "./utilts.cookie";

export const getProviders = async (walletName: string, providers: any) => {
  const getInject = providers?.find(
    (meta: any) => meta.info.name === walletName
  );

  if (!getInject?.provider) throw "Not found provider";
  return getInject.provider;
};

/* ----------------------- COMMON ----------------------- */

const connectProvider = (wallet: WalletType) => {
  if (typeof window === "undefined") return;

  if (wallet === WalletType.AGENT_X) {
    return window.starknet_argentX;
  }

  if (wallet === WalletType.BRAAVOS) {
    return window.starknet_braavos;
  }
};

const getProvider = () => {
  const provider = connectProvider(
    getCookie(utilsConstants.WALLET_CONNECT) as WalletType
  );

  console.log(provider);

  if (!provider) throw new Error("Provider not found");

  return provider;
};

const getContract = (abi: Abi, address: string) => {
  const { RpcProvider } = getRPCProvider();

  const getContract = new Contract(abi, address, RpcProvider);

  return {
    contract: getContract,
  };
};

const getRPCProvider = () => {
  const RPC_Provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    chainId: constants.StarknetChainId.SN_SEPOLIA,
  });

  return {
    RpcProvider: RPC_Provider,
  };
};

const getWalletAccount = () => {
  const provider = getProvider();

  const { RpcProvider } = getRPCProvider();

  const instance = Object.freeze<any>(provider);

  return new WalletAccount(RpcProvider, instance);
};

const signMessage = async (type: TypedData) => {
  const wallet = getWalletAccount();

  // handler signature
  const signature = await wallet.signMessage(type);

  const [r, s] = [signature.length - 2, signature.length - 1];

  const signatureCurve = new ec.starkCurve.Signature(
    BigInt(signature[r]),
    BigInt(signature[s])
  );

  return {
    signature: signatureCurve.toCompactHex(),
  };
};

const getTransaction = async (result: Call) => {
  const wallet = getWalletAccount();

  const execute = await wallet.execute(result);

  const wait = (await wallet.waitForTransaction(
    execute.transaction_hash
  )) as GetTransactionReceiptResponse & {
    transaction_hash: string;
  };

  if (wait.statusReceipt !== "success") {
    throw utilsConstants.FORMAT_THROW(import.meta.url, {
      wait: wait.statusReceipt,
    });
  }

  return wait;
};

const getAbiContract = async (classHash: string) => {
  const { RpcProvider } = getRPCProvider();

  const { abi } = await RpcProvider.getClassAt(classHash);

  const { contract } = getContract(abi, classHash);

  return contract;
};

/* ----------------------- FUNCTIONS ----------------------- */

const Buy = async (params: {
  target: string;
  signedSignature: string;
  seller: string;
  nftContract: string;
  tokenId: string;
  payment: string;
  price: bigint;
  salt: string;
  expiry: number;
  option: CairoCustomEnum;
}) => {
  const contract = await getAbiContract(params.target);

  const { r, s } = ec.starkCurve.Signature.fromCompact(params.signedSignature);

  const result = contract.populate("buy", {
    seller: params.seller,
    order: {
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      payment: params.payment,
      price: params.price,
      salt: params.salt,
      expiry: params.expiry,
      option: params.option,
    },
    signature: [r, s],
  });

  await getTransaction(result);
};

const CancelOrder = async (params: {
  target: string;
  signature: string;
  nftContract: string;
  tokenId: string;
  payment: string;
  price: string;
  expiry: number;
  salt: number;
  option: CairoCustomEnum;
}) => {
  const contract = await getAbiContract(params.target);
  const { r, s } = ec.starkCurve.Signature.fromCompact(params.signature);

  const result = contract.populate("cancelOrder", {
    order: {
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      payment: params.payment,
      price: params.price,
      expiry: params.expiry,
      salt: params.salt,
      option: params.option,
    },
    signature: [r, s],
  });

  await getTransaction(result);
};

const acceptOffer = async (params: {
  target: string;
  signature: string;
  buyer: string;
  nftContract: string;
  tokenId: string;
  payment: string;
  price: string;
  salt: number;
  expiry: number;
  option: CairoCustomEnum;
}) => {
  const contract = await getAbiContract(params.target);

  const { r, s } = ec.starkCurve.Signature.fromCompact(params.signature);

  const result = contract.populate("acceptOffer", {
    buyer: params.buyer,
    order: {
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      payment: params.payment,
      price: params.price,
      salt: params.salt,
      expiry: params.expiry,
      option: params.option,
    },
    signature: [r, s],
  });

  await getTransaction(result);
};

const batchBuy = async (params: {
  contractAddress: string;
  token: string;
  nft: string;
  tokenId: any;
  amountTokenDesired: any;
  to: any;
  deadline: any;
}) => {
  const contract = await getAbiContract(params.contractAddress);

  console.log(params);
  const result = contract.populate("buy_nft", {
    token: params.token,
    nft: params.nft,
    tokenId: params.tokenId,
    amountInMax: params.amountTokenDesired,
    to: params.to,
    deadline: params.deadline,
  });

  await getTransaction(result);
};

const matchSell = async (params: {
  contractAddress: string;
  token: string;
  nft: string;
  tokenId: any;
  amountOutMin: any;
  to: any;
  deadline: any;
}) => {
  const contract = await getAbiContract(params.contractAddress);

  const result = contract.populate("sell_nft", {
    token: params.token,
    nft: params.nft,
    tokenId: params.tokenId,
    amountOutMin: params.amountOutMin,
    to: params.to,
    deadline: params.deadline,
  });

  return await getTransaction(result);
};

const createCollection = async (params: {
  target: string;
  id: string;
  owner: string;
  name: string;
  symbol: string;
  baseURI: string;
}) => {
  const contract = await getAbiContract(params.target);

  const result = contract.populate("createCollection", {
    id: params.id,
    owner: params.owner,
    name: params.name,
    symbol: params.symbol,
    baseURI: params.baseURI,
  });

  await getTransaction(result);
};

const safeBatchMintWithURIs = async (params: {
  target: string;
  to: string;
  uris: string[];
}) => {
  const contract = await getAbiContract(params.target);

  const result = contract.populate("safeBatchMintWithURIs", [
    params.to,
    params.uris,
  ]);

  await getTransaction(result);
};

const getAllowance = async (params: {
  target: string;
  contractAddress: string;
  account: string;
}) => {
  const contract = await getAbiContract(params.contractAddress);

  const result = await contract.allowance(params.account, params.target);

  return Number(result);
};

const addLiquidity = async (params: {
  contractAddress: string;
  token: any;
  nft: any;
  tokenId: any;
  amountTokenDesired: any;
  amountTokenMin: any;
  to: any;
  deadline: any;
}) => {
  try {
    const contract = await getAbiContract(params.contractAddress);

    const result = contract.populate("add_liquidity", [
      params.token,
      params.nft,
      params.tokenId,
      params.amountTokenDesired,
      params.amountTokenMin,
      params.to,
      params.deadline,
    ]);

    return await getTransaction(result);
  } catch (error) {
    console.log(error);
  }
};

// {
//     "contractAddress": "0x60a30620c53d4f6dbf22a92bd033d24eff06fbf3e1023aa5d1570be0bde720e",
//     "token": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
//     "nft": "0x4187b44a9a9d3016907cee7e599d96f0df5547fbe79ae3a1d4c84e245ed07af",
//     "tokenId": [
//         14,
//         20
//     ],
//     "liquidity": 150000000,
//     "amountTokenMin": 11348020552005796,
//     "amountNftMint": 2,
//     "to": "0x6c7788abc7b06f1e2d707afd32d656ca251eb961645c308e642c184c15b5808",
//     "deadline": 1734079502
// }

const removeLiquidity = async (params: {
  contractAddress: string;
  token: any;
  nft: any;
  tokenId: any;
  liquidity: any;
  amountTokenMin: any;
  amountNftMin: any;
  to: any;
  deadline: any;
}) => {
  try {
    const contract = await getAbiContract(params.contractAddress);

    const result = contract.populate("remove_liquidity", [
      params.token,
      params.nft,
      params.tokenId,
      params.liquidity,
      params.amountTokenMin,
      params.amountNftMin,
      params.to,
      params.deadline,
    ]);

    return await getTransaction(result);
  } catch (error) {
    console.log(error);
  }
};

const approve = async (params: {
  target: string;
  contractAddress: string;
  balance: string;
}) => {
  const contract = await getAbiContract(params.contractAddress);

  const approve: Call = await contract.populateTransaction.approve(
    params.target,
    params.balance
  );

  return await getTransaction(approve);
};

const isApproveForAll = async (params: {
  target: string;
  account: string;
  operator: string;
}) => {
  const contract = await getAbiContract(params.target);

  const isApprove: boolean = await contract.isApprovedForAll(
    params.account,
    params.operator
  );

  return isApprove;
};

const allowanceBalance = async (params: {
  tokenAddress: string;
  owner: string;
  spender: string;
}) => {
  const contract = await getAbiContract(params.tokenAddress);

  const isApprove: boolean = await contract.allowance(
    params.owner,
    params.spender
  );

  return isApprove;
};

const setApproveForAll = async (params: {
  target: string;
  operator: string;
}) => {
  const contract = await getAbiContract(params.target);

  const result = contract.populate("setApprovalForAll", {
    operator: params.operator,
    approved: true,
  });

  return await getTransaction(result);
};

export default {
  // common
  matchSell,
  addLiquidity,
  getContract,
  getRPCProvider,
  getWalletAccount,
  signMessage,
  getTransaction,
  getAbiContract,
  allowanceBalance,
  removeLiquidity,
  // functions
  Buy,
  CancelOrder,
  acceptOffer,
  batchBuy,
  createCollection,
  safeBatchMintWithURIs,
  getAllowance,
  approve,
  isApproveForAll,
  setApproveForAll,
};
