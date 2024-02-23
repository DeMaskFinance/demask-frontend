import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import React, { useRef } from "react";

const SwiperCustom = ({ children }: any) => {
  const swiperRef = useRef<any>(null);
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
    <div>
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
          slidesPerView={5}
          slidesPerGroup={1}
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
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
        >
          {children}
        </Swiper>
        <button
          type="button"
          className="flex items-center justify-center text-3xl text-dark1 swiper-button-next-custom"
          onClick={goNext}
        >
          <GoChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SwiperCustom;
