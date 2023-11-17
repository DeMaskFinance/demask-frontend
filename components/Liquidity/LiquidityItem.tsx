import { useContext, useEffect, useState } from "react";

import AccountContext from "@/context/AccountContext";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import viewReward from "@/libs/utils/viewReward";
import Link from "next/link";
import FormatNumber from "../Common/FormatNumber";
interface LiquidytiesItemProps {
  liquidity: any;
  tokenDefault: [any]
}

const LiquidytiesItem: React.FunctionComponent<LiquidytiesItemProps> = ({
  liquidity,
  tokenDefault
}) => {
  const { account, wallet } = useContext(AccountContext);
  const [reward, setReward] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && wallet && liquidity) {
        const result = await viewReward(liquidity.dmlAddress, account, wallet);
        const rewardDec = divideByDecimal(result?.toString(), liquidity.dmlDecimals);
        setReward(rewardDec);
      }
    };
    fetchDataReward();
  }, [liquidity, account, wallet]);

  useEffect(() => {
    if (account) {
      if (liquidity.tokenSymbol === "WETH" || liquidity.tokenSymbol === "WBNB") {
        setTokenSymbol(tokenDefault[0].symbol);
      } else {
        setTokenSymbol(liquidity.tokenSymbol);
      }
    }
  }, []);
  return (
    <Link href={`/details/${liquidity.dmlAddress}`}>
      <div className="box-border flex justify-between p-2 mb-3 rounded cursor-pointer lg:mb-6 text-dark2 bg-dark4 hover:bg-white hover:outline outline-1 hover:outline-secondary5 hover:text-secondary5 active:bg-dark4">
        <div className="flex items-center leading-[13px]">
          <span>{liquidity.nftSymbol}</span>
          <span className="overflow-hidden">/</span>
          <span>{tokenSymbol}</span>
        </div>
        <div className="flex items-center">
          Reward:
          {reward ? (<div className="ml-2">
            <FormatNumber number={reward} />
          </div>) : (<p className="w-10 h-4 rounded-full animate-pulse bg-slate-200"></p>)}
          <span>{tokenSymbol}</span>
        </div>
      </div>
    </Link>
  );
};

export default LiquidytiesItem;
