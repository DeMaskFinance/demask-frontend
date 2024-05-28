import { ChartLoading } from "../Charts";
import { SkeletonTable } from "./SkeletonTable";

export default function SkeletonSwap() {
  return (
    <div className="">
      <div className="min-h-[80vh]">
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center">
            <div className="w-full h-full p-4 border rounded-lg lg:mt-0 border-shader_500 dark:border-shader_900 min-h-[300px]">
              <div className="flex-wrap hidden p-2 mb-2 text-sm font-medium border rounded-lg gap-x-2 lg:flex border-shader_500 w-fit text-shader_500 dark:border-shader_900">
                <div className="w-20 h-4 p-2 rounded bg-slate-700 "></div>
                <div className="w-20 h-4 rounded bg-slate-700 "></div>
                <div className="w-20 h-4 rounded bg-slate-700 "></div>
              </div>
              <div className="h-4 w-[60%] bg-slate-700  rounded mb-14 lg:mb-0"></div>
              <ChartLoading />
            </div>
          </div>
          <div className="lg:w-[40%] md:w-2/4 w-full h-fit p-6 border rounded-lg shadow-home dark:border-shader_900">
            <div className="flex justify-between ">
              <div className="h-8 w-[148px] bg-slate-700  rounded"></div>
              <div className="w-24 h-8 rounded bg-slate-700 "></div>
            </div>
            <div className="mx-auto my-6 rounded-lg h-60 w-60 bg-slate-700 "></div>
            <div className="flex justify-between ">
              <div className="h-6 rounded-full w-36 bg-slate-700 "></div>
              <div className="h-6 rounded-full w-36 bg-slate-700 "></div>
            </div>
            <div className="p-4 mt-6 border rounded-lg border-shader_500 dark:border-shader_900">
              <div className="flex justify-between ">
                <div className="h-6 rounded-full w-36 bg-slate-700 "></div>
                <div className="w-20 h-10 rounded bg-slate-700 "></div>
              </div>
            </div>
            <div className="flex justify-between my-6">
              <div className="h-6 rounded-full w-36 bg-slate-700 "></div>
              <div className="h-6 rounded-full w-36 bg-slate-700 "></div>
            </div>
            <div className="w-full h-12 rounded bg-slate-700 "></div>
            <div className="h-8 w-[138px] bg-slate-700  rounded mt-6 mx-auto"></div>
          </div>
        </div>
        <div className="w-full p-4 mt-6 border rounded-lg border-shader_500 dark:border-shader_900">
          <SkeletonTable length={8} />
        </div>
      </div>
    </div>
  );
}
