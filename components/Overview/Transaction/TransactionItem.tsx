import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
interface TransactionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}

const skeleton = (
  <div className="w-[100%] h-6 bg-slate-200 animate-pulse mr-2 rounded-xl" />
);
const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  return (
    <>
      {data?.data.map((item: any) => (
        <tr className="text-dark2 lg:text-base md:text-base text-sm flex">
          <td className="py-6 flex justify-start lg:w-full md:w-full w-[200px]">
            <span className="line-clamp-1">
              {isFetching ? skeleton : item.action}
            </span>
          </td>
          <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px] ">
            <span className="">{isFetching ? skeleton : item.amountnft}</span>
          </td>

          <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
            <span className="">
              {isFetching ? skeleton : item.amounttokenInUSD?.toFixed(3)}
            </span>
          </td>
          <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
            <span className="">
              {isFetching
                ? skeleton
                : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
            </span>
          </td>

          <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
            {isFetching ? skeleton : item.blockTime}
          </td>
        </tr>
      ))}
    </>
  );
};

export default TransactionItem;
