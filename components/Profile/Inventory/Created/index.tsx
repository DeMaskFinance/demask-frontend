import FormatNumber from "@/components/Common/FormatNumber";
import { LogoIconCard } from "@/components/Logo/Logo";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonNFTTop } from "@/components/Skeleton";
import SwiperCustom from "@/components/SwiperCustom";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { SwiperSlide } from "swiper/react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Classify from "../Classify";
import { collectionListUserService } from "@/libs/service/collectionService";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";

const Created = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [searchCollection, setSearchCollection] = useState<string>("");
  let debouncedSearch = useDebounce(searchCollection);

  const { ref, inView } = useInView();
  const fetchDataNFTs = async (
    account: string,
    chain: string | string[],
    type: string,
    category: string,
    search: string,
    pageParam = 1
  ) => {
    const data = await collectionListUserService(
      account,
      chain,
      type,
      category,
      search,
      pageParam,
      1019
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
  } = useInfiniteQuery(
    ["UserCollection", chainId, account, typeERC, category, debouncedSearch],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(
        "0x4699a9a5607c9281103ad504fa922276eb6385a2",
        chainId,
        typeERC,
        category,
        debouncedSearch,
        pageParam
      ),
    {
      getNextPageParam: (page) => {
        return page.data?.currentPage === page.data?.totalPages
          ? undefined
          : page.data?.currentPage + 1;
      },
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Fragment>
      <Classify
        typeERC={typeERC}
        category={category}
        setTypeERC={setTypeERC}
        setCategory={setCategory}
        setSearchCollection={setSearchCollection}
      />
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-5 md:grid-cols-3 text-dark2">
          {isLoading ? (
            <SkeletonSubCategory />
          ) : isSuccess && data?.pages[0]?.data.data.length > 0 ? (
            <Fragment>
              {data.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page?.data?.data?.map((item: any, itemIndex: number) => (
                    <div key={itemIndex}>
                      <Link
                        href={`/collection/${item.contractAddress}?typeERC=${item.type}`}
                      >
                        <div className="items-center p-3 transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home dark:border-dark1 dark:bg-darkBG2 ">
                          <div className="h-[127px]">
                            {item.avatar ? (
                              <img
                                src={item.avatar}
                                width={620}
                                height={620}
                                className="object-cover w-full h-full rounded-lg"
                                alt="1"
                              />
                            ) : (
                              <Image
                                src="/Placeholder.png"
                                width={620}
                                height={620}
                                className="object-cover w-full h-full rounded-lg"
                                alt="1"
                              />
                            )}
                          </div>
                          <div className="w-full">
                            <div className="flex w-full mt-2">
                              <div className="w-full">
                                <h6 className="flex items-start gap-2 font-medium uppercase">
                                  <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                    {item.name ? (
                                      <ModalDocument data={item.name} />
                                    ) : (
                                      <p>Unnamed</p>
                                    )}
                                  </span>
                                </h6>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <LogoIconCard chainId={chainId} />
                              <p className="px-2 h-[23px] rounded-full bg-dark4 text-[10px] uppercase">
                                {item.type}
                              </p>
                            </div>
                            <div className="flex justify-between text-sm">
                              <p>Total Volume</p>
                              <p>Total Items</p>
                            </div>
                            <div className="flex justify-between font-semibold text-dark2">
                              <div>
                                <FormatNumber number={item?.volume} />
                              </div>
                              <div>
                                <FormatNumber number={item?.totalItems} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div ref={ref} style={{ height: "1px" }}></div>
                    </div>
                  ))}
                </Fragment>
              ))}
              {isFetching && <SkeletonSubCategory />}
              <div ref={ref} style={{ height: "1px" }}></div>
            </Fragment>
          ) : (
            <p className="mt-4">No data available.</p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Created;
