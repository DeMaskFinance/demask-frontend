import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
  NFTIcon,
  PlusIcon,
  SwapIcon,
} from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { nftsUserService } from "@/libs/service/profileService";
import { formatTypeChain } from "@/libs/utils/formatComon";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Classify from "../Classify";
import FilterItems from "./FilterItems";
import SearchNotFound from "@/components/Search/SearchNotFound";
import { useRouter } from "next/router";
import { queryClient } from "@/libs/constants";
interface ModalDetailProps {
  type: string;
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
interface NFTItem {
  nftID: string | number;
  nftAddress: string;
  type: string;
}
interface TradeProps {
  item: NFTItem;
}
const Trade: React.FC<TradeProps> = ({ item }) => {
  const { chainId } = useContext(AccountContext);
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    "v1",
  ]);

  const nativeAddress = contracts?.WETH_ADDRESS;
  return (
    <div className="absolute left-0 z-10 flex justify-between w-full px-2 transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 gap-x-2">
      <Link
        href={`${item.type === "erc1155"
            ? `/add/${item.nftAddress}/${nativeAddress}/${item.nftID}`
            : `/trade/erc721/${item.nftAddress}?tab=pool`
          }`}
        className="basis-1/2"
      >
        <Button className="flex items-center w-full py-3 border gap-x-2 border-shader_400 bg-shader_500 hover:bg-shader_400">
          <PlusIcon width={20} height={20} />
          <p>Add</p>
        </Button>
      </Link>
      <Link
        href={`${item.type === "erc1155"
            ? `/trade/erc1155/${item.nftAddress}/${nativeAddress}/${item.nftID}`
            : `/trade/erc721/${item.nftAddress}`
          }`}
        className="basis-1/2"
      >
        <Button className="flex items-center w-full py-3 gap-x-2" primary>
          <SwapIcon width={20} height={20} className="fill-shader_700" />
          <p>Swap</p>
        </Button>
      </Link>
    </div>
  );
};
export const ItemList: React.FC<ItemListProps> = ({
  data,
  isSuccess,
  isLoading,
  isFetching,
  fetchNextPage,
  hasNextPage,
}) => {
  const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(
    null
  );

  const collectionAddress = useRouter().query.collection as string;
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="font-semibold">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-autoFill text-shader_600">
          <SkeletonSubCategory length={24} />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <Fragment>
          <div className="flex items-center my-4 text-sm text-primary_300 gap-x-2">
            <div className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary_300"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary_500"></span>
            </div>
            <p>{data?.pages[0].totalRecords} Items</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-white md:grid-cols-autoFill">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border-shader_500 hover:border-shader_400"
                  >
                    <div className="relative items-center text-sm transition-all rounded-md cursor-pointer group lg:text-base hover:shadow-home">
                      <div className="relative overflow-hidden aspect-square">
                        <div className="w-full h-full overflow-hidden rounded-t-lg">
                          <MediaNFT data={item} isControls={false} hover zoom />
                        </div>
                      </div>
                      <div className="relative w-full p-3 rounded-b-lg bg-shader_700 group-hover:bg-shader_600 border-x-[1px] border-b-[1px] border-shader_500">
                        <Link
                          href={`/collection/${item.nftAddress}`}
                          className="flex-wrap max-w-full text-xs font-semibold hover:underline text-primary_300 line-clamp-1 hover:underline-offset-1"
                        >
                          {item?.collectionName ? (
                            <ModalDocument data={item?.collectionName} />
                          ) : (
                            <p>--</p>
                          )}
                        </Link>
                        <div className="flex w-full font-bold text-white">
                          <h6
                            title={item.metadata?.name}
                            className="flex items-start w-full gap-2 uppercase "
                          >
                            <span className="flex-wrap max-w-full line-clamp-1">
                              {item.metadata?.name ? (
                                <ModalDocument data={item.metadata?.name} />
                              ) : (
                                <p>--</p>
                              )}
                            </span>
                          </h6>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-shader_200">
                          <p>Last Sale</p>
                          {item.type == "erc1155" && <p>Balance</p>}
                        </div>
                        <div className="flex justify-between font-bold text-white">
                          <div className="flex items-center gap-x-1">
                            <FormatNumber number={item.floorPrice} />
                            <EtherIcon width={16} height={16} />
                          </div>
                          {item.type == "erc1155" && (
                            <div className="flex items-center gap-x-1">
                              <FormatNumber number={item?.nftBalance || 0} />
                              <NFTIcon width={16} height={16} />
                            </div>
                          )}
                        </div>
                        {collectionAddress ? (
                          <Fragment>
                            {item.type === "erc1155" && <Trade item={item} />}
                          </Fragment>
                        ) : (
                          <Trade item={item} />
                        )}
                      </div>
                      <div className="absolute flex items-center justify-between w-full px-2 transition-all duration-150 top-1 opacity-60 group-hover:opacity-100">
                        <div className="flex items-center gap-x-1">
                          <EtherIcon width={20} height={20} />
                          <p className="text-[10px] bg-black bg-opacity-40 rounded-xl px-2 h-5 leading-5 backdrop-opacity-50 font-semibold">
                            {formatTypeChain(item.type)}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div
                              className="flex items-center justify-center w-6 h-6 rounded-full bg-primary_500"
                              onClick={() => {
                                setSelectedItem(item);
                              }}
                            >
                              <EyeIcon width={16} height={16} />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl p-0 border bg-shader_800 border-shader_500">
                            <DialogDescription>
                              {selectedItem && (
                                <ModalDetail
                                  type={selectedItem?.type}
                                  idNFT={selectedItem?.nftID}
                                  nftAddress={selectedItem?.nftAddress}
                                />
                              )}
                            </DialogDescription>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            {isFetching && hasNextPage && <SkeletonSubCategory length={6} />}
            <div ref={ref} style={{ height: "1px" }}></div>
          </div>
        </Fragment>
      ) : (
        <div className="h-[300px]">
          <SearchNotFound />
        </div>
      )}
    </div>
  );
};
const Items = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false);
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
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [
      "NFTsUser",
      chainId,
      account,
      typeERC,
      category,
      debouncedSearch,
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchDataNFTs(
        pageParam,
        chainId,
        account,
        typeERC,
        debouncedSearch,
        category
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });

  return (
    <div className="flex">
      {isFilter && <FilterItems setIsFilter={setIsFilter} />}
      <div className="flex-auto">
        <Classify
          setSearchCollection={setSearchCollection}
          setIsFilter={setIsFilter}
          isFilter={isFilter}
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
    </div>
  );
};
export default Items;
