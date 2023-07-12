import images from "@/public/images";
import Image from "next/image";
import { TwoTab } from "../NavChoice";
import React, {
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
import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { GetServerSideProps } from "next";
import * as homeService from "@/libs/service/homeService";
import useInformationDML from "@/hooks/useInformationDML";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationToken from "@/hooks/useInformationToken";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { ModalWallet } from "../Modal/ModalWallet";
import { amountNFT } from "@/libs/constants";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useAmountInMax from "@/hooks/useAmountInMax";
import BigNumber from "bignumber.js";
interface ReelsProps {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: any;
}
const styles = {
  inputItem:
    "w-[40%] mt-4 py-2 pl-2 mb-6 border rounded-lg mx-auto border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
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
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [filter, setFilter] = useState<any>("");
  const { account, wallet } = useContext(AccountContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputNFT, setInputNFT] = useState<string>("0");
  const [amountNFTSubmit, setAmountNFTSubmit] = useState("");
  const fetchDataPage = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `https://api.demask.finance/homepage?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  };

  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
  };
  // console.log(activeSlideIndex);
  // console.log(filter);

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
      page.records.map((item: any) => {
        if (item.index === activeSlideIndex + 1) {
          setFilter(item);
          setInputNFT("");
          setSelectedCategory("1");
        }
      });
    });
  }, [activeSlideIndex]);
  useEffect(()=>{
    if(selectedCategory === "CUSTOM"){
      setAmountNFTSubmit(inputNFT)
    }else{
      setAmountNFTSubmit(selectedCategory)
    }
  },[inputNFT,selectedCategory,activeSlideIndex,activeChoice])
  console.log(amountNFTSubmit);
  console.log(inputNFT);
  
  const {
    reserves,
    idNFT,
    nftAddress,
    reserveNFT,
    reserveToken,
    tokenAddress,
  } = useInformationDML(filter.dmlAddress);

  const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet);
  const { balanceToken, decimals, bigNumberBalance, symbolToken } =
    useInformationToken(account, tokenAddress, wallet);
  const amountTokenSell = useAmountOutMin(
    amountNFTSubmit,
    filter.dmlAddress,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    activeChoice
  );
  const amountTokenBuy = useAmountInMax(
    amountNFTSubmit,
    filter.dmlAddress,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    activeChoice
  );
  const amountBuy = new BigNumber(amountTokenBuy);
  const amountSell = new BigNumber(amountTokenSell);
  console.log(amountTokenBuy);
  console.log(amountBuy);
  console.log(amountSell);
  
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
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
                  ))}
                </div>
              ))}
          </Swiper>
        </>
      </div>

      {filter && (
        <div className="fixed flex flex-col justify-center w-[800px] right-[164px] top-[30%] z-10">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-3 text-dark1">
              <div className="flex basis-1/6">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
              </div>
              <div className="basis-4/6">
                <div className="flex justify-center text-xl font-medium text-dark1">
                  <span className="mr-4">{filter.metadata.name}</span>
                  {filter.metadata.category.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="h-[30px] flex items-center px-2 mr-2 text-xs font-medium text-center border rounded-lg border-secondary5 text-dark1"
                    >
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="basis-1/6">
                <a
                  href={`https://mumbai.polygonscan.com/address/${filter.dmlAddress}`}
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
              <p className="font-medium text-dark2">{`${filter.creatorAddress.slice(
                0,
                4
              )}...${filter.creatorAddress.slice(-5)}`}</p>
              <p className="-translate-y-[4px] mx-1">.</p>
              <p className="text-xs first-letter:uppercase">
                {filter.blockTimestamp}
              </p>
            </div>
            <div className="mb-4 font-light text-center text-dark2 line-clamp-3">
              {filter.metadata.description}
            </div>
            {filter.metadata.attributes && (
              <div className="my-4">
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  slidesPerView={5}
                  className="flex mySwiper "
                >
                  {filter.metadata.attributes.map(
                    (item: any, index: number) => (
                      <SwiperSlide key={index}>
                        {item.value && item.trait_type && (
                          <ul className="px-2 py-1 mr-4 border rounded-lg border-dark3 min-w-[120px] w-max">
                            <li className="text-lg font-medium text-dark2">
                              {item.trait_type}
                            </li>
                            <li className="text-sm text-dark3">{item.value}</li>
                          </ul>
                        )}
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            )}
            <div className="flex flex-col items-center">
              <h3 className="text-4xl text-secondary3">100 ETH</h3>
              <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                {reserves && (
                  <p className="mb-4 text-secondary4">
                    Reverse NFT:{formatNumber(reserves[1])}
                  </p>
                )}
                {reserves && (
                  <p className="mb-4 text-secondary4 text-end">
                    Reverse Token:
                    {formatNumber(
                      Number(
                        divideByDecimal(reserves[0].toString(), decimals)
                      ).toFixed(2)
                    )}
                  </p>
                )}
              </div>
              {account && activeChoice === "BUY" && (
                <p className="text-secondary3 mb-4 -mt-4">
                  Balance:{formatNumber(balanceToken)} {symbolToken}
                </p>
              )}
              {account && activeChoice === "SELL" && (
                <p className="text-secondary3 mb-4 -mt-4">
                  Balance:{formatNumber(balanceNFT)} NFT
                </p>
              )}
            </div>
            <div className="flex justify-center">
              {amountNFT.map((item, index) => (
                <Button
                  key={index}
                  className="p-2 ml-4 text-sm font-medium leading-normal text-dark3"
                  type="button"
                  outline
                  active={selectedCategory === item.value}
                  onClick={() => setSelectedCategory(item.value)}
                >
                  {item.value}
                </Button>
              ))}
            </div>
            {selectedCategory === "CUSTOM" && (
              <input
                type="number"
                name="amountNFT"
                id="amountNFT"
                placeholder="Input amount NFT"
                className={styles.inputItem}
                value={inputNFT}
                onChange={(e) => {
                  setInputNFT(e.target.value);
                }}
              />
            )}
          </div>
        </div>
      )}
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Reels;
