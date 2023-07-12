import images from "@/public/images";
import Image from "next/image";
import { TwoTab } from "../NavChoice";
import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import AccountContext from "@/context/AccountContext";
import formatNumber from "@/libs/utils/formatNumer";
import { PoolIcon } from "../Icons";
import { Button } from "../Buttons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { GetServerSideProps } from "next";
import * as homeService from "@/libs/service/homeService";
interface ReelsProps {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: any;
}
export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch("https://api.demask.finance/homepage?page=1");
  const homeData = await response.json();
  return {
    props: {
      homeData,
    },
  };
};
const Reels = ({ homeData }: any) => {
  console.log(homeData);

  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [filter, setFilter] = useState<any>("");
  const fetchDataPage = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `https://api.demask.finance/homepage?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  };
  // useEffect(()=>{
  //   setInitialData(data?.pages[0].records[0]);
  // },[])

  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
  };
  console.log(activeSlideIndex);
  console.log(filter);

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
  } = useInfiniteQuery(
    "reelspage",
    ({ pageParam }) => fetchDataPage({ pageParam }),
    {
      getNextPageParam: (page) =>
        page.currentPage === page.totalPage ? undefined : page.currentPage + 1,
    }
  );
  useEffect(() => {
    if (
      data &&
      data.pages &&
      data.pages.length > 0 &&
      data.pages[0].records &&
      data.pages[0].records.length > 0
    ) {
      setFilter(data.pages[0].records[0]);
    }
  }, [data]);
  useEffect(() => {
    data?.pages.map((page: any, index: number) => {
      page.records.map((item: any, index: number) => {
        if (index === activeSlideIndex) {
          setFilter(item);
        }
      });
    });
  }, [activeSlideIndex]);
  console.log(data?.pages[0]);
  console.log(filter);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  console.log(isFetchingNextPage);
  console.log(inView);
  // const formattedDescription = filter.metadata.description
  //   .split("\\n")
  //   .map((line: any, index: any) => (
  //     <React.Fragment key={index}>
  //       {line}
  //       <br />
  //     </React.Fragment>
  //   ));

  const amountNFT = [
    {
      id: 1,
      value: "1",
    },
    {
      id: 2,
      value: "2",
    },
    {
      id: 3,
      value: "5",
    },
    {
      id: 4,
      value: "10",
    },
    {
      id: 5,
      value: "CUSTOM",
    },
  ];
  return (
    <div>
      <div className=" h-[790px]">
        <>
          <Swiper
            direction={"vertical"}
            slidesPerView={1}
            mousewheel={true}
            modules={[Mousewheel, Pagination]}
            className="h-full mySwiper"
            onSlideChange={handleSlideChange}
          >
            {isSuccess &&
              data?.pages.map((page: any, index: any) => (
                <div key={index}>
                  {page.records.map((nftItem: any, index: number) => (
                    <div>
                      <SwiperSlide key={`${nftItem._id}-${index}`}>
                        <div className="relative flex items-center h-full w-fit">
                          {nftItem.metadata.image && (
                            <Image
                              width={760}
                              height={760}
                              src={nftItem.metadata.image}
                              alt="NFT Image"
                              unoptimized
                              className="rounded-2xl max-w-[760px] max-h-[760px]"
                            />
                          )}
                          {nftItem.metadata.animation_url &&
                            !nftItem.metadata.image && (
                              <video
                                src={nftItem.metadata.animation_url}
                                autoPlay
                                loop
                                muted
                                controls
                                className=" rounded-2xl max-w-[760px] max-h-[760px]"
                              />
                            )}
                          {nftItem.metadata.image &&
                            nftItem.metadata.animation_url && (
                              <audio
                                autoPlay
                                loop
                                muted
                                controls
                                src={nftItem.metadata.animation_url}
                                className="absolute bottom-4 mx-auto mt-4 mb-2 translate-x-1/2 right-2/4 w-[80%]"
                              >
                                Your browser does not support the
                                <code>audio</code> element.
                              </audio>
                            )}
                        </div>
                        <div ref={ref} style={{ height: "1px" }} />
                      </SwiperSlide>
                    </div>
                  ))}
                </div>
              ))}
          </Swiper>
        </>
      </div>

      {filter && (
        <div className="fixed flex flex-col justify-center w-[800px] right-[164px] top-[34%] z-10">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-3 text-dark1">
              <div className="flex basis-1/3">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
                {/* {activeChoice === "BUY" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceBuy.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )}
                {activeChoice === "SELL" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceSell.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )} */}
              </div>
              <div className="basis-1/3">
                <div className="flex justify-center text-xl font-medium text-dark1">
                  <span>{filter.metadata.name}</span>
                </div>
                {/* {account && activeChoice === "BUY" && (
                  <p className="text-secondary3">100 ETH</p>
                )}
                {account && activeChoice === "SELL" && (
                  <p className="text-secondary3">200 ETH</p>
                )} */}
              </div>

              <div className=" basis-1/3">
                <a
                  href={`https://mumbai.polygonscan.com/address/${123}`}
                  target="_blank"
                  className="flex justify-end font-medium transition-all duration-150 ease-linear text-dark2 group"
                >
                  <PoolIcon
                    width={24}
                    height={24}
                    className="group-hover:fill-secondary3"
                  />
                  <p className="group-hover:text-secondary3">Pool</p>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2 text-dark2">
              <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
              <p className="font-medium text-dark2">{`${filter.creatorAddress.slice(0,4)}...${filter.creatorAddress.slice(-5)}`}</p>
            <p className="-translate-y-[4px] mx-1">.</p>
            <p className="text-xs first-letter:uppercase">{filter.blockTimestamp}</p>
            </div>
            <div className="mb-4 font-light text-center text-dark2 line-clamp-3">
              {filter.metadata.description}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-4xl text-secondary3">100 ETH</h3>
              <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                <p>Balance nft:1000</p>
                <p>Balance token:1000</p>
              </div>
            </div>
            <div className="flex justify-center">
              {amountNFT.map((item, index) => (
                <Button
                  key={index}
                  className="p-2 ml-4 text-sm font-medium leading-normal text-dark3"
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
        </div>
      )}
    </div>
  );
};

export default Reels;
