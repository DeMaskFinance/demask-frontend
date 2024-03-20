import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  AddIcon,
  BlastIcon,
  GoerliIcon,
  SwapIconProfile,
  ZkSyncIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { nftsUserService } from "@/libs/service/profileService";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Classify from "../Classify";
interface ModalDetailProps {
  data: any;
  nftAddress: string;
  nftID: string;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDetail: boolean;
}
interface ItemListProps {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isFetching: boolean;
  fetchNextPage:any;
}
export const ItemList: React.FC<ItemListProps> = ({
  data,
  isSuccess,
  isLoading,
  isFetching,
  fetchNextPage
}) => {
  const { chainId, demask } = useContext(AccountContext);
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(
    null
  );
  console.log(data);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div>
      {(isLoading || isFetching) ? (
        <div className="mt-4">
          <SkeletonCategory />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-5 md:grid-cols-3 text-dark2">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div key={index} className="relative overflow-hidden">
                    <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                      <div
                        className="relative h-[240px]"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsOpenDetail(true);
                          document.body.style.overflowY = "hidden";
                        }}
                      >
                        <MediaNFT data={item} isControls={false} hover />
                      </div>
                      <div className="w-full">
                        <div className="flex w-full mt-2">
                          <div className="w-full">
                            <h6
                              title={item.metadata?.name}
                              className="flex items-start gap-2 font-medium uppercase"
                            >
                              <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                {item.metadata?.name ? (
                                  <ModalDocument data={item.metadata?.name} />
                                ) : (
                                  <p>--</p>
                                )}
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <LogoIconCard chainId={chainId} />
                          <p className="px-2 h-[23px] rounded-full bg-dark4 text-[10px]">
                            ERC 1155
                          </p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p>Floor price</p>
                          <p>Balance</p>
                        </div>
                        <div className="flex justify-between font-semibold text-dark2">
                          <div>
                            <FormatNumber number={item.floorPrice} />
                          </div>
                          <div>
                            {item.nftBalance ? (
                              <FormatNumber number={item.nftBalance} />
                            ) : (
                              <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Link
                            href={`/add/${item.nftAddress}/${nativeAddress}/${item.nftID}`}
                          >
                            <Button className="flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2">
                              <p>Add</p>
                              <div>
                                <AddIcon width={24} height={24} />
                              </div>
                            </Button>
                          </Link>
                          <Link
                            href={`/swap/${item.nftAddress}/${nativeAddress}/${item.nftID}`}
                          >
                            <Button className="flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2">
                              <p>Swap</p>
                              <div>
                                <SwapIconProfile width={24} height={24} />
                              </div>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            <div ref={ref} style={{ height: "1px" }}></div>
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
      {selectedItem && (
        <ModalDetail
          data={selectedItem}
          idNFT={selectedItem?.nftID}
          nftAddress={selectedItem?.nftAddress}
          setIsOpenDetail={setIsOpenDetail}
          isOpenDetail={isOpenDetail}
        />
      )}
    </div>
  );
};
const Items = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const fetchDataNFTs = async (
    pageParam = 1,
    chain: string | string[],
    account: string,
    typeERC: string
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
    ["NFTsUser", chainId, account, typeERC],
    ({ pageParam = 1 }) => fetchDataNFTs(pageParam, chainId, account, typeERC),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(data);

  return (
    <div>
      <Classify
        typeERC={typeERC}
        category={category}
        setTypeERC={setTypeERC}
        setCategory={setCategory}
      />
      <ItemList
        isLoading={isLoading}
        isSuccess={isSuccess}
        data={data}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
export default Items;
