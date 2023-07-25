import React from "react";
export default function SkeletonNFTTop() {
  return (
    <div className="grid grid-cols-6 h-[208px] absolute top-0 animate-pulse gap-x-[68px] overflow-hidden grid-rows-1">
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
      <div className="h-[208px] rounded-lg bg-slate-200"></div>
    </div>
  );
}
