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
  }
  setReward: any;
}
const getRewardDML = async ({ wallet, dmlTokenLiquidity, setIsOpenTransaction, account, data, setReward }: RewardDMLProps) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlTokenLiquidity, abiDML, signer);

  try {
    const result = await contract.getReward({ gasLimit: 8000000 });
    setIsOpenTransaction(true);
    const check = await provider.waitForTransaction(result.hash);
    const resultTest = await viewReward(dmlTokenLiquidity, account, wallet);
    const rewardDec = divideByDecimal(resultTest.toString(), data.dmlDecimals);
    setReward(rewardDec);
    setIsOpenTransaction(false);
    if (check.status === 1) {
      toast.success(
        <TransitionURL type={"Reward success"} transactionHash={result.hash} />,
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
    } else {
      toast.error(
        <TransitionURL type={"Reward failed"} transactionHash={result.hash} />,
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
    }
  } catch (error) {
    console.error(error);
    setIsOpenTransaction(false);
  }
};
export default getRewardDML;
