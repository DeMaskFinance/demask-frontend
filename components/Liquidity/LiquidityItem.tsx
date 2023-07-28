import { useState, useEffect, useContext } from "react";

import AccountContext from "@/context/AccountContext";
import viewReward from "@/libs/utils/viewReward";
import useInformationDML from "@/hooks/useInformationDML";
import handleBignumbertoDec from "@/libs/utils/handleBigNumbertoDec";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import Link from "next/link";
interface LiquidytiesItemProps {
  liquidity: any;
}

const LiquidytiesItem: React.FunctionComponent<LiquidytiesItemProps> = ({
  liquidity,
}) => {
  const { account, wallet } = useContext(AccountContext);
  const [reward, setReward] = useState("");
  const { decimals } = useInformationDML(liquidity.dmlToken);
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account) {
        const result = await viewReward(liquidity.dmlToken, account);
        const rewardDec = divideByDecimal(result.toString(), decimals);
        setReward(rewardDec);
      }
    };
    fetchDataReward();
  }, []);

  return (
    <Link href={`/details/${liquidity.dmlToken}`}>
      <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
        <p className="flex items-center leading-[13px]">
          <span>{liquidity.metadata.symbol}</span>
          <span className="overflow-hidden">/</span>
          <span>{liquidity.tokenName}</span>
        </p>
        <p>
          REWARD: {formatNumber(reward)} {liquidity.tokenName}
        </p>
      </div>
    </Link>
  );
};

export default LiquidytiesItem;
