import { amountNFT } from "@/libs/constants";
import React from "react";

export default function SkeletonReels() {
  return (
    <div className="lg:flex items-center animate-pulse gap-x-10 lg:px-primary lg:ml-14 lg:mr-14">
      <div className="w-2/4">
        <div className="bg-slate-200 h-[530px] mt-12 w-[530px] border rounded-2xl"></div>
      </div>
      <div className="px-4 lg:flex hidden flex-col w-2/4 h-[530px] justify-between py-6 border rounded-lg border-dark3 grow mt-12">
        <div className="flex justify-between">
          <div className="w-24 h-8 rounded-lg bg-slate-200"></div>
          <div className="h-8 rounded-lg w-28 bg-slate-200"></div>
          <div className="w-24 h-8 rounded-lg bg-slate-200"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 rounded-lg w-[60%] bg-slate-200 mt-4"></div>
          <div className="h-4 rounded-lg w-[80%] bg-slate-200 mt-4"></div>
          <div className="h-4 rounded-lg w-[50%] bg-slate-200 mt-4"></div>
        </div>
        <div className="flex items-center justify-center mx-auto gap-x-8">
          <div className="w-20 h-4 mt-4 rounded-lg bg-slate-200"></div>
          <div className="w-20 h-4 mt-4 rounded-lg bg-slate-200"></div>
        </div>
        <div className="flex items-center justify-center gap-8">
          {amountNFT.map((item, index) => (
            <div
              key={index}
              className="w-10 h-10 mt-4 rounded-lg bg-slate-200"
            ></div>
          ))}
        </div>
        <div className="bg-slate-200 mt-4 w-[90px] h-[34px] rounded-lg mx-auto"></div>
      </div>
    </div>
  );
}
