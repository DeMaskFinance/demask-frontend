import { useContext, useEffect, useState } from "react";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import Link from "next/link";
import { Button } from "../Buttons";
import FormatNumber from "../Common/FormatNumber";
import MediaNFT from "../Common/MediaNFT";
import { EtherIcon, NFTIcon } from "../Icons";
import Image from "next/image";
interface LiquidytiesItemProps {
  liquidity: DataBase;
  type: string;
}

const LiquidytiesItem: React.FunctionComponent<LiquidytiesItemProps> = ({
  liquidity,
  type,
}) => {
  const { account, wallet, chainId } = useContext(AccountContext);
  const [reward, setReward] = useState("");
  const { balanceDML, totalSupply } = useBananceOfDML(
    account,
    liquidity.dmlAddress,
    wallet
  );

  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && wallet && liquidity) {
        const result = await ercContract.viewReward(
          liquidity.dmlAddress,
          account,
          wallet
        );
        const rewardDec = divideByDecimal(
          result?.toString(),
          liquidity.dmlDecimals
        );
        setReward(rewardDec);
      }
    };
    fetchDataReward();
  }, [liquidity, account, wallet]);

  return (
    <div className="relative w-full overflow-hidden group">
      <div className="transition-all duration-150 ease-linear group-hover:brightness-50 h-[240px] w-full rounded-lg overflow-hidden">
        {liquidity?.metadata ? (
          <MediaNFT data={liquidity} isControls={false} />
        ) : (
          <Image
            src={liquidity?.avatar!}
            alt="banner"
            width={600}
            height={600}
            className="object-cover w-full h-full "
          />
        )}
      </div>
      <div className="absolute top-0 left-0 translate-y-[100%] bg-opacity-50 bg-black rounded-lg group-hover:translate-y-0 flex flex-col items-center justify-around w-full h-full py-4 text-white transition-all duration-150 ease-linear opacity-0 group-hover:opacity-100">
        <div className="font-semibold text-[18px] truncate">
          {liquidity?.metadata ? (
            <p>{liquidity?.metadata?.name}</p>
          ) : (
            <p>{liquidity?.name}</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center text-sm ">
            <div className="flex items-center mr-2">
              <span>LP:</span>
              <FormatNumber number={liquidity.reserveNFT} />
              <NFTIcon width={24} height={24} className="fill-white ml-[2px]" />
            </div>
            <FormatNumber number={liquidity.reserveToken} />
            <span>
              <EtherIcon
                width={20}
                height={20}
                className="fill-white ml-[-1px]"
              />
            </span>
            <div>
              ({((Number(balanceDML) / Number(totalSupply)) * 100).toFixed(2)}%)
            </div>
          </div>
          <div className="flex items-center my-2">
            Reward:
            {reward ? (
              <div className="ml-2">
                <FormatNumber number={reward} />
              </div>
            ) : (
              <p className="w-10 h-4 rounded-full animate-pulse bg-slate-700 "></p>
            )}
            <span>
              <EtherIcon
                width={20}
                height={20}
                className="fill-white ml-[-1px]"
              />
            </span>
          </div>
          <Link
            href={
              type === "erc1155"
                ? `/details/${liquidity.dmlAddress}?chain=${chainId}`
                : `/collection/${liquidity.nftAddress}?typeERC=erc721&tab=pool&chain=${chainId}`
            }
          >
            <Button active className="justify-end">
              DETAIL
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiquidytiesItem;
