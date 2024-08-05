import abiDML from "@/abi/abiDML.json";
import divideByDecimal from "./divideByDecimal";
import ercContract from "./erc/erc.contract";
interface RewardDMLProps {
  wallet: string;
  dmlTokenLiquidity: string;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  account: string;
  data: {
    dmlDecimals: string;
    tokenAddress: string;
  };
  setReward: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccessCollect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenErrorCollect: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}
const getRewardDML = async ({
  wallet,
  dmlTokenLiquidity,
  setIsOpenTransaction,
  account,
  data,
  setReward,
  setIsOpenErrorCollect,
  setIsOpenSuccessCollect,
  setHash,
}: RewardDMLProps) => {
  const contract = await ercContract.erc(wallet, dmlTokenLiquidity, abiDML);
  try {
    const result = await contract.getReward([data.tokenAddress], account);
    setIsOpenTransaction(true);
    const check = await result.wait();
    const resultTest = await ercContract.viewReward(
      dmlTokenLiquidity,
      account,
      wallet
    );
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
