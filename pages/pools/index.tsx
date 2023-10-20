import Button from "@/components/Buttons/Button";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
const updateMeta = {
  ...SEO,
  title: 'Detail Liquidity',
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
  const { ref, inView } = useInView();
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
    <div className="py-8 max-w-4xl mx-auto lg:min-h-[calc(100vh-300px)] min-h-[calc(100vh-151px)]">
      <NextSeo {...updateMeta} />
      <div className="w-full">
        <h2 className="text-2xl text-black24">Your Liquidity</h2>
        <p className="mt-2 mb-6 text-dark">List of your liquidity positions</p>
        {((!account || data?.pages[0]?.combinedRecords.length === 0) && !isLoading) && (
          <div className="w-full py-8 mb-6 font-medium text-center rounded-lg bg-dark4 text-secondary4">
            No liquidity found.
          </div>
        )}
        {account && data?.pages[0]?.combinedRecords.length !== 0 && (
          <div>
            <div>
              {isSuccess &&
                data.pages.map((page: any, index: number) => (
                  <div key={index}>
                    {page?.combinedRecords.map(
                      (liquidity: any, index: number) => (
                        <div key={index}>
                          <LiquidytiesItem liquidity={liquidity} tokenDefault={tokenDefault} />
                        </div>
                      )
                    )}

                  </div>
                ))}
              {hasNextPage && (
                <p
                  onClick={() => fetchNextPage()}
                  className="mb-6 -mt-4 text-sm cursor-pointer text-secondary4"
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
        <Button
          type="button"
          primary
          className="h-[34px] w-[158px] text-sm mb-4 block mx-auto"
          onClick={handleAddLiquidity}
        >
          + Add Liquidity
        </Button>
      </div>
    </div>
  );
}
