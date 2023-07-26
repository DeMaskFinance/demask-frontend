import React from "react";
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

const Category = ({ label }: { label: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [label],
    queryFn: async () => {
      const res = await categoryAPI(`/items/${label}`);
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

  return (
    <section className="pt-4">
      <div>
        <h2 className="text-2xl font-medium pb-6">{label}</h2>
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          autoplay={true}
          speed={500}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          loop={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          <ul className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 text-dark2 gap-8">
            {data &&
              data?.items?.map((item: any, idx: number) => (
                <>
                  <SwiperSlide className="text-dark2">
                    <li
                      title={item.metadata.name}
                      key={idx}
                      className="p-2  hover:-translate-y-2 transition-all cursor-pointer shadow-home border-1 rounded-md overflow-hidden items-center "
                    >
                      <Link
                        href={`/swap/${item.nft}/${item.tokenAddress}/${item.tokenId}?dmlAddress=${item.dmlAddress}`}
                      >
                        <div className="relative">
                          <div className="relative pb-[100%] h-0">
                            {item.metadata.image && (
                              <Image
                                loading="lazy"
                                unoptimized
                                width={760}
                                height={760}
                                src={item.metadata.image}
                                alt="NFT Image"
                                className="max-w-full min-w-full h-0 w-0 min-h-full rounded-lg max-h-full absolute object-cover"
                              />
                            )}
                            {item.metadata.animation_url &&
                              !item.metadata.image && (
                                <video
                                  src={item.metadata.animation_url}
                                  autoPlay
                                  loop
                                  muted
                                  controls
                                  className="max-w-full min-w-full h-0 w-0 min-h-full rounded-lg max-h-full absolute object-cover"
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
                              className="font-medium py-2 flex items-start gap-2  uppercase"
                            >
                              <span className="text-xl line-clamp-1 flex-wrap">
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
                            <span className="pb-1 block">
                              {item.creatorAddress.slice(0, 4)}...
                              {item.creatorAddress.slice(-4)}
                            </span>
                            <div className="flex justify-between pb-1">
                              <div className="flex flex-col">
                                <p>Price</p>
                                <p className="block">xxx ETH</p>
                              </div>

                              <div className="flex flex-col">
                                <p>Total sale</p>
                                <p className="block">xxx ETH</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-end">
                              <div className="flex flex-col">
                                <p>Initial</p>
                                <p className="block">xxx ETH</p>
                              </div>

                              <p className="block">
                                {getDate(item.blockTimestamp)} days ago
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

        {isLoading && <SkeletonCategory />}
      </div>
    </section>
  );
};

export default Category;
