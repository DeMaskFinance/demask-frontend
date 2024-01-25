import { amountNFT } from "@/libs/constants";
import React from "react";
import { ChartLoading } from "../Charts";
import TableRowSkeleton from "./SkeletonTablev2";
import SkeletonTable from "./SkeletonTable";

export default function SkeletonSwap() {
  return (
    <div className="py-8 mx-auto max-w-screen-3xl swap">
      <div className="min-h-[80vh]">
        <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0 dark:text-white">
          <div className="h-8 w-8 bg-slate-200 rounded"></div>
          <div className="h-8 w-8 bg-slate-200 rounded"></div>
          <div className="h-8 w-40 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex flex-col-reverse gap-x-10 md:flex-row">
          <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center mb-4 ">
            <div className="h-[355px] w-full p-4 border rounded-lg lg:mt-0 border-dark3">
              <div className='flex-wrap hidden mb-2 p-2 gap-x-2 text-sm font-medium border rounded-lg lg:flex border-dark3 w-fit text-dark3'>
                <div className="h-4 w-20 p-2 bg-slate-200 rounded"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 w-[60%] bg-slate-200 rounded"></div>
              <ChartLoading />
            </div>
            <div className="p-4 border border-dark3 rounded-lg mt-6 w-full">
              <SkeletonTable length={8} />
            </div>
          </div>
          <div className="lg:w-[40%] md:w-2/4 w-full h-fit p-6 border rounded-lg shadow-home">
            <div className="flex justify-between ">
              <div className="h-8 w-[148px] bg-slate-200 rounded"></div>
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="h-60 w-60 bg-slate-200 my-6 mx-auto rounded-lg"></div>
            <div className="flex justify-between ">
              <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
            </div>
            <div className="p-4 border border-dark4 rounded-lg mt-6">
              <div className="flex justify-between ">
                <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
                <div className="h-10 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between my-6">
              <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-12 w-full bg-slate-200 rounded"></div>
            <div className="h-8 w-[138px] bg-slate-200 rounded mt-6 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
