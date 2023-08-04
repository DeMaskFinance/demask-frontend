import Image from "next/image";
import { ActiveIcon } from "../Icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { SkeletonNFTTop } from "../Skeleton";
import { NFTTopService } from "@/libs/service";
import Link from "next/link";
import { AvatarUser } from "../Avatars";
interface NFTTopProps {}

const NFTTop: React.FunctionComponent<NFTTopProps> = () => {
  const swiperRef = useRef<any>(null);
  const { ref, inView } = useInView();
  const fetchDataTopNFT = async (pageParam = 1) => {
    const data = await NFTTopService(pageParam);
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
    ["TopNFT"],
    ({ pageParam = 1 }) => fetchDataTopNFT(pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPage
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(data);
  const goNext = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div>
      {data ? (
        <div className="relative swiper-custom">
          <button
            type="button"
            className="flex items-center justify-center text-3xl text-dark1 swiper-button-prev-custom"
            onClick={goPrev}
          >
            <GoChevronLeft />
          </button>
          {data?.pages[0] ? (
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="hidden mySwiper lg:block md:block"
              slidesPerView={6}
              ref={swiperRef}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 30,
                },
              }}
            >
              {isSuccess &&
                data?.pages.map((page, index) => (
                  <div key={index}>
                    {page.nftDataList.map((nftItem: any, index: number) => (
                      <>
                        <SwiperSlide key={index}>
                          <Link
                            href={`swap/${nftItem.nftAddress}/${nftItem.tokenAddress}/${nftItem.nftId}`}
                          >
                            <div className="w-[208px] h-[208px] relative overflow-hidden group cursor-pointer flex gap-20">
                              {nftItem.metadata.image && (
                                <Image
                                  src={nftItem.metadata.image}
                                  alt="test"
                                  width={208}
                                  height={208}
                                  unoptimized
                                  className="w-full h-full rounded-lg"
                                />
                              )}
                              {nftItem.metadata.animation_url &&
                                !nftItem.metadata.image && (
                                  <div className="w-full h-full bg-gray-300 rounded-lg bg-opacity-80">
                                    <video
                                      src={nftItem.metadata.animation_url}
                                      loop
                                      muted
                                      autoPlay
                                      poster="https://demask.infura-ipfs.io/ipfs/QmZhEv2DwgQAcgTyhxdZsL4DxCEVoUxdETVkudTYajnshg"
                                      className="w-full h-full rounded-lg"
                                    />
                                  </div>
                                )}
                              <div className="absolute bg-[rgba(0,0,0,0.2)] w-full rounded-lg h-full  opacity-0 group-hover:opacity-100 top-0 transition-all duration-300 ease-linear"></div>
                              <div className="absolute top-0 z-10 flex flex-col items-center justify-end w-full h-full p-1 duration-300 ease-linear translate-y-full rounded-lg group-hover:translate-y-0">
                                <p className="text-3xl text-white">
                                  {nftItem.price.toFixed(3)} USD
                                </p>
                                <div className="flex mt-4 mb-1 text-xl text-dark4">
                                  <p>{nftItem.metadata.name}</p>
                                  <i>
                                    <ActiveIcon
                                      width={24}
                                      height={24}
                                      className="fill-dark4"
                                    />
                                  </i>
                                </div>
                                <div className="flex items-center text-white">
                                  <AvatarUser width={28} height={28} />
                                  <p className="font-medium ">ToCa</p>
                                  <p className="-translate-y-[4px] mx-1">.</p>
                                  <p className="text-xs">
                                    {nftItem.blockTimestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div ref={ref} style={{ height: "1px" }} />
                        </SwiperSlide>
                      </>
                    ))}
                  </div>
                ))}
            </Swiper>
          ) : (
            <SkeletonNFTTop />
          )}
          <button
            type="button"
            className="flex items-center justify-center text-3xl text-dark1 swiper-button-next-custom"
            onClick={goNext}
          >
            <GoChevronRight />
          </button>
        </div>
      ) : (
        <SkeletonNFTTop />
      )}
    </div>
  );
};

export default NFTTop;
