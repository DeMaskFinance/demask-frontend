import DetailERC721 from "@/components/ERC721/DetailERC721";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "@/libs/constants";
import { collectionDetail } from "@/libs/service/collectionService";
import { SEO } from "@/next-seo.config";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const updateMeta = {
  ...SEO,
  title: "Trade",
};

export default function TradeERC721({ initialData }: { initialData: any }) {
  const router = useRouter();

  const slug = router.query.slug as string[] || [];

  const collectionAddress = slug[0] || "";
  const paymentToken = slug[1] || "";

  const { chainId } = useContext(AccountContext);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => collectionDetail(collectionAddress, chainId),
    initialData: initialData?.data || initialData || undefined,
    staleTime: 60000,
  });

  return (
    <DetailERC721 isLoading={isLoading} isSuccess={isSuccess} data={data?.data || data} paymentToken={paymentToken} />
  );
}

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  const chainId = "10143";

  const collectionAddress = slug?.[0] || '';

  await queryClient.prefetchQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => collectionDetail(collectionAddress, chainId),
  });

  return {
    props: {
      initialData: queryClient.getQueryData(["detailCollection", chainId, collectionAddress]) || null,
      dehydratedState: dehydrate(queryClient),
    },
  };
}
