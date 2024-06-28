import { TabGroups } from "@/components/NavChoice";
import TopNft from "@/components/Collections/TopNft/TopNft";
import React, { useState } from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import ListTracsaction from "@/components/Collections/Transaction/ListTracsaction";
import { BackgroundDefault } from "@/components/Backgrounds";
import StatisticAnalytics from "@/components/Collections/StaticChart";
const updateMeta = {
  ...SEO,
  title: "Collections",
};
export default function Collections() {
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl px-4 mx-auto lg:px-8">
        <h1 className="text-base md:text-2xl font-bold text-primary_100 py-4 md:py-10 text-center">
          DEMASK INFO & ANALYTICS
        </h1>
        <StatisticAnalytics />
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
