import { Button } from "@/components/Buttons";
import { BackIcon } from "@/components/Icons";
import LiquiditiesHistory from "@/components/Liquidity/LiquidityHistory";
import { ModalAddLiquidity } from "@/components/Modal/ModalAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalRemmoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useInformationDML from "@/hooks/useInformationDML";
import useMetadata from "@/hooks/useMetadata";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import getRewardDML from "@/libs/utils/getReward";
import viewReward from "@/libs/utils/viewReward";
import images from "@/public/images";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import useNetWork from "@/hooks/useNetwork";

const style = {
  btnWallet:
    "flex items-center justify-center p-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};

export default function DetailLiquidity() {
  const { account, wallet } = useContext(AccountContext);
  const router = useRouter();
  const { liquidity } = router.query;
  const [dmlTokenLiquidity, setDmlTokenLiquidity] = useState<string>("");
  const [reward, setReward] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const [isOpenTransation, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] =
    useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [tokenSymbol, setTokenSymbol] = useState("");
  useEffect(() => {
    if (liquidity) {
      setDmlTokenLiquidity(liquidity[0]);
    }
  }, [liquidity]);

  const { decimals } = useInformationDML(dmlTokenLiquidity);
  const { chainId } = useNetWork();
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity) {
        const result = await viewReward(dmlTokenLiquidity, account);
        const rewardDec = divideByDecimal(result.toString(), decimals);
        console.log(rewardDec);

        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();

  }, [dmlTokenLiquidity, account]);
  const { balanceOfDML } = useBananceOfDML(account, dmlTokenLiquidity);
  const handleGetReward = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (account && dmlTokenLiquidity && wallet) {
      getRewardDML({ wallet, dmlTokenLiquidity, account, decimals, setReward, setIsOpenTransaction });
    } else {
      console.log("No account and DML");
    }
  };
  // console.log(account);
  // console.log(dmlTokenLiquidity);


  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
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
    if (account && data) {
      if (
        data.tokenSymbol ===
        "WETH"
      ) {
        setTokenSymbol("MATIC");
      } else {
        setTokenSymbol(data.tokenSymbol);
      }
    }
  }, [data, account]);
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
    <div className="py-8 lg:min-h-[calc(100vh-300px)] min-h-[calc(100vh-151px)] w-[80%] mx-auto">
      <Head>
        <title>Detail Liquidity | DeMask</title>
      </Head>
      <div className="flex justify-between ">
        <div className="flex items-center mb-6">
          <Link href="/liquidity" className="p-1 rounded-lg hover:bg-secondary2 group">
            <BackIcon width={24} height={24} />
          </Link>
          {account && data && (
            <div className="text-2xl text-dark1 font-medium ml-[18px] flex items-center">
              <span>{data.metadata.symbol}</span>
              <span className="block overflow-hidden leading-[18px]">/</span>
              <span>{tokenSymbol}</span>
            </div>
          )}
          {isLoading && (
            <p className="w-[110px] h-6 rounded-full animate-pulse bg-slate-200"></p>
          )}
        </div>
        <div className="flex justify-end mb-8 gap-x-4">
          <button className={style.btnWallet} onClick={handleAddLiquidity}>
            ADD
          </button>
          <button className={style.btnWallet} onClick={handleRemoveLiquidity}>
            REMOVE
          </button>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="grow">
          <div className="h-full ">
            <div className="flex justify-between font-medium max-w-[500px]">
              <div>
                <p className="text-dark1">Liquidity</p>
                <p className="text-xl text-secondary3">
                  {formatNumber(balanceOfDML)}
                </p>
              </div>
              <div>
                <p className="text-dark1">Reward</p>
                <div className="text-xl text-secondary3">
                  <span className="mr-2">{formatNumber(reward)}</span>
                  <span>{tokenSymbol}</span>
                </div>
              </div>
              <div>
                <Button
                  primary
                  className="p-2 text-sm"
                  onClick={handleGetReward}
                >
                  {account ? "COLLECT" : "CONNECT WALLET"}
                </Button>
              </div>
            </div>
            <div className="p-2 mt-6 ">
              <Button primary className="px-6 py-2 text-lg">History</Button>
              {account && data ? (
                <div className="w-[100vw] lg:w-[40vw] 3xl:w-[36vw] overflow-hidden mt-6">
                  <div className="overflow-x-auto">
                    <div className="grid gap-x-4 lg:grid-cols-[80px,repeat(3,2fr),3fr] grid-cols-[150px,100px,100px,100px,200px] text-dark1 font-medium mb-2">
                      <p>Action</p>
                      <p>Liquidity</p>
                      <p>NFT</p>
                      <p>Token</p>
                      <p>Time</p>
                    </div>
                    <LiquiditiesHistory
                      data={data}
                      isFetching={isFetching}
                      isLoading={isLoading}
                    />
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
                <div className="flex items-center mt-6 gap-x-2">
                  <BsClock className="w-5 h-5" />
                  <p className="text-sm font-medium text-dark1">
                    No events in this time range
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {account && data?.metadata && (
          <div className="justify-end max-w-[700px] mb-6 mx-auto">
            {data.metadata?.image && (
              <Image
                width={760}
                height={760}
                src={data.metadata.image}
                alt="NFT Image"
                style={{
                  objectFit: "contain",
                }}
                className="rounded-2xl max-w-[760px] max-h-[760px] w-full"
              />
            )}
            {data.metadata?.animation_url &&
              !data.metadata?.image && (
                <video
                  src={data.metadata.animation_url}
                  autoPlay
                  loop
                  muted
                  controls
                  className=" rounded-2xl max-w-[760px] max-h-[760px]  w-full"
                />
              )}
            {data.metadata?.image &&
              data.metadata?.animation_url && (
                <audio
                  autoPlay
                  loop
                  muted
                  controls
                  src={data.metadata.animation_url}
                  className="absolute bottom-4 mx-auto mt-4 mb-2 translate-x-1/2 right-2/4 w-[80%] "
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              )}
            <div className="w-full">
              <p
                className="block mx-auto mt-2 text-sm text-secondary5 hover:cursor-pointer hover:text-secondary3 w-fit"
                onClick={handleShowDetail}
              >
                Show detail
              </p>
            </div>
          </div>
        )}
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data && (
        <ModalDetail
          nameNFT={data.metadata.name}
          symbolNFT={data.metadata.symbol}
          category={data.metadata.category}
          attributes={data.metadata.attributes}
          description={data.metadata.description}
          uri={data.uri}
          setIsOpenDetail={setIsOpenDetail}
          isOpenDetail={isOpenDetail}
        />
      )}
      {data && account && (
        <ModalAddLiquidity
          data={data}
          account={account}
          wallet={wallet}
          isOpenAddLiquidity={isOpenAddLiquidity}
          setIsOpenLiquidity={setIsOpenAddLiquidity}
        />
      )}
      {data && account && (
        <ModalRemmoveLiquidity
          data={data}
          account={account}
          wallet={wallet}
          isOpenRemoveLiquidity={isOpenRemoveLiquidity}
          setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
        />
      )}
      <ModalTransation isOpenTransation={isOpenTransation} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      <ToastContainer />
    </div>
  );
}
