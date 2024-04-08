import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { AddIcon, SwapIconProfile } from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { nftsUserService } from "@/libs/service/profileService";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Classify from "../Classify";
import useDebounce from "@/hooks/useDebounce";
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
  fetchNextPage: any;
  hasNextPage: boolean | undefined;
}
export const ItemList: React.FC<ItemListProps> = ({
  data,
  isSuccess,
  isLoading,
  isFetching,
  fetchNextPage,
  hasNextPage,
}) => {
  const { chainId, demask } = useContext(AccountContext);
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(
    null
  );
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-5 md:grid-cols-3 text-dark2">
      {isLoading ? (
        <SkeletonSubCategory />
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <Fragment>
          {data?.pages.map((page: any, pageIndex: number) => (
            <Fragment key={pageIndex}>
              {page?.data?.map((item: any, index: number) => (
                <div key={index} className="relative overflow-hidden">
                  <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer group lg:text-base hover:-translate-y-1 hover:shadow-home">
                    <div className="relative h-[240px] overflow-hidden">
                      <div
                        onClick={() => {
                          setSelectedItem(item);
                          setIsOpenDetail(true);
                          document.body.style.overflowY = "hidden";
                        }}
                        className="w-full h-full"
                      >
                        <MediaNFT data={item} isControls={false} hover />
                      </div>
                      <div className="absolute flex z-10 justify-between w-full opacity-0 group-hover:opacity-100 px-2 bottom-[-20%] transition-all duration-150 gap-x-2 group-hover:bottom-2">
                        <Link
                          href={
                            item.type === "erc1155"
                              ? `/add/${item.nftAddress}/${nativeAddress}/${item.nftID}?chain=${chainId}`
                              : `/collection/${item.nftAddress}?typeERC=erc721&tab=pool&chain=${chainId}`
                          }
                          className="basis-1/2"
                        >
                          <Button className="flex items-center w-full py-3 font-semibold transition-all duration-100 text-dark1 bg-dark5 hover:bg-dark3 gap-x-2">
                            <div>
                              <AddIcon
                                width={20}
                                height={20}
                                className="fill-dark1"
                              />
                            </div>
                            <p>Add</p>
                          </Button>
                        </Link>
                        <Link
                          href={
                            item.type === "erc1155"
                              ? `/swap/${item.nftAddress}/${nativeAddress}/${item.nftID}?chain=${chainId}`
                              : `/collection/${item.nftAddress}?typeERC=erc721&chain=${chainId}`
                          }
                          className="basis-1/2"
                        >
                          <Button className="flex items-center w-full py-3 font-semibold transition-all duration-100 text-dark1 bg-dark5 hover:bg-dark3 gap-x-2">
                            <div>
                              <SwapIconProfile
                                width={20}
                                height={20}
                                className="fill-dark1"
                              />
                            </div>
                            <p>Swap</p>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="w-full">
                      <Link
                        href={`/collection/${item.nftAddress}?typeERC=${item.type}`}
                        className="flex-wrap max-w-full mt-2 text-xs font-semibold hover:underline text-dark3 line-clamp-1 hover:underline-offset-1"
                      >
                        {item?.collectionName ? (
                          <ModalDocument data={item?.collectionName} />
                        ) : (
                          <p>--</p>
                        )}
                      </Link>
                      <div className="flex w-full">
                        <h6
                          title={item.metadata?.name}
                          className="flex items-start gap-2 font-medium uppercase text-dark1"
                        >
                          <span className="flex-wrap max-w-full text-lg line-clamp-1">
                            {item.metadata?.name ? (
                              <ModalDocument data={item.metadata?.name} />
                            ) : (
                              <p>--</p>
                            )}
                          </span>
                        </h6>
                      </div>
                      <div className="flex items-center justify-between">
                        <LogoIconCard chainId={chainId} />
                        <p className="px-2 h-[23px] rounded-full bg-dark4 text-[10px] uppercase">
                          {item.type}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-dark3">
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
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
          {isFetching && hasNextPage && <SkeletonSubCategory />}
          <div ref={ref} style={{ height: "1px" }}></div>
        </Fragment>
      ) : (
        <p className="mt-4">No data available.</p>
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
  const [searchCollection, setSearchCollection] = useState<string>("");
  let debouncedSearch = useDebounce(searchCollection);
  const fetchDataNFTs = async (
    pageParam = 1,
    chain: string | string[],
    account: string,
    typeERC: string,
    debouncedSearch: string,
    category: string
  ) => {
    const data = await nftsUserService(
      account,
      chain,
      typeERC,
      debouncedSearch,
      category,
      pageParam
    );
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["NFTsUser", chainId, account, typeERC, category, debouncedSearch],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(
        pageParam,
        chainId,
        account,
        typeERC,
        debouncedSearch,
        category
      ),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  return (
    <div>
      <Classify
        typeERC={typeERC}
        category={category}
        setSearchCollection={setSearchCollection}
        setTypeERC={setTypeERC}
        setCategory={setCategory}
      />
      <ItemList
        isLoading={isLoading}
        isSuccess={isSuccess}
        data={data}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};
export default Items;
