import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
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
  return (
    <>
      {isLoading ? (
        <tr>
          <td className="py-6">{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
        </tr>
      ) : (
        <>
          {data?.nftDataList.map((item: any) => (
            <tr className="text-dark2">
              <td className="py-6">
                {isFetching ? skeleton : item.metadata.name}
              </td>
              <td className="py-1">
                <span className="">{isFetching ? skeleton : item.price}</span>
              </td>
              <td className="py-1">
                <span className="">
                  {isFetching ? skeleton : item.changePrice}
                </span>
              </td>
              <td className="py-1">
                <span className="">{isFetching ? skeleton : item.volume}</span>
              </td>
              <td className="py-6 text-center">
                {isFetching ? skeleton : item.tvl}
              </td>
              <td className="text-right">
                {isFetching ? skeleton : item.totalSupply}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default CollectionItem;
