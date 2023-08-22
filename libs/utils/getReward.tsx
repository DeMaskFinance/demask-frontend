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
  decimals: string;
  setReward: any;
}
const getRewardDML = async ({ wallet, dmlTokenLiquidity, setIsOpenTransaction, account, decimals, setReward }: RewardDMLProps) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlTokenLiquidity, abiDML, signer);

  try {
    const result = await contract.getReward({ gasLimit: 8000000 });
    setIsOpenTransaction(true);
    await provider.waitForTransaction(result.hash);
    const resultTest = await viewReward(dmlTokenLiquidity, account);
    const rewardDec = divideByDecimal(resultTest.toString(), decimals);
    setReward(rewardDec);
    setIsOpenTransaction(false);
    toast.success(
      <TransitionURL type={"Reward"} transactionHash={result.hash} />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  } catch (error) {
    console.error(error);
    setIsOpenTransaction(false);
  }
};
export default getRewardDML;
