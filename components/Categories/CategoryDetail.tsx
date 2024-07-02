import AccountContext from "@/context/AccountContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SkeletonSubCategory } from "../Skeleton/SkeletonCategory";
import NFTCategory from "./NFTCategory";
import SearchNotFound from "../Search/SearchNotFound";
import { collectionTypeCategory } from "@/libs/service/collectionService";

const CategoryDetail = ({ label }: { label: string }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();
  const fetchDetailCollection = async (
    label: string,
    chain: string | string[],
    pageParam: number
  ) => {
    const data = await collectionTypeCategory(label, chain, pageParam, 20);
    return data;
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
    ["CollectionTypeDetail", chainId, label],
    ({ pageParam = 1 }) => fetchDetailCollection(label, chainId, pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  console.log(data, inView);

  return (
    <div>
      {isLoading ? (
        <div className="grid gap-4 mt-4 grid-cols-autoFill text-shader_600">
          <SkeletonSubCategory length={4} />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <Fragment>
          <div className="flex items-center my-4 text-sm text-primary_300 gap-x-2">
            <div className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary_300"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary_500"></span>
            </div>
            <p>{data?.pages[0].totalRecords} Collections</p>
          </div>
          <div className="grid gap-4 pb-4 text-white grid-cols-autoFill">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden border rounded-lg border-shader_500 hover:border-shader_400"
                  >
                    <NFTCategory item={item} />
                  </div>
                ))}
              </Fragment>
            ))}
            {isFetching && hasNextPage && <SkeletonSubCategory length={4} />}
          </div>
          <div ref={ref} style={{ height: "1px" }}></div>
        </Fragment>
      ) : (
        <div className="h-[300px]">
          <SearchNotFound />
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
