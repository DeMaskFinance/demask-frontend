import { AvatarUser } from "@/components/Avatars";
import formatNumber from "@/libs/utils/formatNumer";
import images from "@/public/images";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
interface CollectionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}
const CollectionItem: React.FC<CollectionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  const skeleton = (
    <div className="w-full h-8 bg-slate-200 animate-pulse rounded-xl" />
  );
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {isLoading || isFetching ? (
        Array.from({ length: 10 }, (item, index) => (
          <tr className="lg:text-base md:text-base text-sm flex text-dark2 ">
            <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[200px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
          </tr>
        ))
      ) : (
        <>
          {data &&
            data?.nftDataList?.map((item: any, idx: number) => (
              <tr className="lg:text-base md:text-base border-b text-sm flex text-dark2 hover:bg-slate-100  rounded-lg px-2">
                <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  {idx + 1}
                </td>
                <td className="py-2 lg:w-full md:w-full w-[200px]">
                  <Link
                    href={`/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftId}?dmlAddress=${item.dml}`}
                    className="flex items-center justify-start hover:text-secondary4 hover:font-medium transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex-shrink-0 block rounded-md overflow-hidden w-[32px] h-[32px]">
                        {item.metadata?.image && (
                          <Image
                            loading="lazy"
                            unoptimized
                            width={32}
                            height={32}
                            src={item.metadata?.image}
                            alt="NFT Image"
                            placeholder="blur"
                            blurDataURL={`${images.blur}`}
                            className=""
                          />
                        )}
                        {!item.metadata?.image && (
                          <Image
                            loading="lazy"
                            unoptimized
                            width={32}
                            height={32}
                            src={"/images/video.svg"}
                            alt="NFT Image"
                            placeholder="blur"
                            blurDataURL={`${images.blur}`}
                            className=""
                          />
                        )}
                        {item.metadata?.image && item.metadata?.image && (
                          <Image
                            loading="lazy"
                            unoptimized
                            width={32}
                            height={32}
                            src={item.metadata?.image}
                            alt="NFT Image"
                            placeholder="blur"
                            blurDataURL={`${images.blur}`}
                            className=""
                          />
                        )}
                      </span>

                      <span className="line-clamp-1">
                        {isFetching ? skeleton : item.metadata?.name}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <span className="">
                    ${isFetching ? skeleton : formatNumber(item.lastPrice)}
                  </span>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <span
                    className={`flex items-center ${
                      item.changePrice24h >= 0 ? "text-green" : "text-red"
                    } `}
                  >
                    {item.changePrice24h >= 0 ? <BsArrowUp /> : <BsArrowDown />}
                    {isFetching ? skeleton : formatNumber(item.changePrice24h)}%
                  </span>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <span className="">
                    ${isFetching ? skeleton : formatNumber(item.volume24h)}
                  </span>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  ${isFetching ? skeleton : formatNumber(item.TVL)}
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  ${isFetching ? skeleton : formatNumber(item.totalSupply)}
                </td>
              </tr>
            ))}
        </>
      )}
    </>
  );
};

export default CollectionItem;
