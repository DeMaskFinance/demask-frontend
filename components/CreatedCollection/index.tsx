import { ItemList } from "@/components/Profile/Inventory/Items";
import AccountContext from "@/context/AccountContext";
import * as collectionService from "@/libs/service/collectionService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Classify from "../Profile/Inventory/Classify";
import CollectionDetail from "./CollectionDetail";
export default function DetailCollection() {
  const { chainId } = useContext(AccountContext);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [typeERC] = useQueryParam("typeERC", withDefault(StringParam, ""));
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
      20
    );
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["NFTsAllERC", chainId, collectionAddress, typeERC],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(typeERC, collectionAddress, chainId, pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );

  return (
    <div className="pb-6 min-h-[94vh] mx-auto lg:mb-0 ">
      <CollectionDetail collectionAddress={collectionAddress} />
      <div className="md:px-4 pt-4 px-3">
        <Classify
          setIsFilter={setIsFilter}
          isFilter={isFilter}
          setSearchCollection={setSearchCollection}
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
  );
}
