import DetailLaunchPad from "@/components/LaunchPad/components/DetailLaunchPad";

import React from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { queryClient } from "@/libs/constants";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { dehydrate } from "@tanstack/react-query";
export default function LauchPad({ initialData }: any) {
  const updateMeta = {
    ...SEO,
    title: "Detail Launchpad",
  };
  return (
    <section className="">
      <NextSeo {...updateMeta} />
      <DetailLaunchPad initialData={initialData} />
    </section>
  );
}

export async function getServerSideProps(context: any) {
  const { detail } = context.query;
  const chainId = "10143";

  if (!detail || detail.length === 0) {
    return {
      notFound: true,
    };
  }

  const launchpadAddress = detail[0];

  await queryClient.prefetchQuery({
    queryKey: ["launchPad", launchpadAddress, chainId],
    queryFn: async () =>
      LaunchpadService.LaunchPadInfor(launchpadAddress.toLowerCase(), chainId),
  });

  return {
    props: {
      initialData: queryClient.getQueryData(["launchPad", launchpadAddress, chainId]),
      dehydratedState: dehydrate(queryClient),
    },
  };
}