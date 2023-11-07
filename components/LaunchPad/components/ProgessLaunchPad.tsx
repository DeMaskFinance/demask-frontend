import React from "react";
import { BiLoader } from "react-icons/bi";

const ProgressBar = ({ softcap, hardcap, amount, isRefetching }: any) => {
  const calculatePercentage = (value: any, total: any) => {
    return (value / total) * 100;
  };

  const percentage = calculatePercentage(amount, parseInt(hardcap));

  const total = (percentage / 100) * 67.777777;
  const progressStyle = {
    width: `${total}%`,
    margin: `0 15%`,
  };

  const isSoldOut = parseInt(amount) >= parseInt(hardcap);

  return (
    <div className="relative w-full h-4 bg-gray-400 rounded-xl">
      <div className="relative z-10 flex justify-between w-full bg-black">
        <div
          className={`absolute z-2 ${
            isSoldOut ? "bg-gray-400" : "bg-red"
          } h-4 rounded-lg w-1/6 text-sm text-white flex text-center justify-center items-center`}
        >
          {softcap}
        </div>
        <div
          className={`absolute  ${
            isSoldOut ? "bg-gray-400" : "bg-red"
          } h-4 rounded-lg w-1/6 text-sm text-white flex text-center justify-center items-center right-0`}
        >
          {hardcap}
        </div>
      </div>
      <div className="relative z-1">
        <div
          className={`text-center text-sm flex justify-center items-center text-white h-4 ${
            isSoldOut ? "bg-slate-500" : "bg-secondary5"
          } rounded-lg`}
          style={progressStyle}
        >
          {!isRefetching ? amount : <BiLoader className="animate-spin" />}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
