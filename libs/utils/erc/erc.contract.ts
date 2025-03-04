import { useWriteContract, useReadContract } from "wagmi";
import { estimateGas, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiAdapter } from "@/config";
import { exponentialToDecimal } from "../convertExponential";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiDML from "@/abi/abiDML.json";
import abiCollection from "@/abi/abiCreateCollection.json";
import abiCollection721 from "@/abi/erc721/abiErc721Create.json";
import abiFeeManager from "@/abi/abiFeeManager.json";
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { encodeFunctionData } from "viem";

type Address = `0x${string}`;

const useErcContract = (
  account?: Address,
  dmlToken?: Address,
  nftAddress?: Address,
  routerAddress?: Address
) => {
  const { data: isApprovedForAll } = useReadContract({
    address: nftAddress,
    abi: abiErc1155,
    functionName: "isApprovedForAll",
    args: account && routerAddress ? [account, routerAddress] : undefined,
  });

  const { data: totalSupply } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "totalSupply",
  });

  const { data: rewardData } = useReadContract({
    address: dmlToken,
    abi: abiDML,
    functionName: "viewReward",
    args: account ? [account] : undefined,
  });

  const { writeContractAsync } = useWriteContract();

  const fillCreate = async (
    name: string,
    symbol: string,
    id: number,
    collection: Address | any,
    type: "erc721" | "erc1155"
  ) => {
    const gasLimit = await estimateGas(wagmiAdapter.wagmiConfig, {
      to: collection,
      data: encodeFunctionData({
        abi: type === "erc721" ? abiCollection721 : abiCollection,
        functionName: "fillCreate",
        args: [id.toString(), name, symbol],
      }),
    });

    const rs = await writeContractAsync({
      address: collection,
      abi: type === "erc721" ? abiCollection721 : abiCollection,
      functionName: "fillCreate",
      args: [id.toString(), name, symbol],
      gas: gasLimit,
    });
    return await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs,
    });
  };

  const setRoyalty = async (
    feeManager: Address | any,
    dmlToken: Address,
    royaltyReceiver: Address,
    royaltyPercent: number,
    blockTime: number,
    signature: string
  ) => {
    const rs = await writeContractAsync({
      address: feeManager,
      abi: abiFeeManager,
      functionName: "setRoyalty",
      args: [dmlToken, royaltyReceiver, royaltyPercent, blockTime, signature],
    });
    return await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs,
    });
  };

  const buyLaunchpad = async (
    proof: any,
    launchpadAddress: Address | any,
    inputAmount: number,
    limit: number | string,
    value: number
  ) => {
    const rs = await writeContractAsync({
      address: launchpadAddress,
      abi: abiLaunchPad,
      functionName: "buy",
      args: [proof, limit, inputAmount],
      value: BigInt(exponentialToDecimal(value)),
    });
    return await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash: rs,
    });
  };

  return {
    isApprovedForAll,
    totalSupply,
    rewardData,
    fillCreate,
    setRoyalty,
    buyLaunchpad,
  };
};

export default useErcContract;
