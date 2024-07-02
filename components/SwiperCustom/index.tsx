import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import React, { useEffect, useRef, useState } from "react";

interface SwiperCustomProps {
  children: React.ReactNode;
  slidesPerView: number;
}

const SwiperCustom: React.FC<SwiperCustomProps> = ({
  children,
  slidesPerView,
}) => {
  const swiperRef = useRef<any>(null);
  const [showPrevButton, setShowPrevButton] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(true);
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
  const handleSlideChange = () => {
    const swiperInstance = swiperRef.current.swiper;
    setShowPrevButton(!swiperInstance.isBeginning);
    setShowNextButton(!swiperInstance.isEnd);
  };
  useEffect(() => {
    if (swiperRef.current.swiper.slides.length <= slidesPerView) {
      setShowNextButton(false);
    }
  }, [swiperRef.current]);

  return (
    <div>
      <div className="relative swiper-custom">
        <button
          type="button"
          className={`flex items-center justify-center text-3xl text-dark1 swiper-button-prev-custom ${
            !showPrevButton && "hidden"
          }`}
          onClick={goPrev}
        >
          <GoChevronLeft />
        </button>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="hidden mySwiper lg:block md:block"
          slidesPerView={slidesPerView}
          ref={swiperRef}
          onSlideChange={handleSlideChange}
          breakpoints={{
            0: {
              slidesPerView: 1.3,
              spaceBetween: 30,
              slidesPerGroup: 1,
            },
            480: {
              slidesPerView: 1.3,
              spaceBetween: 30,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 30,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 12,
              slidesPerGroup: 5,
            },
          }}
        >
          {children}
        </Swiper>
        <button
          type="button"
          className={`flex items-center justify-center text-3xl text-dark1 swiper-button-next-custom ${
            !showNextButton && "hidden"
          }`}
          onClick={goNext}
        >
          <GoChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SwiperCustom;
