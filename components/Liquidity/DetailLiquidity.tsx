import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import { queryClient } from "@/libs/constants";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import getRewardDML from "@/libs/utils/getReward";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import ChartNoTransfers from "../Charts/ChartNoTransfers";
import Back from "../Common/Back";
import { Pagination } from "../Common/Pagination";
import { TabGroups } from "../NavChoice";
import ModalDocument from "../Modal/ModalLength/ModalDocument";
import { toast } from "sonner";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { MediaCollection } from "../Common/Media";

const DetailLiquidity = () => {
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const router = useRouter();
  const { liquidity } = router.query;
  const [dmlTokenLiquidity, setDmlTokenLiquidity] = useState<string>("");
  const [isOpenRemoveLiquididy, setIsOpenRemoveLiquididy] = useState(false);
  const [reward, setReward] = useState("");
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
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (liquidity) {
      setDmlTokenLiquidity(liquidity[0]);
    }
  }, [liquidity]);
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);

  const type = "erc721";
  const { isLoading, data, isFetching, refetch, isPlaceholderData, isSuccess } =
    useQuery({
      queryKey: [
        "liquidityHistory",
        account,
        dmlTokenLiquidity,
        chainId,
        activeChoice,
      ],
      queryFn: async () => {
        if (account && dmlTokenLiquidity) {
          const res = await liquidityHistory(
            account,
            dmlTokenLiquidity,
            page,
            chainId,
            activeChoice
          );
          return res;
        }
      },
    });

  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity && data) {
        const result = await ercContract.viewReward(
          dmlTokenLiquidity,
          account,
          wallet
        );
        const rewardDec = divideByDecimal(result?.toString(), data.dmlDecimals);
        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();
  }, [dmlTokenLiquidity, account, data]);

  const { balanceDML, totalSupply } = useBananceOfDML(
    account,
    dmlTokenLiquidity,
    wallet
  );
  const options = ["All", "Add", "Remove"];

  const handleAddLiquidity = () => {
    setIsOpenAddLiquidity(true);
  };
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const actions = [
    // {
    //   icon: (
    //     <PlusIcon
    //       width={18}
    //       height={18}
    //       className="cursor-pointer text-primary_200"
    //     />
    //   ),
    //   content: "Add Pool",
    //   onClick: () => {
    //     handleAddLiquidity();
    //   },
    // },
    // {
    //   icon: <RemoveIcon width={18} height={18} className="cursor-pointer " />,
    //   content: "Remove Pool",
    //   modal: true,
    // },
    {
      icon: (
        <SwapIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Swap",
      link: `/trade/erc721/${data?.nftAddress}`,
    },
  ];
  const closeModal = () => {
    setIsOpenRemoveLiquididy(false);
  };

  return (
    <div className="px-3">
      {isLoading ? (
        <SkeletonPoolDetail />
      ) : isSuccess ? (
        <div>
          <Back />
          <div className="flex mb-4 gap-2 justify-start items-center">
            <div className="w-6 h-6 rounded-full">
              <MediaCollection
                avatar={formatLinkIPFS(data?.collectionAvatar)}
              />
            </div>
            <p className="text-white text-2xl font-bold">
              {data?.collectionName}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            <div className="flex-auto">
              <div className="w-full overflow-x-scroll flex flex-col rounded-lg border border-shader_500 lg:overflow-visible bg-shader_800 min-h-[400px]">
                <div className="overflow-hidden rounded-t-lg">
                  <TabGroups
                    choices={options}
                    activeChoice={activeChoice}
                    onChoiceChange={handleChoiceChange}
                    isDefault
                  />
                </div>
                <div className="flex-grow">
                  <div className="grid gap-x-4 font-semibold text-sm uppercase lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px] bg-shader_600 text-shader_200">
                    <p className="py-3 pl-4">Action</p>
                    <p className="py-3 mx-auto">Liquidity</p>
                    <p className="py-3 mx-auto">NFT</p>
                    <p className="py-3 mx-auto">Token</p>
                    <p className="flex justify-end py-3 pr-4">Time</p>
                  </div>
                  {account && isSuccess && data.liquidityHistory.length > 0 ? (
                    <LiquiditiesHistory
                      data={data}
                      isFetching={isFetching}
                      isLoading={isLoading}
                    />
                  ) : (
                    <ChartNoTransfers />
                  )}
                </div>
              </div>
              {isSuccess && (
                <Pagination
                  data={data}
                  isPlaceholderData={isPlaceholderData}
                  page={page}
                  setPage={setPage}
                  refetch={refetch}
                  isFetching={isFetching}
                />
              )}
            </div>
            <div className="w-full lg:w-[400px] flex flex-col justify-between lg:mb-0 bg-shader_800 border border-shader_500 rounded-lg p-4 text-white font-semibold flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-1">
                  <div className="text-lg font-bold max-w-[180px]">
                    <ModalDocument data={data?.metadata?.name} />
                  </div>
                  <p className="text-sm text-primary_400">
                    {data?.collectionSymbol}/ETH
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  {actions.map((action: any, index) => (
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
                          <Dialog
                            open={isOpenRemoveLiquididy}
                            onOpenChange={setIsOpenRemoveLiquididy}
                          >
                            <DialogTrigger asChild>
                              <div>{action.icon}</div>
                            </DialogTrigger>
                            <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                              {contracts && (
                                <ModalRemoveLiquidity
                                  data={data}
                                  routerAddress={
                                    contracts.ERC1155_ROUTER_ADDRESS
                                  }
                                  routerAddress721={
                                    contracts.ERC721_ROUTER_ADDRESS
                                  }
                                  type="erc721"
                                  setHash={setHash}
                                  setIsOpenSuccess={setIsOpenSuccessRemove}
                                  setIsOpenError={setIsOpenErrorRemove}
                                  closeModal={closeModal}
                                />
                              )}
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

              <div className="overflow-hidden rounded-xl">
                <MediaCollection
                  avatar={formatLinkIPFS(data?.collectionAvatar)}
                />
              </div>
              <div className="w-full font-medium rounded-lg shadow-swiper gap-y-4">
                {account && data?.metadata && (
                  <div className="justify-end mx-auto mb-6">
                    <div className="overflow-hidden rounded-xl">
                      <MediaNFT data={data} isControls={true} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-3 text-shader_200">
                  <p className="text-sm">Liquidity</p>
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber number={(data?.balanceDml).toString()} />
                    <EtherIcon width={16} height={16} />({data?.dmlPercent}%)
                  </div>
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
      />
    </div>
  );
};

export default DetailLiquidity;
