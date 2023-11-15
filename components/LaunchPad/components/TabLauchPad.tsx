import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import ActiveLaunchItem from "./TabLaunchPadItem";
import { useInView } from "react-intersection-observer";
import AccountContext from "@/context/AccountContext";

type TabLaunchPadProps = {
  query: string;
  desc: string;
};
const TabLaunchPad: React.FC<TabLaunchPadProps> = ({ query, desc }) => {
  const { chainId } = useContext(AccountContext);
  // const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
  //   queryKey: ["launchpadActive", query],
  //   queryFn: async () => {
  //     const res = await categoryAPI("launchpad?chainId=280&page=1&limit=50");
  //     return res;
  //   },
  // });
  const { ref, inView } = useInView();
  const fetchDataPage = async (pageParam = 1, chainId: string | string[]) => {
    const data = await categoryAPI(`launchpad?chainId=${chainId}&page=${pageParam}`);
    return data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["Homepage", chainId],
    ({ pageParam = 1 }) => fetchDataPage(pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPage
          ? undefined
          : page?.currentPage + 1,
    }
  );
    console.log(data);
    
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  let upcomingLength = 0;
  let activeLength = 0;
  let endedLength = 0;

  if (data && data.pages[0].launchpadLists) {
    data.pages[0].launchpadLists.forEach((item?: any) => {
      if (item.status === "Upcoming") {
        upcomingLength++;
      } else if (item.status === "Active") {
        activeLength++;
      } else if (item.status === "Ended") {
        endedLength++;
      }
    });
  }

  return (
    <>
      <div className="mb-8 containe">
        {isLoading || isFetchingNextPage || isFetching ? (
          <div className="mt-8">
            <SkeletonCategory />
          </div>
        ) : (
          <>
            <div className="mt-8">
              {upcomingLength === 0 && query === "Upcoming" && <p>{desc}</p>}
              {activeLength === 0 && query === "Active" && <p>{desc}</p>}
              {endedLength === 0 && query === "Ended" && <p>{desc}</p>}
            </div>

            <ul className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2">
              {data &&
                data?.pages[0].launchpadLists?.map((item: any, idx: number) => (
                  <>
                    {item.status === query && (
                      <>
                        <li
                          title={item?.metadata?.name}
                          className="items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home "
                        >
                          <ActiveLaunchItem item={item} query={query} />
                        </li>
                      </>
                    )}
                  </>
                ))}
            </ul>
            
            <div ref={ref} style={{ height: "1px" }} >123</div>
          </>
        )}
      </div>
    </>
  );
};

export default TabLaunchPad;
