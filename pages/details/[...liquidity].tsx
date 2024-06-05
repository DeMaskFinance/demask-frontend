import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, EyeIcon, LeftIcon } from "@/components/Icons";
import LiquiditiesHistory from "@/components/Liquidity/LiquidityHistory";
import { ModalAddLiquidity } from "@/components/Modal/ModalAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import ModalRemoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import SkeletonPoolDetail from "@/components/Skeleton/SkeletonPoolDetail";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import getRewardDML from "@/libs/utils/getReward";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SEO } from "../../next-seo.config";
import TabQuery from "@/components/NavChoice/TabQuery";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import TabTable from "@/components/NavChoice/TabTable";
import { BackgroundDefault } from "@/components/Backgrounds";
const style = {
  btnWallet:
    "flex items-center justify-center p-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-primary_400 active:bg-primary_400 text-primary_400 hover:text-white gap-x-2 border-primary_400",
};
const updateMeta = {
  ...SEO,
  title: "Detail Liquidity",
};
export default function DetailLiquidity() {
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const router = useRouter();
  const { liquidity } = router.query;
  const [dmlTokenLiquidity, setDmlTokenLiquidity] = useState<string>("");
  const [reward, setReward] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const [isOpenTransation, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>("All");
  const [isOpenSuccessAdd, setIsOpenSuccessAdd] = useState<boolean>(false);
  const [isOpenErrorAdd, setIsOpenErrorAdd] = useState<boolean>(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] =
    useState<boolean>(false);
  const [isOpenErrorRemove, setIsOpenErrorRemove] = useState<boolean>(false);
  const [isOpenSuccessCollect, setIsOpenSuccessCollect] =
    useState<boolean>(false);
  const [isOpenErrorCollect, setIsOpenErrorCollect] = useState<boolean>(false);
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] =
    useState<boolean>(false);

  const [page, setPage] = useState(1);
  const { ROUTER: routerAddress } = demask;
  useEffect(() => {
    if (liquidity) {
      setDmlTokenLiquidity(liquidity[0]);
    }
  }, [liquidity]);
  const { isLoading, data, isFetching, refetch, isPreviousData, isSuccess } =
    useQuery({
      queryKey: ["liquidityHistory", account, dmlTokenLiquidity, chainId],
      queryFn: async () => {
        if (account && dmlTokenLiquidity) {
          const res = await liquidityHistory(
            account,
            dmlTokenLiquidity,
            page,
            chainId
          );
          return res;
        }
      },
      keepPreviousData: true,
    });

  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity && data) {
        const result = await ercContract.viewReward(
          dmlTokenLiquidity,
          account,
          wallet
        );
        const rewardDec = divideByDecimal(result.toString(), data.dmlDecimals);
        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();
  }, [dmlTokenLiquidity, account, data]);

  const { balanceOfDML, balanceDML, totalSupply } = useBananceOfDML(
    account,
    dmlTokenLiquidity,
    wallet
  );
  const options = ["All", "Add", "Remove"];
  const handleGetReward = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (account && dmlTokenLiquidity && wallet) {
      getRewardDML({
        wallet,
        dmlTokenLiquidity,
        account,
        data: {
          dmlDecimals: data.dmlDecimals,
          tokenAddress: data.tokenAddress,
        },
        setReward,
        setIsOpenTransaction,
        setIsOpenSuccessCollect,
        setIsOpenErrorCollect,
        setHash,
      });
    } else {
      console.log("No account and DML");
    }
  };

  const handleAddLiquidity = () => {
    setIsOpenAddLiquidity(true);
    document.body.style.overflowY = "hidden";
  };
  const handleRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true);
    document.body.style.overflowY = "hidden";
  };
  const handleShowDetail = () => {
    setIsOpenDetail(true);
    document.body.style.overflowY = "hidden";
  };
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <BackgroundDefault>
      <div className="py-8 min-h-[94vh] max-w-screen-sm md:max-w-screen-xl mx-auto">
        <NextSeo {...updateMeta} />
        {isLoading || isFetching ? (
          <SkeletonPoolDetail />
        ) : isSuccess ? (
          <div>
            <div
              className="flex items-center cursor-pointer gap-x-2 mb-6"
              onClick={() => router.back()}
            >
              <LeftIcon width={20} height={20} />

              <p className="font-semibold text-white">Back</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-x-4">
              <div className="grow">
                <div className="">
                  {account && isSuccess && data.liquidityHistory.length > 0 ? (
                    <div>
                      <div className="w-full overflow-x-scroll rounded-lg border border-shader_500 lg:overflow-visible bg-shader_800 min-h-[400px]">
                        <TabTable
                          choices={options}
                          activeChoice="All"
                          onChoiceChange={handleChoiceChange}
                        />
                        <div className="">
                          <div className="grid gap-x-4 font-semibold text-sm uppercase lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px] bg-shader_600 text-shader_200">
                            <p className="pl-4 py-3">Action</p>
                            <p className="mx-auto py-3">Liquidity</p>
                            <p className="mx-auto py-3">NFT</p>
                            <p className="mx-auto py-3">Token</p>
                            <p className="flex justify-end py-3 pr-4">Time</p>
                          </div>
                          <LiquiditiesHistory
                            data={data}
                            isFetching={isFetching}
                            isLoading={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center mt-8 gap-x-2">
                      <BsClock className="w-5 h-5" />
                      <p className="text-sm font-medium text-shader_700">
                        No events in this time range
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-[400px] mb-20 lg:mb-0 bg-shader_800 border border-shader_500 rounded-lg">
                <div className="w-full p-6 font-medium rounded-lg shadow-swiper gap-y-4">
                  {account && data?.metadata && (
                    <div className="justify-end max-w-[350px] mb-6 mx-auto">
                      <div className="overflow-hidden rounded-xl">
                        <MediaNFT data={data} isControls={true} />
                      </div>
                      <div className="flex" onClick={handleShowDetail}>
                        <EyeIcon width={20} height={20} />
                        View detail
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <p className="mb-2 text-shader_700">Liquidity</p>
                      <div className="flex font-light text-shader_500">
                        <FormatNumber number={balanceOfDML} />
                        <div>
                          (
                          {(
                            (Number(balanceDML) / Number(totalSupply)) *
                            100
                          ).toFixed(2)}
                          )%
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-shader_700">Reward</p>
                      <div className="flex items-center font-light text-shader_500">
                        <FormatNumber number={reward} />
                        <span className="mb-1 ml-1">
                          <EtherIcon
                            width={18}
                            height={18}
                            className="fill-shader_500"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button
                      className="px-6 py-2 text-sm font-medium"
                      green
                      onClick={handleGetReward}
                    >
                      {account ? "COLLECT" : "Connect Wallet"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SkeletonPoolDetail />
        )}
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        {data && (
          <ModalDetail
            type="erc1155"
            idNFT={data.nftID}
            nftAddress={data.nftAddress}
            setIsOpenDetail={setIsOpenDetail}
            isOpenDetail={isOpenDetail}
          />
        )}
        {data && account && (
          <>
            <ModalAddLiquidity
              data={data}
              isOpenAddLiquidity={isOpenAddLiquidity}
              setIsOpenLiquidity={setIsOpenAddLiquidity}
              setHash={setHash}
              setIsOpenSuccess={setIsOpenSuccessAdd}
              setIsOpenError={setIsOpenErrorAdd}
            />
            <ModalSuccess
              isOpenSuccess={isOpenSuccessAdd}
              transactionHash={hash}
              type="Add Liquidity Success"
              setIsOpenSuccess={setIsOpenSuccessAdd}
            />
            <ModalError
              isOpenError={isOpenErrorAdd}
              transactionHash={hash}
              type="Add Liquidity Failed"
              setIsOpenError={setIsOpenErrorAdd}
            />
          </>
        )}
        {data && account && (
          <>
            <ModalRemoveLiquidity
              data={data}
              routerAddress={routerAddress}
              type="erc1155"
              isOpenRemoveLiquidity={isOpenRemoveLiquidity}
              isERC721={false}
              setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
              setHash={setHash}
              setIsOpenSuccess={setIsOpenSuccessRemove}
              setIsOpenError={setIsOpenErrorRemove}
            />
            <ModalSuccess
              isOpenSuccess={isOpenSuccessRemove}
              transactionHash={hash}
              type="Remove Liquidity Success"
              setIsOpenSuccess={setIsOpenSuccessRemove}
            />
            <ModalError
              isOpenError={isOpenErrorRemove}
              transactionHash={hash}
              type="Remove Liquidity Failed"
              setIsOpenError={setIsOpenErrorRemove}
            />
          </>
        )}
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
          isOpenTransation={isOpenTransation}
          setIsOpenTransaction={setIsOpenTransaction}
          isTransaction={true}
        />
      </div>
    </BackgroundDefault>
  );
}
