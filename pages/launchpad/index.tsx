import Launchpad from "@/components/LaunchPad";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { LaunchpadStatus } from "@/enums/launchpad-status";
import { queryClient } from "@/libs/constants";
export default function LaunchPad({ initialData }: any) {
  const updateMeta = {
    ...SEO,
    title: "Launchpad",
  };

  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />

      <div className="">
        <Launchpad initialData={initialData} />
      </div>
    </section>
  );
}

export async function getServerSideProps() {
  const chainId = "10143";

  // await Promise.all([
  //   queryClient.prefetchQuery({
  //     queryKey: ["LaunchpadList", chainId, LaunchpadStatus.Live],
  //     queryFn: () => LaunchpadService.LaunchpadList(chainId, LaunchpadStatus.Live, 1, 20),
  //   }),
  //   queryClient.prefetchQuery({
  //     queryKey: ["LaunchpadList", chainId, LaunchpadStatus.Ended],
  //     queryFn: () => LaunchpadService.LaunchpadList(chainId, LaunchpadStatus.Ended, 1, 20),
  //   }),
  // ]);

  const [liveData, endedData] = await Promise.all([
    LaunchpadService.LaunchpadList(chainId, LaunchpadStatus.Live, 1, 20),
    LaunchpadService.LaunchpadList(chainId, LaunchpadStatus.Ended, 1, 20),
  ]);
  const formattedLiveData = {
    pages: [liveData],
    pageParams: [1],
  };

  const formattedEndedData = {
    pages: [endedData],
    pageParams: [1],
  };
  return {
    props: {
      initialData: {
        Live: formattedLiveData,
        Ended: formattedEndedData,
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
}