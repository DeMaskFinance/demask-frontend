import { amountNFT } from "@/libs/constants";
import React from "react";

export default function SkeletonReels() {
  return (
    <div className="flex items-center animate-pulse gap-x-10 px-primary">
      <div className="bg-slate-200 h-[640px] w-[640px] border rounded-2xl"></div>
      <div className="px-4 py-6 border rounded-lg border-dark3 grow h-fit">
        <div className="flex justify-between">
          <div className="w-24 h-8 rounded-lg bg-slate-200"></div>
          <div className="h-6 rounded-lg w-28 bg-slate-200"></div>
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
        <div className="flex items-center justify-center gap-4">
          {amountNFT.map((item, index) => (
            <div key={index} className="w-10 h-10 mt-4 rounded-lg bg-slate-200"></div>
          ))}
        </div>
        <div className="bg-slate-200 mt-4 w-[90px] h-[34px] rounded-lg mx-auto"></div>
      </div>
    </div>
  );
}
