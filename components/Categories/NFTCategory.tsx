import { mediaType } from "@/libs/constants";
import formatNumber from "@/libs/utils/formatNumer";
import images from "@/public/images";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AvatarUser } from "../Avatars";
import FormatNumber from "../Common/FormatNumber";
import { EtherIcon } from "../Icons";
import AccountContext from "@/context/AccountContext";
import MediaNFT from "../Common/MediaNFT";

interface NFTCategoryProps {
  item: any;
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
  const { chainId } = useContext(AccountContext);
  const getDate = (timeStamp: number) => {
    const date = timeStamp * 1000;
    const currentDateMillis = Date.now();
    const timeDifferenceMillis = date - currentDateMillis;
    const daysLeft = Math.ceil(timeDifferenceMillis / (1000 * 60 * 60 * 24));
    return -daysLeft;
  };

  return (
    <a
      rel="noreferrer noopener"
      target="_blank"
      // href={`${process.env.NEXT_PUBLIC_LINK_APP}/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftID}?chain=${chainId}`}
    >
      <div className="relative dark:text-dark5">
        <div className="h-52 group">
          <MediaNFT data={item} isControls zoom />
        </div>
        <div>
          <h6
            title={item.metadata?.name}
            className="flex items-start gap-2 py-2 font-medium uppercase"
          >
            <span className="flex-wrap text-xl line-clamp-1">
              {item.metadata?.name}
            </span>
            <svg
              className="flex-shrink-0"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                fill="#9075FE"
              />
              <path
                d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                fill="#9075FE"
              />
            </svg>
          </h6>
          <div className="flex gap-x-2">
            <span className="shrink-0">
              <AvatarUser width={24} height={24} />
            </span>
            <span className="block pb-1">
              {item.creator?.slice(0, 4)}...
              {item.creator?.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <div className="flex flex-col items-start">
              <p>Price</p>
              {item.tokenSymbol && item.nftAddress ? (
                <div className="flex flex-col">
                  {item?.reserveToken?.toString() === "0" ||
                  item?.reserveNFT?.toString() === "0" ||
                  item?.reserveNFT?.toString() === "1" ? (
                    <div className="text-red">Can't buy</div>
                  ) : (
                    <div className="flex items-center font-semibold gap-x-1">
                      <div>
                        <FormatNumber number={item.lastPrice} />
                      </div>
                      <div>
                        <EtherIcon
                          width={15}
                          height={15}
                          className="fill-dark2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex animate-pulse gap-x-4">
                  <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">
              <p>Reverse NFT</p>
              {item.reserveNFT ? (
                <p className="font-semibold">{formatNumber(item.reserveNFT)}</p>
              ) : (
                <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-700"></span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col items-start">
              <p>Reverse Token</p>
              <div className="font-semibold">
                <FormatNumber number={item?.reserveToken} />
              </div>
            </div>

            <p className="block text-xs font-semibold">
              {getDate(item.blockTimestamp)} d ago
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NFTCategory;
