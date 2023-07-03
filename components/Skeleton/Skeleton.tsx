import React from "react";

export default function Skeleton() {
  return (
    <div className="p-2 mt-6 rounded-lg shadow-home animate-pulse">
      <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="h-4 col-span-2 rounded-2xl bg-slate-200"></div>
          <div className="h-4 col-span-1 rounded-2xl bg-slate-200"></div>
        </div>
      <div className="flex items-center mb-2 text-dark2">
        <div className="w-6 h-6 mr-2 rounded-full bg-slate-200"></div>
        <div className="h-4 rounded bg-slate-200"></div>
      </div>
      <div className="h-8 mb-2 rounded-2xl bg-slate-200">
      </div>
      <div className="h-[550px] rounded bg-slate-200 ">
      </div>
    </div>
  );
}
