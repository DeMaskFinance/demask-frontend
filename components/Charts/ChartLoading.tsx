import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

export default function ChartLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-shader_200">
      <BiLoaderAlt className="mb-6 text-5xl animate-spin text-primary_400" />
      <p className="mb-1 text-sm font-semibold ">Loading data</p>
      <p className="text-sm">Please wait a moment.</p>
    </div>
  );
}
