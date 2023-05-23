import ChartTVL from "@/components/ChartTVL";
import ChartVolumn from "@/components/ChartVolume";
import CollectionItem from "@/components/CollectionItem";
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
      <h1 className="mb-6 text-2xl font-normal">Demask Info & Analytics</h1>
      <div className="grid grid-cols-2 gap-10">
        {/* Chart */}
        <ChartTVL />
        <ChartVolumn />
      </div>
      <div className="flex gap-6 my-6 text-lg">
        <div className="flex">
          <span className="text-dark">Volume 24H: $8.45M </span>(
          <span className="flex items-center text-red">
            <BsArrowDown />
            89.95%
          </span>
          )
        </div>
        <div className="flex">
          <span className="text-dark">Fees 24H: $41.25K </span>(
          <span className="flex items-center text-red">
            <BsArrowDown />
            19.81%
          </span>
          )
        </div>
        <div className="flex">
          <span className="text-dark">TVL: $275.74M </span>(
          <span className="flex items-center text-green">
            <BsArrowUp />
            1.35%
          </span>
          )
        </div>
      </div>
      {/* Top or Trending */}
      <div className="collectionList">
        <div className="flex gap-4 text-xl text-dark2 w-[184px] border border-dark rounded-t-lg border-b-0">
          <h3 className="pl-6 cursor-pointer text-base2">Top</h3>
          <h3 className="pr-6 cursor-pointer">Trending</h3>
        </div>
        <table className="w-full border rounded-b-lg rounded-tr-lg border-dark">
          <thead className="flex w-full px-8 pt-4 font-semibold text-black24">
            <tr className="flex w-full text-left">
              <th className="flex basis-3/12 gap-x-6">
                <p>#</p>
                <p>Name</p>
              </th>
              <th className="basis-2/12">Price</th>
              <th className="basis-2/12">Change</th>
              <th className="basis-2/12">Volume</th>
              <th className="basis-2/12">TVL</th>
              <th className="basis-1/12">Total supply</th>
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
    </section>
  );
}
