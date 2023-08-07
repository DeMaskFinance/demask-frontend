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
  const [tokenSymbol, setTokenSymbol] = useState("");
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
  useEffect(() => {
    if (account) {
      if (liquidity.erc === "0x734aef51d427b2f745210ec4bf1062abd48eceb6") {
        setTokenSymbol("MATIC");
      } else {
        setTokenSymbol(liquidity.tokenSymbol);
      }
    }
  }, []);
  return (
    <Link href={`/details/${liquidity.dmlToken}`}>
      <div className="box-border flex justify-between p-2 mb-3 rounded cursor-pointer lg:mb-6 text-dark2 bg-dark4 hover:bg-white hover:outline outline-1 hover:outline-secondary5 hover:text-secondary5 active:bg-dark4">
        <p className="flex items-center leading-[13px]">
          <span>{liquidity.metadata.symbol}</span>
          <span className="overflow-hidden">/</span>
          <span>{tokenSymbol}</span>
        </p>
        <div className="flex items-center">
          Reward:  
          {reward?(<span className="ml-2">{formatNumber(reward)}</span>):(<p className="w-10 h-4 rounded-full animate-pulse bg-slate-200"></p>)} 
          <span>{tokenSymbol}</span>
        </div>
      </div>
    </Link>
  );
};

export default LiquidytiesItem;
