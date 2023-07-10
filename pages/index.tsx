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
import { NFTTop } from "@/components/Home";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import "swiper/css";
import "swiper/css/navigation";
import { ethers } from "ethers";
import { LayoutSecondary } from "@/components/Layouts";
export const getServerSideProps: GetServerSideProps = async () => {
  const homeData = await homeService.home(undefined);
  return {
    props: {
      homeData,
    },
  };
};

const Home = ({ homeData }: any) => {
  const swiperRef = useRef<any>(null);
  const [reserve,setReserve] = useState();
  const [idNFT,setIdNFT] = useState();
  const [nftAddress,setNftAddress] = useState();
  const [tokenAddress,setTokenAddress] = useState();
  const { ref, inView } = useInView();
  const fetchDataPage = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `https://api.demask.finance/homepage?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  };
  useEffect(() => {
    const getInforDML = async (dmlToken: string) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(dmlToken, abiErc20, provider);
      try {
        const reserves = await contract.getReserves();
        const decimals = await contract.decimals();
        const idNFT = await contract.id();
        console.log(decimals);
        console.log(idNFT);
        setReserve(reserves)
        setIdNFT(idNFT);
        const nftAddress = await contract.nft();
        const reserveNFT = await contract.reservenft();
        const reserveToken = await contract.reservetoken();
        setNftAddress(nftAddress)
        console.log(nftAddress);
        console.log(reserveNFT);
        console.log(reserveToken);

        const tokenAddress = await contract.token();
        setTokenAddress(tokenAddress)
        console.log(tokenAddress);
      } catch (error) {
        console.error(error);
      }
    };
    data?.pages.map((items)=>{
      items.records.map((item:any)=>{
        getInforDML(item.dmlAddress);
      })
      
    })
  }, []);
  console.log(reserve);
  console.log(idNFT);
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
  // console.log(homeData);
  // console.log(hasNextPage);
    
  console.log(data?.pages);
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
  // const mode = localStorage.getItem('MODE_DEMASK');
  // console.log(mode);
  
  return (
    <div className="py-8">
      <Head>
        <title>Home | DeMask</title>
      </Head>
      {/* <div onClick={()=>fetchDataPage}>Home</div> */}
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
            6,746 curated NFT resources to buy and hold creative workflow.
          </h1>
          <h2 className="mt-2 text-xl font-medium text-dark2">
            Join a growing family of 666,687 designers and makers from around
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
          {/* <Skeleton/> */}
          {isSuccess &&
            data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.records.map((nftItem: any, index: number) => (
                  <NFTItems nftItem={nftItem} key={index}/>
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
    </div>
  );
}
Home.PageLayout = LayoutSecondary;
export default Home;
