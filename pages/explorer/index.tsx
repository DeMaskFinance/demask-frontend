import { BackgroundDefault } from "@/components/Backgrounds";
import { ChartTVL, ChartVolumn } from "@/components/Charts";
import TopCollection from "@/components/Explorer/TopNft/TopCollection";
import ListTracsaction from "@/components/Explorer/Transaction/ListTracsaction";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import {
  useConnect,
  useAccount,
  useBalance,
  useDisconnect,
} from "@starknet-react/core";
const updateMeta = {
  ...SEO,
  title: "Explorer",
};
export default function ExplorerPage() {
  // const { connect, connectors } = useConnect();
  // console.log(connectors);
  // const { address } = useAccount();
  // const { isLoading, isError, error, data } = useBalance({
  //   address:
  //     "0x7bdfe5ccdae97ec118aa02953570c16243e972cef09557698e15278a34b1c87",
  //   watch: true,
  // });
  // const { disconnect } = useDisconnect();

  // if (isLoading) return <div>Loading ...</div>;
  // if (isError || !data) return <div>{error?.message}</div>;
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl px-4 mx-auto lg:px-8">
        <h1 className="title_page">DEMASK INFO & ANALYTICS</h1>
        {/* <ul className="text-white">
          {connectors.map((connector) => (
            <li key={connector.id}>
              <button onClick={() => connect({ connector })}>
                {connector.name}
              </button>
            </li>
          ))}
        </ul>
        {data && (
          <div>
            {data.value.toString()}
            {data.symbol}
          </div>
        )} */}
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
