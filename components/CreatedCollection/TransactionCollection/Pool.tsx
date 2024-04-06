import { Button } from "@/components/Buttons";
import { LightBulbIcon, PoolListIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import PoolItem from "./PoolItem";

const Pool = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, chainId } = useContext(AccountContext);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
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
    ["LiquidityList", account, chainId],
    ({ pageParam = 1 }) =>
      fetchDataListLiquidity(account, pageParam, chainId, "erc721"),
    {
      getNextPageParam: (page: any) =>
        page?.currentPage < page?.totalPages
          ? page?.currentPage + 1
          : undefined,
    }
  );
  return (
    <div className="h-full text-dark3 ">
      <div className="flex items-center px-6 py-4 my-4 text-sm rounded-lg bg-dark5 gap-x-2">
        <LightBulbIcon width={20} height={20} className="flex-shrink-0 fill-yellow" />
        <p>Pools accrue trading fees towards depositors.</p>
      </div>
      {!account ? (
        <Button
          className="flex items-end w-full py-2"
          primary
          onClick={handleOpen}
        >
          CONNECT WALLET
        </Button>
      ) : (
        // <PoolItem />
        <div>
          {(data?.pages[0]?.combinedRecords.length === 0) &&
          !isLoading && (
            <div className="flex flex-col items-center w-full mb-6 font-medium text-center rounded-lg gap-y-4 py-14 bg-dark4 text-dark2">
              <PoolListIcon width={72} height={72} />
              Your active liquidity positions will appear here.
            </div>
          )}
          {isSuccess && data?.pages[0]?.combinedRecords.length !== 0 && 
  data.pages && data.pages.map((page: any, index: number) => (
    <div key={index}>
      {page?.combinedRecords && page.combinedRecords.map(
        (liquidity: any, subIndex: number) => (
          <div key={subIndex} className="w-full mx-auto">
            <PoolItem liquidity={liquidity} />
          </div>
        )
      )}
    </div>
  ))
}
        </div>
      )}

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Pool;
