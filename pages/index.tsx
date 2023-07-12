import { Button } from "@/components/Buttons";
import * as homeService from "@/libs/service/homeService";
import abiErc20 from "@/abi/abiErc20.json";
import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import Image from "next/image";
import Link from "next/link";
import NFTItems from "@/components/Home/NFTItems";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/Skeleton";
import { NFTTop, Reels } from "@/components/Home";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import "swiper/css";
import "swiper/css/navigation";
import { ethers } from "ethers";
import { LayoutSecondary } from "@/components/Layouts";
export const getServerSideProps: GetServerSideProps = async () => {
  const homeData = await homeService.home("1");
  return {
    props: {
      homeData,
    },
  };
};

const Home = ({ homeData }: any) => {
  const swiperRef = useRef<any>(null);
  const [modeInitial, setModeInitial] = useState<string>("");
  const [mode, setMode] = useState<string>(modeInitial);
  useEffect(() => {
    setModeInitial(localStorage.getItem("MODE_DEMASK") || "");
  }, [mode]);

  const { ref, inView } = useInView();
  const fetchDataPage = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `https://api.demask.finance/homepage?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
  } = useInfiniteQuery(
    "homepage",
    ({ pageParam }) => fetchDataPage({ pageParam }),
    {
      getNextPageParam: (page) =>
        page.currentPage === page.totalPage ? undefined : page.currentPage + 1,
    }
  );
  console.log(isFetchingNextPage);
  console.log(inView);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const Category = [
    {
      id: 1,
      value: "ALL",
    },
    {
      id: 2,
      value: "TRENDING",
    },
    {
      id: 3,
      value: "LASTEST",
    },
  ];

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
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
  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem("MODE_DEMASK") === null) {
        setMode("NEWFEEDS");
      } else {
        setMode(localStorage.getItem("MODE_DEMASK") || "");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <div className="py-8">
      <Head>
        <title>Home | DeMask</title>
      </Head>
      {modeInitial === "REELS" ? (
        <Reels />
      ) : (
        <div className="mb-6 leading-7">
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
              className="mySwiper"
              slidesPerView={6}
              ref={swiperRef}
            >
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
              <SwiperSlide>
                <NFTTop />
              </SwiperSlide>
            </Swiper>
            <button
              type="button"
              className="flex items-center justify-center text-3xl text-dark1 swiper-button-next-custom"
              onClick={goNext}
            >
              <GoChevronRight />
            </button>
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="text-3xl font-medium text-dark1 w-[45%] text-center">
              {data?.pages[0].totalRecords} curated NFT resources to buy and
              hold creative workflow.
            </h1>
            <h2 className="mt-2 text-xl font-medium text-dark2">
              Join a growing family of {data?.pages[0].totalCreators} designers and makers from around
              the world.
            </h2>
            <div className="my-6">
              {Category.map((item, index) => (
                <Button
                  key={index}
                  className="p-2 ml-6 text-sm font-medium leading-normal text-dark3"
                  type="button"
                  outline
                  active={selectedCategory.includes(item.value)}
                  onClick={() => setSelectedCategory(item.value)}
                >
                  {item.value}
                </Button>
              ))}
            </div>
          </div>
          <div className="px-[270px]">
            {isSuccess &&
              data?.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.records.map((nftItem: any, index: number) => (
                    <NFTItems nftItem={nftItem} key={index} />
                  ))}
                </Fragment>
              ))}
            <div ref={ref} style={{ height: "1px" }} />
            {isLoading && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            {isFetchingNextPage && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
Home.PageLayout = LayoutSecondary;
export default Home;
