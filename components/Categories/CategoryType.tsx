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
import useInformationDML from "@/hooks/useInformationDML";
import NFTCategory from "./NFTCategory";

const Category = ({ label }: { label: string }) => {
  const swiperRef = useRef<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: [label],
    queryFn: async () => {
      const res = await categoryAPI(`/items/${label}?page=1&limit=10`);
      return res;
    },
  });

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
                slidesPerView: 1.3,
                spaceBetween: 30,
              },
              480: {
                slidesPerView: 1.3,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 2.5,
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
                data?.items?.map((item: any, index: number) => (
                    <SwiperSlide className="text-sm lg:text-base text-dark2" key={index}>
                      <li
                        title={item.metadata.name}
                        className="items-center p-3 overflow-hidden transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home "
                      >
                        <NFTCategory item={item} />
                      </li>
                    </SwiperSlide>
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
          <button className="lg:mt-[28px] self-end text-secondary2 text-sm font-semibold border  hover:border-secondary2 border-white rounded-lg px-4 py-2 transition-all ease-in duration-150">
            <Link href={`category/${label}`}>See more</Link>
          </button>
        )}
      </div>
      {isLoading && <SkeletonCategory />}
    </section>
  );
};

export default Category;
