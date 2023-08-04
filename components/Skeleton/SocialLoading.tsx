import React from "react";

function SocialLoading() {
  return (
    <div className="w-[276px] flex items-start gap-4 mb-2 max-h-[105px] p-2 mt-4 overflow-hidden transition-all border rounded-lg cursor-pointer ">
      <div className="w-[88px]  transition-all flex-shrink-0 bg-slate-200 animate-pulse h-[88px] overflow-hidden rounded-lg"></div>
      <div className="flex flex-col justify-between h-20 mt-1">
        <div className="h-6 bg-slate-200 w-[130px] rounded-lg animate-pulse"></div>
        <div className="h-10 bg-slate-200 w-[155px] rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export default SocialLoading;
