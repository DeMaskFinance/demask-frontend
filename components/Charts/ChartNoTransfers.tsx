import React from "react";
import { BsClock } from "react-icons/bs";
export default function ChartNoTransfers() {
  return (
    <div className="h-full p-2">
      <p className="font-semibold">Volume and Price</p>
      <div className="flex items-center justify-center h-[80%]">
        <div className="flex flex-col items-center justify-center">
          <BsClock className="w-8 h-8 mb-6" />
          <p className="text-sm font-medium text-shader_700">
            No events in this time range
          </p>
          <p className="text-sm text-shader_600">
            Try a different time range or check back later.
          </p>
        </div>
      </div>
    </div>
  );
}
