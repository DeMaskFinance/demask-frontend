import { ChartTVL, ChartVolumn } from "@/components/Charts";
import { TabGroups } from "@/components/NavChoice";
import StatisticChart from "@/components/Overview/StatisticChart";
import TopNft from "@/components/Overview/TopNft/TopNft";
import ListTracsaction from "@/components/Overview/Transaction/ListTracsaction";
import Head from "next/head";
import React, { useState } from "react";
export default function Overview() {
  const [activeChoice, setActiveChoice] = useState<string>("TVL");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <>
      <Head>
        <title>Overview | DeMask</title>
      </Head>
      <section className="max-w-screen-xl pt-8 mx-auto lg:px-8">
        <h1 className="mb-6 text-2xl font-medium">Demask Info & Analytics</h1>
        <TabGroups choices={["TVL", "VOLUMN"]}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
          isOverview />
        {/* Charts Mobile/Tablet */}
        <div className="mt-3 lg:hidden">
          {activeChoice === 'TVL' ? (
            <ChartTVL />
          ) : (
            <ChartVolumn />

          )}
        </div>
        {/* Charts PC */}
        <div className="hidden lg:grid grid-cols-1 gap-10 lg:grid-cols-2 md:grid-cols-2 h-[372px]">
          <ChartTVL />
          <ChartVolumn />
        </div>
        <StatisticChart />
        {/* Top or Trending */}
        <TopNft />
        {/* Transaction */}
        <ListTracsaction />
      </section>
    </>
  );
}
