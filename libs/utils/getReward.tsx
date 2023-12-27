import abiDML from "@/abi/abiDML.json";
import TransitionURL from "@/components/Toast/TransionURL";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getProvider } from "../connection/getProvider";
import viewReward from "./viewReward";
import divideByDecimal from "./divideByDecimal";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
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
  const providerChoice = await getProvider(wallet);
  // const providerWalletTest = await EthereumProvider.init({
  //   projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
  //   chains: [280], // REQUIRED chain ids
  //   // optionalChains: [97, 80001, 280],
  //   showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
  //   methods: ["eth_sendTransaction"],
  //   events: ["eth_transactionHash"],
  //   // optionalEvents, // OPTIONAL ethereum events
  //   rpcMap: {
  //     // "1": "https://mainnet.eth.aragon.network",
  //     // "80001": "https://polygon-mumbai-bor.publicnode.com",
  //     // "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
  //     // "56": "https://bsc-dataseed.binance.org/",
  //     "280": "https://testnet.era.zksync.dev",
  //   },
  // })
  
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
