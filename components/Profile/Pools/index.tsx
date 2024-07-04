import { LiquiditiesItem } from "@/components/Liquidity";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import { SkeletonTable } from "@/components/Skeleton";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";
export default function Pools() {
  const { account, chainId } = useContext(AccountContext);
  const type = "erc1155";
  const fetchDataListLiquidity = async (
    accountUser: string,
    pageParam = 1,
    chainId: string | string[],
    type: string
  ) => {
    const data = await liquidityListAPI(
      accountUser.toLowerCase(),
      pageParam,
      type,
      chainId
    );
    return data;
  };
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    ["LiquidityList", account, chainId, type],
    ({ pageParam = 1 }) =>
      fetchDataListLiquidity(account, pageParam, chainId, type),
    {
      getNextPageParam: (page: any) =>
        page?.currentPage < page?.totalPages
          ? page?.currentPage + 1
          : undefined,
    }
  );

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
        </div>
      ) : (
        <div>
          <p>No data available.</p>
        </div>
      )}
    </div>
  );
}
