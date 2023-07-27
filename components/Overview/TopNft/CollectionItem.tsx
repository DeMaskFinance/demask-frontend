import { AvatarUser } from "@/components/Avatars";
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
    <div className="w-full h-6 bg-slate-200 animate-pulse rounded-xl" />
  );
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {isLoading || isFetching ? (
        Array.from({ length: 10 }, (item, index) => (
          <tr className="lg:text-base md:text-base text-sm flex text-dark2">
            <td className="py-6 flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-start lg:w-full md:w-full w-[200px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
          </tr>
        ))
      ) : (
        <>
          {data?.nftDataList.map((item: any, idx: number) => (
            <tr className="lg:text-base md:text-base text-sm flex text-dark2">
              <td className="py-6 flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                {idx + 1}
              </td>
              <td className="py-6 flex justify-start lg:w-full md:w-full w-[200px]">
                <span className="flex items-center">
                  <span className="flex-shrink-0 block">
                    <AvatarUser width={32} height={32} />
                  </span>
                  <span className="line-clamp-1">
                    {isFetching ? skeleton : item.metadata.name}
                  </span>
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : item.price.toFixed(2)}
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : item.changePrice.toFixed(2)}
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : item.volume.toFixed(2)}
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.tvl.toFixed(2)}
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.totalSupply.toFixed(2)}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default CollectionItem;
