import React from "react";
export default function SkeletonNFTTop() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 h-[265px] top-0 animate-pulse gap-x-6 overflow-hidden grid-rows-1">
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-700"></div>
    </div>
  );
}
