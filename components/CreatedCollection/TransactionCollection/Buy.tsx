import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { nftsUserService } from "@/libs/service/profileService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
const Buy = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const fetchDataNFTs = async (
    pageParam = 1,
    chain: string | string[],
    account: string
  ) => {
    const data = await nftsUserService(account, chain, typeERC, pageParam);
    return data.data;
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
  
  return (
    <div>
      {isLoading ? (
        <div className="mt-4">
          <SkeletonCategory />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[542px]">
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
                            {/* <h6
                              title={item.metadata.name}
                              className="flex items-start gap-2 font-medium uppercase"
                            >
                              <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                <ModalDocument data={item.metadata.name} />
                              </span>
                            </h6> */}
                            --
                          </div>
                        </div>
                        <div className="hidden text-sm lg:block ">
                          <p>Floor price</p>
                        </div>
                        <div className="flex justify-between font-semibold text-dark2">
                          {/* <div>
                            <FormatNumber number={item.floorPrice} />
                          </div> */}
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
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
                            {/* <h6
                              title={item.metadata.name}
                              className="flex items-start gap-2 font-medium uppercase"
                            >
                              <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                <ModalDocument data={item.metadata.name} />
                              </span>
                            </h6> */}
                            --
                          </div>
                        </div>
                        <div className="hidden text-sm lg:block ">
                          <p>Floor price</p>
                        </div>
                        <div className="flex justify-between font-semibold text-dark2">
                          {/* <div>
                            <FormatNumber number={item.floorPrice} />
                          </div> */}
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
          <div>
            <ul className="p-2 text-white rounded-lg bg-dark1">
              <li className="flex items-center">Send: 1.23 <EtherIcon width={18} height={18} className="fill-white"/></li>
              <li className="flex items-center">Receive: 1.23 NFTs</li>
              <li className="flex items-center">Price: 1.23 <EtherIcon width={18} height={18} className="fill-white"/></li>
            </ul>
            <Button primary className="w-full py-4 ">
              BUY 2 NFTs
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4">No data available.</p>
      )}
    </div>
  );
};

export default Buy;
