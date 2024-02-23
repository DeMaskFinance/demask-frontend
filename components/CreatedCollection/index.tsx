import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  EditIcon,
  EtherIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import Items from "@/components/Profile/Inventory/Items";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import { nftsUserService } from "@/libs/service/profileService";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
interface ModalDetailProps {
  data: any;
  nftAddress: string;
  nftID: string;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDetail: boolean;
}
export default function CreatedCollection() {
  const { account, chainId, demask } = useContext(AccountContext);
  const address = useRouter().query.created;
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(
    null
  );
  const { ref, inView } = useInView();
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
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="pb-6 min-h-[75vh] max-w-[1440px] mx-auto flex flex-col gap-y-6 mb-[100px]">
      <div className="h-[120px] lg:h-[240px]">
        <div className="w-full h-full bg-dark4 rounded-b-lg group-hover:brightness-[0.8]"></div>
      </div>
      <section className="flex justify-between">
        <div className="flex items-center gap-x-6">
          <div className="h-[120px]">
            <Image
              src="/images/test.png"
              width={620}
              height={620}
              className="object-cover w-full h-full rounded-lg"
              alt="1"
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-2xl font-semibold">123</p>
              <Link href="/edit/123">
                <EditIcon width={24} height={24} className="fill-dark3" />
              </Link>
            </div>
            <LogoIconCard chainId={chainId} />
            <div className="flex mt-4 gap-x-2">
              <Link href="/">
                <WebsiteIcon width={24} height={24} />
              </Link>
              <Link href="/">
                <TwitterIcon width={24} height={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex self-end p-4 rounded-lg gap-x-20 bg-dark5">
          <div className="text-dark2">
            <p className="mb-1 text-sm">Total Volume</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
              <EtherIcon width={16} height={16} className="fill-dark2" />
            </div>
          </div>
          <div className="text-dark2">
            <p className="mb-1 text-sm">Total Sale</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
              <EtherIcon width={16} height={16} className="fill-dark2" />
            </div>
          </div>
          <div className="text-dark2 gird">
            <p className="mb-1 text-sm">Listed/Supply</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
            </div>
          </div>
          <div className="text-dark2">
            <p className="mb-1 text-sm">Owner</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
            </div>
          </div>
        </div>
      </section>
      <div>
        {isLoading ? (
          <SkeletonCategory />
        ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 md:grid-cols-3 text-dark2">
              {data?.pages.map((page, pageIndex) => (
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
                                title={item.metadata.name}
                                className="flex items-start gap-2 font-medium uppercase"
                              >
                                <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                  <ModalDocument data={item.metadata.name} />
                                </span>
                              </h6>
                            </div>
                            {/* <ActiveIcon width={24} height={24} className="mr-4 fill-yellow" /> */}
                          </div>
                          <LogoIconCard chainId={chainId} />
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
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
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
        <div ref={ref} style={{ height: "1px" }}></div>
      </div>
    </div>
  );
}
