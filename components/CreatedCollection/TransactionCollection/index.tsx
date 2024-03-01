import { nftsUserService } from "@/libs/service/profileService";
import formatNumber from "@/libs/utils/formatNumer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import AccountContext from "@/context/AccountContext";
import { TabGroups } from "@/components/NavChoice";
import { EtherIcon, RefetchIcon } from "@/components/Icons";
import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import FormatNumber from "@/components/Common/FormatNumber";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import Pool from "./Pool";
const TransactionCollection = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const fetchDataNFTs = async (
    pageParam = 1,
    chain: string | string[],
    account: string
  ) => {
    const data = await nftsUserService(account, chain, pageParam);
    return data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["NFTsUser", chainId, account],
    ({ pageParam = 1 }) => fetchDataNFTs(pageParam, chainId, account),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(data);

  return (
    <div className="flex flex-col h-full">
      <div className="items-center justify-between lg:flex">
        <div className="flex items-center mb-3 lg:mb-0 gap-x-8">
          <TabGroups
            choices={["Buy", "Sell", "Pool"]}
            activeChoice={activeChoice}
            onChoiceChange={handleChoiceChange}
          />
          <RefetchIcon
            width={24}
            height={24}
            className="cursor-pointer hover:fill-secondary5"
          />
        </div>
        <div className="flex gap-x-4">
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Send:</p>
            {formatNumber("123")}
            <EtherIcon width={16} height={16} className="ml-1 fill-dark2" />
          </div>
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Receive:</p>
            {formatNumber("123")}
            <span className="ml-1">NFTs</span>
          </div>
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Price:</p>
            {formatNumber("123")}
            <EtherIcon width={16} height={16} className="ml-1 fill-dark2" />
          </div>
        </div>
      </div>
      <div className="relative h-full">
        {activeChoice === "Buy" ? (
          <div>
            {isLoading ? (
              <div className="mt-4">
                <SkeletonCategory />
              </div>
            ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
              <div className="flex flex-col ">
                <div className="grid grid-cols-3 pb-[54px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[542px]">
                  {data?.pages.map((page: any, pageIndex: number) => (
                    <Fragment key={pageIndex}>
                      {page?.data?.map((item: any, index: number) => (
                        <div key={index} className="relative overflow-hidden">
                          <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                            <div className="relative h-[78px] lg:h-[100px]">
                              <MediaNFT data={item} isControls={false} hover />
                            </div>
                            <div className="w-full">
                              <div className="flex w-full mt-2">
                                <div className="w-full">
                                  <h6
                                    title={item.metadata.name}
                                    className="flex items-start gap-2 font-medium uppercase"
                                  >
                                    <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                      <ModalDocument
                                        data={item.metadata.name}
                                      />
                                    </span>
                                  </h6>
                                </div>
                              </div>
                              <div className="hidden text-sm lg:block ">
                                <p>Floor price</p>
                              </div>
                              <div className="flex justify-between font-semibold text-dark2">
                                <div>
                                  <FormatNumber number={item.floorPrice} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
                <Button primary className="absolute bottom-0 w-full py-4">
                  BUY 2 NFTs
                </Button>
              </div>
            ) : (
              <p className="mt-4">No data available.</p>
            )}
          </div>
        ) : activeChoice === "Sell" ? (
          <div>Upcoming</div>
        ) : (
          <Pool/>
        )}
      </div>
    </div>
  );
};

export default TransactionCollection;
