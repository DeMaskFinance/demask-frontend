import { ChartTVL, ChartVolumn } from "@/components/Charts";
import { CollectionItem } from "@/components/Overview";
import { TransactionItem } from "@/components/Overview";
import Head from "next/head";
import React from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
export default function Overview() {
  return (
    <section className="overview px-[164px] pt-8">
      <Head>
        <title>Overview | DeMask</title>
      </Head>
      <h1 className="mb-6 text-2xl font-medium">Demask Info & Analytics</h1>
      <div className="grid grid-cols-2 gap-10">
        {/* Chart */}
        <ChartTVL />
        <ChartVolumn />
      </div>
      <div className="flex gap-6 my-6 text-lg font-medium text-dark2">
        <div className="flex ">
          <span className="mr-2 ">Volume 24H: $8.45M </span> (
          <span className="flex items-center text-red">
            <BsArrowDown />
            89.95%
          </span>
          )
        </div>
        <div className="flex ">
          <span className="mr-2 ">Fees 24H: $41.25K </span>(
          <span className="flex items-center text-red">
            <BsArrowDown />
            19.81%
          </span>
          )
        </div>
        <div className="flex">
          <span className="mr-2 ">TVL: $275.74M </span>(
          <span className="flex items-center text-green">
            <BsArrowUp />
            1.35%
          </span>
          )
        </div>
      </div>
      {/* Top or Trending */}
      <div className="collectionList">
        <div className="flex text-xl text-white w-[184px] h-[42px] items-center text-center">
          <div className="flex items-center justify-center border rounded-tl-lg bg-secondary1 border-secondary1 w-[68px] h-full cursor-pointer">
            <span>TOP</span>
          </div>
          <div className="flex items-center justify-center h-full rounded-tr-lg cursor-pointer grow bg-dark3">
            <span>TRENDING</span>
          </div>
        </div>
        <table className="flex flex-col w-full pb-4 border border-collapse rounded-b-lg rounded-tr-lg border-dark3 border-spacing-0">
          <thead className="flex w-full px-8 pt-4 font-semibold text-black24">
            <tr className="flex w-full text-left">
              <th className="flex flex-1 gap-x-6">
                <p>#</p>
                <p>Name</p>
              </th>
              <th className="w-[248px]">Price</th>
              <th className="w-[280px]">Change</th>
              <th className="w-[277px]">Volume</th>
              <th className="w-[277px]">TVL</th>
              <th className="w-[116px]">Total supply</th>
            </tr>
          </thead>
          {/* Collection */}
          <tbody>
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
            <CollectionItem />
          </tbody>
        </table>
        <div className="flex justify-center my-[27px]">
          <button className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-dark2 text-dark">
            <HiArrowLeft />
          </button>
          <div className="mx-[10px]">Page 1 of 5</div>
          <button className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-secondary3 text-secondary1">
            <HiArrowRight />
          </button>
        </div>
      </div>
      {/* Transaction */}
      <div className="transactionList">
        <div className="flex gap-4 text-xl text-dark2 w-[164px] border bg-secondary1 border-dark3 rounded-t-lg border-b-0">
          <h3 className="w-full text-center text-white cursor-pointer h-[42px] leading-[42px]">
            TRANSACTION
          </h3>
        </div>
        <table className="flex flex-col w-full pb-4 border border-collapse rounded-b-lg rounded-tr-lg border-dark3 border-spacing-0">
          <thead className="flex w-full font-semibold text-black24">
            <tr className="flex w-full px-8 pt-4 text-left">
              <th className="flex flex-1 gap-x-6">
                <p>#</p>
                <p>Action</p>
              </th>
              <th className="w-[296px]">NFT amount</th>
              <th className="w-[316px]">Token amount</th>
              <th className="w-[296px]">Account</th>
              <th className="w-[125px]">Time</th>
            </tr>
          </thead>
          {/* Transaction Item */}
          <tbody>
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
          </tbody>
        </table>
        <div className="flex justify-center my-[27px]">
          <button className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-dark2 text-dark">
            <HiArrowLeft />
          </button>
          <div className="mx-[10px]">Page 1 of 5</div>
          <button className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-secondary3 text-secondary1">
            <HiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
