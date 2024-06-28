import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
  LeftIcon,
  PlusIcon,
  RemoveIcon,
  SwapIcon,
} from "@/components/Icons";
import LiquiditiesHistory from "@/components/Liquidity/LiquidityHistory";
import { ModalAddLiquidity } from "@/components/Modal/ModalAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalRemoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import SkeletonPoolDetail from "@/components/Skeleton/SkeletonPoolDetail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import getRewardDML from "@/libs/utils/getReward";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from "../Common/Pagination";
import { TabGroups } from "../NavChoice";

const DetailLiquidity = () => {
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const router = useRouter();
  const { liquidity } = router.query;
  const [dmlTokenLiquidity, setDmlTokenLiquidity] = useState<string>("");
  const [reward, setReward] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const [isOpenTransation, setIsOpenTransaction] = useState<boolean>(false);
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
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const actions = [
    {
      icon: <PlusIcon width={18} height={18} className="cursor-pointer " />,
      content: "Add Pool",
      onClick: () => {
        handleAddLiquidity();
      },
    },
    {
      icon: <RemoveIcon width={18} height={18} className="cursor-pointer " />,
      content: "Remove Pool",
      modal: () => (
        <ModalRemoveLiquidity
          data={data}
          routerAddress={routerAddress}
          type="erc1155"
          isERC721={false}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccessRemove}
          setIsOpenError={setIsOpenErrorRemove}
        />
      ),
    },
    {
      icon: <SwapIcon width={18} height={18} className="cursor-pointer " />,
      content: "Swap",
      link: `/swap/${data?.nftAddress}/${data?.tokenAddress}/${data?.nftID}?chainId=${chainId}`,
    },
  ];
  return (
    <div>
      {isLoading || isFetching ? (
        <SkeletonPoolDetail />
      ) : isSuccess ? (
        <div>
          <div
            className="flex items-center mb-6 cursor-pointer gap-x-2"
            onClick={() => router.back()}
          >
            <LeftIcon width={20} height={20} />

            <p className="font-semibold text-white">Back</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-x-4">
            <div className="flex-auto">
              {account && isSuccess && data.liquidityHistory.length > 0 ? (
                <div>
                  <div className="w-full overflow-x-scroll flex flex-col rounded-lg border border-shader_500 lg:overflow-visible bg-shader_800 min-h-[400px]">
                    <TabGroups
                      choices={options}
                      activeChoice="All"
                      onChoiceChange={handleChoiceChange}
                      isDefault
                    />
                    <div className="flex-grow">
                      <div className="grid gap-x-4 font-semibold text-sm uppercase lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px] bg-shader_600 text-shader_200">
                        <p className="py-3 pl-4">Action</p>
                        <p className="py-3 mx-auto">Liquidity</p>
                        <p className="py-3 mx-auto">NFT</p>
                        <p className="py-3 mx-auto">Token</p>
                        <p className="flex justify-end py-3 pr-4">Time</p>
                      </div>
                      <LiquiditiesHistory
                        data={data}
                        isFetching={isFetching}
                        isLoading={isLoading}
                      />
                    </div>
                    <Pagination
                      data={data}
                      isPreviousData={isPreviousData}
                      page={page}
                      setPage={setPage}
                      refetch={refetch}
                      totalPages={15}
                      isFetching={isFetching}
                    />
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
            <div className="w-full lg:w-[400px] mb-20 lg:mb-0 bg-shader_800 border border-shader_500 rounded-lg p-4 text-white font-semibold flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-1">
                  <p className="text-lg font-bold">{data?.metadata?.name}</p>
                  <p className="text-sm text-primary_400">
                    ({data?.metadata?.name}/ETH)
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  {actions.map((action, index) => (
                    <Tippy
                      key={index}
                      content={<div className="text-xs">{action.content}</div>}
                      theme="dark"
                      placement="bottom"
                    >
                      <div className="border rounded-full border-shader_400 p-[7px]">
                        {action.link ? (
                          <Link href={action.link} className="group">
                            {action.icon}
                          </Link>
                        ) : action.modal ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div>{action.icon}</div>
                            </DialogTrigger>
                            <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                              <ModalRemoveLiquidity
                                data={data}
                                routerAddress={routerAddress}
                                type="erc1155"
                                isERC721={false}
                                setHash={setHash}
                                setIsOpenSuccess={setIsOpenSuccessRemove}
                                setIsOpenError={setIsOpenErrorRemove}
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div onClick={action.onClick} className="">
                            {action.icon}
                          </div>
                        )}
                      </div>
                    </Tippy>
                  ))}
                </div>
              </div>
              <div className="w-full font-medium rounded-lg shadow-swiper gap-y-4">
                {account && data?.metadata && (
                  <div className="justify-end mx-auto mb-6">
                    <div className="overflow-hidden rounded-xl">
                      <MediaNFT data={data} isControls={true} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between mb-3 text-shader_200">
                  <p className="text-sm">Liquidity</p>
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber number={(+balanceDML / 1e18).toString()} />
                    <EtherIcon width={16} height={16} />(
                    {((Number(balanceDML) / Number(totalSupply)) * 100).toFixed(
                      2
                    )}
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
                <div className="flex gap-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button active className="p-3">
                        <EyeIcon width={20} height={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500 p-0">
                      <DialogHeader>
                        <DialogDescription>
                          {data && (
                            <ModalDetail
                              type="erc1155"
                              idNFT={data.nftID}
                              nftAddress={data.nftAddress}
                            />
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {account ? (
                    <Button
                      gradient
                      className="flex w-full p-3 gap-x-1"
                      onClick={handleGetReward}
                    >
                      Claim
                      <FormatNumber number={reward} />
                      ETH
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button gradient className="flex w-full p-3 gap-x-1">
                          Connect Wallet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[350px] p-0 border-none">
                        <ModalWallet />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonPoolDetail />
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
  );
};

export default DetailLiquidity;
