import { ItemList } from "@/components/Profile/Inventory/Items";
import AccountContext from "@/context/AccountContext";
import * as collectionService from "@/libs/service/collectionService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Classify from "../Profile/Inventory/Classify";
import CollectionDetail from "./CollectionDetail";
import Filter from "./Filter";
export default function DetailCollection({ initialData }: any) {
  const { chainId } = useContext(AccountContext);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [typeERC] = useQueryParam("typeERC", withDefault(StringParam, ""));
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const collectionAddress = useRouter().query.collection as string;
  //Data ERC1155
  const fetchDataNFTs = async (
    typeERC: string,
    collectionAddress: string | string[],
    chain: string | string[],
    pageParam = 1
  ) => {
    const data = await collectionService.collectionListAllERC(
      typeERC,
      collectionAddress,
      chain,
      pageParam,
      20,
      sortOrder
    );
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["NFTsAllERC", chainId, collectionAddress, typeERC, sortOrder],
    queryFn: ({ pageParam = 1 }) =>
      fetchDataNFTs(typeERC, collectionAddress, chainId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,

    initialData: initialData?.nfts || undefined
  });


  return (
    <div className="pb-6 min-h-[94vh] mx-auto lg:mb-0 ">
      <CollectionDetail collectionAddress={collectionAddress} initialData={initialData?.collection} />
      <div className="flex">
        {isFilter && <Filter setIsFilter={setIsFilter} />}
        <div className="md:px-4 pt-4 px-3 w-full">
          <Classify
            setIsFilter={setIsFilter}
            isFilter={isFilter}
            setSearchCollection={setSearchCollection}
            setSortOrder={setSortOrder}
          />
          <ItemList
            isLoading={isLoading}
            isSuccess={isSuccess}
            isFetching={isFetching}
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        </div>
      </div>
    </div>
  );
}
