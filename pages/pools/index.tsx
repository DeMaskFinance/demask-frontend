import Button from "@/components/Buttons/Button";
import { PoolListIcon } from "@/components/Icons";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SEO } from "../../next-seo.config";
import { TabGroups } from "@/components/NavChoice";
import { PoolGradientIcon } from "@/components/Icons/Mobile/IconMobile";
const updateMeta = {
  ...SEO,
  title: "Liquidity",
};
export default function Liquidity() {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);
  const router = useRouter();
  const [activeChoice, setActiveChoice] = useState<string>("Item pool");
  const [type, setType] = useState<string>("erc1155");
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const handleAddLiquidity = () => {
    const nftAddress = demask.CREATOR;
    const tokenAddress = nativeAddress;
    const idNFT = demask.IDNFT;
    router.push(`/add/${nftAddress}/${tokenAddress}/${idNFT}`);
  };

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

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    choice === "Item pool" ? setType("erc1155") : setType("erc721");
  };
  console.log(account, isLoading);

  return (
    <div className="py-8 max-w-screen-xl  mx-auto min-h-[80vh] pb-40 lg:pb-0 px-4 md:px-0">
      <NextSeo {...updateMeta} />
      <div className="w-full">
        <div className="flex flex-wrap justify-between w-full gap-y-2">
          <div className="flex items-center gap-x-2">
            <PoolGradientIcon width={20} height={20} />
            <h2 className="text-2xl font-semibold text_gradient">
              Your Liquidity
            </h2>
          </div>
          <Button
            type="button"
            primary
            className="h-[34px] w-[158px] text-sm"
            onClick={handleAddLiquidity}
          >
            + Add Liquidity
          </Button>
        </div>
        <p className="mt-2 mb-6 textshader_900 title">
          List of your liquidity positions
        </p>
        {account && (
          <div className="flex justify-center mb-6">
            <TabGroups
              choices={["Item pool", "Collection pool"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
        )}
        {account && data?.pages[0]?.combinedRecords.length !== 0 && (
          <div>
            <div className="rounded-lg bg-shader_600 dark:bg-shader_900">
              <div className="">
                {isSuccess &&
                  data.pages.map((page: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-4 md:grid-cols-2"
                    >
                      {page?.combinedRecords.map(
                        (liquidity: any, index: number) => (
                          <div key={index} className="w-full mx-auto">
                            <LiquidytiesItem
                              liquidity={liquidity}
                              type={type}
                            />
                          </div>
                        )
                      )}
                    </div>
                  ))}
                {hasNextPage && (
                  <p
                    onClick={() => fetchNextPage()}
                    className="mt-4 text-sm cursor-pointer text-primary_400"
                  >
                    See more
                  </p>
                )}
              </div>
              {isFetchingNextPage && (
                <div>
                  <BiLoaderAlt className="mb-6 text-3xl animate-spin text-primary_400" />
                </div>
              )}
            </div>
          </div>
        )}
        {(!account || data?.pages[0]?.combinedRecords.length === 0) &&
          !isLoading && (
            <div className="pool_empty">
              <PoolListIcon width={72} height={72} />
              Your active liquidity positions will appear here.
            </div>
          )}
        {isLoading && account && (
          <div>
            <BiLoaderAlt className="mb-6 text-3xl animate-spin text-primary_400" />
          </div>
        )}
      </div>
    </div>
  );
}
