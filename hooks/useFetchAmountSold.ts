import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { useReadContract } from "wagmi";

interface FetchAmountSoldParams {
  account: string;
  launchpadAddress: `0x${string}` | any;
  unit: number;
}

export const useFetchAmountSold = ({
  account,
  launchpadAddress,
  unit,
}: FetchAmountSoldParams) => {
  return useReadContract({
    address: launchpadAddress,
    abi: abiLaunchPad,
    functionName: "mintedCountPerWallet",
    args: account ? [account, unit] : undefined,
  });
};

export const useFetchAmountMinted = ({
  launchpadAddress,
  unit,
}: FetchAmountSoldParams) => {
  return useReadContract({
    address: launchpadAddress,
    abi: abiLaunchPad,
    functionName: "soldout",
    args: [unit],
  });
};
