import abiDML from "@/abi/abiDML.json";
import TransitionURL from "@/components/Toast/TransionURL";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getProvider } from "../connection/getProvider";
import viewReward from "./viewReward";
import divideByDecimal from "./divideByDecimal";
interface RewardDMLProps {
  wallet: string;
  dmlTokenLiquidity: string;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  account: string;
  data: {
    dmlDecimals: string;
    tokenAddress: string;
  }
  setReward: any;
  setIsOpenSuccessCollect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenErrorCollect: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>
}
const getRewardDML = async ({ wallet, dmlTokenLiquidity, setIsOpenTransaction, account, data, setReward, setIsOpenErrorCollect, setIsOpenSuccessCollect, setHash }: RewardDMLProps) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlTokenLiquidity, abiDML, signer);

  try {
    const result = await contract.getReward(
      [data.tokenAddress],
      account
    );
    setIsOpenTransaction(true);
    const check = await provider.waitForTransaction(result.hash);
    const resultTest = await viewReward(dmlTokenLiquidity, account, wallet);
    const rewardDec = divideByDecimal(resultTest.toString(), data.dmlDecimals);
    setHash(result.hash);
    setReward(rewardDec);
    setIsOpenTransaction(false);
    if (check.status === 1) {
      setIsOpenSuccessCollect(true);
    } else {
      setIsOpenErrorCollect(true);
    }
  } catch (error) {
    console.error(error);
    setIsOpenTransaction(false);
  }
};
export default getRewardDML;
