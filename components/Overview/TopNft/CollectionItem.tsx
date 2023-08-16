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
          <tr className="flex text-sm lg:text-base md:text-base text-dark2 ">
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
              <tr className="flex px-2 text-sm border-b rounded-lg lg:text-base md:text-base text-dark2 hover:bg-slate-100">
                <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  {(data.currentPage - 1) * 10 + (idx + 1)}
                </td>
                <td className="py-2 lg:w-full md:w-full w-[200px]">
                  <Link
                    href={`/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftId}`}
                    className="flex items-center justify-start transition-all hover:text-secondary4 hover:font-medium"
                  >
                    <div className="relative flex items-center gap-2 group">
                      <div className="flex-shrink-0 rounded-md overflow-hidden w-[32px] h-[32px] flex items-center">
                        {item.metadata?.image && (
                          <Image
                            loading="lazy"
                            unoptimized
                            width={32}
                            height={32}
                            src={item.metadata?.image}
                            alt="NFT Image"
                            className="object-cover w-full h-full"
                          />
                        )}
                        {item.metadata?.animation_url &&
                          !item.metadata?.image && (
                            <video
                              src={item.metadata?.animation_url}
                              autoPlay={false}
                              loop
                              muted
                              className="object-cover h-full"
                            />
                          )}
                        {item.metadata?.image &&
                          item.metadata?.animation_url && (
                            <audio
                              autoPlay
                              loop
                              muted
                              controls
                              src={item.metadata?.animation_url}
                              className=""
                            >
                              Your browser does not support the
                              <code>audio</code> element.
                            </audio>
                          )}
                      </div>

                      <span className="line-clamp-1 lg:group-hover:hidden">
                        {isFetching ? skeleton : item.metadata?.name}
                      </span>

                      <p className="absolute top-0 hidden px-2 py-1 whitespace-pre bg-white border rounded-lg w-fit left-10 lg:group-hover:block sub-title">
                        {item.metadata?.name}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <span className="">
                    ${isFetching ? skeleton : formatNumber(item.lastPrice)}
                  </span>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <span
                    className={`flex items-center ${item.changePrice24h >= 0 ? "text-green" : "text-red"
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
