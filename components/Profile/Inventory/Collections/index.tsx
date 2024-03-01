import FormatNumber from "@/components/Common/FormatNumber";
import { LogoIconCard } from "@/components/Logo/Logo";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonNFTTop } from "@/components/Skeleton";
import SwiperCustom from "@/components/SwiperCustom";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { collectionListUserService } from "@/libs/service/profileService";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SwiperSlide } from "swiper/react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const Created = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const [category, setCategory] = useQueryParam(
    "category",
    withDefault(StringParam, "")
  );
  const [searchCollection, setSearchCollection] = useQueryParam(
    "searchCollection",
    withDefault(StringParam, "")
  );
  let debouncedSearch = useDebounce(searchCollection);
  console.log(typeERC);

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
    ["NFTsUser", chainId, account, typeERC, category, debouncedSearch],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(
        '0x4699a9a5607c9281103ad504fa922276eb6385a2',
        chainId,
        typeERC,
        category,
        debouncedSearch,
        pageParam
      ),
    {
      getNextPageParam: (page) => {
        console.log(page);

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
  console.log(data);

  return (
    <div>
      <h2 className="my-4 text-2xl font-semibold text-center">Created</h2>
      <SwiperCustom>
        {isLoading || isFetching ? (
          <SkeletonNFTTop />
        ) : isSuccess && data?.pages[0]?.data.data.length > 0 ? (
          <div>
            {data.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                <ul className="grid grid-cols-1 gap-6 lg:grid-cols-5 md:grid-cols-2 text-dark2">
                  {page?.data?.data?.map((item: any, itemIndex: number) => (
                    <li key={itemIndex}>
                      <SwiperSlide className="text-sm lg:text-base text-dark2">
                        <Link href={`created/123123`}>
                          <li className="items-center p-3 transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home ">
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
                              <LogoIconCard chainId={chainId} />
                              <div className="flex justify-between text-sm">
                                <p>Total Volume</p>
                                <p>Total Items</p>
                              </div>
                              <div className="flex justify-between font-semibold text-dark2">
                                <div>
                                  {/* <FormatNumber number={"123"} /> */}
                                  -
                                </div>
                                <div>
                                  <FormatNumber number={item.totalItems} />
                                </div>
                              </div>
                            </div>
                          </li>
                        </Link>
                        <div ref={ref} style={{ height: "1px" }}></div>
                      </SwiperSlide>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </div>
        ) : (
          <p>No data</p>
        )}
      </SwiperCustom>
    </div>
  );
};

export default Created;
