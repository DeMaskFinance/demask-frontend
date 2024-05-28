import React, { Fragment } from "react";
interface SkeletonProps {
  length: number;
}

const SkeletonSubCategory: React.FC<SkeletonProps> = ({ length }) => {
  const array = Array.from({ length: length }, (_, index) => index);
  return (
    <Fragment>
      {array.map((item, index) => (
        <div className="flex flex-col gap-4 animate-pulse" key={index}>
          <div className="h-[188px] p-2 rounded-lg bg-slate-700 "></div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
          <div className="flex justify-between gap-2">
            <div className="h-[24px] w-2/5 rounded-lg bg-slate-700 "></div>
            <div className="h-[24px] w-2/5 rounded-lg bg-slate-700 "></div>
          </div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
        </div>
      ))}
    </Fragment>
  );
};
const SkeletonCategory = () => {
  const array = Array.from({ length: 4 }, (_, index) => index);
  return (
    <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto animate-pulse lg:grid-cols-4 md:grid-cols-2 text-shader_600">
      {array.map((item, index) => (
        <div className="flex flex-col gap-4" key={index}>
          <div className="h-[188px] p-2 rounded-lg bg-slate-700 "></div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
          <div className="flex justify-between gap-2">
            <div className="h-[24px] w-2/5 rounded-lg bg-slate-700 "></div>
            <div className="h-[24px] w-2/5 rounded-lg bg-slate-700 "></div>
          </div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
          <div className="h-[24px] rounded-lg bg-slate-700 "></div>
        </div>
      ))}
    </div>
  );
};
const SkeletonItemTransaction = () => {
  const array = Array.from({ length: 4 }, (_, index) => index);
  return (
    <Fragment>
      {array.map((item, index) => (
        <div
          className="w-full h-full min-w-[90px] min-h-[154px] rounded-lg bg-slate-700  animate-pulse"
          key={index}
        ></div>
      ))}
    </Fragment>
  );
};
export { SkeletonCategory, SkeletonSubCategory, SkeletonItemTransaction };
