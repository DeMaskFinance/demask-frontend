import TabLaunchPadItem from "@/components/LaunchPad/components/TabLaunchPadItem";
import { SkeletonCategory } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
export default function CardLaunchpad() {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);
  const { ref, inView } = useInView();
  
  const fetchDataPage = async (pageParam = 1, chainId: string | string[]) => {
    const data = await categoryAPI(`userLaunchpad?userAddress=${account}&chainId=${chainId}&page=${pageParam}&limit=8?status=all`);
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
    refetch
  } = useInfiniteQuery(
    ["LaunchpadTab", chainId],
    ({ pageParam = 1 }) => fetchDataPage(pageParam, chainId),
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
  console.log(data);
  
  return (
    <>
      <div className="mb-8 containe">
        {(isLoading) ? (
          <div className="mt-8">
            <SkeletonCategory />
          </div>
        ) : (
          <>
            <div className="mt-4">
              {isSuccess && data?.pages[0]?.data.length > 0 ? (
                data.pages.map((page, pageIndex) => (
                  <Fragment key={pageIndex}>
                    <ul className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2">
                      {page?.data?.map((item: any, itemIndex: number) => (
                        <li
                          title={item?.metadata?.name}
                          key={itemIndex}
                          className="items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home "
                        >
                          <TabLaunchPadItem item={item} query={item.status} />
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                ))
              ) : (
                <p>No data</p>
              )}
            </div>
            <div ref={ref} style={{ height: "1px" }} ></div>
          </>
        )}
      </div>
    </>
  );
}
