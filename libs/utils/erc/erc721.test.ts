import abiFactory from "@/abi/erc721/abiFactory.json";
import abiRouter from "@/abi/erc721/abiRouter.json";
import { createPublicClient, http } from "viem";
import { useWriteContract } from "wagmi";
import { exponentialToDecimal } from "../convertExponential";
import { mainnet } from "viem/chains";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiAdapter } from "@/config";

type Address = `0x${string}` | any;

type BigNumberish = number | string | bigint;

const ercContract721 = () => {
  const { writeContractAsync } = useWriteContract();

  const executeTransaction = async (
    contractCall: Promise<`0x${string}`>
  ): Promise<{ hash: `0x${string}`; success: boolean }> => {
    try {
      const hash = await contractCall;
      console.log(hash);
      const receipt = await waitForTransactionReceipt(
        wagmiAdapter.wagmiConfig,
        { hash }
      );
      return { hash, success: receipt.status === "success" };
    } catch (error) {
      console.error("Transaction failed:", error);
      return { hash: "0x", success: false };
    }
  };

  const dmlToken = async (
    wallet: Address,
    collectionAddress: Address,
    tokenAddress: Address,
    factoryAddress: Address
  ) => {
    return executeTransaction(
      writeContractAsync({
        account: wallet,
        abi: abiFactory,
        address: factoryAddress,
        functionName: "dmlToken",
        args: [tokenAddress, collectionAddress],
        gas: BigInt(2000000),
      })
    );
  };

  const addLiquidity = async (
    collectionAddress: Address,
    tokenAddress: Address,
    idNFT: number[],
    routerAddress: Address,
    amountErcDesired: BigNumberish,
    account: Address,
    txDeadline: number,
    valueToSend: BigNumberish
  ) => {
    const rs = await writeContractAsync({
      account,
      abi: abiRouter,
      address: routerAddress,
      functionName: "addERC20ERC721",
      args: [
        tokenAddress,
        collectionAddress,
        idNFT,
        BigInt(exponentialToDecimal(Math.floor(Number(amountErcDesired)))),
        BigInt(0),
        account,
        Math.floor((Date.now() + txDeadline * 60000) / 1000),
      ],
      gas: BigInt(5000000),
      value: BigInt(exponentialToDecimal(Number(valueToSend))),
    });

    console.log(rs);

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    console.log(receipt);

    return receipt;
  };

  const buyERC20ERC721 = async (
    wallet: Address,
    collectionAddress: Address,
    tokenAddress: Address,
    idNFT: number[],
    routerAddress: Address,
    amountInMax: BigNumberish,
    account: Address,
    txDeadline: number
  ) => {
    return executeTransaction(
      writeContractAsync({
        account: wallet,
        abi: abiRouter,
        address: routerAddress,
        functionName: "buyERC20ERC721",
        args: [
          tokenAddress,
          collectionAddress,
          idNFT,
          BigInt(exponentialToDecimal(Math.floor(Number(amountInMax)))),
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
        gas: BigInt(2000000),
        value: BigInt(exponentialToDecimal(Math.floor(Number(amountInMax)))),
      })
    );
  };

  const removeERC20ERC721 = async (
    wallet: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: number[],
    routerAddress: Address,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountNFTMin: BigNumberish,
    account: Address,
    txDeadline: number
  ) => {
    return executeTransaction(
      writeContractAsync({
        account: wallet,
        abi: abiRouter,
        address: routerAddress,
        functionName: "removeERC20ERC721",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          BigInt(Math.floor(Number(liquidity))).toString(),
          BigInt(exponentialToDecimal(Number(amountTokenMin))),
          BigInt(exponentialToDecimal(Number(amountNFTMin))),
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
        gas: BigInt(2000000),
      })
    );
  };

  const sellERC20ERC721 = async (
    wallet: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: number[],
    routerAddress: Address,
    amountSellDec: BigNumberish,
    account: Address,
    txDeadline: number
  ) => {
    return executeTransaction(
      writeContractAsync({
        account: wallet,
        abi: abiRouter,
        address: routerAddress,
        functionName: "sellERC20ERC721",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          BigInt(exponentialToDecimal(Math.floor(Number(amountSellDec)))),
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
        gas: BigInt(2000000),
      })
    );
  };

  const swapERC20ERC721 = async (
    wallet: Address,
    collectionAddress: Address,
    tokenAddress: Address,
    idFrom: number[],
    idTo: number[],
    routerAddress: Address,
    account: Address,
    txDeadline: number,
    valueToSend: BigNumberish
  ) => {
    return executeTransaction(
      writeContractAsync({
        account: wallet,
        abi: abiRouter,
        address: routerAddress,
        functionName: "change",
        args: [
          tokenAddress,
          collectionAddress,
          idFrom,
          idTo,
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
        gas: BigInt(2000000),
        value: BigInt(exponentialToDecimal(Number(valueToSend))),
      })
    );
  };

  return {
    dmlToken,
    addLiquidity,
    buyERC20ERC721,
    sellERC20ERC721,
    removeERC20ERC721,
    swapERC20ERC721,
  };
};

export default ercContract721;
