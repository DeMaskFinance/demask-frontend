import { ChartTVL, ChartVolumn } from "@/components/Charts";
import StatisticChart from "@/components/Overview/StatisticChart";
import TopNft from "@/components/Overview/TopNft/TopNft";
import ListTracsaction from "@/components/Overview/Transaction/ListTracsaction";
import Head from "next/head";
export default function Overview() {
  return (
    <section className="pt-8 overview max-w-screen-xl lg:px-8 mx-auto">
      <Head>
        <title>Overview | DeMask</title>
      </Head>
      <h1 className="mb-6 text-2xl font-medium">Demask Info & Analytics</h1>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-10">
        {/* Chart */}
        <ChartTVL />
        <ChartVolumn />
      </div>
      <StatisticChart />
      {/* Top or Trending */}
      <TopNft />
      {/* Transaction */}
      <ListTracsaction />
    </section>
  );
}
