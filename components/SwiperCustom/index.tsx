import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useEffect, useRef, useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper";
interface SwiperCustomProps {
  children: React.ReactNode;
  slidesPerView?: "auto" | number;
  spaceBetween?: number;
  size?: number;
}

const SwiperCustom: React.FC<SwiperCustomProps> = ({
  children,
  slidesPerView,
  spaceBetween = 12,
  size = 48,
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
    if (
      swiperRef.current &&
      swiperRef.current.swiper.slides.length <=
        swiperRef.current.swiper.params.slidesPerView
    ) {
      setShowNextButton(false);
    }
  }, [children]);
  const swiperProps: any = {
    navigation: true,
    modules: [Navigation],
    spaceBetween,
    ref: swiperRef,
    onSlideChange: handleSlideChange,
    breakpoints:
      slidesPerView === "auto"
        ? {}
        : {
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
              slidesPerView: slidesPerView,
              spaceBetween: 12,
            },
          },
  };

  return (
    <div className="relative swiper-custom">
      <button
        type="button"
        className={`flex items-center justify-center  text-dark1 swiper-button-prev-custom  ${
          !showPrevButton && "hidden"
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <GoChevronLeft />
      </button>
      <Swiper {...swiperProps}>{children}</Swiper>
      <button
        type="button"
        className={`flex items-center justify-center  text-dark1 swiper-button-next-custom  ${
          !showNextButton && "hidden"
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        onClick={goNext}
        aria-label="Next slide"
      >
        <GoChevronRight />
      </button>
    </div>
  );
};

export default SwiperCustom;
