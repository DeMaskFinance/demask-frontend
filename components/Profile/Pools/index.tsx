import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { liquidityUserListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
export default function Pools() {
  const { account, chainId } = useContext(AccountContext);
  const type = "erc721";
  const { ref, inView } = useInView();
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));
  const fetchDataListLiquidity = async (
    accountUser: string,
    pageParam = 1,
    chainId: string | string[],
    type: string,
    version: string
  ) => {
    const data = await liquidityUserListAPI(
      accountUser.toLowerCase(),
      pageParam,
      type,
      chainId,
      version
    );
    return data;
  };
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["LiquidityList", account, chainId, type, version],
    queryFn: ({ pageParam = 1 }) =>
      fetchDataListLiquidity(account, pageParam, chainId, type, version),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-6 md:grid-cols-2 text-shader_600">
          <SkeletonSubCategory length={10} />
        </div>
      ) : isSuccess && data?.pages[0]?.combinedRecords.length !== 0 ? (
        <div>
          <div className="flex text-primary_300 text-sm items-center gap-x-2 mb-4">
            <div className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary_300"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary_500"></span>
            </div>
            <p>{data?.pages[0].totalRecords} Items</p>
          </div>
          {isSuccess &&
            data.pages.map((page: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 overflow-y-scroll lg:grid-cols-6 md:grid-cols-2"
              >
                {page?.combinedRecords.map((liquidity: any, index: number) => (
                  <div key={index} className="w-full mx-auto">
                    <LiquidytiesItem liquidity={liquidity} type={type} />
                  </div>
                ))}
              </div>
            ))}
          <div ref={ref} style={{ height: "1px" }}></div>
        </div>
      ) : (
        <p className="text-shader_200">No data available.</p>
      )}
    </div>
  );
}
