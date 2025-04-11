import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
  NFTIcon,
  PlusIcon,
  RightIcon,
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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Classify from "../Classify";
import FilterItems from "./FilterItems";
import SearchNotFound from "@/components/Search/SearchNotFound";
import { useRouter } from "next/router";
import { queryClient } from "@/libs/constants";
import TokenIcon from "@/components/Logo/TokenIcon";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { getInfoPool } from "@/libs/service/nftService";
import formatNumber from "@/libs/utils/formatNumer";


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
  paymentToken: any;
}
interface TradeProps {
  item: NFTItem;
}
const Trade: React.FC<TradeProps> = ({ item }) => {
  const { chainId } = useContext(AccountContext);

  const [dropdownType, setDropdownType] = useState<"add" | "swap" | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setDropdownType(null));

  const { data: infoPool, isLoading } = useQuery<any>({
    queryKey: ["poolInfo", item.nftAddress, item.type, item?.nftID],
    queryFn: async () => {
      const res = await getInfoPool({
        chainId: chainId,
        nftAddress: item.nftAddress,
        type: item.type,
        nftID: String(item?.nftID)
      });
      return res.data;
    },

    enabled: dropdownType !== null
  });

  const activeOption = infoPool?.dmlList?.filter((opt: any) => opt?.isActive)?.[activeTab];

  const renderDropdown = (type: "add" | "swap") => (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 mb-2 overflow-hidden border border-shader_400 rounded-xl bg-shader_500 z-10 w-full shadow-lg"
    >
      {isLoading ? (
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 bg-gray-600 rounded w-2/4" />
            <div className="h-6 bg-gray-600 rounded w-2/4" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <div className="h-3 bg-gray-600 rounded w-24" />
                  <div className="h-3 bg-gray-600 rounded w-16" />
                </div>
              </div>

              <div className="w-16 h-4 bg-gray-600 rounded" />
            </div>
          ))}
          <div className="w-full h-8 bg-gray-600 rounded" />

        </div>
      ) : (
        <div className="flex flex-col gap-1 px-3 pb-3 mt-1">
          <div className="flex border-b border-white/10">
            {infoPool?.dmlList?.filter((opt: any) => opt?.isActive)?.map((option: any, idx: number) => (
              <button
                key={option?.tokenAddress}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: activeTab === idx
                    ? "linear-gradient(180deg, rgba(144, 117, 254, 0) 0%, rgba(144, 117, 254, 0.15) 100%)"
                    : "",
                }}
                className={`w-1/2 py-2 flex items-center justify-center gap-2 text-sm  ${activeTab === idx
                  ? 'text-white border-b border-primary_300'
                  : 'text-white/60'
                  }`}
              >
                {option?.symbol}
                <TokenIcon token={option?.symbol} w={16} h={16} />
              </button>
            ))}
          </div>

          <div className="pt-2"
          >
            <p className="flex justify-between text-sm text-white/70 mb-1">
              <span className="text-primary_300">TVL:</span>
              <span className="text-white font-bold"><FormatNumber number={activeOption?.tvl || 0} /></span>
            </p>
            <p className="flex justify-between text-sm text-white/70">
              <span className="text-primary_300">Last Sale:</span>
              <span className="text-white font-bold"><FormatNumber number={activeOption?.lastSale || 0} /></span>
            </p>
          </div>

          <Button third className="mt-4 w-full h-10">
            <Link
              href={
                type === "add"
                  ? item.type === "erc1155"
                    ? `/add/${item.nftAddress}/${activeOption?.tokenAddress}/${item.nftID}`
                    : `/trade/erc721/${item.nftAddress}/${activeOption?.tokenAddress}?tab=pool`
                  : item.type === "erc1155"
                    ? `/trade/erc1155/${item.nftAddress}/${activeOption?.tokenAddress}/${item.nftID}`
                    : `/trade/erc721/${item.nftAddress}/${activeOption?.tokenAddress}`
              }
              className="w-full flex justify-center whitespace-pre items-center text-primary_300 gap-x-2"
            >
              Pool Details
              <RightIcon width={20} height={20} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="absolute left-0 z-10 w-full px-2 bottom-3 transition-all duration-150 opacity-0 group-hover:opacity-100">
      <div className="relative w-full">

        {dropdownType && renderDropdown(dropdownType)}

        <div className="flex flex-col gap-2 md:flex-row w-full">
          <div className="relative w-full md:w-1/2">
            <Button
              className="flex items-center w-full lg:py-3 py-2 border gap-x-2 border-shader_400 bg-shader_500 hover:bg-shader_400"
              onClick={() => setDropdownType(dropdownType === "add" ? null : "add")}
            >
              <PlusIcon width={20} height={20} />
              <p>Add</p>
            </Button>
          </div>

          <div className="relative w-full md:w-1/2">
            <Button
              className="flex items-center w-full lg:py-3 py-2 gap-x-2 hover:bg-primary_600 bg-primary_500 border border-shader_400"
              onClick={() => setDropdownType(dropdownType === "swap" ? null : "swap")}
            >
              <SwapIcon width={20} height={20} className="fill-shader_700" />
              <p>Swap</p>
            </Button>
          </div>
        </div>
      </div>
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
          <SkeletonSubCategory length={14} />
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
                {page?.data?.map((item: any, index: number) => {

                  return <div
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
                            <FormatNumber number={item?.lastSale?.lastSale || 0} />
                            <TokenIcon token={item?.lastSale?.paymentToken?.symbol} w={16} h={16} />
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
                          <TokenIcon token={item?.paymentToken?.symbol} w={20} h={20} />
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
                }
                )}
              </Fragment>
            ))}
            {isFetching && hasNextPage && <SkeletonSubCategory length={14} />}
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
    hasNextPage,
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="flex">
      {isFilter && <FilterItems setIsFilter={setIsFilter} />}
      <div className="flex-auto">
        <Classify
          setSearchCollection={setSearchCollection}
          setIsFilter={setIsFilter}
          isFilter={isFilter}
          setSortOrder={setSortOrder}
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
