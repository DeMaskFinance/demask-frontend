import { BackgroundDefault } from "@/components/Backgrounds";
import Button from "@/components/Buttons/Button";
import { LoadingIcon, SearchIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { SEO } from "../../next-seo.config";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import { TabGroups } from "@/components/NavChoice";
const updateMeta = {
  ...SEO,
  title: "Liquidity",
};
export default function Liquidity() {
  const { account, chainId, demask } = useContext(AccountContext);
  const router = useRouter();
  const [activeChoice, setActiveChoice] = useState<string>("ERC-1155");
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
    choice === "ERC-1155" ? setType("erc1155") : setType("erc721");
  };

  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <div className="py-8 max-w-[908px]  mx-auto min-h-[94vh] pb-40 lg:pb-0 px-4 md:px-0">
        <div className="w-full">
          <div className="flex flex-wrap justify-between w-full gap-y-2">
            <div className="flex items-center gap-x-2">
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
          <div className="rounded-lg bg-shader_800 min-h-[70vh] flex flex-col">
            <TabGroups
              choices={["ERC-1155", "ERC-721"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
              isDefault
            />
            {!account || data?.pages[0]?.combinedRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-grow h-full text-sm font-semibold text-shader_200">
                <div className="flex items-center justify-center w-10 h-10 mb-1 border rounded-lg border-primary_500 bg-primary_500 bg-opacity-20">
                  <SearchIcon
                    width={20}
                    height={20}
                    className="text-primary_400"
                  />
                </div>
                <p>Your active liquidity positions will appear here. </p>
                <a
                  href="https://docs.demask.finance/products/dex/how-to-add-remove-lp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary_400"
                >
                  How to add Liquidity?
                </a>
              </div>
            ) : (
              <>
                <div className="border-t border-shader_500">
                  {isSuccess &&
                    data.pages.map((page: any, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 gap-3 p-3 overflow-y-scroll lg:grid-cols-3 md:grid-cols-2"
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
                </div>
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center w-full h-full grow">
                    <LoadingIcon
                      width={30}
                      height={30}
                      className=" animate-spin"
                    />
                  </div>
                )}
              </>
            )}
            {isLoading && account && (
              <div className="flex items-center justify-center w-full h-full grow">
                <LoadingIcon width={30} height={30} className=" animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </BackgroundDefault>
  );
}
