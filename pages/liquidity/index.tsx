import { useState, useRef, useEffect, useContext } from "react";
import Button from "@/components/Buttons/Button";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import AccountContext from "@/context/AccountContext";
export default function Liquidity() {
  const { account, wallet } = useContext(AccountContext);
  const hasLiquidity = true;
  const router = useRouter();
  const handleAddLiquidity = () => {
    const nftAddress = "0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70";
    const tokenAddress = "MATIC";
    const idNFT = "4544751815";
    router.push(`/add/${nftAddress}/${tokenAddress}/${idNFT}`);
  };
  const { ref, inView } = useInView();
  const fetchDataListLiquidity= async (account:string,pageParam = 1) => {
    const data = await liquidityListAPI(account,pageParam);
    return data;
  };
  console.log(fetchDataListLiquidity(account,1));
  
  // const {
  //   data,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   isSuccess,
  //   isLoading,
  //   isFetching,
  // } = useInfiniteQuery(
  //   ["LiquidityList"],
  //   ({ pageParam = 1 }) => fetchDataListLiquidity(pageParam),
  //   {
  //     getNextPageParam: (page) =>
  //       page?.currentPage === page?.totalPage
  //         ? undefined
  //         : page?.currentPage + 1,
  //   }
  // );
  return (
    <div className="py-8 px-secondary">
      <Head>
        <title>Liquidity | DeMask</title>
      </Head>
      <div className="w-full">
        <h2 className="text-2xl text-black24">Your Liquidity</h2>
        <p className="mt-2 mb-6 text-dark">List of your liquidity positions</p>
        {hasLiquidity ? (
          <div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <Button
          type="button"
          primary
          className="h-[34px] w-[158px] text-sm mb-4"
          onClick={handleAddLiquidity}
        >
          + Add Liquidity
        </Button>
      </div>
    </div>
  );
}
