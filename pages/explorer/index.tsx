import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { BackgroundDefault } from "@/components/Backgrounds";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import TopCollection from "@/components/Explorer/TopNft/TopCollection";
import ListTracsaction from "@/components/Explorer/Transaction/ListTracsaction";
import SEOHead from "@/components/SEOHead";
import { categoryAPI } from "@/libs/service/categoriesChartService";

export default function ExplorerPage({ initialData }: { initialData: any }) {

  return (
    <BackgroundDefault>
      <SEOHead title="Explorer" />
      <section className="max-w-screen-xl px-4 mx-auto lg:px-8">
        <h1 className="title_page">DEMASK INFO & ANALYTICS</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          <ChartTVL initialData={initialData.chartTvl?.chartData} />
          <ChartVolumn initialData={initialData.chartVolume?.chartData} />
        </div>

        <TopCollection initialData={initialData.topCollection} />
        <ListTracsaction initialData={initialData.transactionList} />
      </section>
    </BackgroundDefault>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  const chainId = 10143;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["chartTvl", chainId],
      queryFn: () => categoryAPI(`tvlChart?chainId=${chainId}`),
    }),
    queryClient.prefetchQuery({
      queryKey: ["chartVolume", chainId, "1D"],
      queryFn: () => categoryAPI(`volumeChart?chainId=${chainId}&interval=1D`),
    }),
    queryClient.prefetchQuery({
      queryKey: ["topCollection", chainId, "volume24h", "desc", 1],
      queryFn: () =>
        categoryAPI(
          `top-collection-list?chainId=${chainId}&sortField=volume24h&sortOrder=desc&page=1`
        ),
    }),
    queryClient.prefetchQuery({
      queryKey: ["transactionList", chainId, "blockTime", "desc", 1],
      queryFn: () =>
        categoryAPI(
          `transaction-list?chainId=${chainId}&sortField=blockTime&sortOrder=desc&page=1`
        ),
    }),
  ]);

  return {
    props: {
      initialData: {
        chartTvl: queryClient.getQueryData(["chartTvl", chainId]),
        chartVolume: queryClient.getQueryData(["chartVolume", chainId, "1D"]),
        topCollection: queryClient.getQueryData(["topCollection", chainId, "volume24h", "desc", 1]),
        transactionList: queryClient.getQueryData(["transactionList", chainId, "blockTime", "desc", 1]),
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
}

