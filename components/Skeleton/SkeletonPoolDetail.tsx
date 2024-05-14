import React from "react";
import { SkeletonTable } from "./SkeletonTable";

const SkeletonPoolDetail = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-x-10">
      <div className="grow">
        <div className="flex flex-wrap justify-between mb-6 lg:flex-nowrap">
          <div className="flex gap-x-4">
            <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-24 h-8 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="w-40 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="w-full p-4 mt-6 border rounded-lg border-dark3">
          <SkeletonTable length={6} />
        </div>
      </div>
      <div className="w-full lg:w-[400px] mb-20 lg:mb-0 p-6 border rounded-lg shadow-home">
        <div className="mx-auto my-6 rounded-lg h-60 w-60 bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex justify-between my-6">
          <div className="h-6 rounded-full w-36 bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-6 rounded-full w-36 bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-8 w-[138px] bg-slate-200 dark:bg-slate-700 rounded mt-6 mx-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonPoolDetail;
