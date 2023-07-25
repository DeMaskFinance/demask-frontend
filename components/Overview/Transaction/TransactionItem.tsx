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
        <tr className="text-dark2">
          <td className="py-6">{isFetching ? skeleton : item.action}</td>
          <td className="py-1 text-center">
            <span className="">{isFetching ? skeleton : item.amountnft}</span>
          </td>
          <td className="py-1 text-center">
            <span className="">
              {isFetching ? skeleton : item.amounttokenInUSD}
            </span>
          </td>
          <td className="py-1 text-right">
            <span className="">
              {isFetching
                ? skeleton
                : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
            </span>
          </td>
          <td className="text-center">
            {isFetching
              ? skeleton
              : item.transactionHash.slice(0, 4) +
                "..." +
                item.transactionHash.slice(-4)}
          </td>
          <td className="text-right">
            {isFetching ? skeleton : item.blockTime}
          </td>
        </tr>
      ))}
    </>
  );
};

export default TransactionItem;
