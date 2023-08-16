import Image from "next/image";
import { ActiveIcon, SwapIcon } from "../Icons";
import React, { useState, useRef, useEffect } from "react";
import useInformationDML from "@/hooks/useInformationDML";
import useAmountInMax from "@/hooks/useAmountInMax";
import formatNumber from "@/libs/utils/formatNumer";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import BigNumber from "bignumber.js";
import checkIsERC20 from "@/libs/validation/checkIsERC20";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { AvatarUser } from "../Avatars";
import useSvgComponents from "../Picture/Picture";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
interface NFTItemsProps {
  nftItem: any;
}
const NFTItems: React.FunctionComponent<NFTItemsProps> = ({ nftItem }) => {
  const svgComponents = useSvgComponents();

  const [heightDescription, setHeightDescription] = useState(0);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [symbolToken, setSymbolToken] = useState<string>("");
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { ref, inView } = useInView();
  const handleInViewChange = (isVisible:boolean) => {
    const video:any = videoRef.current;
    const audio:any = audioRef.current;
    if (video) {
      if (isVisible) {
        video.play();
        video.muted = false;
      } else {
        video.pause();
        video.muted = true;
      }
    }else if(audio){
      if (isVisible) {
        audio.play();
        audio.muted = false;
      } else {
        audio.pause();
        audio.muted = true;
      }
    }
  };
  useEffect(() => {
    if (inView) {
      handleInViewChange(true);
    }else{
      handleInViewChange(false);
    }
  }, [inView]);
  useEffect(() => {
    if (descriptionRef.current) {
      setHeightDescription(descriptionRef.current.clientHeight);
    }
  }, []);

  const formattedDescription = nftItem.metadata.description
    .split("\\n")
    .map((line: any, index: number) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  const {
    reserves,
    decimals,
    idNFT,
    nftAddress,
    reserveNFT,
    reserveToken,
    tokenAddress,
  } = useInformationDML(nftItem.dmlToken);
  console.log(inView);
  
  const { amountTokenBuy } = useAmountInMax(
    "1",
    nftItem.dmlToken,
    tokenAddress,
    nftAddress,
    idNFT,
    "Metamask",
    "BUY"
  );
  let tokenAddressSwap = "";
  if (tokenAddress === "0x734aeF51d427b2f745210Ec4BF1062ABd48Eceb6") {
    tokenAddressSwap = "MATIC";
  } else {
    tokenAddressSwap = tokenAddress;
  }
  const amountBuy = new BigNumber(amountTokenBuy);
  const formatPrice = formatNumber(
    divideByDecimal(amountBuy.toFixed(), decimals)
  );
  useEffect(() => {
    const handleToken = async () => {
      const { symbol } = await checkIsERC20(tokenAddress);
      setSymbolToken(symbol);
    };
    handleToken();
  }, [tokenAddress]);
  let symbolTokenSwap = "";
  if (symbolToken === "WETH") {
    symbolTokenSwap = "MATIC";
  } else {
    symbolTokenSwap = symbolToken;
  }

  return (
    <div className="px-4 py-6 mb-6 rounded-lg shadow-chart">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="flex gap-1 mr-4 text-2xl font-medium line-clamp-1 text-dark1">
            {nftItem.metadata.name} 
          </h2>
          {reserveToken.toString() === "0" ||
            reserveNFT.toString() === "0" ||
            (reserveNFT.toString() === "1" && (
              <ActiveIcon width={24} height={24} className="mr-4 fill-red" />
            ))}
        </div>
        <div className="flex items-center gap-x-2 ">
          <div className="bg-secondary2 text-white rounded-lg lg:px-4 md:px-3 px-2 lg:py-1 md:py-0.5 py-0.5 hover:bg-secondary4 transition-all">
            {reserveToken.toString() === "0" ||
              reserveNFT.toString() === "0" ||
              reserveNFT.toString() === "1" ? (
              <div className="font-semibold text-white">Unable to buy</div>
            ) : (
              <Link
                href={`/swap/${nftItem.nft}/${nftItem.erc}/${nftItem.Factory_Contract_id}`}
                className="flex items-center gap-2 text-sm font-semibold whitespace-pre lg:text-lg md:text-md"
              >
                {symbolToken && tokenAddress && nftAddress ? (
                  <span>
                    {formatPrice} {symbolTokenSwap}
                  </span>
                ) : (
                  <div className="flex px-6 animate-spin gap-x-4">
                    <AiOutlineLoading3Quarters />
                  </div>
                )}
                <svgComponents.buttonSwap />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 my-2 text-dark2">
        <div className="flex items-center pr-6">
          <AvatarUser width={32} height={32} />
          {nftItem.creatorAddress ? (
            <p className="font-medium text-dark2">{`${nftItem.creatorAddress?.slice(
              0,
              4
            )}...${nftItem.creatorAddress?.slice(-5)}`}</p>
          ):(
            <p>Unknow</p>
          )}
          <p className="-translate-y-[4px] mx-1">.</p>
          <p className="text-xs whitespace-pre first-letter:uppercase">
            {nftItem.blockTimestamp}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {nftItem.metadata.category.map((item: any, index: number) => (
            <Link
              href={`/category/${item.toLowerCase()}`}
              key={index}
              className="px-2 rounded-lg bg-dark4"
            >
              <p>{item}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-4">
      <p
        className={`text-dark2 ${isMore ? "line-clamp-0" : "line-clamp-3"}`}
        ref={descriptionRef}
      >
        {formattedDescription}
      </p>
      {heightDescription >= 84 && !isMore && (
        <p
          className="text-sm font-light cursor-pointer text-secondary4"
          onClick={() => setIsMore(true)}
        >
          Read more
        </p>
      )}
      </div>
      {nftItem.metadata.attributes && nftItem.metadata.attributes.length > 0 && (
        <div className="mb-4">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
            className="flex mySwiper swiper-newsfeed"
          >
            {nftItem.metadata.attributes.map((item: any, index: number) => (
              <SwiperSlide key={index} className="slide-nft-item">
                {item.value && item.trait_type && (
                  <ul className="px-2 py-1 mr-4 border rounded-lg border-dark3 min-w-[120px] w-max">
                    <li className="text-lg font-medium text-dark2">
                      {item.trait_type}
                    </li>
                    <li className="text-sm text-dark3">{item.value}</li>
                  </ul>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="relative mx-auto" ref={ref}>
        {nftItem.metadata.image && (
          <div className="h-full overflow-hidden rounded-2xl">
            <div
              style={{ backgroundImage: `url(${nftItem.metadata.image})` }}
              className="w-full max-h-[420px] lg:max-h-[650px] bg-center bg-cover rounded-2xl blur-3xl z-0 h-[639px] absolute]"
            ></div>
            <div className="absolute top-0 flex items-center justify-center w-full h-full p-4 overflow-hidden">
              <Image
                width={1031}
                height={1049}
                src={nftItem.metadata.image}
                alt="NFT Image"
                unoptimized
                className="lg:min-w-[500px] relative imageNFT w-auto max-h-[650px] z-100 rounded-xl"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}
        {nftItem.metadata.animation_url && !nftItem.metadata.image && (
          <video
            src={nftItem.metadata.animation_url}
            autoPlay
            ref={videoRef}
            loop
            muted
            controls
            className="mx-auto rounded-2xl"
          />
        )}
        {nftItem.metadata.image && nftItem.metadata.animation_url && (
          <audio
            autoPlay
            loop
            ref={audioRef}
            muted
            controls
            src={nftItem.metadata.animation_url}
            className="absolute bottom-0 mx-auto mt-4 mb-2 translate-x-1/2 right-2/4 w-[80%]"
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default NFTItems;
