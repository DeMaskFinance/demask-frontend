import React from "react";
import { BiLoader } from "react-icons/bi";

const ProgressBar = ({ softcap, hardcap, amount, isRefetching }: any) => {
  const calculatePercentage = (value: any, total: any) => {
    return (value / total) * 100;
  };

  const percentage = calculatePercentage(amount, parseInt(hardcap));
  console.log(percentage);
  const percentageSoftcap = calculatePercentage(softcap, parseInt(hardcap));
  console.log(percentageSoftcap);

  const total = (percentage / 100) * 67.777777;
  const progressStyle = {
    width: `${total}%`,
    margin: `0 15%`,
  };

  const isSoldOut = parseInt(amount) >= parseInt(hardcap);

  return (
    <div className="relative w-full h-1 bg-dark4 rounded-xl">
      <div className="relative z-10 flex justify-between w-full bg-black">
        <div
          style={{ width: `${percentage}%` }}
          className={`absolute z-2 ${isSoldOut ? "bg-gray-400" : "bg-secondary5"
            } h-1 rounded-lg w-[${percentage}%] text-sm text-white flex text-center justify-center items-center`}
        >
          {/* {percentage} */}

        </div>
        <div className={`absolute w-1 h-1 bg-red`} style={{ left: `${percentageSoftcap}%` }}>
          <div className="absolute text-xs text-dark1 w-max top-2 -translate-x-2/4">Softcap line ({percentageSoftcap.toFixed(2)}%)</div>
        </div>
      </div>
      <div className="flex justify-between mt-2 mb-3 text-xs text-dark1">
        <p className="">{percentage.toFixed(2)}%</p>
        <p>{amount}/{hardcap}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
