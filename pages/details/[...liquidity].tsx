import { Button } from "@/components/Buttons";
import { BackIcon } from "@/components/Icons";
import LiquiditiesHistory from "@/components/Liquidity/LiquidityHistory";
import { ModalAddLiquidity } from "@/components/Modal/ModalAddLiquidity";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useInformationDML from "@/hooks/useInformationDML";
import { liquidityHistory } from "@/libs/service/liquidityService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import getRewardDML from "@/libs/utils/getReward";
import viewReward from "@/libs/utils/viewReward";
import images from "@/public/images";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (liquidity) {
      setDmlTokenLiquidity(liquidity[0]);
    }
  }, [liquidity]);
  const { decimals } = useInformationDML(dmlTokenLiquidity);
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity) {
        const result = await viewReward(dmlTokenLiquidity, account);
        const rewardDec = divideByDecimal(result.toString(), decimals);
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
      getRewardDML({ wallet, dmlTokenLiquidity });
    } else {
      console.log("No account and DML");
    }
  };

  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["LiquidityHistory"],
    queryFn: async () => {
      const res = await liquidityHistory(
        "0x28c6fc863b28c795975fce54cf1f1a1771b5ef2b",
        "0xd7e292b1fe46b0647b94b0b30a6af1e7fac061c0",
        page
      );
      return res;
    },

    keepPreviousData: true,
  });

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

  return (
    <div className="py-8">
      <Head>
        <title>Detail Liquidity | DeMask</title>
      </Head>
      <div className="flex justify-between ">
        <div className="flex items-center mb-6">
          <Link href="/liquidity">
            <BackIcon width={24} height={24} />
          </Link>
          <div className="text-2xl text-dark1 font-medium ml-[18px] flex items-center">
            <span>NFT</span>
            <span className="block overflow-hidden leading-[18px]">/</span>
            <span>USDT</span>
          </div>
        </div>
        <div className="flex justify-end mb-8 gap-x-4">
          <button className={style.btnWallet} onClick={handleAddLiquidity}>
            ADD
          </button>
          <button className={style.btnWallet}>REMOVE</button>
        </div>
      </div>
      <div className="flex gap-x-20">
        <div className="grow">
          <div className="h-full ">
            <div className="flex justify-between font-medium w-[500px]">
              <div>
                <p className="text-dark1">Liquidity</p>
                <p className="text-xl text-secondary3">
                  {formatNumber(balanceOfDML)}
                </p>
              </div>
              <div>
                <p className="text-dark1">Reward</p>
                <p className="text-xl text-secondary3">
                  ${formatNumber(reward)}
                </p>
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
            <h3 className="mt-5 mb-4 text-lg font-medium text-dark1">
              History
            </h3>
            {account && data ? (
              <div>
                <div className="grid gap-4 grid-cols-[80px,repeat(3,2fr),4fr] text-dark1 font-medium mb-2">
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
                <div className="flex justify-center gap-5 py-8 text-sm text-dark2 ">
                  <button
                    onClick={prevPage}
                    disabled={isPreviousData || page === 1 || isFetching}
                    className={`${
                      isPreviousData || page === 1 || isFetching
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
                    className={`${
                      isPreviousData || page === data?.totalPages || isFetching
                        ? "text-white bg-slate-300"
                        : "hover:text-white hover:bg-secondary2 transition-all"
                    } w-6 h-6 flex items-center text-center justify-center rounded-full transition-all`}
                  >
                    <MdOutlineNavigateNext />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <BsClock className="w-5 h-5" />
                <p className="text-sm font-medium text-dark1">
                  No events in this time range
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="justify-end w-[504px]">
          <Image
            src={images.testImg}
            alt="test"
            className=" rounded-xl"
            width={504}
            height={504}
          />
        </div>
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* <ModalDetail
        nameNFT={nameNFT}
        symbolNFT={symbolNFT}
        category={category}
        attributes={attributes}
        description={description}
        setIsOpenDetail={setIsOpenDetail}
        isOpenDetail={isOpenDetail}
      /> */}
      {data && (
        <ModalAddLiquidity
          data={data}
          account={account}
          wallet={wallet}
          isOpenAddLiquidity={isOpenAddLiquidity}
          setIsOpenLiquidity={setIsOpenAddLiquidity}
        />
      )}
      <ToastContainer />
    </div>
  );
}
