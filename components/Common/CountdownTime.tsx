import AccountContext from "@/context/AccountContext";
import { convertTime } from "@/hooks/useConvertTime";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
interface CountdownTimeProps {
  blockNumber: number;
  query?: string;
  isSuccess?: boolean;
}
const CountdownTime: React.FunctionComponent<CountdownTimeProps> = ({
  blockNumber,
  query,
  isSuccess,
}) => {
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);
  const { chainId } = useContext(AccountContext);
  const timer = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const reBase = Math.max(0, blockNumber - currentTime);
    setBlockNumberTimer(reBase);
  };

  useEffect(() => {
    timer();
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    timer();
  }, [blockNumber]);

  const { days, hours, minutes, seconds } = convertTime(blockNumberTimer);

  return (
    <div>
      {query !== "Ended" ? (
        <div className="">
          <p className="text-xs text-center text-shader_500">
            {query === "Active"
              ? "The next phase will end in:"
              : "The next phase will begin in"}
          </p>
          {minutes > 0 && seconds > 0 && (
            <div className="flex justify-center mt-1 text-primary_500 gap-x-2">
              <div className="flex gap-1 mb-2">
                <span className="font-semibold">{days}d</span>:
                <span className="font-semibold">{hours}h</span>:
                <span className="font-semibold">
                  {minutes > 9 ? minutes : "0" + minutes}m
                </span>
                :
                <span className="font-semibold">
                  {seconds > 9 ? seconds : "0" + seconds}s
                </span>
              </div>
              <div className="text-[10px] border border-primary_500  text-primary_500 transition-all duration-150 hover:text-white hover:bg-primary_500 rounded-lg h-6 px-2 datas-end leading-6">
                <Link href={`/launchpad?choice=${query}`}>{query}</Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs text-center text-shader_500">This phase has:</p>
          <div
            className={`text-[10px] border  transition-all duration-150  rounded-lg h-6 px-2 datas-end leading-6 ${
              isSuccess
                ? "border-green  text-green w-[61px] hover:text-white hover:bg-green"
                : "border-red w-[50px]  text-red hover:text-white hover:bg-red"
            }`}
          >
            {isSuccess ? "Success" : "Failed"}
          </div>
        </div>
      )}
    </div>
  );
};
export default CountdownTime;
