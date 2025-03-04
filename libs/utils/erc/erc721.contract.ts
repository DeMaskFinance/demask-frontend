import abiFactory from "@/abi/erc721/abiFactory.json";
import abiRouter from "@/abi/erc721/abiRouter.json";
import { wagmiAdapter } from "@/config";
import { waitForTransactionReceipt, estimateGas } from "@wagmi/core";
import { useWriteContract } from "wagmi";
import { exponentialToDecimal } from "../convertExponential";
import { encodeFunctionData } from "viem";

type Address = `0x${string}` | any;

type BigNumberish = number | string | bigint;

const ercContract721 = () => {
  const { writeContractAsync } = useWriteContract();

  const dmlToken = async (
    wallet: Address,
    collectionAddress: Address,
    tokenAddress: Address,
    factoryAddress: Address
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: factoryAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "dmlToken",
        args: [tokenAddress, collectionAddress],
      }),
    });

    const rs = await writeContractAsync({
      account: wallet,
      abi: abiFactory,
      address: factoryAddress,
      functionName: "dmlToken",
      args: [tokenAddress, collectionAddress],
      gas: gasLimit,
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
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
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
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
      }),
      value: BigInt(exponentialToDecimal(Number(valueToSend))),
    });

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
      gas: gasLimit,
      value: BigInt(exponentialToDecimal(Number(valueToSend))),
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const buyERC20ERC721 = async (
    collectionAddress: Address,
    tokenAddress: Address,
    idNFT: number[] | any,
    routerAddress: Address,
    amountInMax: BigNumberish,
    account: Address,
    txDeadline: number
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "buyERC20ERC721",
        args: [
          tokenAddress,
          collectionAddress,
          idNFT,
          BigInt(exponentialToDecimal(Math.floor(Number(amountInMax)))),
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
      }),
      value: BigInt(exponentialToDecimal(Math.floor(Number(amountInMax)))),
    });

    const rs = await writeContractAsync({
      account: account,
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
      gas: gasLimit,
      value: BigInt(exponentialToDecimal(Math.floor(Number(amountInMax)))),
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const removeERC20ERC721 = async (
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
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
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
      }),
    });

    const rs = await writeContractAsync({
      account: account,
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
      gas: gasLimit,
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const sellERC20ERC721 = async (
    wallet: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: number[] | any,
    routerAddress: Address,
    amountSellDec: BigNumberish,
    account: Address,
    txDeadline: number
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "sellERC20ERC721",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          BigInt(exponentialToDecimal(Math.floor(Number(amountSellDec)))),
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
      }),
    });

    const rs = await writeContractAsync({
      account: account,
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
      gas: gasLimit,
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
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
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "change",
        args: [
          tokenAddress,
          collectionAddress,
          idFrom,
          idTo,
          account,
          Math.floor((Date.now() + txDeadline * 60000) / 1000),
        ],
      }),
      value: BigInt(exponentialToDecimal(Number(valueToSend))),
    });

    const rs = await writeContractAsync({
      account: account,
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
      gas: gasLimit,
      value: BigInt(exponentialToDecimal(Number(valueToSend))),
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
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
