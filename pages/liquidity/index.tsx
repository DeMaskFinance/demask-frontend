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
import { BiLoaderAlt } from "react-icons/bi";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
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
  const fetchDataListLiquidity = async (accountUser: string, pageParam = 1) => {
    console.log(account, pageParam);
    const data = await liquidityListAPI(accountUser.toLowerCase(), pageParam);
    return data;
  };
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    ["LiquidityList", account],
    ({ pageParam = 1 }) => fetchDataListLiquidity(account, pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage < page?.totalPages
          ? page?.currentPage + 1
          : undefined,
    }
  );
  console.log(data?.pages[0]);
  console.log(hasNextPage);
  
  return (
    <div className="py-8 px-secondary min-h-[calc(100vh-300px)]">
      <Head>
        <title>Liquidity | DeMask</title>
      </Head>
      <div className="w-full">
        <h2 className="text-2xl text-black24">Your Liquidity</h2>
        <p className="mt-2 mb-6 text-dark">List of your liquidity positions</p>
        {(!account || data?.pages[0].combinedRecords.length === 0 && !isLoading) && (
          <div className="w-full py-8 mb-6 font-medium text-center rounded-lg bg-dark4 text-secondary4">
            No liquidity found.
          </div>
        )}
        {account && data?.pages[0].combinedRecords.length === 0 && (
          <div className="w-full py-8 mb-6 font-medium text-center rounded-lg bg-dark4 text-secondary4">
            No liquidity found.
          </div>
        )}
        {account && data?.pages[0].combinedRecords.length !== 0 && (
          <div>
            <div>
              {isSuccess &&
                data.pages.map((page: any, index: number) => (
                  <div key={index}>
                    {page.combinedRecords.map(
                      (liquidity: any, index: number) => (
                        <div key={index}>
                          <LiquidytiesItem liquidity={liquidity} />
                        </div>
                      )
                    )}
                    {hasNextPage && (
                      <p
                        onClick={() => fetchNextPage()}
                        className="mb-6 -mt-4 text-sm cursor-pointer text-secondary4"
                      >
                        See more
                      </p>
                    )}
                  </div>
                ))}
            </div>
            {(isFetchingNextPage) && (
              <div>
                <BiLoaderAlt className="mb-6 text-3xl animate-spin text-secondary5" />
              </div>
            )}
          </div>)
        }
        {
          isLoading && account && (
            <div>
              <BiLoaderAlt className="mb-6 text-3xl animate-spin text-secondary5" />
            </div>
          )
        }
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
