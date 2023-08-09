import Image from "next/image";
import React from "react";
import { CreateIconAbout, LaunchpadIconAbout, ReferralIconAbout, SwapIconAbout } from "../Icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
const styles = {
  title: 'py-3 text-2xl font-medium text-dark1 text-center'
}
function Features() {
  return (
    <div className="py-6">
      <h2 className="pb-8 text-3xl font-semibold">Features of DEMASK?</h2>
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
        className="pb-8 swiper-about text-dark2">
        <SwiperSlide>
          <CreateIconAbout width={156} height={156} className="mx-auto" />
          <h6 className={styles.title}>Create</h6>
          <p className="text-center lg:text-left">
            The Create feature will enable you to own crypto collectibles
            effortlessly, allowing you to hold or sell them through the swap
            function.
          </p>
        </SwiperSlide>

        <SwiperSlide>
          <SwapIconAbout width={156} height={156} className="mx-auto" />
          <h6 className={styles.title}>Swap</h6>
          <p className="text-center lg:text-left">
            This feature will enable you to easily buy and sell your favorite
            cryptocurrency collectibles or trade them to make profits using the
            DeMask Protocol.
          </p>
        </SwiperSlide>

        <SwiperSlide>
          <LaunchpadIconAbout width={156} height={156} className="mx-auto" />

          <h6 className={styles.title}>Launchpad</h6>
          <p className="text-center lg:text-left">
            The feature enables developers and content creators to distribute
            crypto collectibles to the market through initial distribution
            pricing.
          </p>
        </SwiperSlide>

        <SwiperSlide>
          <ReferralIconAbout width={156} height={156} className="mx-auto" />

          <h6 className={styles.title}>Referral</h6>
          <p className="text-center lg:text-left">
            The feature will help introducers earn tokens from trading through
            the protocol.
          </p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Features;
