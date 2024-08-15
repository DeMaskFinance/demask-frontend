import { LoadingIcon, SearchIcon } from "@/components/Icons";
import LiquidytiesItem from "@/components/Liquidity/LiquidityItem";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import { liquidityUserListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
const UserPools = () => {
  const { account, chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();
  const [activeChoice, setActiveChoice] = useState<string>("ERC-1155");
  const [type, setType] = useState<string>("erc1155");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    choice === "ERC-1155" ? setType("erc1155") : setType("erc721");
  };
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));

  const fetchDataListLiquidity = async (
    accountUser: string,
    pageParam = 1,
    chainId: string | string[],
    type: string,
    version: string
  ) => {
    const data = await liquidityUserListAPI(
      accountUser.toLowerCase(),
      pageParam,
      type,
      chainId,
      version
    );
    return data;
  };
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["LiquidityList", account, chainId, type, version],
    queryFn: ({ pageParam = 1 }) =>
      fetchDataListLiquidity(account, pageParam, chainId, type, version),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="rounded-lg bg-shader_800 flex flex-col overflow-y-auto min-h-[550px] max-h-[650px]">
      <TabGroups
        choices={["ERC-1155", "ERC-721"]}
        activeChoice={activeChoice}
        onChoiceChange={handleChoiceChange}
        isDefault
      />
      {!account || data?.pages[0]?.combinedRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow h-full text-sm font-semibold text-shader_200">
          <div className="flex items-center justify-center w-10 h-10 mb-1 border rounded-lg border-primary_500 bg-primary_500 bg-opacity-20">
            <SearchIcon width={20} height={20} className="text-primary_400" />
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
          <div className="border-t border-shader_500 ">
            {isSuccess &&
              data.pages.map((page: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 p-3 overflow-y-scroll lg:grid-cols-3 md:grid-cols-2"
                >
                  {page?.combinedRecords.map(
                    (liquidity: any, index: number) => (
                      <div key={index} className="w-full mx-auto">
                        <LiquidytiesItem liquidity={liquidity} type={type} />
                      </div>
                    )
                  )}
                </div>
              ))}
            <div ref={ref} style={{ height: "1px" }}></div>
          </div>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center w-full h-full grow">
              <LoadingIcon width={30} height={30} className=" animate-spin" />
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
  );
};

export default UserPools;
