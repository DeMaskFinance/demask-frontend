import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { SkeletonNFTTop } from "../Skeleton";
import SkeletonCategory from "../Skeleton/SkeletonCategory";
import { AvatarUser } from "../Avatars";
import images from "@/public/images";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Category = ({ label }: { label: string }) => {
  const swiperRef = useRef<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: [label],
    queryFn: async () => {
      const res = await categoryAPI(`/items/${label}?page=1&limit=10`);
      return res;
    },
  });

  const getDate = (timeStamp: any) => {
    const date = timeStamp * 1000;
    const currentDateMillis = Date.now();
    const timeDifferenceMillis = date - currentDateMillis;
    const daysLeft = Math.ceil(timeDifferenceMillis / (1000 * 60 * 60 * 24));
    return -daysLeft;
  };
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
  return (
    <section className="mt-6">
      <div className="flex flex-col">
        <h2 className="px-4 py-1 mx-auto mb-8 text-2xl font-medium uppercase rounded-md bg-dark4 w-max text-dark1">
          {label}
        </h2>
        <div className="relative swiper-custom">
          <button
            type="button"
            className="flex items-center justify-center text-3xl text-dark1 swiper-button-prev-custom"
            onClick={goPrev}
          >
            <GoChevronLeft />
          </button>
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="hidden mySwiper lg:block md:block"
            slidesPerView={4}
            slidesPerGroup={2}
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
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-5 md:grid-cols-2 text-dark2">
              {data &&
                data?.items?.map((item: any, idx: number) => (
                  <>
                    <SwiperSlide className="text-dark2">
                      <li
                        title={item.metadata.name}
                        key={idx}
                        className="items-center p-3 overflow-hidden transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home "
                      >
                        <Link
                          href={`/swap/${item.nft}/${item.tokenAddress}/${item.tokenId}?dmlAddress=${item.dmlAddress}`}
                        >
                          <div className="relative">
                            <div className="relative pb-[100%] h-0">
                              {item.metadata.image && (
                                <Image
                                  loading="lazy"
                                  width={760}
                                  unoptimized
                                  height={760}
                                  src={item.metadata.image}
                                  alt="NFT Image"
                                  placeholder="blur"
                                  blurDataURL={`${images.blur}`}
                                  className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                                />
                              )}
                              {item.metadata.animation_url &&
                                !item.metadata.image && (
                                  <video
                                    src={item.metadata.animation_url}
                                    autoPlay={false}
                                    loop
                                    muted
                                    controls={false}
                                    onMouseOver={event => (event.target as any).play()}
                                    onMouseOut={event => (event.target as any).pause()}
                                    className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                                  />
                                )}
                              {item.metadata.image &&
                                item.metadata.animation_url && (
                                  <audio
                                    autoPlay
                                    loop
                                    muted
                                    controls
                                    src={item.metadata.animation_url}
                                    className="absolute top-32 h-10 translate-x-1/2 right-2/4 w-[80%] py-1 rounded-lg  object-cover"
                                  >
                                    Your browser does not support the
                                    <code>audio</code> element.
                                  </audio>
                                )}
                            </div>

                            <div>
                              <h6
                                title={item.metadata.name}
                                className="flex items-start gap-2 py-2 font-medium uppercase"
                              >
                                <span className="flex-wrap text-xl line-clamp-1">
                                  {item.metadata.name}
                                </span>
                                <svg
                                  className="flex-shrink-0"
                                  width="25"
                                  height="24"
                                  viewBox="0 0 25 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    opacity="0.4"
                                    d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                                    fill="#9075FE"
                                  />
                                  <path
                                    d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                                    fill="#9075FE"
                                  />
                                </svg>
                              </h6>
                              <div className="flex">
                                <span className="shrink-0">
                                  <AvatarUser width={24} height={24} />
                                </span>
                                <span className="pb-1 -ml-2.5 block">
                                  {item.creatorAddress.slice(0, 4)}...
                                  {item.creatorAddress.slice(-4)}
                                </span>
                              </div>
                              <div className="flex justify-between pb-1">
                                <div className="flex flex-col">
                                  <p>Price</p>
                                  <p className="block">xxx ETH</p>
                                </div>

                                <div className="flex flex-col">
                                  <p>Reverse NFT</p>
                                  <p className="block">xxx ETH</p>
                                </div>
                              </div>

                              <div className="flex items-end justify-between">
                                <div className="flex flex-col">
                                  <p>Reverse Token</p>
                                  <p className="block">xxx ETH</p>
                                </div>

                                <p className="block">
                                  {getDate(item.blockTimestamp)} d ago
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </SwiperSlide>
                  </>
                ))}
            </ul>
          </Swiper>
          <button
            type="button"
            className="flex items-center justify-center text-3xl text-dark1 swiper-button-next-custom"
            onClick={goNext}
          >
            <GoChevronRight />
          </button>
        </div>
        {data && (
          <button className="mt-[28px] self-end text-secondary2 text-sm font-semibold border  hover:border-secondary2 border-white rounded-lg px-4 py-2 transition-all ease-in duration-150">
            <Link href={`category/${label}`}>
              See more
            </Link>
          </button>
        )}
        {isLoading && <SkeletonCategory />}
      </div>
    </section>
  );
};

export default Category;
