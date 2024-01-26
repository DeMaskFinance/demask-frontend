import React from "react";
import { BiLoader } from "react-icons/bi";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import FormatNumber from "@/components/Common/FormatNumber";
const ProgressBar = ({ softcap, hardcap, amount, isRefetching }: any) => {
  const calculatePercentage = (value: number, total: number) => {
    return (value / total) * 100;
  };

  const percentage = calculatePercentage(amount, parseInt(hardcap));
  const percentageSoftcap = calculatePercentage(softcap, parseInt(hardcap));

  const isSoldOut = parseInt(amount) >= parseInt(hardcap);

  return (
    <div className="relative w-full h-1 bg-dark4 rounded-xl">
      <div className="relative z-10 flex justify-between w-full bg-black">
        <div
          style={{ width: `${percentage}%` }}
          className={`absolute z-2 ${isSoldOut ? "bg-gray-400" : "bg-secondary5"
            } h-1 rounded-lg w-[${percentage}%] text-sm text-white flex text-center justify-center items-center`}
        >
        </div>
        <div className={`absolute w-1 h-1 bg-secondary3`} style={{ left: `${percentageSoftcap}%` }}>
          <Tippy content={
            <div>
              <span className='text-[10px] font-normal text-dark0'>
                ({percentageSoftcap.toFixed(2)}%)
              </span>
            </div>
          }
            theme='light'
            placement="bottom"
          >
            <div className=''>
              <div className="absolute text-xs text-dark1 w-max cursor-pointer -top-[18px] -translate-x-2/4">Softcap</div>
            </div>
          </Tippy>
        </div>
      </div>
      <div className="flex justify-between mt-2 mb-3 text-xs text-dark1">
        <p className="">{percentage.toFixed(2)}%</p>
        <div className="flex items-center"><FormatNumber number={(amount / 1e18).toString()} />/<FormatNumber number={(hardcap / 1e18).toString()} /></div>
      </div>
    </div>
  );
};

export default ProgressBar;
