import DetailERC721 from "@/components/ERC721/DetailERC721";
import AccountContext from "@/context/AccountContext";
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
  const collectionAddress = (router.query.erc as string) || "";

  const { chainId } = useContext(AccountContext);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => collectionDetail(collectionAddress, chainId),
    initialData,
    staleTime: 60000,
  });


  return (
    <DetailERC721 isLoading={isLoading} isSuccess={isSuccess} data={data?.data} />
  );
}

export async function getServerSideProps(context: any) {
  const { erc } = context.params;
  const queryClient = new QueryClient();
  const chainId = "10143";

  await queryClient.prefetchQuery({
    queryKey: ["detailCollection", chainId, erc],
    queryFn: async () => collectionDetail(erc, chainId),
  });

  return {
    props: {
      initialData: queryClient.getQueryData(["detailCollection", chainId, erc]),
      dehydratedState: dehydrate(queryClient),
    },
  };
}
