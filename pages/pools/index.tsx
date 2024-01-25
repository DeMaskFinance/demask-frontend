import Button from "@/components/Buttons/Button";
import { PoolListIcon } from "@/components/Icons";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SEO } from '../../next-seo.config';
const updateMeta = {
  ...SEO,
  title: 'Liquidity',
};
export default function Liquidity() {
  const { account, wallet, chainId, demask, tokenDefault } = useContext(AccountContext);
  const router = useRouter();
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const handleAddLiquidity = () => {
    const nftAddress = demask.CREATOR;
    const tokenAddress = nativeAddress;
    const idNFT = demask.IDNFT;
    router.push(`/add/${nftAddress}/${tokenAddress}/${idNFT}`);
  };

  const fetchDataListLiquidity = async (accountUser: string, pageParam = 1, chainId: string | string[]) => {
    const data = await liquidityListAPI(accountUser.toLowerCase(), pageParam, chainId);
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
    ["LiquidityList", account, chainId],
    ({ pageParam = 1 }) => fetchDataListLiquidity(account, pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage < page?.totalPages
          ? page?.currentPage + 1
          : undefined,
    }
  );

  return (
    <div className="py-8 max-w-screen-xl  mx-auto min-h-[75vh] pb-40 lg:pb-0">
      <NextSeo {...updateMeta} />
      <div className="w-full">
        <div className="flex justify-between w-full">
          <h2 className="text-2xl font-semibold text-dark0">Your Liquidity</h2>
          <Button
            type="button"
            primary
            className="h-[34px] w-[158px] text-sm"
            onClick={handleAddLiquidity}
          >
            + Add Liquidity
          </Button>
        </div>
        <p className="mt-2 mb-6 text-dark">List of your liquidity positions</p>
        {((!account || data?.pages[0]?.combinedRecords.length === 0) && !isLoading) && (
          <div className="flex flex-col items-center w-full mb-6 font-medium text-center rounded-lg gap-y-4 py-14 bg-dark4 text-dark2">
            <PoolListIcon width={72} height={72} />
            Your active liquidity positions will appear here.
          </div>
        )}
        {account && data?.pages[0]?.combinedRecords.length !== 0 && (
          <div>
            <div>
              {isSuccess &&
                data.pages.map((page: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-2">
                    {page?.combinedRecords.map(
                      (liquidity: any, index: number) => (
                        <div key={index} className="w-full mx-auto">
                          <LiquidytiesItem liquidity={liquidity} />
                        </div>
                      )
                    )}
                  </div>
                ))}
              {hasNextPage && (
                <p
                  onClick={() => fetchNextPage()}
                  className="mt-4 text-sm cursor-pointer text-secondary4"
                >
                  See more
                </p>
              )}
            </div>
            {(isFetchingNextPage) && (
              <div>
                <BiLoaderAlt className="mb-6 text-3xl animate-spin text-secondary5" />
              </div>
            )}
          </div>)
        }
        {
          isLoading && account && (
            <div>
              <BiLoaderAlt className="mb-6 text-3xl animate-spin text-secondary5" />
            </div>
          )
        }
      </div>
    </div>
  );
}
