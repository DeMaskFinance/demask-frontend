import { useContext, useEffect, useState } from "react";

import AccountContext from "@/context/AccountContext";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import viewReward from "@/libs/utils/viewReward";
import Link from "next/link";
import FormatNumber from "../Common/FormatNumber";
import ModalDocument from "../Modal/ModalLength/ModalDocument";
import MediaNFT from "../Common/MediaNFT";
import Image from "next/image";
import { EtherIcon, NFTIcon } from "../Icons";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import { Button } from "../Buttons";
interface LiquidytiesItemProps {
  liquidity: any;
}

const LiquidytiesItem: React.FunctionComponent<LiquidytiesItemProps> = ({
  liquidity,
}) => {
  const { account, wallet } = useContext(AccountContext);
  const [reward, setReward] = useState("");
  const { balanceDML, totalSupply } = useBananceOfDML(account, liquidity.dmlAddress, wallet);
  console.log(totalSupply);

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
  console.log(liquidity);

  return (
    <div className="relative w-full overflow-hidden group">
      <div className="transition-all duration-150 ease-linear group-hover:brightness-50 h-[240px] w-full">
        <MediaNFT data={liquidity} isControls={false} />
      </div>
      <div className="absolute top-0 left-0 translate-y-[100%] bg-secondary5 rounded-lg group-hover:translate-y-0 flex flex-col items-center justify-around w-full h-full py-4 text-white transition-all duration-150 ease-linear opacity-0 group-hover:opacity-100">
        <p className="font-semibold text-[18px] truncate">{liquidity.metadata.name}</p>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center text-sm ">
            <div className="flex items-center mr-2">
              <span>LP:</span>
              <FormatNumber number={liquidity.reserveNFT} />
              <NFTIcon width={24} height={24} className="fill-white ml-[2px]" />
            </div>
            <FormatNumber number={liquidity.reserveToken} />
            <span><EtherIcon width={20} height={20} className="fill-white ml-[-1px]" /></span>
            <div>({(Number(balanceDML) / Number(totalSupply) * 100).toFixed(2)}%)</div>
          </div>
          <div className="flex items-center my-2">
            Reward:
            {reward ? (<div className="ml-2">
              <FormatNumber number={reward} />
            </div>) : (<p className="w-10 h-4 rounded-full animate-pulse bg-slate-200"></p>)}
            <span><EtherIcon width={20} height={20} className="fill-white ml-[-1px]" /></span>
          </div>
          <Link href={`/details/${liquidity.dmlAddress}`}>
            <Button active className="justify-end">DETAIL</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiquidytiesItem;
