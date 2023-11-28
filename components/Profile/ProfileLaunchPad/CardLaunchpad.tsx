import CountdownTime from "@/components/Common/CountdownTime";
import MediaNFT from "@/components/Common/MediaNFT";
import TabLaunchPadItem from "@/components/LaunchPad/components/TabLaunchPadItem";
import ModalLaunchPadProfile from "@/components/Modal/ModalLaunchpadProfile";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { convertTime } from "@/hooks/useConvertTime";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import handleLeaveLaunchPad from "@/libs/utils/handleLeaveLaunchpad";
import handleReleaseLaunchPad from "@/libs/utils/handleReleaseLaunchPad";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoReloadOutline } from "react-icons/io5";
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
  console.log(data);
  
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
