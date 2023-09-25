import React from "react";
export default function SkeletonAddLiquidity() {
    return (
        <div className="grid grid-cols-2 animate-pulse gap-x-[68px] h-[calc(100vh-130px)] lg:h-[calc(100vh-130px)]">
            <div>
                <p className="w-full h-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-4 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-12 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-4 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-16 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-4 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-12 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-4 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-full h-16 mt-4 rounded-lg bg-slate-200"></p>
                <p className="w-1/2 h-10 mx-auto mt-10 rounded-lg bg-slate-200"></p>
            </div>
            <div className="h-[90%] rounded-lg bg-slate-200"></div>
        </div>
    );
}