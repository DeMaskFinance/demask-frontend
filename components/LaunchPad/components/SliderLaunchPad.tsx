import { Button } from "@/components/Buttons";
import { EtherIcon, RightIcon } from "@/components/Icons";
import Image from "next/image";
import React, { Fragment, useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { queryClient } from "@/libs/constants";
import AccountContext from "@/context/AccountContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { LaunchpadStatus } from "@/enums/launchpad-status";
import SearchNotFound from "@/components/Search/SearchNotFound";
import { formatDate } from "@/libs/utils/formatComon";
import { MediaNFT } from "@/components/Common/Media";
import Link from "next/link";

const SliderLaunchPad = () => {
  const [animate, setAnimate] = useState(false);
  const { chainId } = useContext(AccountContext);
  const { data, fetchNextPage, isSuccess, isLoading, isFetching } =
    useInfiniteQuery({
      queryKey: ["LaunchpadList", chainId],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        LaunchpadService.LaunchpadList(
          chainId,
          LaunchpadStatus.Live,
          pageParam,
          4
        ),
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    });

  const handleSlideChange = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} key="${index}">
              <span class="swiper-pagination-bullet-active-progress"></span>
            </span>`,
        }}
        loop={true}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
        className="mySwiper"
      >
        {isSuccess && data?.pages[0]?.data?.data.length > 0 ? (
          data.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              <ul className="grid grid-cols-1 md:grid-cols-autoFillLaunchpad gap-6 text-shader_600">
                {page?.data?.data?.map(
                  (item: LaunchpadData, itemIndex: number) => (
                    <SwiperSlide>
                      <div
                        className={` object-cover h-[346px] relative`}
                        key={itemIndex}
                        style={{
                          backgroundImage: `url(${item.metadata.banner})`,
                        }}
                      >
                        <div
                          className={`absolute text-white font-bold top-0 pl-3 md:pl-10 flex items-center w-full md:w-1/2 h-full bg-launchpad `}
                        >
                          <div
                            className={`flex gap-y-4 flex-col ${
                              animate ? "animate-slide-up-800" : ""
                            }`}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <MediaNFT data={item} isControls />
                            </div>
                            <div>
                              <h5 className="text-2xl">{item.metadata.name}</h5>
                              <p className="text-shader_200 font-semibold line-clamp-2">
                                {item.metadata.description}
                              </p>
                              <div className="flex font-bold gap-x-2 items-center my-2">
                                <span>{item.limit} Items</span>
                                <span className="h-4 w-[1px] bg-shader_400"></span>
                                <div className="flex items-center gap-x-1">
                                  <span>{item.price}</span>
                                  <EtherIcon width={16} height={16} />
                                </div>
                              </div>
                              <div className="flex gap-x-2 items-center text-base">
                                <div className="relative flex w-2 h-2">
                                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                                  <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
                                </div>
                                <p className="text-shader_200 ">End in:</p>
                                <p className="text-green2">
                                  {formatDate(item.endTime - item.startTime)}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`launchpad/${item.launchpadAddress}/${item.unit}`}
                            >
                              <Button
                                primary
                                className="px-3 h-10 whitespace-nowrap gap-x-2 w-fit"
                              >
                                Mint now
                                <RightIcon width={20} height={20} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                )}
              </ul>
            </Fragment>
          ))
        ) : (
          <Image
            src="/images/BannerLaunchpad.png"
            width={1000}
            height={500}
            className=" w-full object-cover aspect-[5/1] px-10 mb-4"
            alt="banner_launchpad"
          />
        )}
      </Swiper>
    </>
  );
};

export default SliderLaunchPad;
