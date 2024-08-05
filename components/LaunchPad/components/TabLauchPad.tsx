import AccountContext from "@/context/AccountContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TabLaunchPadItem from "./TabLaunchPadItem";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import SearchNotFound from "@/components/Search/SearchNotFound";
import { LaunchpadStatus } from "@/enums/launchpad-status";

type TabLaunchPadProps = {
  query: LaunchpadStatus;
};
const TabLaunchPad: React.FC<TabLaunchPadProps> = ({ query }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["LaunchpadList", chainId, query],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      LaunchpadService.LaunchpadList(chainId, query, pageParam),
    getNextPageParam: (page) =>
      page?.currentPage === page?.totalPages
        ? undefined
        : page?.currentPage + 1,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="mb-8 px-3 lg:px-10">
      {isLoading ? (
        <div className="grid gap-4 mt-8 grid-cols-2 md:grid-cols-autoFill text-shader_600">
          <SkeletonSubCategory length={24} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            {isSuccess && data?.pages[0]?.data?.data.length > 0 ? (
              data.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  <ul className="grid grid-cols-1 md:grid-cols-autoFillLaunchpad gap-6 text-shader_600">
                    {page?.data?.data?.map(
                      (item: LaunchpadData, itemIndex: number) => (
                        <TabLaunchPadItem key={itemIndex} item={item} />
                      )
                    )}
                  </ul>
                </Fragment>
              ))
            ) : (
              <SearchNotFound />
            )}
          </div>
          <div ref={ref} style={{ height: "1px" }}></div>
        </>
      )}
    </div>
  );
};

export default TabLaunchPad;
