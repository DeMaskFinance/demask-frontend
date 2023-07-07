import Image from "next/image";
import { ActiveIcon, SwapIcon } from "../Icons";
import React, { useState, useRef, useEffect } from "react";
import useInformationDML from "@/hooks/useInformationDML";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import { ethers } from "ethers";
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
interface NFTItemsProps {
  nftItem: any;
}

const NFTItems: React.FunctionComponent<NFTItemsProps> = ({ nftItem }) => {
  const [heightDescription, setHeightDescription] = useState(0);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [symbolToken, setSymbolToken] = useState<string>("");
  const [reserve, setReserve] = useState();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (descriptionRef.current) {
      setHeightDescription(descriptionRef.current.clientHeight);
    }
  }, []);

  const formattedDescription = nftItem.metadata.description
    .split("\\n")
    .map((line: any, index: any) => (
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
  } = useInformationDML(nftItem.dmlAddress);
  const amountTokenBuy = useAmountInMax(
    "1",
    nftItem.dmlAddress,
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
  console.log(nftItem.metadata.attributes);

  return (
    <div className="px-4 py-6 mt-6 rounded-lg shadow-home">
      <div className="flex items-center justify-between">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-medium text-dark1">
            {nftItem.metadata.name}{" "}
          </h2>
          <ActiveIcon width={24} height={24} className="mr-4" />
          {nftItem.metadata.category.map((item: any, index: number) => (
            <div
              key={index}
              className="h-[30px] flex items-center px-2 mr-4 text-xs font-medium text-center border rounded-lg border-secondary5 text-dark1"
            >
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-x-2">
          {symbolToken && tokenAddress && nftAddress ? (
            <div className="text-[24px] font-medium text-secondary3 leading-[14px] flex gap-x-2 items-end">
              <span>
                {formatPrice} {symbolTokenSwap}
              </span>
            </div>
          ) : (
            <div className="flex animate-pulse gap-x-4">
              <div className="w-24 h-6 rounded-full bg-slate-200"></div>
            </div>
          )}
          {tokenAddress && nftAddress && idNFT ? (
            <Link href={`/swap/${nftAddress}/${tokenAddressSwap}/${idNFT}`}>
              <SwapIcon width={24} height={24} />
            </Link>
          ) : (
            <div className="flex animate-pulse gap-x-4">
              <div className="w-10 h-6 rounded-full bg-slate-200"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center mb-2 text-dark2">
        <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
        <p className="font-medium text-dark2">TOCA</p>
        <p className="-translate-y-[4px] mx-1">.</p>
        <p className="text-xs">19 Mins</p>
      </div>
      <p
        className={`font-light text-dark2 ${
          isMore ? "line-clamp-0" : "line-clamp-3"
        }`}
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
      {nftItem.metadata.attributes && (
        <div className="mt-4">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            slidesPerView={7}
            className="flex mySwiper "
          >
            {nftItem.metadata.attributes.map((item: any, index: number) => (
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
            ))}
          </Swiper>
        </div>
      )}
      {/* <Link href={`/swap/${nftAddress}/${tokenAddress}/${idNFT}`}> */}
      <div className="relative mt-6">
        {nftItem.metadata.image && (
          <Image
            width={1031}
            height={1049}
            src={nftItem.metadata.image}
            alt="NFT Image"
            unoptimized
            className="rounded-2xl"
          />
        )}
        {nftItem.metadata.animation_url && !nftItem.metadata.image && (
          <video
            src={nftItem.metadata.animation_url}
            autoPlay
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
      {/* </Link> */}
    </div>
  );
};

export default NFTItems;
