import { AvatarUser } from "@/components/Avatars";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import { convertTime } from "@/hooks/useConvertTime";
import formatNumber from "@/libs/utils/formatNumer";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

interface TabLaunchPadProps {
  item: any;
  query: string;
}
const TabLaunchPadItem: React.FC<TabLaunchPadProps> = ({ item, query }) => {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);
  // console.log(item);

  const blockNumber =
    query === "Upcoming"
      ? item.startTime
      : query === "Active"
        ? item.endTime
        : "";
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  const timer = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const reBase = Math.max(0, blockNumber - currentTime);
    setBlockNumberTimer(reBase);
  };
  useEffect(() => {
    timer();
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [blockNumber]);

  useEffect(() => {
    timer();
  }, [blockNumber]);

  const { days, hours, minutes, seconds } = convertTime(blockNumberTimer);

  const convetTime = (timestamp: any) => {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    console.log(timestamp);
    return day;
  };

  const getMinutes = (startDate: any, endDate: any) => {
    const timeDifference = startDate + endDate;

    // Convert the time difference to minutes
    const totalMinutes = Math.floor(timeDifference / (1000 * 60));

    return totalMinutes;
  };

  const progess = (item.totalSold / item.hardcap) * 100;
  return (
    <div className="h-full group">
      <Link
        href={`launchpad/${item.nftID}/${item.nftAddress}/${item.tokenPayment}`}
        className="block h-full"
      >
        <div className="flex flex-col justify-between h-full">
          <div className="relative flex flex-col h-full">
            <div className="h-[250px] ">
              <MediaNFT data={item} isControls={false} hover />
            </div>

            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h6
                  title={item.metadata.name}
                  className="flex items-start gap-2 py-2 font-medium uppercase"
                >
                  <span className="flex-wrap text-xl line-clamp-1">
                    {item.metadata.name}
                  </span>
                  <svg
                    className="flex-shrink-0"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                      fill="#9075FE"
                    />
                    <path
                      d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                      fill="#9075FE"
                    />
                  </svg>
                </h6>
                <div className="flex gap-2">
                  <span className="shrink-0">
                    <AvatarUser width={24} height={24} />
                  </span>
                  <span className="pb-1 -ml-2.5 block">
                    {item.creator?.slice(0, 4)}...
                    {item.creator?.slice(-4)}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex flex-col gap-2">
                    <div className="line-clamp-3">
                      {item.metadata.description}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-2 mt-1 text-white transition-all duration-300 ease-linear rounded-lg gap-x-1 bg-dark3 group-hover:bg-secondary3">
                <span className="text-sm">Total raise </span>
                <FormatNumber number={(item.priceListing / 1e18).toString()}/>
              </div>
            </div>
          </div>
          <div>
            {query !== "Ended" && (
              <div className="pt-2 mt-2 border-t">
                <p className="text-xs text-center text-dark3">
                  {query === "Active" ? "Whitelist phase ends in:" : "Whitelist phase start in:"}
                </p>
                {minutes > 0 && seconds > 0 && (
                  <div className="flex justify-center mt-1 text-secondary2">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TabLaunchPadItem;
