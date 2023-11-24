import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { Fragment, useContext, useEffect, useState } from "react";
import ActiveLaunchItem from "./TabLaunchPadItem";
import { useInView } from "react-intersection-observer";
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import AccountContext from "@/context/AccountContext";

type TabLaunchPadProps = {
  query: string;
  desc: string;
};
const TabLaunchPad: React.FC<TabLaunchPadProps> = ({ query, desc }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();
  const [choice] = useQueryParam('choice', withDefault(StringParam, 'Active'));
  
  const fetchDataPage = async (pageParam = 1, chainId: string | string[], choice: string) => {
    const data = await categoryAPI(`launchpad?chainId=${chainId}&status=${choice}&page=${pageParam}&limit=8`);
    return data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery(
    ["Homepage", chainId, choice],
    ({ pageParam = 1 }) => fetchDataPage(pageParam, chainId, choice),
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
                          <ActiveLaunchItem item={item} query={query} />
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                ))
              ) : (
                <p>{desc}</p>
              )}
            </div>
            <div ref={ref} style={{ height: "1px" }} ></div>
          </>
        )}
      </div>
    </>
  );
};

export default TabLaunchPad;
