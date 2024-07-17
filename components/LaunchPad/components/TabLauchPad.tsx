import SearchNotFound from "@/components/Search/SearchNotFound";
import {
  SkeletonCategory,
  SkeletonSubCategory,
} from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TabLaunchPadItem from "./TabLaunchPadItem";

type TabLaunchPadProps = {
  query: string;
};
const TabLaunchPad: React.FC<TabLaunchPadProps> = ({ query }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();

  const fetchDataPage = async (
    pageParam = 1,
    chainId: string | string[],
    query: string
  ) => {
    const data = await categoryAPI(
      `launchpad?chainId=${chainId}&status=${query}&page=${pageParam}&limit=20`
    );
    return data;
  };

  const { data, fetchNextPage, isSuccess, isLoading } = useInfiniteQuery(
    ["LaunchpadTab", chainId, query],
    ({ pageParam = 1 }) => fetchDataPage(pageParam, chainId, query),
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
  const item = {
    // launchpad: "123",

    blockNumber: 123,
    blockTime: 123,
    blockTimestamp: "123",
    endTime: "123",
    hardcap: "123",
    id: "678",
    launchpad: "string",
    nftAddress: "123",
    nftID: "789",
    price: "9.2",
    purchaseLimit: "89",
    softcap: "12",
    startTime: "1212",
    tge: "122",
    tokenDecimals: "18",
    tokenName: "9HN",
    tokenPayment: "122",
    tokenSymbol: "122",
    transactionHash: "23",
    vesting: "92",
    metadata: {
      name: "abc",
      image:
        "https://i.seadn.io/s/raw/files/a9948c4c063b12bbf2db92888ed41bd1.png?auto=format&dpr=1&w=136&h=136&fr=1",
    },
    reserveTokenDecimals: "18",
    // reserveToken: string;
    // reserveNFT: string;
    // royaltyFee: number;
    // amount: string;
    // totalSold: string;
    // isSuccess: boolean;
    // isClaim: boolean;
    // status: string;
    // launchpadInfo: LaunchpadInfo;
  };
  return (
    <div className="mb-8 px-3 lg:px-10">
      {isLoading ? (
        <div className="grid gap-4 mt-8 grid-cols-2 md:grid-cols-autoFill text-shader_600">
          <SkeletonSubCategory length={24} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            {/* {isSuccess && data?.pages[0]?.data.length > 0 ? (
              data.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  <ul className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-shader_600">
                    {page?.data?.map(
                      (item: LaunchpadData, itemIndex: number) => (
                        <li
                          title={item?.metadata?.name}
                          key={itemIndex}
                          className="items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:shadow-home "
                        >
                          <ActiveLaunchItem item={item} query={query} />
                        </li>
                      )
                    )}
                  </ul>
                </Fragment>
              ))
            ) : (
              <SearchNotFound />
            )} */}
            <ul className="grid grid-cols-1 md:grid-cols-autoFillLaunchpad gap-6 text-shader_600">
              <TabLaunchPadItem item={item} query={query} />
              <TabLaunchPadItem item={item} query={query} />
              <TabLaunchPadItem item={item} query={query} />
              <TabLaunchPadItem item={item} query={query} />
              <TabLaunchPadItem item={item} query={query} />
              <TabLaunchPadItem item={item} query={query} />
            </ul>
          </div>
          <div ref={ref} style={{ height: "1px" }}></div>
        </>
      )}
    </div>
  );
};

export default TabLaunchPad;
