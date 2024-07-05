import { TabGroups } from "@/components/NavChoice";
import TopNft from "@/components/Explore/TopNft/TopNft";
import React, { useState } from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import ListTracsaction from "@/components/Explore/Transaction/ListTracsaction";
import { BackgroundDefault } from "@/components/Backgrounds";
import StatisticAnalytics from "@/components/Explore/StaticChart";
const updateMeta = {
  ...SEO,
  title: "Explore",
};
export default function ExplorePage() {
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl px-4 mx-auto lg:px-8">
        <h1 className="title_page">DEMASK INFO & ANALYTICS</h1>
        {/* <StatisticAnalytics /> */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
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
