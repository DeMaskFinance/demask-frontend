import React, { useRef, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { SkeletonNFTTop } from "../Skeleton";
// import SkeletonCategory from "../Skeleton/SkeletonCategory";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import NFTCategory from "./NFTCategory";
import AccountContext from "@/context/AccountContext";
import SwiperCustom from "../SwiperCustom";

const Category = ({ label }: { label: string }) => {
  const { chainId, tokenDefault } = useContext(AccountContext);
  const swiperRef = useRef<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: [label, chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `items/${label}?chainId=${chainId}&page=1&limit=10`
      );
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
    <section className="">
      {data && data.items.length > 0 && (
        <div className="flex flex-col">
          <h2 className="px-4 py-1 mx-auto mb-8 text-2xl font-medium uppercase rounded-md bg-dark4 w-max text-dark1">
            {label}
          </h2>
          <SwiperCustom slidesPerView={6}>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-6 md:grid-cols-2 text-dark2">
              {data &&
                data?.items?.map((item: any, index: number) => (
                  <SwiperSlide
                    className="text-sm lg:text-base text-dark2 dark:bg-darkBG0"
                    key={index}
                  >
                    <li
                      title={item.metadata?.name}
                      className="items-center p-3 transition-all border rounded-md cursor-pointer hover:shadow-home area_input "
                    >
                      <NFTCategory item={item} />
                    </li>
                  </SwiperSlide>
                ))}
            </ul>
          </SwiperCustom>
          {data && (
            <button className="lg:mt-[28px] self-end text-secondary2 text-sm font-semibold border dark:border-darkBG0 dark:hover:border-secondary2  hover:border-secondary2 border-white rounded-lg px-4 py-2 transition-all ease-in duration-150">
              <Link href={`category/${label}`}>See all</Link>
            </button>
          )}
        </div>
      )}
      {isLoading && <p>123</p>}
    </section>
  );
};

export default Category;
