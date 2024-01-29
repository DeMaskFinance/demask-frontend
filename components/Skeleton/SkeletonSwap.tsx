import { ChartLoading } from "../Charts";
import SkeletonTable from "./SkeletonTable";

export default function SkeletonSwap() {
  return (
    <div className="py-8 mx-auto max-w-screen-3xl swap">
      <div className="min-h-[80vh]">
        <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0 dark:text-white">
          <div className="w-8 h-8 rounded bg-slate-200"></div>
          <div className="w-8 h-8 rounded bg-slate-200"></div>
          <div className="w-40 h-8 rounded-full bg-slate-200"></div>
        </div>
        <div className="flex flex-col-reverse gap-x-10 md:flex-row">
          <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center mb-4 ">
            <div className="h-[355px] w-full p-4 border rounded-lg lg:mt-0 border-dark3">
              <div className='flex-wrap hidden p-2 mb-2 text-sm font-medium border rounded-lg gap-x-2 lg:flex border-dark3 w-fit text-dark3'>
                <div className="w-20 h-4 p-2 rounded bg-slate-200"></div>
                <div className="w-20 h-4 rounded bg-slate-200"></div>
                <div className="w-20 h-4 rounded bg-slate-200"></div>
              </div>
              <div className="h-4 w-[60%] bg-slate-200 rounded"></div>
              <ChartLoading />
            </div>
            <div className="w-full p-4 mt-6 border rounded-lg border-dark3">
              <SkeletonTable length={8} />
            </div>
          </div>
          <div className="lg:w-[40%] md:w-2/4 w-full h-fit p-6 border rounded-lg shadow-home">
            <div className="flex justify-between ">
              <div className="h-8 w-[148px] bg-slate-200 rounded"></div>
              <div className="w-24 h-8 rounded bg-slate-200"></div>
            </div>
            <div className="mx-auto my-6 rounded-lg h-60 w-60 bg-slate-200"></div>
            <div className="flex justify-between ">
              <div className="h-6 rounded-full w-36 bg-slate-200"></div>
              <div className="h-6 rounded-full w-36 bg-slate-200"></div>
            </div>
            <div className="p-4 mt-6 border rounded-lg border-dark4">
              <div className="flex justify-between ">
                <div className="h-6 rounded-full w-36 bg-slate-200"></div>
                <div className="w-20 h-10 rounded bg-slate-200"></div>
              </div>
            </div>
            <div className="flex justify-between my-6">
              <div className="h-6 rounded-full w-36 bg-slate-200"></div>
              <div className="h-6 rounded-full w-36 bg-slate-200"></div>
            </div>
            <div className="w-full h-12 rounded bg-slate-200"></div>
            <div className="h-8 w-[138px] bg-slate-200 rounded mt-6 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
