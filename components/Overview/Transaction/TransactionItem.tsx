import { AvatarUser } from "@/components/Avatars";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
interface TransactionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}

const skeleton = (
  <div className="w-[100%] h-8 bg-slate-200 animate-pulse mr-2 rounded-xl" />
);
const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
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
          </tr>
        ))
      ) : (
        <>
          {data?.data.map((item: any, idx: number) => (
            <tr className="lg:text-base md:text-base border-b text-sm flex text-dark2  hover:bg-slate-100  rounded-lg lg:px-2">
              <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                {idx + 1}
              </td>
              <td className="py-2 hover:text-secondary3 relative hover:font-medium flex items-center justify-start lg:w-full md:w-full w-[200px]">
                <Link
                  target="_blank"
                  href={`https://mumbai.polygonscan.com/tx/${item.transactionHash}`}
                >
                  <span className="flex items-center">
                    <span className="flex-shrink-0 block">
                      <AvatarUser width={32} height={32} />
                    </span>
                    <span className="line-clamp-1">
                      {isFetching ? skeleton : item.actionName}
                      {/* {item.actionName.length > 10 ? "..." : ""} */}
                    </span>
                    <span
                      className={`ml-2 absolute top-2 left-52 bg-transparent border text-sm ${
                        item.action === "Buy" || item.action === "Sell"
                          ? "border-green text-green"
                          : "border-red text-red"
                      } p-1 rounded-lg`}
                    >
                      {isFetching ? skeleton : item.action}
                    </span>
                  </span>
                </Link>
              </td>

              {/* <td className="py-2 flex items-center  justify-start lg:w-full w-[50px]">
                <span
                  className={`bg-transparent border text-sm ${
                    item.action === "Buy" || item.action === "Sell"
                      ? "border-green text-green"
                      : "border-red text-red"
                  } p-1 rounded-lg`}
                >
                  {isFetching ? skeleton : item.action}
                </span>
              </td> */}
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                <span className="">
                  {isFetching ? skeleton : item.amountnft}
                </span>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : item.amounttokenInUSD?.toFixed(3)}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching
                    ? skeleton
                    : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                </span>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.blockTime}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default TransactionItem;
