import abiRouter from "@/abi/abiRouter.json";
import abiDML from "@/abi/abiDML.json";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiFactory from "@/abi/abiFactory.json";
import { exponentialToDecimal } from "../convertExponential";
import BigNumber from "bignumber.js";
import { useReadContract, useWriteContract } from "wagmi";
import { estimateGas, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiAdapter } from "@/config";
import { encodeFunctionData } from "viem";

type Address = `0x${string}` | any;

const erc1155Contract = () => {
  const { writeContractAsync } = useWriteContract();

  const allowanceDML = async (
    account: Address,
    dmlAddress: Address,
    routerAddress: Address
  ) => {
    const rs = useReadContract({
      account,
      abi: abiDML,
      address: dmlAddress,
      functionName: "allowance",
      args: [account, routerAddress],
    });

    return rs.toString();
  };

  const getBalanceNFT = async (
    account: Address,
    nftAddress: Address,
    idNFT: string | number[]
  ) => {
    const rs = useReadContract({
      account,
      abi: abiErc1155,
      address: nftAddress,
      functionName: "balanceOf",
      args: [account, idNFT.toString()],
    });

    return rs.toString();
  };

  const getDMLToken = async (
    nftAddress: Address,
    idNFT: string,
    tokenAddress: Address,
    factoryAddress: Address
  ) => {
    const rs = useReadContract({
      account: factoryAddress,
      abi: abiFactory,
      address: factoryAddress,
      functionName: "getDmlToken",
      args: [tokenAddress, nftAddress, idNFT],
    });

    return rs.toString();
  };

  const buyERC20ERC1155 = async (
    account: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: string | number[],
    routerAddress: Address,
    amountInMax: number,
    inputNFT: string,
    txDeadline: number,
    isNative?: boolean
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "buyERC20ERC1155",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          inputNFT,
          exponentialToDecimal(Math.floor(amountInMax)),
          account,
          Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
        ],
      }),

      value: BigInt(exponentialToDecimal(Math.floor(amountInMax))),
    });

    const rs = await writeContractAsync({
      account,
      abi: abiRouter,
      address: routerAddress,
      functionName: "buyERC20ERC1155",
      args: [
        tokenAddress,
        nftAddress,
        idNFT,
        inputNFT,
        exponentialToDecimal(Math.floor(amountInMax)),
        account,
        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
      ],
      gas: gasLimit,
      value: isNative
        ? BigInt(exponentialToDecimal(Math.floor(amountInMax)))
        : BigInt(0),
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const removeERC20ERC1155 = async (
    account: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: string | number[],
    routerAddress: Address,
    liquidity: number,
    amountTokenMin: number,
    amountNFTMin: number,
    txDeadline: number
  ) => {
    console.log({
      args: [
        tokenAddress,
        nftAddress,
        idNFT,
        Math.floor(Number(liquidity)).toString(),
        exponentialToDecimal(Number(amountTokenMin)),
        exponentialToDecimal(Number(amountNFTMin)),
        account,
        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
      ],
    });
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "removeERC20ERC1155",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          Math.floor(Number(liquidity)).toString(),
          exponentialToDecimal(Number(amountTokenMin)),
          exponentialToDecimal(Number(amountNFTMin)),
          account,
          Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
        ],
      }),
    });

    const rs = await writeContractAsync({
      account,
      abi: abiRouter,
      address: routerAddress,
      functionName: "removeERC20ERC1155",
      args: [
        tokenAddress,
        nftAddress,
        idNFT,
        Math.floor(Number(liquidity)).toString(),
        exponentialToDecimal(Number(amountTokenMin)),
        exponentialToDecimal(Number(amountNFTMin)),
        account,
        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
      ],
      gas: gasLimit,
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const addERC20ERC1155 = async (
    account: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: string | number[],
    routerAddress: Address,
    amountErcDesired: number,
    inputNFT: string,
    txDeadline: number,
    valueToSend: string | 0,
    isNative?: boolean
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "addERC20ERC1155",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          BigNumber(
            exponentialToDecimal(Math.floor(amountErcDesired))
          ).toFixed(),
          inputNFT,
          0,
          account,
          Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
        ],
      }),
      value: BigInt(isNative ? BigNumber(valueToSend || 0).toFixed() : 0),
    });

    const rs = await writeContractAsync({
      account,
      abi: abiRouter,
      address: routerAddress,
      functionName: "addERC20ERC1155",
      args: [
        tokenAddress,
        nftAddress,
        idNFT,
        BigNumber(exponentialToDecimal(Math.floor(amountErcDesired))).toFixed(),
        inputNFT,
        0,
        account,
        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
      ],
      gas: gasLimit,
      value: BigInt(isNative ? BigNumber(valueToSend || 0).toFixed() : 0),
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  const sellERC20ERC1155 = async (
    account: Address,
    nftAddress: Address,
    tokenAddress: Address,
    idNFT: string | number[],
    routerAddress: Address,
    amountSellDec: number,
    inputNFT: string,
    txDeadline: number
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: routerAddress,
      data: encodeFunctionData({
        abi: abiRouter,
        functionName: "sellERC20ERC1155",
        args: [
          tokenAddress,
          nftAddress,
          idNFT,
          inputNFT,
          exponentialToDecimal(Math.floor(amountSellDec)),
          account,
          Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
        ],
      }),
    });

    const rs = await writeContractAsync({
      account,
      abi: abiRouter,
      address: routerAddress,
      functionName: "sellERC20ERC1155",
      args: [
        tokenAddress,
        nftAddress,
        idNFT,
        inputNFT,
        exponentialToDecimal(Math.floor(amountSellDec)),
        account,
        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
      ],
      gas: gasLimit,
    });

    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs as any,
    });

    return receipt;
  };

  return {
    allowanceDML,
    getBalanceNFT,
    getDMLToken,
    buyERC20ERC1155,
    removeERC20ERC1155,
    addERC20ERC1155,
    sellERC20ERC1155,
  };
};

export default erc1155Contract;
