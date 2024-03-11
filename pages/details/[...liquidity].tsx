import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { BackIcon, EtherIcon } from "@/components/Icons";
import LiquiditiesHistory from "@/components/Liquidity/LiquidityHistory";
import { ModalAddLiquidity } from "@/components/Modal/ModalAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import ModalRemmoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import { ModalError, ModalSuccess, ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import SkeletonPoolDetail from "@/components/Skeleton/SkeletonPoolDetail";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import getRewardDML from "@/libs/utils/getReward";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { SEO } from '../../next-seo.config';
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
const style = {
  btnWallet:
    "flex items-center justify-center p-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};
const updateMeta = {
  ...SEO,
  title: 'Detail Liquidity',
};
export default function DetailLiquidity() {
  const { account, wallet, chainId, tokenDefault, demask } = useContext(AccountContext);
  const router = useRouter();
  const { liquidity } = router.query;
  const [dmlTokenLiquidity, setDmlTokenLiquidity] = useState<string>("");
  const [reward, setReward] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const [isOpenTransation, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [isOpenSuccessAdd, setIsOpenSuccessAdd] = useState<boolean>(false);
  const [isOpenErrorAdd, setIsOpenErrorAdd] = useState<boolean>(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] = useState<boolean>(false);
  const [isOpenErrorRemove, setIsOpenErrorRemove] = useState<boolean>(false);
  const [isOpenSuccessCollect, setIsOpenSuccessCollect] = useState<boolean>(false);
  const [isOpenErrorCollect, setIsOpenErrorCollect] = useState<boolean>(false);
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] =
    useState<boolean>(false);
  const [tab, setTab] = useQueryParam("historyPool", withDefault(StringParam, "All"));
  const [page, setPage] = useState(1);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  useEffect(() => {
    if (liquidity) {
      setDmlTokenLiquidity(liquidity[0]);
    }
  }, [liquidity]);
  const { isLoading, data, isFetching, refetch, isPreviousData, isSuccess } = useQuery({
    queryKey: ["liquidityHistory", account, dmlTokenLiquidity, chainId],
    queryFn: async () => {
      if (account && dmlTokenLiquidity) {
        const res = await liquidityHistory(account, dmlTokenLiquidity, page, chainId);
        return res;
      }
    },
    keepPreviousData: true,
  });


  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity && data) {
        const result = await erc1155Contract.viewReward(dmlTokenLiquidity, account, wallet);
        const rewardDec = divideByDecimal(result.toString(), data.dmlDecimals);
        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();

  }, [dmlTokenLiquidity, account, data]);
  console.log(data);

  const { balanceOfDML, balanceDML, totalSupply } = useBananceOfDML(account, dmlTokenLiquidity, wallet);
  const options = [{ tab: 'All' }, { tab: 'Add' }, { tab: 'Remove' }];
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
        wallet, dmlTokenLiquidity, account, data: {
          dmlDecimals: data.dmlDecimals,
          tokenAddress: data.tokenAddress,
        }, setReward, setIsOpenTransaction, setIsOpenSuccessCollect, setIsOpenErrorCollect, setHash
      });
    } else {
      console.log("No account and DML");
    }
  };

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPage((next) => Math.min(next + 1, data?.totalPages));
  useEffect(() => {
    refetch();
  }, [page, refetch]);
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

  return (
    <div className="py-8 min-h-[75vh] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto">
      <NextSeo {...updateMeta} />
      {(isLoading || isFetching) ? (
        <SkeletonPoolDetail />
      ) : isSuccess ? (
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="grow">
            <div className="flex flex-wrap justify-between mb-6 lg:flex-nowrap">
              {data && account && (
                <>
                  <div className="flex flex-wrap items-center mb-2 lg:mb-0">
                    <Link href='/pools' className="p-1 rounded-lg group">
                      <BackIcon width={30} height={30} className="hover:fill-secondary2" />
                    </Link>
                    <div className="w-[30px] h-[30px] ml-4">
                      <MediaNFT data={data} isControls={false} />
                    </div>
                    <Link href={`/swap/${data.nftAddress}/${data.tokenAddress}/${data.nftID}`} className="flex items-center ml-2 text-lg font-medium lg:text-2xl text-dark1">
                      <div className="relative truncate max-w-[160px]">
                        <ModalDocument data={data?.metadata?.name}/>
                      </div>
                      (
                      <span>{data?.metadata?.symbol}</span>
                      <span className="block overflow-hidden leading-[18px]">/</span>
                      <span>{data.tokenSymbol}</span>
                      )
                    </Link>
                  </div>
                  <div className="flex justify-end gap-x-4">
                    <button className={style.btnWallet} onClick={handleAddLiquidity}>
                      ADD
                    </button>
                    <button className={style.btnWallet} onClick={handleRemoveLiquidity}>
                      REMOVE
                    </button>
                    <Link href={`/swap/${data.nftAddress}/${data.tokenAddress}/${data.nftID}`} className={style.btnWallet} >
                      SWAP
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="h-full ">
              <div className="">
                {account && isSuccess && data.liquidityHistory.length > 0 ? (
                  <div>
                    <div className="p-2 mt-6 overflow-y-scroll border border-gray-200 rounded-lg min-h-[315px]">
                      <div className='sticky left-0 flex items-center gap-2 p-1 mb-2 text-base text-center text-white rounded-lg lg:left-2 bg-dark3 w-max'>
                        {options.map((item, idx) => (
                          <button
                            key={idx}
                            className={`py-2 px-4 ${tab === item.tab ? "bg-secondary5" : ""
                              } rounded-lg text-xs`}
                            type="button"
                            onClick={() => {
                              setTab(item.tab)
                            }}
                          >
                            {item.tab}
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 ">
                        <div className="">
                          <div className="grid gap-x-4 border-b lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px] text-dark1 font-semibold">
                            <p className="pl-3">Action</p>
                            <p className="mx-auto">Liquidity</p>
                            <p className="mx-auto">NFT</p>
                            <p className="mx-auto">Token</p>
                            <p className="flex justify-end">Time</p>
                          </div>
                          <LiquiditiesHistory
                            data={data}
                            isFetching={isFetching}
                            isLoading={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-5 py-8 text-sm text-dark2 ">
                      <button
                        onClick={prevPage}
                        disabled={isPreviousData || page === 1 || isFetching}
                        className={`${isPreviousData || page === 1 || isFetching
                          ? "text-white bg-slate-300"
                          : "hover:text-white hover:bg-secondary2 transition-all"
                          } w-6 h-6 flex items-center text-center justify-center rounded-full transition-all`}
                      >
                        <MdNavigateBefore />
                      </button>
                      <p>
                        Page
                        <span className="px-2 font-medium text-secondary2">
                          {page}
                        </span>{" "}
                        of
                        <span
                          className="px-2 font-medium cursor-pointer text-secondary2"
                          onClick={() =>
                            page !== data?.totalPages && setPage(data?.totalPages)
                          }
                        >
                          {data?.totalPages}
                        </span>
                      </p>
                      <button
                        onClick={nextPage}
                        disabled={
                          isPreviousData || page === data?.totalPages || isFetching
                        }
                        className={`${isPreviousData || page === data?.totalPages || isFetching
                          ? "text-white bg-slate-300"
                          : "hover:text-white hover:bg-secondary2 transition-all"
                          } w-6 h-6 flex items-center text-center justify-center rounded-full transition-all`}
                      >
                        <MdOutlineNavigateNext />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mt-8 gap-x-2">
                    <BsClock className="w-5 h-5" />
                    <p className="text-sm font-medium text-dark1">
                      No events in this time range
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[400px] mb-20 lg:mb-0">
            <div className="w-full p-6 font-medium rounded-lg shadow-swiper gap-y-4">
              {account && data?.metadata && (
                <div className="justify-end max-w-[350px] mb-6 mx-auto">
                  <MediaNFT data={data} isControls={true} />
                  <div className="w-full">
                    <p
                      className="block mx-auto mt-2 text-xs text-secondary5 hover:cursor-pointer hover:text-secondary3 w-fit"
                      onClick={handleShowDetail}
                    >
                      Show detail
                    </p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap justify-between">
                <div>
                  <p className="mb-2 text-dark1">Liquidity</p>
                  <div className="flex font-light text-dark3">
                    <FormatNumber number={balanceOfDML} />
                    <div>({(Number(balanceDML) / Number(totalSupply) * 100).toFixed(2)})%</div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-dark1">Reward</p>
                  <div className="flex items-center font-light text-dark3">
                    <FormatNumber number={reward} />
                    <span className="mb-1 ml-1">
                      <EtherIcon width={18} height={18} className="fill-dark3" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  className="px-6 py-2 text-sm font-medium text-white transition-all duration-150 ease-linear border rounded-lg bg-green hover:bg-white hover:text-green boder-white hover:border-green"
                  onClick={handleGetReward}
                >
                  {account ? "COLLECT" : "CONNECT WALLET"}
                </Button>
              </div>
            </div>
          </div>
        </div>) : (
        <SkeletonPoolDetail />
      )}
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data && (
        <ModalDetail
          data={data}
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
            setHash={setHash} setIsOpenSuccess={setIsOpenSuccessAdd} setIsOpenError={setIsOpenErrorAdd}
          />
          <ModalSuccess isOpenSuccess={isOpenSuccessAdd} transactionHash={hash} type="Add Liquidity Success" setIsOpenSuccess={setIsOpenSuccessAdd} />
          <ModalError isOpenError={isOpenErrorAdd} transactionHash={hash} type="Add Liquidity Failed" setIsOpenError={setIsOpenErrorAdd} /></>
      )}
      {data && account && (
        <>
          <ModalRemmoveLiquidity
            data={data}
            routerAddress={routerAddress}
            isOpenRemoveLiquidity={isOpenRemoveLiquidity}
            setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
            setHash={setHash} setIsOpenSuccess={setIsOpenSuccessRemove} setIsOpenError={setIsOpenErrorRemove}
          />
          <ModalSuccess isOpenSuccess={isOpenSuccessRemove} transactionHash={hash} type="Remove Liquidity Success" setIsOpenSuccess={setIsOpenSuccessRemove} />
          <ModalError isOpenError={isOpenErrorRemove} transactionHash={hash} type="Remove Liquidity Failed" setIsOpenError={setIsOpenErrorRemove} />
        </>
      )}
      <ModalSuccess isOpenSuccess={isOpenSuccessCollect} transactionHash={hash} type="Collect Reward Success" setIsOpenSuccess={setIsOpenSuccessCollect} />
      <ModalError isOpenError={isOpenErrorCollect} transactionHash={hash} type="Collect Reward Failed" setIsOpenError={setIsOpenErrorCollect} />
      <ModalTransation isOpenTransation={isOpenTransation} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
    </div>
  );
}
