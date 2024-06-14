import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
  NFTIcon,
  PlusIcon,
  SearchIcon,
  SwapIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { formatTypeChain } from "@/libs/utils/formatComon";
import { CgClose } from "react-icons/cg";
import TabQuery from "@/components/NavChoice/TabQuery";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { TabGroups } from "@/components/NavChoice";
import FilterItems from "./FilterItems";
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
    <div className="font-semibold">
      {isLoading ? (
        <div className="grid grid-cols-autoFill gap-4 mt-4 text-shader_600">
          <SkeletonSubCategory length={5} />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <Fragment>
          <div className="my-4 flex text-primary_300 text-sm items-center gap-x-2">
            <div className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary_300"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary_500"></span>
            </div>
            <p>{data?.pages[0].totalRecords} Items</p>
          </div>
          <div className="grid grid-cols-autoFill gap-4 mt-4  text-white">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden border border-shader_500 rounded-lg hover:border-shader_400"
                  >
                    <div className="relative items-center text-sm transition-all  rounded-md cursor-pointer group lg:text-base hover:shadow-home">
                      <div className="relative aspect-square overflow-hidden">
                        <div className="w-full h-full overflow-hidden rounded-t-lg">
                          <MediaNFT data={item} isControls={false} hover zoom />
                        </div>
                      </div>
                      <div className="w-full p-3 bg-shader_700 rounded-b-lg relative group-hover:bg-shader_600">
                        <Link
                          href={`/collection/${item.nftAddress}?typeERC=${item.type}`}
                          className="flex-wrap max-w-full text-xs font-semibold hover:underline text-primary_300 line-clamp-1 hover:underline-offset-1"
                        >
                          {item?.collectionName ? (
                            <ModalDocument data={item?.collectionName} />
                          ) : (
                            <p>--</p>
                          )}
                        </Link>
                        <div className="flex w-full text-white font-bold">
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
                        <div className="flex justify-between text-sm text-shader_200 mt-2">
                          <p>Floor price</p>
                          <p>Balance</p>
                        </div>
                        <div className="flex justify-between font-bold text-white">
                          <div className="flex gap-x-1 items-center">
                            <FormatNumber number={item.floorPrice} />
                            <EtherIcon width={16} height={16} />
                          </div>
                          <div>
                            {item.nftBalance ? (
                              <div className="flex gap-x-1 items-center">
                                <FormatNumber number={item.nftBalance} />
                                <NFTIcon width={16} height={16} />
                              </div>
                            ) : (
                              <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-700 "></span>
                            )}
                          </div>
                        </div>
                        <div className="absolute flex z-10 justify-between w-full opacity-0 group-hover:opacity-100 px-2 bottom-3 left-0 transition-all duration-150 gap-x-2">
                          <Link
                            href={
                              item.type === "erc1155"
                                ? `/add/${item.nftAddress}/${nativeAddress}/${item.nftID}?chain=${chainId}`
                                : `/collection/${item.nftAddress}?typeERC=erc721&tab=pool&chain=${chainId}`
                            }
                            className="basis-1/2"
                          >
                            <Button className="flex items-center w-full py-3 gap-x-2 border border-shader_400 bg-shader_500 hover:bg-shader_400">
                              <PlusIcon width={20} height={20} />
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
                            <Button
                              className="flex items-center w-full py-3 gap-x-2"
                              primary
                            >
                              <SwapIcon
                                width={20}
                                height={20}
                                className="fill-shader_700"
                              />
                              <p>Swap</p>
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center justify-between absolute top-1 px-2 w-full opacity-60 group-hover:opacity-100 transition-all duration-150">
                        <div className="flex gap-x-1 items-center">
                          <EtherIcon width={20} height={20} />
                          <p className="text-[10px] bg-black bg-opacity-40 rounded-xl px-2 h-5 leading-5 backdrop-opacity-50 font-semibold">
                            {formatTypeChain(item.type)}
                          </p>
                        </div>
                        <div
                          className="w-6 h-6 bg-primary_500 flex items-center justify-center rounded-full"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsOpenDetail(true);
                            document.body.style.overflowY = "hidden";
                          }}
                        >
                          <EyeIcon width={16} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            {isFetching && hasNextPage && <SkeletonSubCategory length={4} />}
            <div ref={ref} style={{ height: "1px" }}></div>
          </div>
        </Fragment>
      ) : (
        <p className="mt-4">No data available.</p>
      )}
      {selectedItem && (
        <ModalDetail
          type={selectedItem?.type}
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
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  let debouncedSearch = useDebounce(searchCollection);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, ""));

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
