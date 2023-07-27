import { ChartTVL, ChartVolumn } from "@/components/Charts";
import { CollectionItem } from "@/components/Overview";
import { TransactionItem } from "@/components/Overview";
import TopNft from "@/components/Overview/TopNft/TopNft";
import ListTracsaction from "@/components/Overview/Transaction/ListTracsaction";
import Head from "next/head";
import React from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
export default function Overview() {
  return (
    <section className="pt-8 overview max-w-screen-xl mx-auto">
      <Head>
        <title>Overview | DeMask</title>
      </Head>
      <h1 className="mb-6 text-2xl font-medium">Demask Info & Analytics</h1>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-10">
        {/* Chart */}
        <ChartTVL />
        <ChartVolumn />
      </div>
      <div className="flex lg:flex-row md:flex-row flex-col gap-6 my-6 text-base font-medium text-dark2">
        <div className="flex">
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
      <TopNft />
      {/* Transaction */}
      <ListTracsaction />
    </section>
  );
}
