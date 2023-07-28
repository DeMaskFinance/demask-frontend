import { AvatarUser } from "@/components/Avatars";
import formatNumber from "@/libs/utils/formatNumer";
import Link from "next/link";
import React, { useState } from "react";
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
          <tr className="lg:text-base md:text-base text-sm flex text-dark2">
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
          {data?.nftDataList?.map((item: any, idx: number) => (
            <tr className="lg:text-base md:text-base border-b text-sm flex text-dark2">
              <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                {idx + 1}
              </td>
              <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[200px]">
                <span className="flex items-center">
                  <span className="flex-shrink-0 block">
                    <AvatarUser width={32} height={32} />
                  </span>
                  <Link
                    href={`/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftId}?dmlAddress=${item.dml}`}
                    className="line-clamp-1 hover:text-secondary4"
                  >
                    {isFetching ? skeleton : item.metadata.name}
                  </Link>
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  ${isFetching ? skeleton : formatNumber(item.price)}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  ${isFetching ? skeleton : formatNumber(item.changePrice)}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  ${isFetching ? skeleton : formatNumber(item.volume)}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                ${isFetching ? skeleton : formatNumber(item.tvl)}
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
