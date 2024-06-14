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
import { SkeletonSubCategory } from "../Skeleton/SkeletonCategory";

const Category = ({ label }: { label: string }) => {
  const { chainId, tokenDefault } = useContext(AccountContext);
  const { data, isLoading } = useQuery({
    queryKey: [label, chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `items/${label}?chainId=${chainId}&page=1&limit=10`
      );
      return res;
    },
  });

  return (
    <section className="mb-10">
      {data && data.items.length > 0 && (
        <div className="flex flex-col">
          <h2
            className={`uppercase ${
              label === "Art"
                ? "text-primary_300"
                : label === "Gaming"
                ? "text-green"
                : label === "Film"
                ? "text-yellow"
                : label === "Music"
                ? "text-blue"
                : "text-red"
            } text-lg font-bold mb-3`}
          >
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
                      className="items-center transition-all "
                    >
                      <NFTCategory item={item} />
                    </li>
                  </SwiperSlide>
                ))}
            </ul>
          </SwiperCustom>
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-6 md:grid-cols-2 text-dark2">
          <SkeletonSubCategory length={6} />
        </div>
      )}
    </section>
  );
};

export default Category;
