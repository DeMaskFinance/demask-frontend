import abiDML from "@/abi/abiDML.json";
import TransitionURL from "@/components/Toast/TransionURL";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getProvider } from "../connection/getProvider";
interface RewardDMLProps {
  wallet: string;
  dmlTokenLiquidity:string;
}
const getRewardDML = async ({ wallet,dmlTokenLiquidity }: RewardDMLProps) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlTokenLiquidity, abiDML, signer);
  console.log(contract);
  
  try {
    const result = await contract.getReward({ gasLimit: 8000000 });
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
  }
};
export default getRewardDML;
