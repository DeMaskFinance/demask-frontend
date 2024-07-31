import { Button } from "@/components/Buttons";
import { EtherIcon, RightIcon } from "@/components/Icons";
import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SliderLaunchPad = () => {
  const [animate, setAnimate] = useState(false);

  const handleSlideChange = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="bg-[url('/images/BG.png')] object-cover h-[346px] relative">
            <div
              className={`absolute text-white font-bold top-0 pl-3 md:pl-10 flex items-center w-full md:w-1/2 h-full bg-launchpad `}
            >
              <div
                className={`flex gap-y-4 flex-col ${
                  animate ? "animate-slide-up-800" : ""
                }`}
              >
                <Image
                  src="/images/test.png"
                  width={300}
                  height={100}
                  alt="logo_launchpad "
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h5 className="text-2xl">KUNGFU PANDA</h5>
                  <p className="text-shader_200 font-semibold line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi
                  </p>
                  <div className="flex font-bold gap-x-2 items-center my-2">
                    <span>10,000 Items</span>
                    <span className="h-4 w-[1px] bg-shader_400"></span>
                    <div className="flex items-center gap-x-1">
                      <span>0.0012</span>
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="flex gap-x-2 items-center text-base">
                    <div className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
                    </div>
                    <p className="text-shader_200 ">End in:</p>
                    <p className="text-green2">12d 05h 45m 30s</p>
                  </div>
                </div>
                <Button
                  primary
                  className="px-3 h-10 whitespace-nowrap gap-x-2 w-fit"
                >
                  Mint now
                  <RightIcon width={20} height={20} />
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-[url('/images/BG.png')] object-cover h-[346px] relative">
            <div
              className={`absolute text-white font-bold top-0 pl-3 md:pl-10 flex items-center w-full md:w-1/2 h-full bg-launchpad `}
            >
              <div
                className={`flex gap-y-4 flex-col ${
                  animate ? "animate-slide-up-800" : ""
                }`}
              >
                <Image
                  src="/images/test.png"
                  width={300}
                  height={100}
                  alt="logo_launchpad "
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h5 className="text-2xl">KUNGFU PANDA</h5>
                  <p className="text-shader_200 font-semibold line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi
                  </p>
                  <div className="flex font-bold gap-x-2 items-center my-2">
                    <span>10,000 Items</span>
                    <span className="h-4 w-[1px] bg-shader_400"></span>
                    <div className="flex items-center gap-x-1">
                      <span>0.0012</span>
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="flex gap-x-2 items-center text-base">
                    <div className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
                    </div>
                    <p className="text-shader_200 ">End in:</p>
                    <p className="text-green2">12d 05h 45m 30s</p>
                  </div>
                </div>
                <Button
                  primary
                  className="px-3 h-10 whitespace-nowrap gap-x-2 w-fit"
                >
                  Mint now
                  <RightIcon width={20} height={20} />
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-[url('/images/BG.png')] object-cover h-[346px] relative">
            <div
              className={`absolute text-white font-bold top-0 pl-3 md:pl-10 flex items-center w-full md:w-1/2 h-full bg-launchpad `}
            >
              <div
                className={`flex gap-y-4 flex-col ${
                  animate ? "animate-slide-up-800" : ""
                }`}
              >
                <Image
                  src="/images/test.png"
                  width={300}
                  height={100}
                  alt="logo_launchpad "
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h5 className="text-2xl">KUNGFU PANDA</h5>
                  <p className="text-shader_200 font-semibold line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi
                  </p>
                  <div className="flex font-bold gap-x-2 items-center my-2">
                    <span>10,000 Items</span>
                    <span className="h-4 w-[1px] bg-shader_400"></span>
                    <div className="flex items-center gap-x-1">
                      <span>0.0012</span>
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="flex gap-x-2 items-center text-base">
                    <div className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
                    </div>
                    <p className="text-shader_200 ">End in:</p>
                    <p className="text-green2">12d 05h 45m 30s</p>
                  </div>
                </div>
                <Button
                  primary
                  className="px-3 h-10 whitespace-nowrap gap-x-2 w-fit"
                >
                  Mint now
                  <RightIcon width={20} height={20} />
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-[url('/images/BG.png')] object-cover h-[346px] relative">
            <div
              className={`absolute text-white font-bold top-0 pl-3 md:pl-10 flex items-center w-full md:w-1/2 h-full bg-launchpad `}
            >
              <div
                className={`flex gap-y-4 flex-col ${
                  animate ? "animate-slide-up-800" : ""
                }`}
              >
                <Image
                  src="/images/test.png"
                  width={300}
                  height={100}
                  alt="logo_launchpad "
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h5 className="text-2xl">KUNGFU PANDA</h5>
                  <p className="text-shader_200 font-semibold line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi
                  </p>
                  <div className="flex font-bold gap-x-2 items-center my-2">
                    <span>10,000 Items</span>
                    <span className="h-4 w-[1px] bg-shader_400"></span>
                    <div className="flex items-center gap-x-1">
                      <span>0.0012</span>
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="flex gap-x-2 items-center text-base">
                    <div className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
                    </div>
                    <p className="text-shader_200 ">End in:</p>
                    <p className="text-green2">12d 05h 45m 30s</p>
                  </div>
                </div>
                <Button
                  primary
                  className="px-3 h-10 whitespace-nowrap gap-x-2 w-fit"
                >
                  Mint now
                  <RightIcon width={20} height={20} />
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default SliderLaunchPad;
