import { BackgroundDefault } from "@/components/Backgrounds";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import TopCollection from "@/components/Explorer/TopNft/TopCollection";
import ListTracsaction from "@/components/Explorer/Transaction/ListTracsaction";
import SEOHead from "@/components/SEOHead";


export default function ExplorerPage() {
  return (
    <BackgroundDefault>
      <SEOHead
        title="Explorer"
      />
      <section className="max-w-screen-xl px-4 mx-auto lg:px-8">
        <h1 className="title_page">DEMASK INFO & ANALYTICS</h1>

        {/* <StatisticAnalytics /> */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          <ChartTVL />
          <ChartVolumn />
        </div>

        {/* Top or Trending */}
        <TopCollection />
        {/* Transaction */}
        <ListTracsaction />
      </section>
    </BackgroundDefault>
  );
}
