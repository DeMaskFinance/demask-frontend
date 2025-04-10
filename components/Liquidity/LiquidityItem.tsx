import abiDML from "@/abi/abiDML.json";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "@/libs/constants";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { useGetRewardDML } from "@/libs/utils/getReward";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { useReadContract } from "wagmi";
import { Button } from "../Buttons";
import FormatNumber from "../Common/FormatNumber";
import MediaNFT from "../Common/Media/MediaNFT";
import { EtherIcon, NFTIcon, RightIcon } from "../Icons";
import { ModalError, ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccess } from "../Modal/ModalTransation/ModalSuccess";
import { shorten } from "@/lib/utils";

interface LiquidytiesItemProps {
  liquidity: DataBase;
  type: string;
}

const LiquidytiesItem: React.FunctionComponent<LiquidytiesItemProps> = ({
  liquidity,
  type,
}) => {
  const { account, wallet, updateBalance, chainId } =
    useContext(AccountContext);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccessCollect, setIsOpenSuccessCollect] =
    useState<boolean>(false);
  const [isOpenErrorCollect, setIsOpenErrorCollect] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const [reward, setReward] = useState("");

  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);




  const { getRewardDML } = useGetRewardDML();


  const { data: rewardData } = useReadContract({
    address: liquidity.dmlAddress as any,
    abi: abiDML,
    functionName: "viewReward",
    args: [account],
  });

  useEffect(() => {
    if (rewardData && liquidity) {
      const rewardDec = divideByDecimal(rewardData.toString(), liquidity.dmlDecimals);
      setReward(rewardDec);
    } else {
      setReward("0");
    }
  }, [rewardData, liquidity]);

  const dmlTokenLiquidity = liquidity.dmlAddress;
  const handleGetReward = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();


    if (account && contracts) {
      getRewardDML(
        dmlTokenLiquidity,
        account,
        contracts.WETH_ADDRESS,
        liquidity.dmlDecimals,
        setIsOpenTransaction,
        setReward,
        setIsOpenSuccessCollect,
        setIsOpenErrorCollect,
        setHash,
      );
    } else {
      console.log("No account and DML");
    }
  };


  return (
    <div className="relative w-full overflow-hidden border rounded-lg group border-shader_500">
      <div className="flex p-4 border-b bg-shader_600 gap-x-3 border-shader_500">
        <div className="relative w-10 h-10 ">
          <div className="w-full h-full overflow-hidden rounded-lg">
            {liquidity?.metadata ? (
              <MediaNFT data={liquidity} isControls={false} />
            ) : (
              <Image
                src={formatLinkIPFS(liquidity?.avatar || "") || "/placeHolderIMG.png"}
                alt="banner"
                width={600}
                height={600}
                className="object-cover w-full h-full "
              />
            )}
          </div>
          <div className="absolute -right-[6px] -bottom-[6px] border-4 border-shader_800 rounded-full">
            <EtherIcon width={16} height={16} />
          </div>
        </div>
        <div>
          <div className="font-bold text-white truncate">
            {liquidity?.metadata ? (
              <p>{liquidity?.metadata?.name}</p>
            ) : (
              <p>{liquidity?.name}</p>
            )}
          </div>

          <p className="text-sm font-semibold text-primary_300">
            {shorten((liquidity?.metadata?.symbol)) || shorten(String(liquidity?.symbol))}/MON
          </p>
        </div>
      </div>
      <div className="p-4 font-semibold bg-shader_700">
        <div className="flex justify-between mb-3 text-shader_200">
          <p className="text-sm">Reserve NFT</p>
          <div className="flex items-center font-bold text-white gap-x-1">
            <FormatNumber number={liquidity.reserveNFT} />
            <NFTIcon width={16} height={16} />
          </div>
        </div>
        <div className="flex justify-between mb-3 text-shader_200">
          <p className="text-sm">Liquidity</p>
          <div className="flex items-center font-bold text-white gap-x-1">
            <FormatNumber number={liquidity.balanceDml || 0} />
            <EtherIcon width={16} height={16} />(
            {(
              ((liquidity?.balanceDml ?? 0) /
                (liquidity?.totalSupplyDml ?? 1)) *
              100
            ).toFixed(2)}
            %)
          </div>
        </div>
        <div className="flex justify-between mb-3 text-shader_200">
          <p className="text-sm">Reward</p>
          <div className="flex items-center font-bold text-white gap-x-1">
            {reward ? (
              <div className="ml-2">
                <FormatNumber number={reward} />
              </div>
            ) : (
              <p className="w-10 h-4 rounded-full animate-pulse bg-slate-700 "></p>
            )}
            <EtherIcon width={16} height={16} />
          </div>
        </div>
        <Button
          gradient
          className={`flex w-full p-3 mt-5 gap-x-1 ${Number(reward) === 0 ? "opacity-70 hover:cursor-not-allowed" : ""}`}
          onClick={handleGetReward}
          disabled={Number(reward) === 0}
        >
          Claim
          <FormatNumber number={reward} />
          MON
        </Button>
        <Link
          href={
            type === "erc1155"
              ? `/details/${liquidity.dmlAddress}`
              : `/trade/erc721/${liquidity.nftAddress}?tab=pool`
          }
        >
          <div className="flex justify-center mx-auto mt-3 text-sm gap-x-1 text-primary_300">
            Pool detail
            <RightIcon width={20} height={20} className="text-primary_300" />
          </div>
        </Link>
      </div>
      <ModalSuccess
        isOpenSuccess={isOpenSuccessCollect}
        transactionHash={hash}
        type="Collect Reward Success"
        setIsOpenSuccess={setIsOpenSuccessCollect}
      />
      <ModalError
        isOpenError={isOpenErrorCollect}
        transactionHash={hash}
        type="Collect Reward Failed"
        setIsOpenError={setIsOpenErrorCollect}
      />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default LiquidytiesItem;