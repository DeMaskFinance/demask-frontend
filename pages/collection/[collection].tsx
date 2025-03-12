import DetailCollection from "@/components/Collection";
import SEOHead from "@/components/SEOHead";
import { queryClient } from "@/libs/constants";
import * as collectionService from "@/libs/service/collectionService";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { dehydrate } from "@tanstack/react-query";


const Collections = ({ initialData }: any) => {

  return (
    <div>
      <SEOHead title={initialData?.collection?.name}
        description={initialData?.collection?.description}
        image={formatLinkIPFS(initialData?.collection?.avatar)}
      />

      <DetailCollection initialData={initialData} />
    </div>
  );
};

export default Collections;

export async function getServerSideProps(context: any) {
  const chainId = "10143";
  const collectionAddress = context.query.collection || "";
  const typeERC = context.query.typeERC || "erc721";
  const sortOrder = context.query.sortOrder || "desc";

  if (!collectionAddress) {
    return { notFound: true };
  }
  const firstPageData = await collectionService.collectionListAllERC(
    typeERC,
    collectionAddress,
    chainId,
    1,
    20,
    sortOrder
  );

  await queryClient.prefetchQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () =>
      collectionService
        .collectionDetail(collectionAddress, chainId)
        .then((res: any) => res.data),
  });
  return {
    props: {
      initialData: {
        nfts: {
          pages: [firstPageData?.data],
          pageParams: [1],
        },
        collection: queryClient.getQueryData([
          "detailCollection",
          chainId,
          collectionAddress,
        ])
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
}