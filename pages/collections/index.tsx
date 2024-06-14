import { TabGroups } from "@/components/NavChoice";
import TopNft from "@/components/Collections/TopNft/TopNft";
import React, { useState } from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import ListTracsaction from "@/components/Collections/Transaction/ListTracsaction";
import StatisticChart from "@/components/Collections/StaticChart";
import { BackgroundDefault } from "@/components/Backgrounds";
const updateMeta = {
  ...SEO,
  title: "Collections",
};
export default function Collections() {
  const [activeChoice, setActiveChoice] = useState<string>("TVL");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl px-4 pt-10 mx-auto lg:px-8">
        <h1 className="text-2xl font-bold text-primary_100 mb-10 text-center">
          DEMASK INFO & ANALYTICS
        </h1>
        <StatisticChart />
        <div className="lg:hidden">
          <div className="pt-3 rounded-lg shadow-chart">
            <div className="mb-4 ml-2">
              <TabGroups
                choices={["TVL", "VOLUMN"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
                isOverview
              />
            </div>
            {/* Charts Mobile/Tablet */}
            {activeChoice === "TVL" ? <ChartTVL /> : <ChartVolumn />}
          </div>
        </div>
        {/* Charts PC */}
        <div className="hidden lg:grid grid-cols-1 gap-10 lg:grid-cols-2 md:grid-cols-2 h-[372px]">
          <ChartTVL />
          <ChartVolumn />
        </div>

        {/* Top or Trending */}
        <TopNft />
        {/* Transaction */}
        <ListTracsaction />
      </section>
    </BackgroundDefault>
  );
}
