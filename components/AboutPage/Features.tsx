import Image from "next/image";
import React from "react";
import { CreateIconAbout, LaunchpadIconAbout, ReferralIconAbout, SwapIconAbout } from "../Icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
import Link from "next/link";
const styles = {
  title: 'py-3 text-2xl font-medium text-dark1 text-center'
}
const featuresList = [
  {
    title: "Create",
    content: "The Create feature will enable you to own crypto collectibles effortlessly, allowing you to hold or sell them through the swap function.",
    icon: CreateIconAbout,
  },
  {
    title: "Swap",
    content: "This feature will enable you to easily buy and sell your favorite cryptocurrency collectibles or trade them to make profits using the DeMask Protocol.",
    icon: SwapIconAbout,
  },
  {
    title: "Launchpad",
    content: "The feature enables developers and content creators to distribute crypto collectibles to the market through initial distribution pricing.",
    icon: LaunchpadIconAbout,
  },
  {
    title: "Referral",
    content: "The feature will help introducers earn tokens from trading through the protocol.",
    icon: ReferralIconAbout,
  }
]
function Features() {
  return (
    <div className="py-6 ">
      <h2 className="pb-8 text-2xl font-semibold lg:text-3xl">Features of
        <Link href='/' className="ml-2 text-secondary5">
          DEMASK?
        </Link></h2>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="p-4 swiper-about text-dark2">
        {
          featuresList.map((item, index) => (
            <SwiperSlide key={index} className="h-auto p-2 scale-110 rounded-lg shadow-swiper swipper-about group hover:shadow-about">
              <item.icon width={156} height={156} className="mx-auto group-hover:animate-spin-360 " />
              <h6 className={styles.title}>{item.title}</h6>
              <p className="text-center lg:text-left ">
                {item.content}
              </p>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
}

export default Features;
